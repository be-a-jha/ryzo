'use client';

import { useEffect, useState } from 'react';
import {
  connectSpacetimeDB,
  isSpacetimeConnected,
  onConnectionChange,
  getSpacetimeConnection,
} from '@/lib/spacetimedb';

/** Hook: connection status */
export function useSpacetimeStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    try {
      connectSpacetimeDB();
    } catch {
      // Connection may already exist
    }
    setConnected(isSpacetimeConnected());

    const unsub = onConnectionChange((status) => {
      setConnected(status);
    });
    return unsub;
  }, []);

  return connected;
}

/** Hook: active matches from SpacetimeDB */
export function useActiveMatches() {
  const [matches, setMatches] = useState<Array<Record<string, unknown>>>([]);
  const connected = useSpacetimeStatus();

  useEffect(() => {
    if (!connected) return;
    const conn = getSpacetimeConnection();
    if (!conn) return;

    const initial = [...conn.db.activeMatch.iter()];
    setMatches(initial as unknown as Array<Record<string, unknown>>);

    conn.db.activeMatch.onInsert((_ctx, match) => {
      setMatches((prev) => [...prev, match as unknown as Record<string, unknown>]);
    });

    conn.db.activeMatch.onUpdate((_ctx, _old, newMatch) => {
      setMatches((prev) =>
        prev.map((m) =>
          (m as Record<string, unknown>).matchId === (newMatch as Record<string, unknown>).matchId
            ? (newMatch as unknown as Record<string, unknown>)
            : m
        )
      );
    });
  }, [connected]);

  return matches;
}

/** Hook: order statuses from SpacetimeDB */
export function useOrderStatuses() {
  const [statuses, setStatuses] = useState<Array<Record<string, unknown>>>([]);
  const connected = useSpacetimeStatus();

  useEffect(() => {
    if (!connected) return;
    const conn = getSpacetimeConnection();
    if (!conn) return;

    const initial = [...conn.db.orderStatus.iter()];
    setStatuses(initial as unknown as Array<Record<string, unknown>>);

    conn.db.orderStatus.onInsert((_ctx, order) => {
      setStatuses((prev) => {
        const orderId = (order as Record<string, unknown>).orderId;
        const exists = prev.some((o) => (o as Record<string, unknown>).orderId === orderId);
        if (exists) {
          return prev.map((o) =>
            (o as Record<string, unknown>).orderId === orderId
              ? (order as unknown as Record<string, unknown>)
              : o
          );
        }
        return [...prev, order as unknown as Record<string, unknown>];
      });
    });

    conn.db.orderStatus.onUpdate((_ctx, _old, newOrder) => {
      setStatuses((prev) =>
        prev.map((o) =>
          (o as Record<string, unknown>).orderId === (newOrder as Record<string, unknown>).orderId
            ? (newOrder as unknown as Record<string, unknown>)
            : o
        )
      );
    });
  }, [connected]);

  return statuses;
}

/** Hook: Check if both Zomato and Rapido orders exist, trigger match */
export function useMatchTrigger() {
  const orderStatuses = useOrderStatuses();

  useEffect(() => {
    // Find pending orders
    const zomatoOrder = orderStatuses.find((o) => 
      String(o.platform).toLowerCase() === 'zomato' &&
      String(o.status) === 'pending'
    );
    
    const rapidoOrder = orderStatuses.find((o) => 
      String(o.platform).toLowerCase() === 'rapido' &&
      String(o.status) === 'pending'
    );

    // If both exist, trigger match
    if (zomatoOrder && rapidoOrder) {
      console.log('[useMatchTrigger] Both pending orders found! Triggering match...');
      
      import('@/store/matchingStore').then(async ({ useMatchingStore }) => {
        const store = useMatchingStore.getState();
        
        store.setMatchStatus('searching');
        
        // Create match after 1.5s
        setTimeout(async () => {
          const { generateMatchId, pushMatchToSpacetime } = await import('@/services/spacetimeService');
          const { MOCK_MATCH_DATA, MOCK_AGENT_LOG, MOCK_UNIFIED_PING } = await import('@/lib/mockData');
          const { useRiderStore } = await import('@/store/riderStore');
          const { useRyzoStore } = await import('@/store/ryzoStore');
          
          const matchId = generateMatchId();
          const riderId = '679f1234567890abcdef1234';
          const zomatoId = String(zomatoOrder.orderId);
          const rapidoId = String(rapidoOrder.orderId);
          
          // Push match to SpacetimeDB
          await pushMatchToSpacetime({
            matchId,
            riderId,
            order1Id: zomatoId,
            order2Id: rapidoId,
            combinedEarnings: 142,
            overlapScore: 84,
          });
          
          // Update local state
          store.setMatchStatus('matched');
          store.setMatchData(MOCK_MATCH_DATA);
          store.setAgentLog(MOCK_AGENT_LOG);
          
          // Add ping to rider store
          useRiderStore.getState().addPing(MOCK_UNIFIED_PING);
          
          // Show popup if on dashboard
          const ryzoScreen = useRyzoStore.getState().currentScreen;
          if (ryzoScreen === 8) {
            store.showRiderPopup();
          } else {
            useMatchingStore.setState({ pendingRiderAlert: true });
          }
        }, 1500);
      });
    }
  }, [orderStatuses]);
}

/** Hook: agent decisions from SpacetimeDB */
export function useAgentDecisions() {
  const [decisions, setDecisions] = useState<Array<Record<string, unknown>>>([]);
  const connected = useSpacetimeStatus();

  useEffect(() => {
    if (!connected) return;
    const conn = getSpacetimeConnection();
    if (!conn) return;

    const initial = [...conn.db.agentDecision.iter()];
    setDecisions(initial as unknown as Array<Record<string, unknown>>);

    conn.db.agentDecision.onInsert((_ctx, decision) => {
      setDecisions((prev) => [...prev, decision as unknown as Record<string, unknown>]);
    });
  }, [connected]);

  return decisions;
}
