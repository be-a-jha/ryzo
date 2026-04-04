import { create } from 'zustand';
import type { MatchData, MatchStatus, AgentDecisionEntry } from '@/types/match';
import { MOCK_MATCH_DATA, MOCK_AGENT_LOG, MOCK_UNIFIED_PING } from '@/lib/mockData';
import { useRiderStore } from '@/store/riderStore';
import { useRyzoStore } from '@/store/ryzoStore';
import api from '@/lib/api';

interface MatchingState {
  /** Current matching status */
  matchStatus: MatchStatus;
  /** Full match data once a match is found */
  matchData: MatchData | null;
  /** Agent decision log (last 3 entries) */
  agentLog: AgentDecisionEntry[];
  /** Whether the Zomato flexible trigger has been pressed */
  zomatoFlexibleTriggered: boolean;
  /** Whether the Rapido flexible trigger has been pressed */
  rapidoFlexibleTriggered: boolean;
  /** Notification message for Zomato phone */
  zomatoNotification: string | null;
  /** Notification message for Rapido phone */
  rapidoNotification: string | null;

  /** Trigger the matching engine */
  triggerMatch: (source: 'zomato' | 'rapido') => void;
  /** Set match data from backend response */
  setMatchData: (data: MatchData) => void;
  /** Update match status */
  setMatchStatus: (status: MatchStatus) => void;
  /** Add an agent decision log entry */
  addAgentLogEntry: (entry: AgentDecisionEntry) => void;
  /** Set the full agent log */
  setAgentLog: (log: AgentDecisionEntry[]) => void;
  /** Dismiss a notification */
  dismissNotification: (phone: 'zomato' | 'rapido') => void;
  /** Reset matching state */
  reset: () => void;
}

const initialState = {
  matchStatus: 'idle' as MatchStatus,
  matchData: null as MatchData | null,
  agentLog: [] as AgentDecisionEntry[],
  zomatoFlexibleTriggered: false,
  rapidoFlexibleTriggered: false,
  zomatoNotification: null as string | null,
  rapidoNotification: null as string | null,
};

export const useMatchingStore = create<MatchingState>((set, get) => ({
  ...initialState,

  triggerMatch: (source) => {
    set({
      matchStatus: 'searching',
      ...(source === 'zomato'
        ? { zomatoFlexibleTriggered: true }
        : { rapidoFlexibleTriggered: true }),
    });

    // Call backend API to trigger matching
    // Backend will: Gemini calculates overlap → ArmorIQ approves → SpacetimeDB pushes
    const triggerBackend = async () => {
      try {
        // Mock data for demo - in production these would come from actual orders
        const payload = {
          riderId: '507f1f77bcf86cd799439011', // Mock rider ID
          orderIds: ['507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013'],
          platforms: source === 'zomato' ? ['swiggy', 'rapido'] : ['rapido', 'swiggy'],
        };

        const response = await api.post('/api/matching/trigger', payload);
        
        if (response.data.match) {
          // Match found - update state
          const match = response.data.match;

          const matchData: MatchData = {
            matchId: match._id,
            overlapScore: match.overlapScore,
            detourPercent: match.detourPercentage,
            combinedEarnings: match.combinedEarnings,
            individualEarnings: {
              swiggy: match.individualEarnings.find(
                (e: { platform: string; amount: number }) => e.platform === 'swiggy',
              )?.amount || 78,
              rapido: match.individualEarnings.find(
                (e: { platform: string; amount: number }) => e.platform === 'rapido',
              )?.amount || 64,
            },
            distanceSaved: match.distanceSaved || 0,
            explanation: match.explanation,
            optimalSequence: match.optimalSequence || [],
            stops: MOCK_MATCH_DATA.stops,
            comparison: MOCK_MATCH_DATA.comparison,
            agentDecisionLog: match.agentDecisionLog || MOCK_AGENT_LOG,
          };

          set({
            matchStatus: 'matched',
            matchData,
            agentLog: match.agentDecisionLog || MOCK_AGENT_LOG,
            zomatoNotification: 'Rider found! Your flexible delivery is matched ✓',
            rapidoNotification: 'Ride matched! Flexible ride confirmed ✓',
          });

          // THE DEMO MOMENT: inject unified ping into rider dashboard
          useRiderStore.getState().addPing(MOCK_UNIFIED_PING);

          // Ensure RYZO center phone is on rider dashboard
          const ryzoScreen = useRyzoStore.getState().currentScreen;
          if (ryzoScreen < 8) {
            useRyzoStore.getState().navigateTo(8);
          }

          // Auto-dismiss notifications after 3 seconds
          setTimeout(() => {
            set({ zomatoNotification: null });
          }, 3000);
          setTimeout(() => {
            set({ rapidoNotification: null });
          }, 3000);
        } else {
          // No match found or blocked by agent
          set({
            matchStatus: 'fallback',
            zomatoNotification: 'No match found. Standard delivery.',
            rapidoNotification: 'No match found. Standard ride.',
          });

          setTimeout(() => {
            set({ zomatoNotification: null, rapidoNotification: null });
          }, 3000);
        }
      } catch (error) {
        console.error('Match trigger failed:', error);
        
        // Fallback to mock data for demo if backend is not running
        setTimeout(() => {
          const state = get();
          if (state.matchStatus !== 'searching') return;

          // THE DEMO MOMENT: All three phones update simultaneously
          set({
            matchStatus: 'matched',
            matchData: MOCK_MATCH_DATA,
            agentLog: MOCK_AGENT_LOG,
            zomatoNotification: 'Rider found! Your flexible delivery is matched ✓',
            rapidoNotification: 'Ride matched! Flexible ride confirmed ✓',
          });

          // Inject unified ping into rider dashboard
          useRiderStore.getState().addPing(MOCK_UNIFIED_PING);

          // Ensure RYZO center phone is on rider dashboard
          const ryzoScreen = useRyzoStore.getState().currentScreen;
          if (ryzoScreen < 8) {
            useRyzoStore.getState().navigateTo(8);
          }

          // Auto-dismiss notifications after 3 seconds
          setTimeout(() => {
            set({ zomatoNotification: null });
          }, 3000);
          setTimeout(() => {
            set({ rapidoNotification: null });
          }, 3000);
        }, 1500);
      }
    };

    triggerBackend();
  },

  setMatchData: (data) => set({ matchData: data, matchStatus: 'matched' }),

  setMatchStatus: (status) => set({ matchStatus: status }),

  addAgentLogEntry: (entry) => {
    const { agentLog } = get();
    const updated = [entry, ...agentLog].slice(0, 3);
    set({ agentLog: updated });
  },

  setAgentLog: (log) => set({ agentLog: log.slice(0, 3) }),

  dismissNotification: (phone) => {
    if (phone === 'zomato') {
      set({ zomatoNotification: null });
    } else {
      set({ rapidoNotification: null });
    }
  },

  reset: () => set(initialState),
}));
