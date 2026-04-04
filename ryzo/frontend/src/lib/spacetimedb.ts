'use client';

import { DbConnection, type ErrorContext } from '@/module_bindings';
import type { Identity } from 'spacetimedb';

const SPACETIMEDB_URI = process.env.NEXT_PUBLIC_SPACETIMEDB_URI || 'wss://maincloud.spacetimedb.com';
const MODULE_NAME = process.env.NEXT_PUBLIC_SPACETIMEDB_MODULE || 'ryzo-0r856';

let connection: DbConnection | null = null;
let isConnected = false;

// Event handlers
type ConnectionHandler = (connected: boolean) => void;

const connectionHandlers: ConnectionHandler[] = [];
const matchInsertHandlers: Array<(match: Record<string, unknown>) => void> = [];

export function getSpacetimeConnection(): DbConnection | null {
  return connection;
}

export function isSpacetimeConnected(): boolean {
  return isConnected;
}

export function onConnectionChange(handler: ConnectionHandler): () => void {
  connectionHandlers.push(handler);
  return () => {
    const idx = connectionHandlers.indexOf(handler);
    if (idx !== -1) connectionHandlers.splice(idx, 1);
  };
}

export function onMatchInsert(handler: (match: Record<string, unknown>) => void): () => void {
  matchInsertHandlers.push(handler);
  return () => {
    const idx = matchInsertHandlers.indexOf(handler);
    if (idx !== -1) matchInsertHandlers.splice(idx, 1);
  };
}

export function connectSpacetimeDB(): DbConnection {
  if (connection) return connection;

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('spacetimedb_token') || undefined
    : undefined;

  try {
    connection = DbConnection.builder()
      .withUri(SPACETIMEDB_URI)
      .withDatabaseName(MODULE_NAME)
      .withToken(token)
      .onConnect((conn: DbConnection, identity: Identity, authToken: string) => {
        console.log('SpacetimeDB connected:', identity.toHexString());
        isConnected = true;

        // Save token for reconnection
        if (typeof window !== 'undefined') {
          localStorage.setItem('spacetimedb_token', authToken);
        }

        // Subscribe to all public tables
        conn.subscriptionBuilder()
          .onApplied(() => {
            console.log('SpacetimeDB subscriptions applied');
          })
          .onError((err) => {
            console.error('SpacetimeDB subscription error:', err);
          })
          .subscribe([
            'SELECT * FROM active_match',
            'SELECT * FROM order_status',
            'SELECT * FROM agent_decision',
            'SELECT * FROM rider_location',
          ]);

        connectionHandlers.forEach((h) => h(true));
      })
      .onDisconnect((_ctx: ErrorContext, err?: Error) => {
        console.log('SpacetimeDB disconnected', err?.message || '');
        isConnected = false;
        connection = null;
        connectionHandlers.forEach((h) => h(false));
      })
      .onConnectError((_ctx: ErrorContext, err: Error) => {
        console.error('SpacetimeDB connection error:', err.message);
        isConnected = false;
      })
      .build();

    // Register table event handlers
    connection.db.activeMatch.onInsert((_ctx, match) => {
      console.log('SpacetimeDB: new match inserted:', match.matchId);
      matchInsertHandlers.forEach((h) => h(match as unknown as Record<string, unknown>));
    });

    connection.db.orderStatus.onInsert((_ctx, order) => {
      console.log('SpacetimeDB: order status update:', order.orderId, order.status);
    });

    connection.db.agentDecision.onInsert((_ctx, decision) => {
      console.log('SpacetimeDB: agent decision:', decision.decision);
    });

    return connection;
  } catch (error) {
    console.error('SpacetimeDB init error:', error);
    throw error;
  }
}
