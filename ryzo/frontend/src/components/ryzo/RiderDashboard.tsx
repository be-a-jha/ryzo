'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map, DollarSign, User, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useRyzoStore } from '@/store/ryzoStore';
import { useRiderStore } from '@/store/riderStore';
import { useMatchingStore } from '@/store/matchingStore';
import { useActiveMatches } from '@/hooks/useSpacetimeDB';
import {
  MOCK_STANDARD_PING,
  MOCK_AGENT_LOG,
  MOCK_MATCH_DATA,
} from '@/lib/mockData';
import { useSpacetimeStatus } from '@/hooks/useSpacetimeDB';
import { cn } from '@/lib/utils';
import type { OrderPing } from '@/types/rider';

// ── Sub-components ──

function EarningsCard() {
  const profile = useRiderStore((s) => s.profile);
  return (
    <div className="bg-ryzo-surface-1 border border-ryzo-border rounded-2xl p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[12px] text-ryzo-text-secondary">Today&apos;s Earnings</p>
          <p className="text-[28px] font-bold text-white tabular-nums">₹{profile.todayEarnings}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-ryzo-text-secondary">Orders</p>
          <p className="text-[28px] font-bold text-white tabular-nums">{profile.todayOrders}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="w-full h-1 bg-ryzo-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-ryzo-orange rounded-full transition-all duration-500"
            style={{ width: `${profile.goalPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-ryzo-text-secondary mt-1.5">{profile.goalPercent}% of daily goal</p>
      </div>
    </div>
  );
}

function OnlineToggle() {
  const profile = useRiderStore((s) => s.profile);
  const toggleStatus = useRiderStore((s) => s.toggleStatus);
  const isOnline = profile.status === 'online';
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={toggleStatus}
      className="w-full bg-ryzo-surface-1 border border-ryzo-border rounded-2xl p-2 flex"
    >
      <div
        className={cn(
          'flex-1 py-2.5 rounded-xl text-[13px] font-bold text-center transition-all duration-200',
          isOnline ? 'bg-ryzo-surface-2 text-ryzo-success' : 'text-ryzo-text-muted'
        )}
        style={isOnline ? { boxShadow: '0 0 12px rgba(34,197,94,0.15)' } : undefined}
      >
        ONLINE
      </div>
      <div
        className={cn(
          'flex-1 py-2.5 rounded-xl text-[13px] font-bold text-center transition-all duration-200',
          !isOnline ? 'bg-ryzo-surface-2 text-ryzo-error' : 'text-ryzo-text-muted'
        )}
      >
        GO OFFLINE
      </div>
    </motion.button>
  );
}

function PlatformChip({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-[0.5px] border"
      style={{
        color,
        borderColor: color,
        backgroundColor: color + '1A',
      }}
    >
      {name}
    </span>
  );
}

function StatsRow({ distance, earnings, time, ping }: {
  distance: string; earnings: string; time: string; ping: OrderPing;
}) {
  return (
    <div className="flex gap-2 mt-3">
      <div className="flex-1 text-center">
        <p className="text-[16px] font-bold text-white tabular-nums">{distance}</p>
        <p className="text-[11px] text-ryzo-text-secondary uppercase">{ping.distanceLabel}</p>
      </div>
      <div className="flex-1 text-center">
        <p className="text-[16px] font-bold text-white tabular-nums">{earnings}</p>
        <p className="text-[11px] text-ryzo-text-secondary uppercase">{ping.earningsLabel}</p>
      </div>
      <div className="flex-1 text-center">
        <p className="text-[16px] font-bold text-white tabular-nums">{time}</p>
        <p className="text-[11px] text-ryzo-text-secondary uppercase">{ping.timeLabel}</p>
      </div>
    </div>
  );
}

function OrderPingCard({ ping, onAccept, onDecline }: {
  ping: OrderPing;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const isUnified = ping.type === 'unified';
  const [timer, setTimer] = useState(ping.expiresIn);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const platformColors: Record<string, string> = {
    ZOMATO: '#E23744',
    RAPIDO: '#1A6FE8',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        'bg-ryzo-surface-1 rounded-2xl p-4',
        isUnified ? 'border-2 border-ryzo-orange' : 'border border-ryzo-border'
      )}
      style={isUnified ? { animation: 'pulse-orange 1.5s ease-in-out infinite' } : undefined}
    >
      {/* Platform chips + badge */}
      <div className="flex items-center gap-2 flex-wrap">
        {ping.platforms.map((p) => (
          <PlatformChip key={p} name={p} color={platformColors[p] || '#888888'} />
        ))}
        {isUnified && ping.badge && (
          <span className="text-[11px] font-bold uppercase tracking-[2px] text-ryzo-orange ml-auto">
            {ping.badge}
          </span>
        )}
      </div>

      {/* Restaurant + drop */}
      <p className="text-[15px] font-bold text-white mt-2.5">{ping.restaurant}</p>
      <p className="text-[13px] text-ryzo-text-secondary">{ping.dropAddress}</p>

      {/* Stats row */}
      <StatsRow distance={ping.distance} earnings={ping.earnings} time={ping.time} ping={ping} />

      {/* AI + Agent tags (unified only) */}
      {isUnified && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {ping.aiTag && (
            <span className="px-2.5 py-1 rounded-lg bg-ryzo-surface-2 border border-ryzo-orange text-ryzo-orange text-[11px]">
              {ping.aiTag}
            </span>
          )}
          {ping.agentTag && (
            <span className="px-2.5 py-1 rounded-lg bg-ryzo-surface-2 border border-ryzo-success text-ryzo-success text-[11px]">
              {ping.agentTag}
            </span>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onDecline}
          className="flex-1 h-11 rounded-xl bg-ryzo-surface-2 border border-ryzo-border text-ryzo-text-secondary text-[14px]"
        >
          Decline
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAccept}
          className="flex-1 h-11 rounded-xl bg-ryzo-orange text-black text-[14px] font-bold"
        >
          Accept
        </motion.button>
      </div>

      {/* Timer */}
      <p className="text-[12px] text-ryzo-text-secondary text-right mt-2 tabular-nums">
        Expires in {minutes}:{seconds.toString().padStart(2, '0')}
      </p>
    </motion.div>
  );
}

function AgentDecisionLog() {
  const [expanded, setExpanded] = useState(false);
  const agentLog = useMatchingStore((s) => s.agentLog);
  const log = agentLog.length > 0 ? agentLog : MOCK_AGENT_LOG;

  return (
    <div className="mt-3">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-[13px] text-ryzo-text-secondary"
      >
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        View ArmorIQ Decision Log
      </motion.button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 mt-2">
              {log.map((entry) => (
                <div
                  key={entry.id}
                  className="text-[12px] font-mono flex items-start gap-2 px-2 py-1.5 bg-ryzo-surface-2 rounded-lg"
                >
                  <span className={entry.action === 'MATCH_APPROVED' ? 'text-ryzo-success' : 'text-ryzo-error'}>
                    {entry.action === 'MATCH_APPROVED' ? '✅' : '❌'}
                  </span>
                  <span className={entry.action === 'MATCH_APPROVED' ? 'text-ryzo-success' : 'text-ryzo-error'}>
                    {entry.action === 'MATCH_APPROVED' ? 'APPROVED' : 'BLOCKED'}
                  </span>
                  <span className="text-ryzo-text-muted">|</span>
                  <span className="text-ryzo-text-secondary">{entry.reason}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BottomNav() {
  const tabs = [
    { icon: Home, label: 'Home', active: true },
    { icon: Map, label: 'Map', active: false },
    { icon: DollarSign, label: 'Earnings', active: false },
    { icon: User, label: 'Profile', active: false },
  ] as const;

  return (
    <div className="flex-shrink-0 bg-ryzo-surface-3 border-t border-ryzo-border-subtle">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <button key={tab.label} className="flex flex-col items-center gap-1">
            <tab.icon
              size={20}
              className={tab.active ? 'text-ryzo-orange' : 'text-ryzo-text-muted'}
            />
            <span
              className={cn(
                'text-[10px] font-medium',
                tab.active ? 'text-ryzo-orange' : 'text-ryzo-text-muted'
              )}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Match Popup Overlay ──
// Full-screen overlay that slides up when a match is found

function MatchPopup() {
  const riderPopupVisible = useMatchingStore((s) => s.riderPopupVisible);
  const matchData = useMatchingStore((s) => s.matchData);
  const acceptMatch = useMatchingStore((s) => s.acceptMatch);
  const declineMatch = useMatchingStore((s) => s.declineMatch);

  const data = matchData || MOCK_MATCH_DATA;

  return (
    <AnimatePresence>
      {riderPopupVisible && (
        <motion.div
          key="match-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-50 flex items-end"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full bg-ryzo-surface-1 rounded-t-3xl overflow-hidden"
            style={{ boxShadow: '0 -16px 60px rgba(252,128,25,0.25)' }}
          >
            {/* Orange glow bar at top */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-ryzo-orange to-transparent" />

            {/* Handle + close */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ryzo-orange animate-pulse" />
                <span className="text-[12px] font-bold uppercase tracking-[3px] text-ryzo-orange">
                  New Unified Order
                </span>
              </div>
              <motion.button whileTap={{ scale: 0.9 }} onClick={declineMatch}>
                <X size={18} className="text-ryzo-text-muted" />
              </motion.button>
            </div>

            {/* Match summary */}
            <div className="px-5 pb-3">
              <p className="text-[18px] font-bold text-white">
                McDonald&apos;s + Rapido Ride
              </p>
              <p className="text-[13px] text-ryzo-text-secondary mt-0.5">
                Arera Colony → BHEL → MP Nagar → Sarvadharm
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-2 px-5 pb-4">
              <div className="bg-ryzo-surface-2 rounded-xl p-3 text-center">
                <p className="text-[20px] font-bold text-white tabular-nums">₹{data.combinedEarnings}</p>
                <p className="text-[10px] text-ryzo-text-secondary uppercase mt-0.5">Combined</p>
              </div>
              <div className="bg-ryzo-surface-2 rounded-xl p-3 text-center">
                <p className="text-[20px] font-bold text-ryzo-success tabular-nums">{data.overlapScore}%</p>
                <p className="text-[10px] text-ryzo-text-secondary uppercase mt-0.5">Overlap</p>
              </div>
              <div className="bg-ryzo-surface-2 rounded-xl p-3 text-center">
                <p className="text-[20px] font-bold text-white tabular-nums">{data.distanceSaved} km</p>
                <p className="text-[10px] text-ryzo-text-secondary uppercase mt-0.5">Saved</p>
              </div>
            </div>

            {/* AI + Agent tags */}
            <div className="flex gap-2 px-5 pb-4 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-ryzo-surface-2 border border-ryzo-orange text-ryzo-orange text-[11px]">
                🤖 AI Optimized Route
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-ryzo-surface-2 border border-ryzo-success text-ryzo-success text-[11px]">
                ✓ ArmorIQ Approved
              </span>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 px-5 pb-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={declineMatch}
                className="flex-1 h-13 rounded-xl bg-ryzo-surface-2 border border-ryzo-border text-ryzo-text-secondary text-[15px] font-medium"
              >
                Decline
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={acceptMatch}
                className="flex-[2] h-13 rounded-xl bg-ryzo-orange text-black text-[15px] font-bold"
                style={{ animation: 'pulse-orange 1.5s ease-in-out infinite' }}
              >
                Accept Unified Order
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ──

/** Play a short notification beep using Web Audio API */
function playNotificationSound(): void {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Two-tone notification: ascending beep
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587, ctx.currentTime); // D5
    oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.12); // G5
    oscillator.frequency.setValueAtTime(988, ctx.currentTime + 0.24); // B5

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);

    // Clean up
    oscillator.onended = () => {
      ctx.close();
    };
  } catch {
    // Audio not available — silent fail
  }
}

export default function RiderDashboard() {
  const navigateTo = useRyzoStore((s) => s.navigateTo);
  const setMatchData = useMatchingStore((s) => s.setMatchData);
  const setMatchStatus = useMatchingStore((s) => s.setMatchStatus);
  const matchStatus = useMatchingStore((s) => s.matchStatus);
  const showRiderPopup = useMatchingStore((s) => s.showRiderPopup);
  const removePing = useRiderStore((s) => s.removePing);
  const profile = useRiderStore((s) => s.profile);
  const riderId = useRiderStore((s) => s.riderId);
  const loading = useRiderStore((s) => s.loading);
  const error = useRiderStore((s) => s.error);
  const fetchProfile = useRiderStore((s) => s.fetchProfile);
  const fetchOrders = useRiderStore((s) => s.fetchOrders);
  const incomingPings = useRiderStore((s) => s.incomingPings);
  const stdbConnected = useSpacetimeStatus();

  // Standard pings (non-unified) - use backend data if available, fallback to mock
  const [pings] = useState<OrderPing[]>([MOCK_STANDARD_PING]);
  const displayPings = incomingPings.length > 0 ? incomingPings : pings;

  // Subscribe to SpacetimeDB matches for cross-device sync
  const spacetimeMatches = useActiveMatches();

  // When new match arrives from SpacetimeDB, show popup
  useEffect(() => {
    if (spacetimeMatches.length > 0) {
      const latestMatch = spacetimeMatches[0];
      console.log('[RiderDashboard] Match from SpacetimeDB:', latestMatch);
      
      // Set match data
      setMatchData(MOCK_MATCH_DATA);
      setMatchStatus('matched');
      
      // Show popup if on dashboard
      showRiderPopup();
      
      // Play sound
      playNotificationSound();
    }
  }, [spacetimeMatches, setMatchData, setMatchStatus, showRiderPopup]);

  // Fetch real data from backend on mount
  useEffect(() => {
    const storedRiderId = riderId || localStorage.getItem('ryzo_rider_id');
    if (storedRiderId) {
      fetchProfile(storedRiderId);
      fetchOrders(storedRiderId);
    }
  }, [riderId, fetchProfile, fetchOrders]);

  // When rider reaches this screen, activate any pending match popup + sound
  useEffect(() => {
    showRiderPopup();
  // Only run on mount — showRiderPopup is stable (store action ref)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAccept = (ping: OrderPing) => {
    if (ping.type === 'unified') {
      setMatchData(MOCK_MATCH_DATA);
      navigateTo(9);
    }
  };

  const handleDecline = (pingId: string) => {
    removePing(pingId);
  };

  return (
    <div className="flex flex-col h-full bg-ryzo-black relative">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-3 pb-4">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-ryzo-orange border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-ryzo-surface-1 border border-ryzo-error rounded-2xl p-4 mb-4">
            <p className="text-[14px] text-ryzo-error">{error}</p>
            <p className="text-[12px] text-ryzo-text-secondary mt-1">Using demo data as fallback</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold text-white">
            Good morning, {profile.name.split(' ')[0]} 👋
          </h2>
          <div className="w-10 h-10 rounded-full bg-ryzo-surface-2 border-2 border-ryzo-orange flex items-center justify-center">
            <span className="text-[13px] font-bold text-white">{profile.initials}</span>
          </div>
        </div>

        {/* Earnings */}
        <EarningsCard />

        {/* Online toggle */}
        <div className="mt-3">
          <OnlineToggle />
        </div>

        {/* Section label */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <span className="text-[14px] font-medium text-white">INCOMING ORDERS</span>
          <span className="w-2 h-2 rounded-full bg-ryzo-orange animate-pulse" />
        </div>

        {/* Matching in progress banner */}
        <AnimatePresence>
          {matchStatus === 'searching' && (
            <motion.div
              key="searching-banner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-3 overflow-hidden"
            >
              <div className="bg-ryzo-surface-1 border border-ryzo-orange rounded-2xl p-4 flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-ryzo-orange border-t-transparent rounded-full animate-spin" />
                <div>
                  <p className="text-[14px] font-bold text-white">Finding optimal match...</p>
                  <p className="text-[12px] text-ryzo-text-secondary mt-0.5">
                    AI analyzing route overlap + ArmorIQ validating
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standard order pings (always visible) */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {displayPings.map((ping) => (
              <OrderPingCard
                key={ping.id}
                ping={ping}
                onAccept={() => handleAccept(ping)}
                onDecline={() => handleDecline(ping.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Agent Log */}
        <AgentDecisionLog />

        {/* SpacetimeDB connection indicator */}
        <div className="mt-4 mb-2 flex items-center gap-2">
          <span
            className={cn(
              'w-2 h-2 rounded-full',
              stdbConnected ? 'bg-ryzo-success' : 'bg-ryzo-text-disabled'
            )}
          />
          <span className="text-[11px] text-ryzo-text-muted">
            {stdbConnected ? 'SpacetimeDB Connected' : 'SpacetimeDB Offline'}
          </span>
        </div>
      </div>

      {/* Bottom nav */}
      <BottomNav />

      {/* Match Popup Overlay — slides up on top of everything */}
      <MatchPopup />
    </div>
  );
}
