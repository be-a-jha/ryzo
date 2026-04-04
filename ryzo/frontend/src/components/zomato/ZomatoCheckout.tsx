'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Pencil, Zap, Check } from 'lucide-react';
import { useMatchingStore } from '@/store/matchingStore';
import {
  ZOMATO_ORDER_ITEMS,
  ZOMATO_RESTAURANT,
  ZOMATO_SUBTOTAL,
  ZOMATO_DELIVERY_FEE,
  ZOMATO_PLATFORM_FEE,
  ZOMATO_TOTAL,
  ZOMATO_STANDARD_TIME,
  ZOMATO_DELIVERY_ADDRESS,
  ZOMATO_FLEXIBLE_SAVINGS,
  ZOMATO_FLEXIBLE_TOTAL,
  ZOMATO_FLEXIBLE_WAIT,
} from '@/lib/mockData';

function ZomatoHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#EEEEEE]">
      <ArrowLeft size={20} className="text-[#1A1A1A]" />
      <h1 className="text-[18px] font-bold text-[#1A1A1A]">Checkout</h1>
      <div className="w-5" />
    </div>
  );
}

function OrderItems() {
  return (
    <div className="px-4 py-4 bg-white">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#E23744] flex items-center justify-center">
          <span className="text-white text-[14px] font-bold">Z</span>
        </div>
        <p className="text-[16px] font-bold text-[#1A1A1A]">{ZOMATO_RESTAURANT}</p>
      </div>

      <div className="flex flex-col gap-2">
        {ZOMATO_ORDER_ITEMS.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <span className="text-[14px] text-[#4A4A4A]">
              {item.name} x{item.quantity}
            </span>
            <span className="text-[14px] text-[#1A1A1A] tabular-nums">₹{item.price}</span>
          </div>
        ))}
        <div className="h-px bg-[#EEEEEE] my-1" />
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-[#1A1A1A]">Subtotal</span>
          <span className="text-[14px] font-medium text-[#1A1A1A] tabular-nums">₹{ZOMATO_SUBTOTAL}</span>
        </div>
      </div>
    </div>
  );
}

function DeliveryAddress() {
  return (
    <div className="px-4 py-3 bg-white border-t border-[#EEEEEE]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] text-[#9A9A9A] uppercase tracking-wide">Deliver to</p>
          <p className="text-[14px] text-[#1A1A1A] mt-0.5">{ZOMATO_DELIVERY_ADDRESS}</p>
        </div>
        <Pencil size={16} className="text-[#9A9A9A]" />
      </div>
    </div>
  );
}

function PricingBreakdown() {
  return (
    <div className="px-4 py-3 bg-white border-t border-[#EEEEEE]">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#4A4A4A]">Item total</span>
          <span className="text-[13px] text-[#4A4A4A] tabular-nums">₹{ZOMATO_SUBTOTAL}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#4A4A4A]">Delivery fee</span>
          <span className="text-[13px] text-[#4A4A4A] tabular-nums">₹{ZOMATO_DELIVERY_FEE}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#4A4A4A]">Platform fee</span>
          <span className="text-[13px] text-[#4A4A4A] tabular-nums">₹{ZOMATO_PLATFORM_FEE}</span>
        </div>
        <div className="h-px bg-[#EEEEEE] my-1" />
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold text-[#1A1A1A]">Total</span>
          <span className="text-[15px] font-bold text-[#1A1A1A] tabular-nums">₹{ZOMATO_TOTAL}</span>
        </div>
        <p className="text-[12px] text-[#9A9A9A]">Estimated delivery: {ZOMATO_STANDARD_TIME}</p>
      </div>
    </div>
  );
}

function RyzoFlexibleCard() {
  const triggerMatch = useMatchingStore((s) => s.triggerMatch);
  const isTriggered = useMatchingStore((s) => s.zomatoFlexibleTriggered);

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
            <span className="text-[15px] font-bold text-white">Flexible Delivery</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FC8019] text-black text-[12px] font-bold">
            Save ₹{ZOMATO_FLEXIBLE_SAVINGS}
          </span>
        </div>

        {/* Subtext */}
        <p className="text-[13px] text-[#888888] mt-2">
          Wait {ZOMATO_FLEXIBLE_WAIT} more for a guaranteed discount
        </p>

        {/* Divider */}
        <div className="h-px bg-[#2A2A2A] my-3" />

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#FC8019]">
            RYZO Flexible — ₹{ZOMATO_FLEXIBLE_TOTAL} total
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
            Flexible Order Placed
          </motion.div>
        ) : (
          <motion.button
            key="cta"
            whileTap={{ scale: 0.97 }}
            onClick={() => triggerMatch('zomato')}
            className="w-full h-13 rounded-xl bg-[#FC8019] text-black text-[15px] font-bold mt-3"
          >
            Order with Flexible Delivery
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MatchNotification() {
  const notification = useMatchingStore((s) => s.zomatoNotification);
  const matchStatus = useMatchingStore((s) => s.matchStatus);

  return (
    <div className="absolute top-1 left-2 right-2 z-50 pointer-events-none">
      <AnimatePresence>
        {matchStatus === 'searching' && (
          <motion.div
            key="zomato-searching"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-[#111111] border border-[#FC8019] rounded-xl px-4 py-3 shadow-lg flex items-center gap-2"
          >
            <div className="w-4 h-4 border-2 border-[#FC8019] border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-[13px] font-medium text-[#FC8019]">Finding a flexible rider...</p>
              <p className="text-[10px] text-[#555555] mt-0.5">AI analyzing route overlap</p>
            </div>
          </motion.div>
        )}
        {notification && matchStatus !== 'searching' && (
          <motion.div
            key="zomato-notif"
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

export default function ZomatoCheckout() {
  return (
    <div className="flex flex-col h-full bg-[#F8F8F8] relative">
      <ZomatoHeader />
      <MatchNotification />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <OrderItems />
        <DeliveryAddress />
        <PricingBreakdown />

        {/* RYZO Integration Card */}
        <RyzoFlexibleCard />

        {/* Standard Order Button */}
        <div className="px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-full h-13 rounded-xl bg-[#E23744] text-white text-[15px] font-semibold"
          >
            Place Order — ₹{ZOMATO_TOTAL}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
