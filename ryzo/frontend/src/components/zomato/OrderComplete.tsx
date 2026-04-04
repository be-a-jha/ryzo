'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Home, Package } from 'lucide-react';
import { useMatchingStore } from '@/store/matchingStore';

export default function OrderComplete() {
  const reset = useMatchingStore((s) => s.reset);

  const handleBackHome = () => {
    reset();
    // In a real app, this would navigate to Zomato home
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white px-6">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1 
        }}
        className="relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#22C55E] rounded-full blur-3xl opacity-20 animate-pulse" />
        
        {/* Success icon */}
        <div className="relative w-32 h-32 rounded-full bg-[#22C55E]/10 border-4 border-[#22C55E] flex items-center justify-center">
          <CheckCircle2 size={64} className="text-[#22C55E]" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-8"
      >
        <h1 className="text-[28px] font-bold text-[#1A1A1A] mb-2">
          Order Delivered! 🎉
        </h1>
        <p className="text-[15px] text-[#4A4A4A]">
          Your food has been delivered successfully
        </p>
      </motion.div>

      {/* Savings Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full mt-8 bg-[#FC8019]/10 border border-[#FC8019] rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Package size={20} className="text-[#FC8019]" />
          <span className="text-[14px] font-bold text-[#FC8019]">RYZO Flexible Delivery</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[32px] font-bold text-[#FC8019] tabular-nums">₹42</span>
          <span className="text-[14px] text-[#4A4A4A]">saved</span>
        </div>

        <p className="text-[13px] text-[#4A4A4A]">
          Thanks for choosing flexible delivery! You saved money and helped reduce carbon emissions.
        </p>
      </motion.div>

      {/* Order Details */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full mt-4 bg-[#F8F8F8] rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-[#4A4A4A]">Order ID</span>
          <span className="text-[13px] font-mono text-[#1A1A1A]">#ZOM-4521</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-[#4A4A4A]">Delivery Time</span>
          <span className="text-[13px] text-[#1A1A1A]">32 minutes</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#4A4A4A]">Total Paid</span>
          <span className="text-[15px] font-bold text-[#1A1A1A] tabular-nums">₹318</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full mt-8 space-y-3"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleBackHome}
          className="w-full h-13 rounded-xl bg-[#E23744] text-white text-[15px] font-bold flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Back to Home
        </motion.button>

        <button
          className="w-full h-12 rounded-xl bg-white border border-[#EEEEEE] text-[#4A4A4A] text-[14px]"
        >
          Rate Your Experience
        </button>
      </motion.div>

      {/* Footer Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-[12px] text-[#9A9A9A] text-center mt-6"
      >
        Powered by RYZO • Smarter deliveries for everyone
      </motion.p>
    </div>
  );
}
