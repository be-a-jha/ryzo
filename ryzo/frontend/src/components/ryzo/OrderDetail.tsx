'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useRyzoStore } from '@/store/ryzoStore';
import { useMatchingStore } from '@/store/matchingStore';
import { COMPARISON_DATA, AI_INSIGHT_TEXT, MOCK_MATCH_DATA } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import MapView from '@/components/shared/MapView';

function ComparisonTable() {
  return (
    <div className="bg-ryzo-surface-1 border border-ryzo-border rounded-2xl overflow-hidden">
      {/* Header row */}
      <div className="flex bg-ryzo-surface-2">
        <div className="flex-1 px-3 py-2.5 text-[12px] text-ryzo-text-muted" />
        <div className="flex-1 px-3 py-2.5 text-[13px] text-white text-center">Zomato Only</div>
        <div className="flex-1 px-3 py-2.5 text-[13px] text-white text-center">Rapido Only</div>
        <div className="flex-1 px-3 py-2.5 text-[13px] text-black text-center font-bold bg-ryzo-orange rounded-sm">
          RYZO AI
        </div>
      </div>

      {/* Data rows */}
      {COMPARISON_DATA.map((row, i) => (
        <motion.div
          key={row.metric}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.1 }}
          className={cn(
            'flex items-center',
            i < COMPARISON_DATA.length - 1 && 'border-b border-ryzo-border'
          )}
        >
          <div className="flex-1 px-3 py-2.5 text-[12px] text-ryzo-text-secondary">{row.metric}</div>
          <div className="flex-1 px-3 py-2.5 text-[13px] text-ryzo-text-secondary text-center tabular-nums">
            {row.swiggyOnly}
          </div>
          <div className="flex-1 px-3 py-2.5 text-[13px] text-ryzo-text-secondary text-center tabular-nums">
            {row.rapidoOnly}
          </div>
          <div className="flex-1 px-3 py-2.5 text-[13px] text-white text-center font-bold tabular-nums">
            <span className="flex items-center justify-center gap-1">
              {row.ryzoAI}
              <Check size={12} className="text-ryzo-success" />
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AIInsightCard() {
  return (
    <div
      className="bg-ryzo-surface-3 border border-ryzo-orange rounded-xl p-4 flex gap-3"
    >
      <span className="text-[20px] flex-shrink-0">🤖</span>
      <p className="text-[13px] text-white leading-[1.5]">
        {AI_INSIGHT_TEXT}
      </p>
    </div>
  );
}

export default function OrderDetail() {
  const navigateTo = useRyzoStore((s) => s.navigateTo);
  const goBack = useRyzoStore((s) => s.goBack);
  const matchData = useMatchingStore((s) => s.matchData);
  const setMatchStatus = useMatchingStore((s) => s.setMatchStatus);

  // Use real match data or fallback to mock
  const data = matchData || MOCK_MATCH_DATA;

  return (
    <div className="flex flex-col h-full bg-ryzo-black">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={goBack}>
            <ArrowLeft size={20} className="text-white" />
          </motion.button>
          <h2 className="text-[18px] font-bold text-white">Order Details</h2>
          <span className="px-2.5 py-1 rounded-full bg-ryzo-surface-2 border border-ryzo-orange text-ryzo-orange text-[12px]">
            AI Pick 🤖
          </span>
        </div>

        {/* Match summary card */}
        <div className="px-4 mt-2">
          <div className="bg-ryzo-surface-1 border border-ryzo-orange rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] text-ryzo-text-secondary">Match {data.matchId}</span>
              <span className="text-[12px] text-ryzo-success font-bold">
                {data.overlapScore}% overlap
              </span>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 text-center">
                <p className="text-[20px] font-bold text-white tabular-nums">₹{data.combinedEarnings}</p>
                <p className="text-[11px] text-ryzo-text-secondary">Combined</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-[20px] font-bold text-ryzo-success tabular-nums">{data.distanceSaved} km</p>
                <p className="text-[11px] text-ryzo-text-secondary">Saved</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-[20px] font-bold text-white tabular-nums">{data.detourPercent}%</p>
                <p className="text-[11px] text-ryzo-text-secondary">Detour</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="px-4 mt-3">
          <MapView variant="comparison" />
        </div>

        {/* Comparison table */}
        <div className="px-4 mt-4">
          <ComparisonTable />
        </div>

        {/* AI Insight */}
        <div className="px-4 mt-4">
          <AIInsightCard />
        </div>

        {/* SpacetimeDB status */}
        <div className="px-4 mt-3 mb-4">
          <span className="text-[11px] text-ryzo-text-muted">
            🟢 Live — SpacetimeDB Connected
          </span>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex-shrink-0 p-4 bg-gradient-to-t from-ryzo-black via-ryzo-black to-transparent">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setMatchStatus('accepted');
            navigateTo(10);
          }}
          className="w-full h-13 rounded-xl bg-ryzo-orange text-black text-[15px] font-bold"
        >
          Start Navigation
        </motion.button>
      </div>
    </div>
  );
}
