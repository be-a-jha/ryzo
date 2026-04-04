import { Request, Response } from 'express';
import { generateVoiceAudio, getVoiceScript, type VoiceCommandType } from '../services/elevenLabsService';

const VALID_TYPES: VoiceCommandType[] = ['match', 'navigation', 'arrival', 'fallback'];

export const generateVoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, type } = req.body as { text?: string; type?: string };

    if (!type || !VALID_TYPES.includes(type as VoiceCommandType)) {
      res.status(400).json({
        error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}`,
      });
      return;
    }

    const voiceType = type as VoiceCommandType;
    const script = text || getVoiceScript(voiceType);

    // Try ElevenLabs API
    const audioBuffer = await generateVoiceAudio(voiceType, text);

    if (audioBuffer) {
      // Return audio stream
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'no-cache',
        'X-Voice-Script': encodeURIComponent(script),
      });
      res.send(audioBuffer);
    } else {
      // Fallback: return script text (ElevenLabs not configured)
      res.status(200).json({
        script,
        type: voiceType,
        audioUrl: null,
        message: 'ElevenLabs not configured — returning script text for frontend TTS fallback',
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Failed to generate voice', details: message });
  }
};
