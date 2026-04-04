import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

type VoiceCommandType = 'match' | 'navigation' | 'arrival' | 'fallback';

const VOICE_SCRIPTS: Record<VoiceCommandType, string> = {
  match:
    "New unified order matched. Pickup at McDonald's Arera Colony, then drop at B H E L Sector. Rapido ride pickup at M P Nagar, drop at Sarvadharm Colony. Combined route saves 1.2 kilometers. Extra earning: 42 rupees. Route is optimized.",
  navigation: 'Turn right on Hoshangabad Road in 200 meters.',
  arrival: 'You have arrived at the delivery location. Please complete the handover.',
  fallback: 'No match found within the time window. Proceeding with standard delivery.',
};

function getClient(): ElevenLabsClient | null {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === 'your_elevenlabs_api_key') {
    return null;
  }
  return new ElevenLabsClient({ apiKey });
}

export async function generateVoiceAudio(
  type: VoiceCommandType,
  customText?: string
): Promise<Buffer | null> {
  const client = getClient();
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  const text = customText || VOICE_SCRIPTS[type];

  if (!client || !voiceId || voiceId === 'your_voice_id') {
    console.log('ElevenLabs not configured — returning null (frontend will use fallback)');
    return null;
  }

  try {
    const audioStream = await client.textToSpeech.stream(voiceId, {
      text,
      modelId: 'eleven_multilingual_v2',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
      },
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('ElevenLabs API error:', message);
    return null;
  }
}

export function getVoiceScript(type: VoiceCommandType): string {
  return VOICE_SCRIPTS[type];
}

export type { VoiceCommandType };
