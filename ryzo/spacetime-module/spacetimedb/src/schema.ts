import { schema, table, t } from 'spacetimedb/server';

// Table: active_matches — real-time match data synced across all 3 phones
export const ActiveMatch = table(
  {
    name: 'active_match',
    public: true,
    indexes: [
      { accessor: 'active_match_rider_id', algorithm: 'btree' as const, columns: ['riderId'] },
    ],
  },
  {
    matchId: t.string().primaryKey(),
    riderId: t.string(),
    orderIds: t.string(),       // JSON stringified array
    platforms: t.string(),      // JSON stringified array
    overlapScore: t.u64(),
    combinedEarnings: t.u64(),
    status: t.string(),         // pending | accepted | declined | completed
    explanation: t.string(),
    timestamp: t.u64(),
  }
);

// Table: order_status — tracks order state changes across phones
export const OrderStatus = table(
  {
    name: 'order_status',
    public: true,
    indexes: [
      { accessor: 'order_status_platform', algorithm: 'btree' as const, columns: ['platform'] },
    ],
  },
  {
    orderId: t.string().primaryKey(),
    status: t.string(),         // pending | matched | active | delivered
    discountApplied: t.u64(),   // stored as integer cents (e.g., 4200 = ₹42)
    platform: t.string(),
    savingsMessage: t.string(),
    timestamp: t.u64(),
  }
);

// Table: agent_decisions — ArmorIQ decision log synced in real-time
export const AgentDecision = table(
  {
    name: 'agent_decision',
    public: true,
  },
  {
    decisionId: t.string().primaryKey(),
    decision: t.string(),       // MATCH_APPROVED | MATCH_BLOCKED
    reason: t.string(),
    overlapScore: t.u64(),
    detourPercent: t.u64(),
    capacity: t.string(),
    timestamp: t.u64(),
  }
);

// Table: rider_location — real-time rider position for map sync
export const RiderLocation = table(
  {
    name: 'rider_location',
    public: true,
  },
  {
    riderId: t.string().primaryKey(),
    lat: t.string(),            // stored as string to avoid float precision issues
    lng: t.string(),
    currentStopIndex: t.u64(),
    timestamp: t.u64(),
  }
);

const spacetimedb = schema({
  activeMatch: ActiveMatch,
  orderStatus: OrderStatus,
  agentDecision: AgentDecision,
  riderLocation: RiderLocation,
});

export default spacetimedb;
