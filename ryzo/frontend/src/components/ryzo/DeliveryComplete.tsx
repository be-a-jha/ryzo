'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Home, TrendingUp } from 'lucide-react';
import { useRyzoStore } from '@/store/ryzoStore';
import { useRiderStore } from '@/store/riderStore';
import { useMatchingStore } from '@/store/matchingStore';
import { useEffect } from 'react';

export default function DeliveryComplete() {
  const navigateTo = useRyzoStore((s) => s.navigateTo);
  const profile = useRiderStore((s) => s.profile);
  const updateEarnings = useRiderStore((s) => s.updateEarnings);
  const completeOrder = useMatchingStore((s) => s.completeOrder);

  // Update earnings and mark orders as completed when component mounts
  useEffect(() => {
    // Add earnings from completed delivery (₹142 from unified order)
    updateEarnings(142);
    
    // Mark both Zomato and Rapido orders as completed
    completeOrder('zomato');
    completeOrder('rapido');
  }, [updateEarnings, completeOrder]);

  const handleGoHome = () => {
    navigateTo(8); // Back to Rider Dashboard
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-ryzo-black px-6">
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
        <div className="absolute inset-0 bg-ryzo-success rounded-full blur-3xl opacity-20 animate-pulse" />
        
        {/* Success icon */}
        <div className="relative w-32 h-32 rounded-full bg-ryzo-success/10 border-4 border-ryzo-success flex items-center justify-center">
          <CheckCircle2 size={64} className="text-ryzo-success" />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-8"
      >
        <h1 className="text-[28px] font-bold text-white mb-2">
          Delivery Complete! 🎉
        </h1>
        <p className="text-[15px] text-ryzo-text-secondary">
          Both orders delivered successfully
        </p>
      </motion.div>

      {/* Earnings Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full mt-8 bg-ryzo-surface-1 border border-ryzo-border rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] text-ryzo-text-secondary">Earnings from this trip</span>
          <TrendingUp size={20} className="text-ryzo-success" />
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-[36px] font-bold text-ryzo-success tabular-nums">₹142</span>
          <span className="text-[14px] text-ryzo-text-secondary">+₹42 vs separate</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ryzo-border">
          <div>
            <p className="text-[12px] text-ryzo-text-muted uppercase mb-1">Distance Saved</p>
            <p className="text-[16px] font-bold text-white">1.2 km</p>
          </div>
          <div>
            <p className="text-[12px] text-ryzo-text-muted uppercase mb-1">Time Saved</p>
            <p className="text-[16px] font-bold text-white">~12 min</p>
          </div>
        </div>
      </motion.div>

      {/* Today's Summary */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full mt-4 bg-ryzo-surface-2 rounded-xl p-4"
      >
        <p className="text-[13px] text-ryzo-text-secondary mb-2">Today's Total</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[20px] font-bold text-white tabular-nums">₹{profile.todayEarnings + 142}</p>
            <p className="text-[12px] text-ryzo-text-muted">{profile.todayOrders + 2} orders completed</p>
          </div>
          <div className="text-right">
            <p className="text-[14px] text-ryzo-success font-bold">{Math.round(((profile.todayEarnings + 142) / profile.dailyGoal) * 100)}%</p>
            <p className="text-[12px] text-ryzo-text-muted">of daily goal</p>
          </div>
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
          onClick={handleGoHome}
          className="w-full h-13 rounded-xl bg-ryzo-orange text-black text-[15px] font-bold flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Back to Dashboard
        </motion.button>

        <button
          className="w-full h-12 rounded-xl bg-ryzo-surface-2 border border-ryzo-border text-ryzo-text-secondary text-[14px]"
        >
          View Trip Details
        </button>
      </motion.div>

      {/* Motivational Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-[13px] text-ryzo-text-muted text-center mt-6"
      >
        Great job! Keep going to reach your daily goal 💪
      </motion.p>
    </div>
  );
}
