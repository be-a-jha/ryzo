'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Zap, Check } from 'lucide-react';
import { useMatchingStore } from '@/store/matchingStore';
import {
  RAPIDO_PICKUP,
  RAPIDO_DROP,
  RAPIDO_DISTANCE,
  RAPIDO_EST_TIME,
  RAPIDO_BASE_FARE,
  RAPIDO_CONVENIENCE_FEE,
  RAPIDO_TOTAL,
  RAPIDO_STANDARD_WAIT,
  RAPIDO_FLEXIBLE_SAVINGS,
  RAPIDO_FLEXIBLE_TOTAL,
  RAPIDO_FLEXIBLE_WAIT,
  RAPIDO_RIDE_TYPES,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';

function RapidoHeader() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#121212] border-b border-[#2A2A2A]">
      <div className="w-8 h-8 rounded-lg bg-[#1A6FE8] flex items-center justify-center">
        <span className="text-white text-[14px] font-bold">R</span>
      </div>
      <h1 className="text-[18px] font-bold text-white">Book a Ride</h1>
    </div>
  );
}

function MapPreview() {
  return (
    <div className="w-full h-[120px] bg-[#1A1A1A] relative overflow-hidden">
      {/* Road grid */}
      <div className="absolute top-1/3 left-0 right-0 h-px bg-[#2A2A2A]" />
      <div className="absolute top-2/3 left-0 right-0 h-px bg-[#2A2A2A]" />
      <div className="absolute top-0 bottom-0 left-1/4 w-px bg-[#2A2A2A]" />
      <div className="absolute top-0 bottom-0 right-1/3 w-px bg-[#2A2A2A]" />

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 120">
        <path
          d="M 60 30 Q 140 50 200 70 Q 240 85 270 95"
          stroke="#1A6FE8"
          strokeWidth="3"
          fill="none"
          opacity="0.9"
        />
      </svg>

      {/* Pickup pin */}
      <div className="absolute top-[20%] left-[16%]">
        <div className="w-3 h-3 rounded-full bg-[#22C55E] border-2 border-white" />
      </div>
      {/* Drop pin */}
      <div className="absolute bottom-[15%] right-[12%]">
        <div className="w-3 h-3 rounded-full bg-[#EF4444] border-2 border-white" />
      </div>
    </div>
  );
}

function RideDetails() {
  return (
    <div className="px-4 py-3 bg-[#121212]">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-4 h-4 mt-0.5 flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#22C55E] border-2 border-[#22C55E]/30" />
          </div>
          <div>
            <p className="text-[12px] text-[#888888]">Pickup</p>
            <p className="text-[14px] text-white">{RAPIDO_PICKUP}</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-4 h-4 mt-0.5 flex-shrink-0">
            <MapPin size={14} className="text-[#EF4444]" />
          </div>
          <div>
            <p className="text-[12px] text-[#888888]">Drop</p>
            <p className="text-[14px] text-white">{RAPIDO_DROP}</p>
          </div>
        </div>
        <p className="text-[12px] text-[#888888] ml-6">
          {RAPIDO_DISTANCE} | Est. time: {RAPIDO_EST_TIME}
        </p>
      </div>
    </div>
  );
}

