'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useRyzoStore } from '@/store/ryzoStore';
import { USER_PLATFORM_APPS } from '@/lib/mockData';
import type { PlatformApp } from '@/types/platform';
import { cn } from '@/lib/utils';

function AppLogo({ app }: { app: PlatformApp }) {
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[18px] font-bold relative"
      style={{ backgroundColor: app.color }}
    >
      {app.name.charAt(0)}
      {app.integrated && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-ryzo-orange border-2 border-ryzo-surface-1" />
      )}
    </div>
  );
}

function AppCard({ app, onAdd }: { app: PlatformApp & { integrated: boolean }; onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-ryzo-surface-1 border rounded-2xl p-4 flex items-center gap-3',
        app.integrated
          ? 'border-ryzo-success'
          : 'border-ryzo-border'
      )}
      style={app.integrated ? { boxShadow: '0 0 12px rgba(34,197,94,0.15)' } : undefined}
    >
      <AppLogo app={app} />
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-bold text-white">{app.name}</p>
        <p className="text-[12px] text-ryzo-text-secondary">{app.category}</p>
      </div>
      {app.integrated ? (
        <div className="flex items-center gap-1.5">
          <Check size={14} className="text-ryzo-success" />
          <span className="text-[13px] font-medium text-ryzo-success">Integrated</span>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-ryzo-surface-2 border border-ryzo-orange text-ryzo-orange text-[13px] font-medium"
        >
          Add
        </motion.button>
      )}
    </motion.div>
  );
}

export default function UserIntegration() {
  const goBack = useRyzoStore((s) => s.goBack);
  const integratedApps = useRyzoStore((s) => s.integratedApps);
  const openLoginModal = useRyzoStore((s) => s.openLoginModal);
  const hasIntegrated = integratedApps.length > 0;

  const apps = USER_PLATFORM_APPS.map((app) => ({
    ...app,
    integrated: integratedApps.includes(app.id),
  }));

  const handleAdd = (app: PlatformApp) => {
    openLoginModal(app);
  };

  return (
    <div className="flex flex-col h-full bg-ryzo-black">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <motion.button whileTap={{ scale: 0.9 }} onClick={goBack}>
          <ArrowLeft size={20} className="text-white" />
        </motion.button>
        <h2 className="text-[18px] font-bold text-white">Connect Your Apps</h2>
      </div>

      {/* Subtext */}
      <p className="text-[13px] text-ryzo-text-secondary px-4 mb-4 leading-[1.5]">
        Connect your delivery accounts. We add a smarter layer on top.
      </p>

      {/* Section label */}
      <p className="text-[11px] font-medium uppercase tracking-[2px] text-ryzo-text-muted px-4 mb-3">
        DETECTED ON YOUR DEVICE
      </p>

      {/* App list */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-hide">
        <div className="flex flex-col gap-3">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.25 }}
            >
              <AppCard app={app} onAdd={() => handleAdd(app)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ryzo-black via-ryzo-black to-transparent">
        <motion.button
          whileTap={hasIntegrated ? { scale: 0.97 } : undefined}
          disabled={!hasIntegrated}
          className={cn(
            'w-full h-13 rounded-xl text-[15px] font-medium transition-colors',
            hasIntegrated
              ? 'bg-white text-black'
              : 'bg-ryzo-surface-2 text-ryzo-text-muted cursor-not-allowed'
          )}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
