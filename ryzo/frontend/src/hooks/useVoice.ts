'use client';

import { useState, useCallback, useRef } from 'react';
import api from '@/lib/api';

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
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        // Already stopped
      }
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playVoice = useCallback(
    async (type: VoiceCommandType, customText?: string) => {
      try {
        // Stop any currently playing audio
        stop();
        setIsPlaying(true);
        setCurrentScript(customText || FALLBACK_SCRIPTS[type]);

        // Try to get audio from backend (ElevenLabs)
        try {
          const response = await api.post(
            '/api/voice/generate',
            { type, text: customText },
            { responseType: 'arraybuffer', timeout: 5000 }
          );

          // Check if we got audio (Content-Type: audio/mpeg) or JSON fallback
          const contentType = response.headers['content-type'] || '';
          if (contentType.includes('audio')) {
            // Play audio via Web Audio API
            if (!audioContextRef.current) {
              audioContextRef.current = new AudioContext();
            }
            const audioContext = audioContextRef.current;
            const audioBuffer = await audioContext.decodeAudioData(response.data as ArrayBuffer);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.onended = () => {
              setIsPlaying(false);
              sourceRef.current = null;
            };
            sourceRef.current = source;
            source.start(0);
            return;
          }
        } catch {
          // Backend not available — use browser TTS fallback
        }

        // Fallback: use browser's built-in SpeechSynthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(
            customText || FALLBACK_SCRIPTS[type]
          );
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.onend = () => setIsPlaying(false);
          utterance.onerror = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
        } else {
          // No TTS available — just simulate playback for demo
          setTimeout(() => setIsPlaying(false), 3000);
        }
      } catch (error) {
        console.error('Voice playback error:', error);
        setIsPlaying(false);
      }
    },
    [stop]
  );

  return { playVoice, isPlaying, currentScript, stop };
}
