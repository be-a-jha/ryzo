/**
 * SpacetimeDB Service - Real-time sync across devices
 * 
 * This service pushes data to SpacetimeDB for cross-device synchronization.
 * All connected devices will receive updates via SpacetimeDB subscriptions.
 */

import { getSpacetimeConnection } from '@/lib/spacetimedb';

interface OrderData {
  orderId: string;
  platform: 'zomato' | 'rapido';
  type: 'food' | 'ride';
  status: string;
  pickup: { lat: number; lng: number; address: string };
  drop: { lat: number; lng: number; address: string };
  fare: number;
  timestamp: number;
}

interface MatchData {
  matchId: string;
  riderId: string;
  order1Id: string;
  order2Id: string;
  combinedEarnings: number;
  overlapScore: number;
}

/**
 * Generate unique order ID
 */
export function generateOrderId(platform: string): string {
  return `${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate unique match ID
 */
export function generateMatchId(): string {
  return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clear all orders and matches from SpacetimeDB (for testing/debugging)
 */
export async function clearSpacetimeData(): Promise<void> {
  try {
    const conn = getSpacetimeConnection();
    if (!conn) {
      console.warn('[SpacetimeDB] Not connected, cannot clear data');
      return;
    }

    // Note: SpacetimeDB doesn't have a built-in "delete all" reducer
    // You would need to implement delete reducers in your SpacetimeDB module
    // For now, we'll just log a warning
    console.warn('[SpacetimeDB] Clear data not implemented - need delete reducers in SpacetimeDB module');
    console.log('[SpacetimeDB] To clear data: Redeploy SpacetimeDB module or implement delete reducers');
    
    // Alternative: Update all orders to "completed" status
    const orders = [...conn.db.orderStatus.iter()];
    for (const order of orders) {
      await conn.reducers.updateOrderStatus({
        orderId: (order as Record<string, unknown>).orderId as string,
        status: 'completed',
        discountApplied: BigInt(0),
        platform: (order as Record<string, unknown>).platform as string,
        savingsMessage: 'Cleared',
        timestamp: BigInt(Date.now()),
      });
    }
    
    console.log('[SpacetimeDB] All orders marked as completed');
  } catch (error) {
    console.error('[SpacetimeDB] Failed to clear data:', error);
  }
}

/**
 * Push order to SpacetimeDB for cross-device sync
 */
export async function pushOrderToSpacetime(order: OrderData): Promise<void> {
  try {
    const conn = getSpacetimeConnection();
    if (!conn) {
      console.warn('[SpacetimeDB] Not connected, order not synced:', order.orderId);
      return;
    }

    // Calculate discount (20% for flexible delivery)
    const discountApplied = Math.round(order.fare * 0.2);
    const savingsMessage = `Save ₹${discountApplied} with flexible delivery`;

    // Call SpacetimeDB reducer to insert/update order status
    await conn.reducers.updateOrderStatus({
      orderId: order.orderId,
      status: order.status,
      discountApplied: BigInt(discountApplied),
      platform: order.platform,
      savingsMessage,
      timestamp: BigInt(order.timestamp),
    });

    console.log(`[SpacetimeDB] Order synced: ${order.orderId} (${order.platform})`);
  } catch (error) {
    console.error('[SpacetimeDB] Failed to push order:', error);
    // Non-critical, don't throw
  }
}

/**
 * Push match to SpacetimeDB for cross-device sync
 */
export async function pushMatchToSpacetime(match: MatchData): Promise<void> {
  try {
    const conn = getSpacetimeConnection();
    if (!conn) {
      console.warn('[SpacetimeDB] Not connected, match not synced:', match.matchId);
      return;
    }

    // Call SpacetimeDB reducer to insert match
    await conn.reducers.insertMatch({
      matchId: match.matchId,
      riderId: match.riderId,
      orderIds: `${match.order1Id},${match.order2Id}`,
      platforms: 'zomato,rapido',
      overlapScore: BigInt(match.overlapScore),
      combinedEarnings: BigInt(match.combinedEarnings),
      status: 'pending',
      explanation: `Matched orders with ${match.overlapScore}% overlap, ₹${match.combinedEarnings} earnings`,
      timestamp: BigInt(Date.now()),
    });

    console.log(`[SpacetimeDB] Match synced: ${match.matchId} (${match.overlapScore}% overlap)`);
  } catch (error) {
    console.error('[SpacetimeDB] Failed to push match:', error);
  }
}
