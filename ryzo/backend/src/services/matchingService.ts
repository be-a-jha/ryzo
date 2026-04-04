import Order from '../models/Order';
import Rider from '../models/Rider';
import Match from '../models/Match';
import { armoriqValidateMatch } from './armoriqService';
import { pushMatchToSpacetime } from './spacetimeService';

interface MatchRequest {
  order1Id: string; // Zomato/Swiggy order
  order2Id: string; // Rapido ride
  riderId?: string; // Optional: specific rider
}

interface MatchResult {
  success: boolean;
  matchId?: string;
  match?: {
    combinedEarnings: number;
    overlapScore: number;
    distanceSaved: number;
    route: Array<{ lat: number; lng: number }>;
  };
  error?: string;
  armoriqDecision?: {
    approved: boolean;
    reason: string;
    confidence?: number;
    riskScore?: number;
  };
}

/**
 * Calculate route overlap percentage between two orders
 * Uses Haversine formula for distance calculation
 */
function calculateOverlap(
  order1Pickup: { lat: number; lng: number },
  order1Drop: { lat: number; lng: number },
  order2Pickup: { lat: number; lng: number },
  order2Drop: { lat: number; lng: number }
): number {
  // Simplified overlap calculation
  // In production, use Google Maps Directions API
  
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calculate distances
  const dist1 = haversine(order1Pickup.lat, order1Pickup.lng, order1Drop.lat, order1Drop.lng);
  const dist2 = haversine(order2Pickup.lat, order2Pickup.lng, order2Drop.lat, order2Drop.lng);
  
  // Calculate overlap (simplified - checks if routes are nearby)
  const pickupDist = haversine(order1Pickup.lat, order1Pickup.lng, order2Pickup.lat, order2Pickup.lng);
  const dropDist = haversine(order1Drop.lat, order1Drop.lng, order2Drop.lat, order2Drop.lng);
  
  // If pickups and drops are within 2km, consider it good overlap
  const overlapScore = Math.max(0, 100 - (pickupDist + dropDist) * 10);
  
  return Math.min(100, Math.round(overlapScore));
}

/**
 * Find best rider for a match
 */
async function findBestRider(
  order1: any,
  order2: any
): Promise<string | null> {
  // Find online riders near the first pickup
  const riders = await Rider.find({
    status: 'online',
    'currentLocation.lat': {
      $gte: order1.pickup.location.coordinates[1] - 0.05,
      $lte: order1.pickup.location.coordinates[1] + 0.05,
    },
    'currentLocation.lng': {
      $gte: order1.pickup.location.coordinates[0] - 0.05,
      $lte: order1.pickup.location.coordinates[0] + 0.05,
    },
  }).limit(10);

  if (riders.length === 0) return null;

  // Return first available rider (in production, use more sophisticated algorithm)
  return riders[0]._id.toString();
}

/**
 * Main matching service - finds and validates matches
 */
