'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Bike, ArrowRight } from 'lucide-react';
import { useRyzoStore } from '@/store/ryzoStore';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  delay: number;
}

function RoleCard({ icon, title, subtitle, onClick, delay }: RoleCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="w-full bg-ryzo-surface-1 border border-ryzo-border rounded-2xl p-6 flex items-center gap-4 text-left transition-colors hover:border-ryzo-text-disabled"
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[20px] font-bold text-white">{title}</h3>
        <p className="text-[13px] text-ryzo-text-secondary mt-0.5 leading-[1.4]">
          {subtitle}
        </p>
      </div>
      <ArrowRight size={20} className="flex-shrink-0 text-ryzo-orange" />
    </motion.button>
  );
}

export default function RoleSelection() {
  const navigateTo = useRyzoStore((s) => s.navigateTo);
  const setRole = useRyzoStore((s) => s.setRole);

  const handleSelectRole = (role: 'user' | 'rider', screen: 4 | 7) => {
    setRole(role);
    navigateTo(screen);
  };

  return (
    <div className="flex flex-col h-full bg-ryzo-black px-5">
      {/* Greeting */}
      <div className="pt-10 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[24px] font-bold text-white"
        >
          Hello, Aryan 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-[15px] text-ryzo-text-secondary mt-1"
        >
          How will you use RYZO today?
        </motion.p>
      </div>

      {/* Role Cards */}
      <div className="flex flex-col gap-4">
        <RoleCard
          icon={<ShoppingBag size={32} className="text-white" />}
          title="I'm a User"
          subtitle="Order food and rides across all your apps in one place"
          onClick={() => handleSelectRole('user', 4)}
          delay={0.15}
        />
        <RoleCard
          icon={<Bike size={32} className="text-white" />}
          title="I'm a Rider"
          subtitle="Get unified orders from all platforms and maximize your earnings"
          onClick={() => handleSelectRole('rider', 7)}
          delay={0.25}
        />
      </div>

      {/* Footer */}
      <div className="mt-auto pb-6">
        <p className="text-[12px] text-ryzo-text-muted text-center">
          You can switch roles anytime from settings
        </p>
      </div>
    </div>
  );
}
