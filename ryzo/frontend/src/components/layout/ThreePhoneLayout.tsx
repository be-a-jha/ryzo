'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PhoneFrame from './PhoneFrame';

interface ThreePhoneLayoutProps {
  leftPhone: React.ReactNode;
  centerPhone: React.ReactNode;
  rightPhone: React.ReactNode;
}

type PhoneTab = 'zomato' | 'ryzo' | 'rapido';

/** Staggered entrance animation for phones */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const phoneVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export default function ThreePhoneLayout({
  leftPhone,
  centerPhone,
  rightPhone,
}: ThreePhoneLayoutProps) {
  const [activeTab, setActiveTab] = useState<PhoneTab>('ryzo');

  return (
    <div className="min-h-screen w-full bg-ryzo-black flex flex-col items-center justify-center px-4 py-8">
      {/* RYZO branding header */}
      <div className="mb-8 text-center">
        <h1 className="text-[28px] font-bold text-white tracking-[8px]">
          RY
          <span className="relative">
            Z
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-ryzo-orange"
              style={{ bottom: '2px' }}
            />
          </span>
          O
        </h1>
        <p className="text-[13px] text-ryzo-text-secondary mt-1">
          One Rider. Every Platform.
        </p>
      </div>

      {/* Tablet/Mobile tab switcher — visible only on md and below */}
      <div className="flex lg:hidden mb-6 bg-ryzo-surface-1 rounded-xl p-1 border border-ryzo-border">
        {(['zomato', 'ryzo', 'rapido'] as PhoneTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 tap-scale ${
              activeTab === tab
                ? 'bg-ryzo-surface-2 text-white'
                : 'text-ryzo-text-muted hover:text-ryzo-text-secondary'
            }`}
          >
            {tab === 'ryzo' ? 'RYZO' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Desktop layout — three phones side by side */}
      <motion.div
        className="hidden lg:flex items-start justify-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={phoneVariants}>
          <PhoneFrame label="Zomato" variant="light">
            {leftPhone}
          </PhoneFrame>
        </motion.div>

        <motion.div variants={phoneVariants}>
          <PhoneFrame label="RYZO" variant="dark">
            {centerPhone}
          </PhoneFrame>
        </motion.div>

        <motion.div variants={phoneVariants}>
          <PhoneFrame label="Rapido" variant="dark">
            {rightPhone}
          </PhoneFrame>
        </motion.div>
      </motion.div>

      {/* Tablet/Mobile layout — single phone with tab switching */}
      <div className="flex lg:hidden items-start justify-center">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {activeTab === 'zomato' && (
            <PhoneFrame label="Zomato" variant="light">
              {leftPhone}
            </PhoneFrame>
          )}
          {activeTab === 'ryzo' && (
            <PhoneFrame label="RYZO" variant="dark">
              {centerPhone}
            </PhoneFrame>
          )}
          {activeTab === 'rapido' && (
            <PhoneFrame label="Rapido" variant="dark">
              {rightPhone}
            </PhoneFrame>
          )}
        </motion.div>
      </div>

      {/* Tech stack footer */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 flex items-center gap-3 flex-wrap justify-center"
      >
        {[
          { label: 'SpacetimeDB', color: '#FC8019' },
          { label: 'Gemini AI', color: '#4285F4' },
          { label: 'ArmorIQ', color: '#22C55E' },
          { label: 'ElevenLabs', color: '#9B59B6' },
          { label: 'Next.js 16', color: '#FFFFFF' },
        ].map((tech) => (
          <span
            key={tech.label}
            className="px-2.5 py-1 rounded-full text-[10px] font-medium border"
            style={{
              color: tech.color,
              borderColor: tech.color + '40',
              backgroundColor: tech.color + '0D',
            }}
          >
            {tech.label}
          </span>
        ))}
      </motion.div> */}
    </div>
  );
}