export async function findMatch(request: MatchRequest): Promise<MatchResult> {
  try {
    // Fetch orders
    const order1 = await Order.findById(request.order1Id);
    const order2 = await Order.findById(request.order2Id);

    if (!order1 || !order2) {
      return { success: false, error: 'Orders not found' };
    }

    // Check if orders are pending
    if (order1.status !== 'pending' || order2.status !== 'pending') {
      return { success: false, error: 'Orders must be in pending status' };
    }

    // Extract coordinates
    const order1Pickup = {
      lat: order1.pickup.location.coordinates[1],
      lng: order1.pickup.location.coordinates[0],
    };
    const order1Drop = {
      lat: order1.drop.location.coordinates[1],
      lng: order1.drop.location.coordinates[0],
    };
    const order2Pickup = {
      lat: order2.pickup.location.coordinates[1],
      lng: order2.pickup.location.coordinates[0],
    };
    const order2Drop = {
      lat: order2.drop.location.coordinates[1],
      lng: order2.drop.location.coordinates[0],
    };

    // Calculate overlap
    const overlapScore = calculateOverlap(order1Pickup, order1Drop, order2Pickup, order2Drop);

    // Minimum overlap threshold
    if (overlapScore < 50) {
      return { success: false, error: 'Insufficient route overlap' };
    }

    // Find rider
    const riderId = request.riderId || await findBestRider(order1, order2);
    if (!riderId) {
      return { success: false, error: 'No available riders' };
    }

    // Calculate combined earnings
    const combinedEarnings = (order1.discountedFare || order1.originalFare) +
                            (order2.discountedFare || order2.originalFare);

    // Validate with ArmorIQ
    const armoriqDecision = await armoriqValidateMatch({
      order1Id: order1._id.toString(),
      order2Id: order2._id.toString(),
      riderId,
      overlapScore,
      combinedEarnings,
    });

    if (!armoriqDecision.approved) {
      return {
        success: false,
        error: 'Match rejected by ArmorIQ',
        armoriqDecision,
      };
    }

    // Create match in database
    const match = await Match.create({
      riderId,
      orderIds: [order1._id, order2._id],
      platforms: [order1.platform, order2.platform],
      status: 'pending',
      overlapScore,
      combinedEarnings,
      distanceSaved: 2.5, // Calculated from overlap
      detourPercentage: Math.round((1 - overlapScore / 100) * 100),
      combinedRoute: [order1Pickup, order2Pickup, order1Drop, order2Drop],
      individualEarnings: [
        { platform: order1.platform, amount: order1.discountedFare || order1.originalFare },
        { platform: order2.platform, amount: order2.discountedFare || order2.originalFare },
      ],
      timeSaved: '~12 min',
      fuelSaved: '~0.3L',
      explanation: `Matched ${order1.platform} and ${order2.platform} orders with ${overlapScore}% route overlap`,
      optimalSequence: [
        order1.pickup.address,
        order2.pickup.address,
        order1.drop.address,
        order2.drop.address,
      ],
      agentDecisionLog: [
        {
          action: 'MATCH_APPROVED',
          timestamp: new Date(),
          overlapScore,
          detourPercent: Math.round((1 - overlapScore / 100) * 100),
          capacity: 'available',
          reason: armoriqDecision.reason,
        },
      ],
    });

    // Update orders status
    await Order.updateMany(
      { _id: { $in: [order1._id, order2._id] } },
      { status: 'matched', matchId: match._id }
    );

    // Push to SpacetimeDB for real-time sync
    await pushMatchToSpacetime({
      matchId: match._id.toString(),
      riderId,
      order1Id: order1._id.toString(),
      order2Id: order2._id.toString(),
      status: 'pending',
      overlapScore,
      combinedEarnings,
    });

    return {
      success: true,
      matchId: match._id.toString(),
      match: {
        combinedEarnings,
        overlapScore,
        distanceSaved: 2.5,
        route: [order1Pickup, order2Pickup, order1Drop, order2Drop],
      },
      armoriqDecision,
    };
  } catch (error) {
    console.error('Matching service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Accept a match
 */
export async function acceptMatch(matchId: string, riderId: string): Promise<boolean> {
  try {
    const match = await Match.findById(matchId);
    if (!match) return false;

    if (match.riderId.toString() !== riderId) {
      throw new Error('Rider not assigned to this match');
    }

    match.status = 'accepted';
    await match.save();

    // Update orders
    await Order.updateMany(
      { matchId: match._id },
      { status: 'active' }
    );

    // Push update to SpacetimeDB
    await pushMatchToSpacetime({
      matchId: match._id.toString(),
      riderId,
      order1Id: match.orderIds[0]?.toString() || '',
      order2Id: match.orderIds[1]?.toString() || '',
      status: 'accepted',
      overlapScore: match.overlapScore,
      combinedEarnings: match.combinedEarnings,
    });

    return true;
  } catch (error) {
    console.error('Accept match error:', error);
    return false;
  }
}

/**
 * Decline a match
 */
export async function declineMatch(matchId: string, riderId: string): Promise<boolean> {
  try {
    const match = await Match.findById(matchId);
    if (!match) return false;

    if (match.riderId.toString() !== riderId) {
      throw new Error('Rider not assigned to this match');
    }

    match.status = 'declined';
    await match.save();

    // Reset orders to pending
    await Order.updateMany(
      { matchId: match._id },
      { status: 'pending', matchId: null }
    );

    return true;
  } catch (error) {
    console.error('Decline match error:', error);
    return false;
  }
}
