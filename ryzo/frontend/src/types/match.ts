import type { OrderStop } from './order';

export interface ComparisonRow {
  metric: string;
  zomatoOnly: string;
  rapidoOnly: string;
  ryzoAI: string;
}

export interface AgentDecisionEntry {
  id: string;
  action: 'MATCH_APPROVED' | 'MATCH_BLOCKED';
  timestamp: string;
  overlapScore: number;
  detourPercent: number;
  capacity: string;
  reason: string;
}

export interface MatchData {
  matchId: string;
  overlapScore: number;
  detourPercent: number;
  combinedEarnings: number;
  individualEarnings: { zomato: number; rapido: number };
  distanceSaved: number;
  explanation: string;
  optimalSequence: string[];
  stops: OrderStop[];
  comparison: ComparisonRow[];
  agentDecisionLog: AgentDecisionEntry[];
}

export type MatchStatus = 'idle' | 'searching' | 'matched' | 'accepted' | 'fallback';
