/**
 * SpacetimeDB Backend Service
 * Pushes real-time updates to SpacetimeDB for client sync
 */

interface MatchUpdate {
  matchId: string;
  riderId: string;
  order1Id: string;
  order2Id: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  overlapScore: number;
  combinedEarnings: number;
}

interface OrderStatusUpdate {
  orderId: string;
  status: string;
  riderId?: string;
  currentLocation?: { lat: number; lng: number };
}

interface RiderLocationUpdate {
  riderId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
}

/**
 * Push match update to SpacetimeDB
 * In production, this would use the SpacetimeDB SDK to insert/update rows
 */
export async function pushMatchToSpacetime(match: MatchUpdate): Promise<void> {
  try {
    // TODO: Implement actual SpacetimeDB client connection
    // For now, log the update
    console.log('[SpacetimeDB] Match update:', {
      matchId: match.matchId,
      status: match.status,
      riderId: match.riderId,
    });

    // In production:
    // const conn = await getSpacetimeDBConnection();
    // await conn.call('insert_match', match);
  } catch (error) {
    console.error('Failed to push match to SpacetimeDB:', error);
    // Non-critical, don't throw
  }
}

/**
 * Push order status update to SpacetimeDB
 */
export async function pushOrderStatusToSpacetime(
  orderStatus: OrderStatusUpdate
): Promise<void> {
  try {
    console.log('[SpacetimeDB] Order status update:', {
      orderId: orderStatus.orderId,
      status: orderStatus.status,
    });

    // In production:
    // const conn = await getSpacetimeDBConnection();
    // await conn.call('update_order_status', orderStatus);
  } catch (error) {
    console.error('Failed to push order status to SpacetimeDB:', error);
  }
}

/**
 * Push rider location update to SpacetimeDB
 */
export async function pushRiderLocationToSpacetime(
  location: RiderLocationUpdate
): Promise<void> {
  try {
    console.log('[SpacetimeDB] Rider location update:', {
      riderId: location.riderId,
      lat: location.lat,
      lng: location.lng,
    });

    // In production:
    // const conn = await getSpacetimeDBConnection();
    // await conn.call('update_rider_location', location);
  } catch (error) {
    console.error('Failed to push rider location to SpacetimeDB:', error);
  }
}

/**
 * Push agent decision log to SpacetimeDB
 */
export async function pushAgentDecisionToSpacetime(decision: {
  matchId: string;
  decision: 'APPROVED' | 'REJECTED';
  reason: string;
  confidence: number;
}): Promise<void> {
  try {
    console.log('[SpacetimeDB] Agent decision:', {
      matchId: decision.matchId,
      decision: decision.decision,
    });

    // In production:
    // const conn = await getSpacetimeDBConnection();
    // await conn.call('log_agent_decision', decision);
  } catch (error) {
    console.error('Failed to push agent decision to SpacetimeDB:', error);
  }
}

// TODO: Implement SpacetimeDB connection management
// let spacetimeConnection: any = null;
//
// async function getSpacetimeDBConnection() {
//   if (spacetimeConnection) return spacetimeConnection;
//   
//   const { DbConnection } = require('spacetimedb');
//   spacetimeConnection = DbConnection.builder()
//     .withUri(process.env.SPACETIMEDB_URI || '')
//     .withDatabaseName(process.env.SPACETIMEDB_MODULE || '')
//     .build();
//   
//   return spacetimeConnection;
// }
