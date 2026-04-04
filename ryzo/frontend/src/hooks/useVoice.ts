'use client';

import { useState, useCallback, useRef } from 'react';

type VoiceCommandType = 'match' | 'navigation' | 'arrival' | 'fallback';

const FALLBACK_SCRIPTS: Record<VoiceCommandType, string> = {
  match:
    "New unified order matched. Pickup at McDonald's Arera Colony, then drop at BHEL Sector. Combined route saves 1.2 kilometers.",
  navigation: 'Turn right on Hoshangabad Road in 200 meters.',
  arrival: 'You have arrived at the delivery location.',
  fallback: 'No match found. Proceeding with standard delivery.',
};

export function useVoice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScript, setCurrentScript] = useState('');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    setIsPlaying(false);
  }, []);

  const playVoice = useCallback(
    (type: VoiceCommandType, customText?: string) => {
      try {
        // Stop any current playback
        stop();

        const text = customText || FALLBACK_SCRIPTS[type];
        setIsPlaying(true);
        setCurrentScript(text);

        // Use browser SpeechSynthesis — works everywhere, zero network dependency
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;

          // Pick a good English voice if available
          const voices = window.speechSynthesis.getVoices();
          const preferred =
            voices.find(
              (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('google'),
            ) || voices.find((v) => v.lang.startsWith('en-'));
          if (preferred) {
            utterance.voice = preferred;
          }

          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } else {
          // No TTS at all — simulate playback duration for demo
          setTimeout(() => setIsPlaying(false), 3000);
        }
      } catch (error) {
        console.error('Voice playback error:', error);
        setIsPlaying(false);
      }
    },
    [stop],
  );

  return { playVoice, isPlaying, currentScript, stop };
}
