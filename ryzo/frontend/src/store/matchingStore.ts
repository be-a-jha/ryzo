import { create } from 'zustand';
import type { MatchData, MatchStatus, AgentDecisionEntry } from '@/types/match';
import { MOCK_MATCH_DATA, MOCK_AGENT_LOG, MOCK_UNIFIED_PING } from '@/lib/mockData';
import { useRiderStore } from '@/store/riderStore';
import { useRyzoStore } from '@/store/ryzoStore';
import { pushOrderToSpacetime, pushMatchToSpacetime, generateOrderId, generateMatchId } from '@/services/spacetimeService';

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
  /** Whether Zomato order is completed */
  zomatoCompleted: boolean;
  /** Whether Rapido order is completed */
  rapidoCompleted: boolean;
  /** Whether the rider popup is showing */
  riderPopupVisible: boolean;
  /** Match is ready but rider hasn't reached Screen 8 yet — queued */
  pendingRiderAlert: boolean;

  /** Mark a platform as flexible-ordered (does NOT trigger match alone) */
  triggerMatch: (source: 'zomato' | 'rapido') => void;
  /** Called by RiderDashboard on mount — activates any queued popup + plays sound */
  showRiderPopup: () => void;
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
  /** Mark order as completed */
  completeOrder: (phone: 'zomato' | 'rapido') => void;
  /** Accept the match from rider popup */
  acceptMatch: () => void;
  /** Decline the match from rider popup */
  declineMatch: () => void;
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
  zomatoCompleted: false,
  rapidoCompleted: false,
  riderPopupVisible: false,
  pendingRiderAlert: false,
};

/** Play a short notification beep using Web Audio API */
function playNotificationSound(): void {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Two-tone notification: ascending beep
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587, ctx.currentTime); // D5
    oscillator.frequency.setValueAtTime(784, ctx.currentTime + 0.12); // G5
    oscillator.frequency.setValueAtTime(988, ctx.currentTime + 0.24); // B5

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);

    // Clean up
    oscillator.onended = () => {
      ctx.close();
    };
  } catch {
    // Audio not available — silent fail
  }
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  ...initialState,

  triggerMatch: async (source) => {
    const state = get();

    if (source === 'zomato') {
      // Already triggered? Ignore
      if (state.zomatoFlexibleTriggered) return;

      const orderId = generateOrderId('zomato');

      // Push to SpacetimeDB for cross-device sync
      await pushOrderToSpacetime({
        orderId,
        platform: 'zomato',
        type: 'food',
        status: 'pending',
        pickup: { lat: 23.2599, lng: 77.4126, address: "McDonald's, Arera Colony" },
        drop: { lat: 23.2156, lng: 77.4395, address: 'BHEL Sector' },
        fare: 78,
        timestamp: Date.now(),
      });

      set({
        zomatoFlexibleTriggered: true,
        zomatoNotification: 'Flexible order placed! Waiting for ride match...',
      });

      // Auto-dismiss after 4s
      setTimeout(() => {
        set({ zomatoNotification: null });
      }, 4000);

      // IMPORTANT: Don't check local state - SpacetimeDB will trigger match
      console.log('[MatchingStore] Zomato order pushed to SpacetimeDB');
    } else {
      // rapido
      if (state.rapidoFlexibleTriggered) return;

      const orderId = generateOrderId('rapido');

      // Push to SpacetimeDB for cross-device sync
      await pushOrderToSpacetime({
        orderId,
        platform: 'rapido',
        type: 'ride',
        status: 'pending',
        pickup: { lat: 23.2400, lng: 77.4500, address: 'MP Nagar' },
        drop: { lat: 23.2100, lng: 77.4200, address: 'Sarvadharm' },
        fare: 92,
        timestamp: Date.now(),
      });

      set({
        rapidoFlexibleTriggered: true,
        rapidoNotification: 'Flexible ride booked! Waiting for delivery match...',
      });

      setTimeout(() => {
        set({ rapidoNotification: null });
      }, 4000);

      // IMPORTANT: Don't check local state - SpacetimeDB will trigger match
      console.log('[MatchingStore] Rapido order pushed to SpacetimeDB');
    }
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

  completeOrder: (phone) => {
    if (phone === 'zomato') {
      set({ zomatoCompleted: true });
    } else {
      set({ rapidoCompleted: true });
    }
  },

  showRiderPopup: () => {
    const { pendingRiderAlert, matchStatus } = get();
    // Only activate if there is a queued match and it hasn't been acted on
    if (pendingRiderAlert && matchStatus === 'matched') {
      set({ riderPopupVisible: true, pendingRiderAlert: false });
      playNotificationSound();
    }
  },

  acceptMatch: async () => {
    set({
      matchStatus: 'accepted',
      riderPopupVisible: false,
    });

    // Mark orders as completed in SpacetimeDB
    const { getSpacetimeConnection } = await import('@/lib/spacetimedb');
    const conn = getSpacetimeConnection();
    if (conn) {
      try {
        // Get all pending orders and mark as completed
        const orders = [...conn.db.orderStatus.iter()];
        for (const order of orders) {
          if (String((order as Record<string, unknown>).status) === 'pending') {
            await conn.reducers.updateOrderStatus({
              orderId: String((order as Record<string, unknown>).orderId),
              status: 'completed',
              discountApplied: BigInt(0),
              platform: String((order as Record<string, unknown>).platform),
              savingsMessage: 'Match accepted',
              timestamp: BigInt(Date.now()),
            });
          }
        }
        console.log('[MatchingStore] Orders marked as completed');
      } catch (error) {
        console.error('[MatchingStore] Failed to update orders:', error);
      }
    }

    // Show confirmations on both phones
    set({
      zomatoNotification: 'Rider found! Your flexible delivery is on the way',
      rapidoNotification: 'Ride matched! Your flexible ride is confirmed',
    });

    // Auto-dismiss after 3s
    setTimeout(() => {
      set({ zomatoNotification: null });
    }, 3000);
    setTimeout(() => {
      set({ rapidoNotification: null });
    }, 3000);

    // Navigate rider to order detail
    useRyzoStore.getState().navigateTo(9);

    // Reset match status after 2s to allow new matches
    setTimeout(() => {
      set({ 
        matchStatus: 'idle',
        matchData: null,
        zomatoFlexibleTriggered: false,
        rapidoFlexibleTriggered: false,
      });
    }, 2000);
  },

  declineMatch: async () => {
    // Mark orders as completed in SpacetimeDB FIRST
    const { getSpacetimeConnection } = await import('@/lib/spacetimedb');
    const conn = getSpacetimeConnection();
    if (conn) {
      try {
        // Get all pending orders and mark as completed
        const orders = [...conn.db.orderStatus.iter()];
        for (const order of orders) {
          if (String((order as Record<string, unknown>).status) === 'pending') {
            await conn.reducers.updateOrderStatus({
              orderId: String((order as Record<string, unknown>).orderId),
              status: 'completed',
              discountApplied: BigInt(0),
              platform: String((order as Record<string, unknown>).platform),
              savingsMessage: 'Match declined',
              timestamp: BigInt(Date.now()),
            });
          }
        }
        console.log('[MatchingStore] Orders marked as completed');
      } catch (error) {
        console.error('[MatchingStore] Failed to update orders:', error);
      }
    }

    // Reset state
    set({
      matchStatus: 'idle',
      matchData: null,
      riderPopupVisible: false,
      pendingRiderAlert: false,
      agentLog: [],
      zomatoFlexibleTriggered: false,
      rapidoFlexibleTriggered: false,
    });

    // Show decline messages
    set({
      zomatoNotification: 'No rider available. Standard delivery continues.',
      rapidoNotification: 'No rider available. Standard ride continues.',
    });

    setTimeout(() => {
      set({ zomatoNotification: null, rapidoNotification: null });
    }, 3000);
  },

  reset: () => set(initialState),
}));