function RideTypeSelector() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="px-4 py-3 bg-[#121212] border-t border-[#2A2A2A]">
      <div className="flex gap-2">
        {RAPIDO_RIDE_TYPES.map((ride, i) => (
          <motion.button
            key={ride.type}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(i)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-center border transition-all',
              selected === i
                ? 'border-[#1A6FE8] bg-[#1A6FE8]/10 text-white'
                : 'border-[#2A2A2A] bg-[#1A1A1A] text-[#888888]'
            )}
          >
            <p className="text-[13px] font-medium">{ride.type}</p>
            <p className="text-[12px] tabular-nums mt-0.5">₹{ride.price}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PricingBreakdown() {
  return (
    <div className="px-4 py-3 bg-[#121212] border-t border-[#2A2A2A]">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#888888]">Base fare</span>
          <span className="text-[13px] text-[#888888] tabular-nums">₹{RAPIDO_BASE_FARE}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#888888]">Convenience fee</span>
          <span className="text-[13px] text-[#888888] tabular-nums">₹{RAPIDO_CONVENIENCE_FEE}</span>
        </div>
        <div className="h-px bg-[#2A2A2A] my-1" />
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-white">Total</span>
          <span className="text-[15px] font-bold text-white tabular-nums">₹{RAPIDO_TOTAL}</span>
        </div>
        <p className="text-[12px] text-[#555555]">Standard wait: {RAPIDO_STANDARD_WAIT}</p>
      </div>
    </div>
  );
}

function RyzoFlexibleCard() {
  const triggerMatch = useMatchingStore((s) => s.triggerMatch);
  const isTriggered = useMatchingStore((s) => s.rapidoFlexibleTriggered);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mx-4 mt-3"
    >
      <div className="bg-[#111111] border border-[#FC8019] rounded-xl p-4">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[#FC8019]" />
            <span className="text-[15px] font-bold text-white">Flexible Ride</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FC8019] text-black text-[12px] font-bold">
            Save ₹{RAPIDO_FLEXIBLE_SAVINGS}
          </span>
        </div>

        {/* Subtext */}
        <p className="text-[13px] text-[#888888] mt-2">
          Wait {RAPIDO_FLEXIBLE_WAIT} for a rider already heading your way
        </p>

        {/* Divider */}
        <div className="h-px bg-[#2A2A2A] my-3" />

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#FC8019]">
            RYZO Flexible — ₹{RAPIDO_FLEXIBLE_TOTAL} total
          </span>
          <span className="text-[10px] text-[#555555]">Powered by RYZO</span>
        </div>
      </div>

      {/* Flexible CTA — changes state after click */}
      <AnimatePresence mode="wait">
        {isTriggered ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-13 rounded-xl bg-[#22C55E] text-white text-[15px] font-bold mt-3 flex items-center justify-center gap-2"
          >
            <Check size={18} strokeWidth={3} />
            Flexible Ride Booked
          </motion.div>
        ) : (
          <motion.button
            key="cta"
            whileTap={{ scale: 0.97 }}
            onClick={() => triggerMatch('rapido')}
            className="w-full h-13 rounded-xl bg-[#FC8019] text-black text-[15px] font-bold mt-3"
          >
            Book Flexible Ride
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MatchNotification() {
  const notification = useMatchingStore((s) => s.rapidoNotification);
  const matchStatus = useMatchingStore((s) => s.matchStatus);

  return (
    <div className="absolute top-1 left-2 right-2 z-50 pointer-events-none">
      <AnimatePresence>
        {matchStatus === 'searching' && (
          <motion.div
            key="rapido-searching"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#111111] border border-[#FC8019] rounded-xl px-4 py-3 shadow-lg flex items-center gap-2"
          >
            <div className="w-4 h-4 border-2 border-[#FC8019] border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-[13px] font-medium text-[#FC8019]">Matching your ride...</p>
              <p className="text-[10px] text-[#555555] mt-0.5">ArmorIQ validating match</p>
            </div>
          </motion.div>
        )}
        {notification && matchStatus !== 'searching' && (
          <motion.div
            key="rapido-notif"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#111111] border border-[#22C55E] rounded-xl px-4 py-3 shadow-lg"
          >
            <p className="text-[13px] font-medium text-[#22C55E]">{notification}</p>
            <p className="text-[10px] text-[#555555] mt-0.5">Powered by RYZO</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RapidoBooking() {
  return (
    <div className="flex flex-col h-full bg-[#0D0D0D] relative">
      <RapidoHeader />
      <MatchNotification />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <MapPreview />
        <RideDetails />
        <RideTypeSelector />
        <PricingBreakdown />

        {/* RYZO Integration Card */}
        <RyzoFlexibleCard />

        {/* Standard Booking Button */}
        <div className="px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full h-13 rounded-xl bg-[#1A6FE8] text-white text-[15px] font-semibold"
          >
            Book Rapido Bike
          </motion.button>
        </div>
      </div>
    </div>
  );
}
