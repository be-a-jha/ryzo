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
