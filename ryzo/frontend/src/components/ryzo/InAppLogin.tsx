'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useRyzoStore } from '@/store/ryzoStore';

export default function InAppLogin() {
  const currentLoginApp = useRyzoStore((s) => s.currentLoginApp);
  const closeLoginModal = useRyzoStore((s) => s.closeLoginModal);
  const addIntegratedApp = useRyzoStore((s) => s.addIntegratedApp);
  const [showPassword, setShowPassword] = useState(false);

  if (!currentLoginApp) return null;

  const handleLogin = () => {
    addIntegratedApp(currentLoginApp.id);
    closeLoginModal();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/70 z-40"
        onClick={closeLoginModal}
      />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 z-50 bg-ryzo-surface-1 rounded-t-3xl"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.5)' }}
      >
        {/* Handle pill */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-ryzo-text-disabled" />
        </div>

        <div className="px-5 pb-8">
          {/* App logo + name */}
          <div className="flex flex-col items-center mb-5">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-[24px] font-bold mb-3"
              style={{ backgroundColor: currentLoginApp.color }}
            >
              {currentLoginApp.name.charAt(0)}
            </div>
            <h3 className="text-[20px] font-bold text-white">{currentLoginApp.name}</h3>
            <p className="text-[13px] text-ryzo-text-secondary mt-0.5">
              Login to link your {currentLoginApp.name} account
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <Lock size={12} className="text-ryzo-text-muted" />
              <span className="text-[10px] text-ryzo-text-muted">Secured by RYZO</span>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Phone number or email"
              className="w-full h-13 px-4 bg-ryzo-surface-2 border border-ryzo-border rounded-xl text-[15px] text-white placeholder:text-ryzo-text-muted focus:border-ryzo-orange focus:outline-none transition-colors"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full h-13 px-4 pr-12 bg-ryzo-surface-2 border border-ryzo-border rounded-xl text-[15px] text-white placeholder:text-ryzo-text-muted focus:border-ryzo-orange focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ryzo-text-secondary"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex justify-end">
              <button className="text-[12px] text-ryzo-text-secondary underline">
                Forgot Password?
              </button>
            </div>
          </div>

          {/* CTA button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            className="w-full h-13 rounded-xl text-[15px] font-bold text-white mt-4"
            style={{ backgroundColor: currentLoginApp.color }}
          >
            Login & Link Account
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
