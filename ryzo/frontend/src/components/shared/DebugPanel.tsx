'use client';

import { useState } from 'react';
import { useSpacetimeStatus, useOrderStatuses, useActiveMatches } from '@/hooks/useSpacetimeDB';
import { useMatchingStore } from '@/store/matchingStore';
import { clearSpacetimeData } from '@/services/spacetimeService';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export default function DebugPanel() {
  const [expanded, setExpanded] = useState(false);
  const [clearing, setClearing] = useState(false);
  const connected = useSpacetimeStatus();
  const orderStatuses = useOrderStatuses();
  const activeMatches = useActiveMatches();
  const matchStatus = useMatchingStore((s) => s.matchStatus);
  const zomatoTriggered = useMatchingStore((s) => s.zomatoFlexibleTriggered);
  const rapidoTriggered = useMatchingStore((s) => s.rapidoFlexibleTriggered);

  const handleClear = async () => {
    if (!confirm('Clear all orders and matches? This will mark all orders as completed.')) {
      return;
    }
    setClearing(true);
    await clearSpacetimeData();
    
    // Reset local state
    useMatchingStore.getState().reset();
    
    // Reload page after 1s
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  // Filter orders by status
  const pendingOrders = orderStatuses.filter((o) => String(o.status) === 'pending');
  const matchedOrders = orderStatuses.filter((o) => String(o.status) === 'matched');
  const completedOrders = orderStatuses.filter((o) => String(o.status) === 'completed');

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-2 border border-white/20 hover:bg-black/90"
      >
        <ChevronUp size={14} />
        Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm border border-white/20 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">Debug Panel</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            disabled={clearing}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-50"
            title="Clear all data"
          >
            <RefreshCw size={14} className={clearing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setExpanded(false)}>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* SpacetimeDB Connection */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="font-semibold">SpacetimeDB</span>
        </div>
        <p className="text-white/60 text-[10px]">
          {connected ? 'Connected' : 'Disconnected'}
        </p>
      </div>

      {/* Local State */}
      <div className="mb-3">
        <p className="font-semibold mb-1">Local State</p>
        <div className="space-y-1 text-[10px]">
          <p>Match Status: <span className="text-orange-400">{matchStatus}</span></p>
          <p>Zomato: <span className={zomatoTriggered ? 'text-green-400' : 'text-red-400'}>
            {zomatoTriggered ? 'Triggered' : 'Not triggered'}
          </span></p>
          <p>Rapido: <span className={rapidoTriggered ? 'text-green-400' : 'text-red-400'}>
            {rapidoTriggered ? 'Triggered' : 'Not triggered'}
          </span></p>
        </div>
      </div>

      {/* Order Statuses from SpacetimeDB */}
      <div className="mb-3">
        <p className="font-semibold mb-1">Orders in SpacetimeDB</p>
        <div className="space-y-1 text-[10px] mb-2">
          <p>Total: <span className="text-white/60">{orderStatuses.length}</span></p>
          <p>Pending: <span className="text-yellow-400">{pendingOrders.length}</span></p>
          <p>Matched: <span className="text-green-400">{matchedOrders.length}</span></p>
          <p>Completed: <span className="text-blue-400">{completedOrders.length}</span></p>
        </div>
        
        {pendingOrders.length === 0 ? (
          <p className="text-white/40 text-[10px]">No pending orders</p>
        ) : (
          <div className="space-y-1">
            {pendingOrders.map((order, i) => (
              <div key={i} className="bg-white/5 p-2 rounded text-[10px]">
                <p>Platform: <span className="text-orange-400">{String(order.platform)}</span></p>
                <p>Status: <span className="text-yellow-400">{String(order.status)}</span></p>
                <p className="text-white/40 truncate">ID: {String(order.orderId).slice(0, 20)}...</p>
                <p className="text-white/40">
                  Age: {Math.round((Date.now() - Number(order.timestamp)) / 1000)}s
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Matches from SpacetimeDB */}
      <div>
        <p className="font-semibold mb-1">Matches in SpacetimeDB ({activeMatches.length})</p>
        {activeMatches.length === 0 ? (
          <p className="text-white/40 text-[10px]">No matches yet</p>
        ) : (
          <div className="space-y-1">
            {activeMatches.map((match, i) => (
              <div key={i} className="bg-white/5 p-2 rounded text-[10px]">
                <p>Overlap: <span className="text-green-400">{String(match.overlapScore)}%</span></p>
                <p>Earnings: <span className="text-orange-400">₹{String(match.combinedEarnings)}</span></p>
                <p>Status: <span className="text-blue-400">{String(match.status)}</span></p>
                <p className="text-white/40 truncate">ID: {String(match.matchId).slice(0, 20)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-white/40 text-[10px]">
          Click <RefreshCw size={10} className="inline" /> to clear all data and reset
        </p>
      </div>
    </div>
  );
}
