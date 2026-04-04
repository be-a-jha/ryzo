interface MatchPushData {
  matchId: string;
  riderId: string;
  orderIds: string[];
  platforms: string[];
  overlapScore: number;
  combinedEarnings: number;
  status: string;
}

interface OrderStatusPushData {
  orderId: string;
  status: string;
  discountApplied: number;
  platform: string;
}

const SPACETIMEDB_URI = process.env.SPACETIMEDB_URI;

async function callSpacetimeReducer(reducer: string, args: unknown[]): Promise<boolean> {
  if (!SPACETIMEDB_URI || SPACETIMEDB_URI === 'ws://localhost:3000') {
    console.log(`SpacetimeDB not configured — skipping ${reducer} push`);
    return false;
  }

  try {
    // Convert ws:// to http:// for REST API calls
    const httpUri = SPACETIMEDB_URI.replace('ws://', 'http://').replace('wss://', 'https://');

    const response = await fetch(`${httpUri}/database/ryzo/call/${reducer}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      console.error(`SpacetimeDB reducer ${reducer} failed: ${response.status}`);
      return false;
    }

    console.log(`SpacetimeDB: ${reducer} pushed successfully`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`SpacetimeDB push error (${reducer}):`, message);
    return false;
  }
}

export async function pushMatchToSpacetime(data: MatchPushData): Promise<boolean> {
  return callSpacetimeReducer('insert_match', [
    {
      matchId: data.matchId,
      riderId: data.riderId,
      orderIds: JSON.stringify(data.orderIds),
      platforms: JSON.stringify(data.platforms),
      overlapScore: data.overlapScore,
      combinedEarnings: data.combinedEarnings,
      status: data.status,
      timestamp: BigInt(Date.now()),
    },
  ]);
}

export async function pushOrderStatusToSpacetime(data: OrderStatusPushData): Promise<boolean> {
  return callSpacetimeReducer('update_order_status', [
    {
      orderId: data.orderId,
      status: data.status,
      discountApplied: data.discountApplied,
      platform: data.platform,
      timestamp: BigInt(Date.now()),
    },
  ]);
}
