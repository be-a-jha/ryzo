'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useRyzoStore } from '@/store/ryzoStore';
import { useRiderStore } from '@/store/riderStore';
import { MOCK_NAVIGATION_STOPS, VOICE_SCRIPTS } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useCallback, useState } from 'react';
import type { OrderStop } from '@/types/order';
import MapView from '@/components/shared/MapView';
import api from '@/lib/api';

// ── Voice engine — ElevenLabs via backend, SpeechSynthesis fallback ──

function useVoiceEngine() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [usingElevenLabs, setUsingElevenLabs] = useState(false);

  /** Try ElevenLabs backend first, fall back to browser SpeechSynthesis */
  const speak = useCallback(async (text: string, type: 'match' | 'navigation' | 'arrival' | 'fallback' = 'navigation') => {
    if (typeof window === 'undefined') return;

    // Cancel any current playback
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Try ElevenLabs via backend
    try {
      const response = await api.post('/api/voice/generate', { type, text }, {
        responseType: 'arraybuffer',
        timeout: 4000,
      });

      // Check if we got audio back (not JSON fallback)
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('audio')) {
        const blob = new Blob([response.data], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        setUsingElevenLabs(true);
        audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; };
        audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; };
        await audio.play();
        return;
      }
    } catch {
      // ElevenLabs unavailable — fall through to SpeechSynthesis
    }

    // Fallback: browser SpeechSynthesis
    setUsingElevenLabs(false);
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('google'),
    ) || voices.find((v) => v.lang.startsWith('en-'));
    if (preferred) utterance.voice = preferred;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  return { speak, stop, usingElevenLabs };
}

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

function VoiceBanner({ onToggleMute, muted }: { onToggleMute: () => void; muted: boolean }) {
  const voiceActive = useRiderStore((s) => s.voiceActive);
  const instruction = useRiderStore((s) => s.currentVoiceInstruction);

  return (
    <div className="bg-ryzo-surface-1 border border-ryzo-orange rounded-2xl p-4 flex items-center gap-3">
      <WaveformBars active={voiceActive && !muted} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-white">
          {muted ? '🔇 Voice Muted' : '🔊 Voice Navigation Active'}
        </p>
        <p className="text-[13px] text-ryzo-orange mt-0.5 truncate">
          {instruction || 'Preparing navigation...'}
        </p>
      </div>
      <motion.button whileTap={{ scale: 0.9 }} onClick={onToggleMute}>
        {muted ? (
          <VolumeX size={20} className="flex-shrink-0 text-ryzo-text-muted" />
        ) : (
          <Volume2 size={20} className="flex-shrink-0 text-ryzo-orange" />
        )}
      </motion.button>
    </div>
  );
}

// ── Map with Google Maps ──

function NavigationMap({ stops }: { stops: OrderStop[] }) {
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
                !isDone && !isCurrent && 'bg-ryzo-text-disabled border-ryzo-text-muted',
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
                !isDone && !isCurrent && 'text-ryzo-text-muted',
              )}
            >
              {stop.name}
            </p>
            <p
              className={cn(
                'text-[10px] text-center',
                isDone && 'text-ryzo-text-muted line-through',
                isCurrent && 'text-ryzo-text-secondary',
                !isDone && !isCurrent && 'text-ryzo-text-disabled',
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
  const navigateTo = useRyzoStore((s) => s.navigateTo);
  const navigationStops = useRiderStore((s) => s.navigationStops);
  const advanceStop = useRiderStore((s) => s.advanceStop);
  const setNavigationStops = useRiderStore((s) => s.setNavigationStops);
  const setVoiceActive = useRiderStore((s) => s.setVoiceActive);
  const setVoiceInstruction = useRiderStore((s) => s.setVoiceInstruction);
  const currentStopIndex = useRiderStore((s) => s.currentStopIndex);

  const { speak, stop: stopSpeech } = useVoiceEngine();
  const mutedRef = useRef(false);
  const hasMountedRef = useRef(false);

  const stops = navigationStops.length > 0 ? navigationStops : MOCK_NAVIGATION_STOPS;
  const currentStop = stops.find((s) => s.status === 'current');
  const allDone = stops.every((s) => s.status === 'done');

  // Initialize stops + play first voice instruction on mount
  useEffect(() => {
    if (navigationStops.length === 0) {
      setNavigationStops(MOCK_NAVIGATION_STOPS);
    }
    setVoiceActive(true);

    // Small delay so voices list is loaded
    const timer = setTimeout(() => {
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        const firstScript = VOICE_SCRIPTS.turnByTurn[0];
        setVoiceInstruction(firstScript);
        if (!mutedRef.current) {
          speak(firstScript);
        }
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      stopSpeech();
      setVoiceActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When stop index changes, speak the next turn-by-turn instruction
  useEffect(() => {
    if (!hasMountedRef.current) return;

    const script = VOICE_SCRIPTS.turnByTurn[currentStopIndex];
    if (script) {
      setVoiceInstruction(script);
      if (!mutedRef.current) {
        speak(script);
      }
    }
  }, [currentStopIndex, setVoiceInstruction, speak]);

  // When all done, speak completion
  useEffect(() => {
    if (allDone && hasMountedRef.current) {
      const doneScript = 'All deliveries complete. Great job! You earned 94 rupees combined.';
      setVoiceInstruction(doneScript);
      if (!mutedRef.current) {
        speak(doneScript);
      }
      setVoiceActive(false);
    }
  }, [allDone, setVoiceInstruction, setVoiceActive, speak]);

  const handleMarkDelivered = () => {
    // Check if this is the last stop
    const isLastStop = currentStopIndex >= stops.length - 1;
    
    // Speak arrival script before advancing
    const arrivalScript = VOICE_SCRIPTS.stopArrival[currentStopIndex];
    if (arrivalScript && !mutedRef.current) {
      speak(arrivalScript);
    }

    // Advance after a tiny delay so arrival audio starts
    setTimeout(() => {
      advanceStop();
      
      // If this was the last stop, navigate to completion screen
      if (isLastStop) {
        setTimeout(() => {
          navigateTo(11); // Screen 11 = DeliveryComplete
        }, 1000);
      }
    }, 300);
  };

  const handleToggleMute = () => {
    mutedRef.current = !mutedRef.current;
    if (mutedRef.current) {
      stopSpeech();
      setVoiceActive(false);
    } else {
      setVoiceActive(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-ryzo-black">
      {/* Voice banner */}
      <div className="px-4 pt-3">
        <VoiceBanner onToggleMute={handleToggleMute} muted={mutedRef.current} />
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