// ── Internal: fires when BOTH zomato + rapido are triggered ──

function fireBothMatched(
  set: (partial: Partial<MatchingState>) => void,
  _get: () => MatchingState,
): void {
  // Phase 1: searching state on all 3 phones
  set({ matchStatus: 'searching' });

  // Show searching messages
  set({
    zomatoNotification: 'Finding a flexible rider for your order...',
    rapidoNotification: 'Matching your ride with a delivery...',
  });

  // Phase 2: after 1.5s delay (simulates AI + ArmorIQ processing), show match result
  setTimeout(() => {
    const matchId = generateMatchId();
    const riderId = '679f1234567890abcdef1234'; // Demo rider ID

    // Push match to SpacetimeDB for cross-device sync
    pushMatchToSpacetime({
      matchId,
      riderId,
      order1Id: 'zomato_order',
      order2Id: 'rapido_order',
      combinedEarnings: 142,
      overlapScore: 84,
    });

    set({
      matchStatus: 'matched',
      matchData: MOCK_MATCH_DATA,
      agentLog: MOCK_AGENT_LOG,
      // riderPopupVisible starts false — only becomes true once the rider
      // is actually on Screen 8 (RiderDashboard mounts and calls showRiderPopup)
      riderPopupVisible: false,
      zomatoNotification: null,
      rapidoNotification: null,
      pendingRiderAlert: true, // queues the popup for when rider reaches dashboard
    });

    // Inject unified ping into rider store
    useRiderStore.getState().addPing(MOCK_UNIFIED_PING);

    // Only play sound if rider is already on the dashboard (Screen 8)
    const ryzoScreen = useRyzoStore.getState().currentScreen;
    if (ryzoScreen === 8) {
      // Rider is already logged in and on dashboard — show popup + sound immediately
      set({ riderPopupVisible: true, pendingRiderAlert: false });
      playNotificationSound();
    }
    // Otherwise: pendingRiderAlert stays true. RiderDashboard will pick it up on mount.
  }, 1500);
}
