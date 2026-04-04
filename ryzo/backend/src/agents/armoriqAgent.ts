interface AgentRules {
  minOverlapPercent: number;
  maxDetourPercent: number;
  maxTasksPerRider: number;
  timeWindowMinutes: number;
}

interface EvaluateMatchInput {
  overlapScore: number;
  detourPercent: number;
  riderCurrentTasks: number;
  timeConstraintMet: boolean;
}

interface AgentDecisionLog {
  action: 'MATCH_APPROVED' | 'MATCH_BLOCKED';
  timestamp: Date;
  overlapScore: number;
  detourPercent: number;
  capacity: string;
  reason: string;
}

interface EvaluateMatchResult {
  decision: 'APPROVED' | 'BLOCKED';
  reason: string;
  logEntry: AgentDecisionLog;
}

const AGENT_RULES: AgentRules = {
  minOverlapPercent: 70,
  maxDetourPercent: 30,
  maxTasksPerRider: 2,
  timeWindowMinutes: 10,
};

async function callArmorIQAPI(input: EvaluateMatchInput): Promise<EvaluateMatchResult | null> {
  const apiKey = process.env.ARMORIQ_API_KEY;
  const agentId = process.env.ARMORIQ_AGENT_ID;

  if (!apiKey || apiKey === 'your_armoriq_key' || !agentId || agentId === 'your_agent_id') {
    return null;
  }

  try {
    const response = await fetch(`https://api.armoriq.ai/v1/agents/${agentId}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        rules: AGENT_RULES,
        input: {
          overlapScore: input.overlapScore,
          detourPercent: input.detourPercent,
          riderCurrentTasks: input.riderCurrentTasks,
          timeConstraintMet: input.timeConstraintMet,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`ArmorIQ API returned ${response.status} — using local rules engine`);
      return null;
    }

    const data = (await response.json()) as {
      decision: 'APPROVED' | 'BLOCKED';
      reason: string;
    };

    return {
      decision: data.decision,
      reason: data.reason,
      logEntry: {
        action: data.decision === 'APPROVED' ? 'MATCH_APPROVED' : 'MATCH_BLOCKED',
        timestamp: new Date(),
        overlapScore: input.overlapScore,
        detourPercent: input.detourPercent,
        capacity: `${input.riderCurrentTasks} of ${AGENT_RULES.maxTasksPerRider} slots`,
        reason: data.reason,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('ArmorIQ API error:', message);
    return null;
  }
}

function evaluateLocally(input: EvaluateMatchInput): EvaluateMatchResult {
  const reasons: string[] = [];
  let blocked = false;

  // Rule 1: Minimum overlap
  if (input.overlapScore < AGENT_RULES.minOverlapPercent) {
    reasons.push(`Overlap ${input.overlapScore}% below ${AGENT_RULES.minOverlapPercent}% threshold`);
    blocked = true;
  } else {
    reasons.push(`Overlap ${input.overlapScore}% exceeds ${AGENT_RULES.minOverlapPercent}% threshold`);
  }

  // Rule 2: Maximum detour
  if (input.detourPercent > AGENT_RULES.maxDetourPercent) {
    reasons.push(`Detour ${input.detourPercent}% exceeds ${AGENT_RULES.maxDetourPercent}% limit`);
    blocked = true;
  } else {
    reasons.push(`Detour ${input.detourPercent}% within ${AGENT_RULES.maxDetourPercent}% limit`);
  }

  // Rule 3: Rider capacity
  if (input.riderCurrentTasks >= AGENT_RULES.maxTasksPerRider) {
    reasons.push(`Rider at max capacity (${input.riderCurrentTasks}/${AGENT_RULES.maxTasksPerRider})`);
    blocked = true;
  } else {
    reasons.push('Rider has capacity');
  }

  // Rule 4: Time window
  if (!input.timeConstraintMet) {
    reasons.push('Time window expired');
    blocked = true;
  }

  const decision = blocked ? 'BLOCKED' : 'APPROVED';
  const reason = reasons.join('. ') + '.';

  return {
    decision,
    reason,
    logEntry: {
      action: decision === 'APPROVED' ? 'MATCH_APPROVED' : 'MATCH_BLOCKED',
      timestamp: new Date(),
      overlapScore: input.overlapScore,
      detourPercent: input.detourPercent,
      capacity: `${input.riderCurrentTasks} of ${AGENT_RULES.maxTasksPerRider} slots`,
      reason,
    },
  };
}

export async function evaluateMatch(input: EvaluateMatchInput): Promise<EvaluateMatchResult> {
  // Try ArmorIQ API first, fall back to local rules engine
  const apiResult = await callArmorIQAPI(input);

  if (apiResult) {
    console.log('ArmorIQ API decision:', apiResult.decision);
    return apiResult;
  }

  console.log('Using local ArmorIQ rules engine');
  return evaluateLocally(input);
}

export { AGENT_RULES };
export type { EvaluateMatchInput, EvaluateMatchResult, AgentDecisionLog };
