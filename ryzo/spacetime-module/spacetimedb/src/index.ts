import spacetimedb from './schema';
import { t } from 'spacetimedb/server';

// === Lifecycle Hooks ===

export const init = spacetimedb.init((_ctx) => {
  console.info('RYZO SpacetimeDB module initialized');
});

export const onConnect = spacetimedb.clientConnected((ctx) => {
  console.info(`Client connected: ${ctx.sender.toHexString()}`);
});

export const onDisconnect = spacetimedb.clientDisconnected((ctx) => {
  console.info(`Client disconnected: ${ctx.sender.toHexString()}`);
});

// === Match Reducers ===

// Insert a new match (called by backend when Gemini + ArmorIQ approve)
export const insert_match = spacetimedb.reducer(
  {
    matchId: t.string(),
    riderId: t.string(),
    orderIds: t.string(),
    platforms: t.string(),
    overlapScore: t.u64(),
    combinedEarnings: t.u64(),
    status: t.string(),
    explanation: t.string(),
    timestamp: t.u64(),
  },
  (ctx, args) => {
    ctx.db.activeMatch.insert({
      matchId: args.matchId,
      riderId: args.riderId,
      orderIds: args.orderIds,
      platforms: args.platforms,
      overlapScore: args.overlapScore,
      combinedEarnings: args.combinedEarnings,
      status: args.status,
      explanation: args.explanation,
      timestamp: args.timestamp,
    });
    console.info(`Match inserted: ${args.matchId} — status: ${args.status}`);
  }
);

// Update match status (accept/decline/complete)
export const update_match_status = spacetimedb.reducer(
  {
    matchId: t.string(),
    newStatus: t.string(),
  },
  (ctx, { matchId, newStatus }) => {
    const existing = ctx.db.activeMatch.matchId.find(matchId);
    if (!existing) {
      console.error(`Match not found: ${matchId}`);
      return;
    }
    ctx.db.activeMatch.matchId.update({ ...existing, status: newStatus });
    console.info(`Match ${matchId} updated to: ${newStatus}`);
  }
);

// === Order Status Reducers ===

// Update order status (syncs across Zomato/Rapido/RYZO phones)
export const update_order_status = spacetimedb.reducer(
  {
    orderId: t.string(),
    status: t.string(),
    discountApplied: t.u64(),
    platform: t.string(),
    savingsMessage: t.string(),
    timestamp: t.u64(),
  },
  (ctx, args) => {
    const existing = ctx.db.orderStatus.orderId.find(args.orderId);
    if (existing) {
      ctx.db.orderStatus.orderId.update({
        ...existing,
        status: args.status,
        discountApplied: args.discountApplied,
        savingsMessage: args.savingsMessage,
        timestamp: args.timestamp,
      });
    } else {
      ctx.db.orderStatus.insert({
        orderId: args.orderId,
        status: args.status,
        discountApplied: args.discountApplied,
        platform: args.platform,
        savingsMessage: args.savingsMessage,
        timestamp: args.timestamp,
      });
    }
    console.info(`Order ${args.orderId} status: ${args.status}`);
  }
);

// === Agent Decision Reducers ===

// Log an ArmorIQ agent decision
export const log_agent_decision = spacetimedb.reducer(
  {
    decisionId: t.string(),
    decision: t.string(),
    reason: t.string(),
    overlapScore: t.u64(),
    detourPercent: t.u64(),
    capacity: t.string(),
    timestamp: t.u64(),
  },
  (ctx, args) => {
    ctx.db.agentDecision.insert({
      decisionId: args.decisionId,
      decision: args.decision,
      reason: args.reason,
      overlapScore: args.overlapScore,
      detourPercent: args.detourPercent,
      capacity: args.capacity,
      timestamp: args.timestamp,
    });
    console.info(`Agent decision: ${args.decision} — ${args.reason}`);
  }
);

// === Rider Location Reducers ===

// Update rider position in real-time
export const update_rider_location = spacetimedb.reducer(
  {
    riderId: t.string(),
    lat: t.string(),
    lng: t.string(),
    currentStopIndex: t.u64(),
    timestamp: t.u64(),
  },
  (ctx, args) => {
    const existing = ctx.db.riderLocation.riderId.find(args.riderId);
    if (existing) {
      ctx.db.riderLocation.riderId.update({
        ...existing,
        lat: args.lat,
        lng: args.lng,
        currentStopIndex: args.currentStopIndex,
        timestamp: args.timestamp,
      });
    } else {
      ctx.db.riderLocation.insert({
        riderId: args.riderId,
        lat: args.lat,
        lng: args.lng,
        currentStopIndex: args.currentStopIndex,
        timestamp: args.timestamp,
      });
    }
  }
);

export default spacetimedb;
