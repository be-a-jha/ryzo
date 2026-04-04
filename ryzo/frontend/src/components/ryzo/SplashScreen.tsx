'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRyzoStore } from '@/store/ryzoStore';
import { useRiderStore } from '@/store/riderStore';

export default function SplashScreen() {
  const navigateTo = useRyzoStore((s) => s.navigateTo);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar over 2000ms
    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 16);

    // Auto-navigate to Screen 2 after 2000ms
    const timeout = setTimeout(() => {
      navigateTo(2);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigateTo]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-ryzo-black px-4">
      {/* RYZO Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-[48px] font-bold text-white tracking-[8px]">
          R
          <span className="relative">
            Y
            {/* Orange accent underline under Y only */}
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-ryzo-orange"
              style={{ bottom: '2px' }}
            />
          </span>
          ZO
        </h1>

        {/* Tagline */}
        <p className="text-[14px] text-ryzo-text-secondary mt-2">
          One Rider. Every Platform.
        </p>
      </motion.div>

      {/* Loading progress bar */}
      <div className="mt-12 w-48">
        <div className="w-full h-[2px] bg-ryzo-surface-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ryzo-orange rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>
        <p className="text-[12px] text-ryzo-text-muted text-center mt-3">
          Loading...
        </p>
      </div>

      {/* Demo fast-forward button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => {
          useRyzoStore.getState().setRole('rider');
          useRyzoStore.getState().navigateTo(8);
          // Initialize rider as online for demo
          const rider = useRiderStore.getState();
          if (rider.profile.status !== 'online') {
            rider.toggleStatus();
          }
        }}
        className="mt-8 px-4 py-2 rounded-lg bg-ryzo-surface-2 border border-ryzo-border text-ryzo-text-secondary text-[12px] hover:border-ryzo-orange hover:text-ryzo-orange transition-colors"
      >
        Skip to Rider Dashboard (Demo)
      </motion.button>
    </div>
  );
}
