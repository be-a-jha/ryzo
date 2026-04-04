'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useRiderStore } from '@/store/riderStore';
import { MOCK_NAVIGATION_STOPS } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import type { OrderStop } from '@/types/order';
import MapView from '@/components/shared/MapView';
import api from '@/lib/api';

// ── Waveform bars ──

function WaveformBars({ active }: { active: boolean }) {
  const delays = [0, 100, 200, 100, 50];
  const heights = active ? [16, 32, 24, 40, 16] : [8, 8, 8, 8, 8];

  return (
    <div className="flex items-end gap-[3px] h-10">
      {delays.map((delay, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-ryzo-orange"
          animate={{ height: heights[i] }}
          transition={
            active
              ? {
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: delay / 1000,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

// ── Voice Banner ──

function VoiceBanner() {
  const voiceActive = useRiderStore((s) => s.voiceActive);
  const instruction = useRiderStore((s) => s.currentVoiceInstruction);

  return (
    <div
      className="bg-ryzo-surface-1 border border-ryzo-orange rounded-2xl p-4 flex items-center gap-3"
    >
      <WaveformBars active={voiceActive} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-white">🔊 Voice Navigation Active</p>
        <p className="text-[13px] text-ryzo-orange mt-0.5 truncate">
          {instruction || 'Turn right on Hoshangabad Road in 200m'}
        </p>
      </div>
      <Volume2 size={20} className="flex-shrink-0 text-ryzo-orange" />
      <span className="absolute bottom-1 right-3 text-[9px] text-ryzo-text-muted">ElevenLabs</span>
    </div>
  );
}

// ── Map with Google Maps ──

function NavigationMap({ stops }: { stops: OrderStop[] }) {
  // Mock rider position - in real app this would come from GPS
  const riderPosition = { lat: 23.2400, lng: 77.4300 };

  return (
    <div className="w-full h-[200px] bg-ryzo-surface-2 border-b border-ryzo-border relative">
      <MapView 
        variant="navigation" 
        riderPosition={riderPosition}
        stops={stops}
      />
    </div>
  );
}

// ── Stop progress stepper ──

function StopsStepper({ stops }: { stops: OrderStop[] }) {
  const stopLabels: Record<string, string> = {
    "McDonald's": 'Pickup Food',
    'BHEL Sector': 'Drop Food',
    'MP Nagar': 'Pickup Rider',
    'Sarvadharm': 'Drop Rider',
  };

  return (
    <div className="flex items-start justify-between px-2 relative">
      {/* Connecting line */}
      <div className="absolute top-3 left-[10%] right-[10%] h-px bg-ryzo-text-disabled" />

      {stops.map((stop, i) => {
        const isDone = stop.status === 'done';
        const isCurrent = stop.status === 'current';
        return (
          <div key={i} className="flex flex-col items-center z-10 w-[70px]">
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center border-2',
                isDone && 'bg-ryzo-success border-ryzo-success',
                isCurrent && 'bg-ryzo-orange border-ryzo-orange',
                !isDone && !isCurrent && 'bg-ryzo-text-disabled border-ryzo-text-muted'
              )}
            >
              {isDone ? (
                <span className="text-[10px] text-white">✓</span>
              ) : (
                <span className={cn('text-[10px] font-bold', isCurrent ? 'text-black' : 'text-ryzo-text-muted')}>
                  {i + 1}
                </span>
              )}
            </div>
            <p
              className={cn(
                'text-[11px] mt-1.5 text-center leading-tight',
                isDone && 'text-ryzo-text-muted line-through',
                isCurrent && 'text-white font-bold',
                !isDone && !isCurrent && 'text-ryzo-text-muted'
              )}
            >
              {stop.name}
            </p>
            <p
              className={cn(
                'text-[10px] text-center',
                isDone && 'text-ryzo-text-muted line-through',
                isCurrent && 'text-ryzo-text-secondary',
                !isDone && !isCurrent && 'text-ryzo-text-disabled'
              )}
            >
              {stopLabels[stop.name] || stop.type}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ──

export default function ActiveNavigation() {
  const navigationStops = useRiderStore((s) => s.navigationStops);
  const advanceStop = useRiderStore((s) => s.advanceStop);
  const setNavigationStops = useRiderStore((s) => s.setNavigationStops);
  const setVoiceActive = useRiderStore((s) => s.setVoiceActive);
  const setVoiceInstruction = useRiderStore((s) => s.setVoiceInstruction);

  const stops = navigationStops.length > 0 ? navigationStops : MOCK_NAVIGATION_STOPS;
  const currentStop = stops.find((s) => s.status === 'current');
  const currentIndex = stops.findIndex((s) => s.status === 'current');

  useEffect(() => {
    if (navigationStops.length === 0) {
      setNavigationStops(MOCK_NAVIGATION_STOPS);
    }
    setVoiceActive(true);
    
    // Call backend to generate voice navigation
    const playVoiceNavigation = async () => {
      try {
        const response = await api.post('/api/voice/generate', {
          type: 'navigation',
        });
        
        if (response.headers['content-type']?.includes('audio/mpeg')) {
          // Audio returned - play it
          const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play().catch(err => console.error('Audio playback failed:', err));
          
          // Get script from header
          const script = decodeURIComponent(response.headers['x-voice-script'] || '');
          setVoiceInstruction(script || 'Turn right on Hoshangabad Road in 200m');
        } else if (response.data.script) {
          // Fallback: text script returned
          setVoiceInstruction(response.data.script);
        }
      } catch (error) {
        console.error('Voice generation failed:', error);
        // Fallback to default instruction
        setVoiceInstruction('Turn right on Hoshangabad Road in 200m');
      }
    };
    
    playVoiceNavigation();
  }, [navigationStops.length, setNavigationStops, setVoiceActive, setVoiceInstruction]);

  const allDone = stops.every((s) => s.status === 'done');

  const handleMarkDelivered = () => {
    advanceStop();
  };

  return (
    <div className="flex flex-col h-full bg-ryzo-black">
      {/* Voice banner */}
      <div className="px-4 pt-3 relative">
        <VoiceBanner />
      </div>

      {/* Map */}
      <div className="mt-3">
        <NavigationMap stops={stops} />
      </div>

      {/* Stops stepper */}
      <div className="px-4 mt-4">
        <StopsStepper stops={stops} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom sheet */}
      <div
        className="bg-ryzo-surface-1 rounded-t-3xl p-5 flex-shrink-0"
        style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.5)' }}
      >
        <AnimatePresence mode="wait">
          {allDone ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-2"
            >
              <p className="text-[20px] font-bold text-ryzo-success">All Stops Complete!</p>
              <p className="text-[13px] text-ryzo-text-secondary mt-1">
                Unified order delivered. You earned ₹94 combined.
              </p>
              <div className="flex gap-3 mt-3 justify-center">
                <span className="px-3 py-1 rounded-full bg-ryzo-success-dim border border-ryzo-success text-ryzo-success text-[12px]">
                  +₹42 extra vs separate
                </span>
                <span className="px-3 py-1 rounded-full bg-ryzo-surface-2 border border-ryzo-border text-ryzo-text-secondary text-[12px]">
                  1.2 km saved
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="in-progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-ryzo-text-secondary">Next Stop</span>
                <span className="text-[12px] text-ryzo-orange tabular-nums">0.8 km away</span>
              </div>
              <p className="text-[18px] font-bold text-white">
                {currentStop?.name || 'BHEL Sector'} — {currentStop?.type === 'drop' ? 'Drop' : 'Pickup'}
              </p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-ryzo-surface-2 border border-ryzo-border text-[12px] text-white tabular-nums">
                ~6 min
              </span>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleMarkDelivered}
                className="w-full h-13 rounded-xl bg-white text-black text-[15px] font-bold mt-4"
              >
                Mark as Delivered
              </motion.button>

              <p className="text-[13px] text-ryzo-text-secondary underline text-center mt-3 cursor-pointer">
                Report an issue
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
