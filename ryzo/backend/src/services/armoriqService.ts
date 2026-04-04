import axios from 'axios';

const ARMORIQ_API_URL = 'https://api.armoriq.ai/v1';
const ARMORIQ_API_KEY = process.env.ARMORIQ_API_KEY || '';
const ARMORIQ_AGENT_ID = process.env.ARMORIQ_AGENT_ID || '';

interface MatchValidationRequest {
  order1Id: string;
  order2Id: string;
  riderId: string;
  overlapScore: number;
  combinedEarnings: number;
}

interface ArmorIQDecision {
  approved: boolean;
  reason: string;
  confidence: number;
  riskScore: number;
}

/**
 * Validate a match using ArmorIQ agent
 */
export async function armoriqValidateMatch(
  request: MatchValidationRequest
): Promise<ArmorIQDecision> {
  // If API key not configured, use rule-based fallback
  if (!ARMORIQ_API_KEY || !ARMORIQ_AGENT_ID) {
    console.warn('ArmorIQ not configured, using rule-based validation');
    return ruleBasedValidation(request);
  }

  try {
    const response = await axios.post(
      `${ARMORIQ_API_URL}/agents/${ARMORIQ_AGENT_ID}/validate`,
      {
        context: {
          order1Id: request.order1Id,
          order2Id: request.order2Id,
          riderId: request.riderId,
          overlapScore: request.overlapScore,
          combinedEarnings: request.combinedEarnings,
        },
        rules: [
          'overlap_score >= 50',
          'combined_earnings >= 50',
          'rider_rating >= 4.0',
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${ARMORIQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );

    return {
      approved: response.data.approved,
      reason: response.data.reason || 'ArmorIQ validation passed',
      confidence: response.data.confidence || 0.95,
      riskScore: response.data.riskScore || 0.05,
    };
  } catch (error) {
    console.error('ArmorIQ API error:', error);
    // Fallback to rule-based validation
    return ruleBasedValidation(request);
  }
}

/**
 * Rule-based validation fallback
 */
function ruleBasedValidation(request: MatchValidationRequest): ArmorIQDecision {
  const { overlapScore, combinedEarnings } = request;

  // Rule 1: Overlap must be >= 50%
  if (overlapScore < 50) {
    return {
      approved: false,
      reason: 'Insufficient route overlap (< 50%)',
      confidence: 0.95,
      riskScore: 0.8,
    };
  }

  // Rule 2: Combined earnings must be >= ₹50
  if (combinedEarnings < 50) {
    return {
      approved: false,
      reason: 'Combined earnings too low (< ₹50)',
      confidence: 0.95,
      riskScore: 0.6,
    };
  }

  // Rule 3: Overlap score bonus
  let confidence = 0.7;
  if (overlapScore >= 80) confidence = 0.95;
  else if (overlapScore >= 70) confidence = 0.85;
  else if (overlapScore >= 60) confidence = 0.75;

  return {
    approved: true,
    reason: `Match approved: ${overlapScore}% overlap, ₹${combinedEarnings} earnings`,
    confidence,
    riskScore: 1 - confidence,
  };
}

/**
 * Log agent decision for audit trail
 */
export async function logAgentDecision(
  matchId: string,
  decision: ArmorIQDecision
): Promise<void> {
  try {
    if (!ARMORIQ_API_KEY || !ARMORIQ_AGENT_ID) return;

    await axios.post(
      `${ARMORIQ_API_URL}/agents/${ARMORIQ_AGENT_ID}/logs`,
      {
        matchId,
        decision: decision.approved ? 'APPROVED' : 'REJECTED',
        reason: decision.reason,
        confidence: decision.confidence,
        riskScore: decision.riskScore,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Authorization': `Bearer ${ARMORIQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 3000,
      }
    );
  } catch (error) {
    console.error('Failed to log ArmorIQ decision:', error);
    // Non-critical, don't throw
  }
}
