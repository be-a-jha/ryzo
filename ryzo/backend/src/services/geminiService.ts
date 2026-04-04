import { GoogleGenerativeAI } from '@google/generative-ai';

interface Coordinate {
  lat: number;
  lng: number;
}

interface RouteOverlapResult {
  overlapScore: number;
  optimalSequence: string[];
  distanceSaved: number;
  explanation: string;
}

interface MatchDataInput {
  platforms: string[];
  combinedEarnings: number;
  individualEarnings: { platform: string; amount: number }[];
  distanceSaved: number;
  timeSaved: string;
  overlapScore: number;
}

const MOCK_OVERLAP_RESULT: RouteOverlapResult = {
  overlapScore: 84,
  optimalSequence: ["McDonald's Pickup", 'BHEL Sector Drop', 'MP Nagar Pickup', 'Sarvadharm Drop'],
  distanceSaved: 1.2,
  explanation:
    'Both deliveries overlap 84% on Hoshangabad Road. Taking them together saves 1.2km and earns more.',
};

const MOCK_EXPLANATION =
  'Taking this unified order saves you 1.2km and earns ₹42 more than either order separately.';

function getGenAI(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function calculateRouteOverlap(
  routeA: Coordinate[],
  routeB: Coordinate[]
): Promise<RouteOverlapResult> {
  const genAI = getGenAI();

  if (!genAI) {
    console.log('Gemini API key not configured — using mock overlap data');
    return MOCK_OVERLAP_RESULT;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `You are a route optimization AI for a delivery platform. Analyze these two delivery routes and determine their overlap.

Route A (Food delivery): ${JSON.stringify(routeA)}
Route B (Ride): ${JSON.stringify(routeB)}

Respond ONLY with a JSON object (no markdown, no code blocks, no extra text):
{
  "overlapScore": <number 0-100, percentage of shared road segments>,
  "optimalSequence": <string array of stop names in optimal order>,
  "distanceSaved": <number in km, distance saved by combining>,
  "explanation": <string, one sentence natural language explanation>
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Strip potential markdown code blocks
    const cleaned = responseText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(cleaned) as RouteOverlapResult;

    // Validate response shape
    if (
      typeof parsed.overlapScore !== 'number' ||
      !Array.isArray(parsed.optimalSequence) ||
      typeof parsed.distanceSaved !== 'number' ||
      typeof parsed.explanation !== 'string'
    ) {
      console.warn('Gemini returned unexpected shape — falling back to mock data');
      return MOCK_OVERLAP_RESULT;
    }

    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini API error:', message);
    return MOCK_OVERLAP_RESULT;
  }
}

export async function generateMatchExplanation(matchData: MatchDataInput): Promise<string> {
  const genAI = getGenAI();

  if (!genAI) {
    console.log('Gemini API key not configured — using mock explanation');
    return MOCK_EXPLANATION;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `You are a delivery optimization AI. Generate a single concise sentence explaining why a rider should accept this unified order.

Match data:
- Platforms: ${matchData.platforms.join(', ')}
- Route overlap: ${matchData.overlapScore}%
- Combined earnings: ₹${matchData.combinedEarnings}
- Individual earnings: ${matchData.individualEarnings.map((e) => `${e.platform}: ₹${e.amount}`).join(', ')}
- Distance saved: ${matchData.distanceSaved}km
- Time saved: ${matchData.timeSaved}

Respond with ONLY the explanation sentence. No quotes, no extra text. Keep it under 25 words. Use ₹ for currency.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    if (!responseText || responseText.length > 200) {
      return MOCK_EXPLANATION;
    }

    return responseText;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Gemini explanation error:', message);
    return MOCK_EXPLANATION;
  }
}
