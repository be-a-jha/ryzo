import { create } from 'zustand';
import type { RiderProfile, OrderPing } from '@/types/rider';
import type { OrderStop } from '@/types/order';
import { getRiderProfile, getRiderOrders, updateRiderStatus as updateRiderStatusAPI } from '@/services/riderService';

interface RiderState {
  /** Rider profile data */
  profile: RiderProfile;
  /** Incoming order pings */
  incomingPings: OrderPing[];
  /** Current active stop index (0-based) during navigation */
  currentStopIndex: number;
  /** Navigation stops for the active order */
  navigationStops: OrderStop[];
  /** Whether voice navigation is currently playing */
  voiceActive: boolean;
  /** Current voice instruction text */
  currentVoiceInstruction: string;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Rider ID (from backend) */
  riderId: string | null;

  /** Fetch rider profile from backend */
  fetchProfile: (riderId: string) => Promise<void>;
  /** Fetch rider orders from backend */
  fetchOrders: (riderId: string) => Promise<void>;
  /** Toggle rider online/offline status */
  toggleStatus: () => Promise<void>;
  /** Set rider profile */
  setProfile: (profile: RiderProfile) => void;
  /** Add an incoming order ping */
  addPing: (ping: OrderPing) => void;
  /** Remove a ping by id (decline) */
  removePing: (pingId: string) => void;
  /** Set navigation stops for active order */
  setNavigationStops: (stops: OrderStop[]) => void;
  /** Advance to the next stop */
  advanceStop: () => void;
  /** Set voice active state */
  setVoiceActive: (active: boolean) => void;
  /** Set current voice instruction */
  setVoiceInstruction: (instruction: string) => void;
  /** Update earnings after completing delivery */
  updateEarnings: (amount: number) => void;
  /** Set rider ID */
  setRiderId: (id: string) => void;
  /** Reset rider state */
  reset: () => void;
}

const defaultProfile: RiderProfile = {
  name: 'Rahul Kumar',
  initials: 'RK',
  todayEarnings: 847,
  todayOrders: 6,
  dailyGoal: 1247,
  goalPercent: 68,
  status: 'online',
  currentLocation: { lat: 23.2215, lng: 77.4014 },
  integratedPlatforms: [],
};

const initialState = {
  profile: defaultProfile,
  incomingPings: [] as OrderPing[],
  currentStopIndex: 0,
  navigationStops: [] as OrderStop[],
  voiceActive: false,
  currentVoiceInstruction: '',
  loading: false,
  error: null as string | null,
  riderId: null as string | null,
};

export const useRiderStore = create<RiderState>((set, get) => ({
  ...initialState,

  fetchProfile: async (riderId: string) => {
    set({ loading: true, error: null, riderId });
    try {
      const profile = await getRiderProfile(riderId);
      set({ profile, loading: false });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      set({ 
        error: 'Failed to load rider profile', 
        loading: false,
        // Keep default profile as fallback
      });
    }
  },

  fetchOrders: async (riderId: string) => {
    set({ loading: true, error: null });
    try {
      const orders = await getRiderOrders(riderId);
      set({ incomingPings: orders, loading: false });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ 
        error: 'Failed to load orders', 
        loading: false,
        // Keep existing pings as fallback
      });
    }
  },

  toggleStatus: async () => {
    const { profile, riderId } = get();
    const newStatus = profile.status === 'online' ? 'offline' : 'online';
    
    // Optimistic update
    set({
      profile: {
        ...profile,
        status: newStatus,
      },
    });

    // Update backend if riderId exists
    if (riderId) {
      try {
        await updateRiderStatusAPI(riderId, newStatus);
      } catch (error) {
        console.error('Failed to update status:', error);
        // Revert on error
        set({
          profile: {
            ...profile,
            status: profile.status,
          },
          error: 'Failed to update status',
        });
      }
    }
  },

  setRiderId: (id) => set({ riderId: id }),

  setProfile: (profile) => set({ profile }),

  addPing: (ping) => {
    const { incomingPings } = get();
    // Check if ping already exists
    const exists = incomingPings.some((p) => p.id === ping.id);
    if (exists) {
      console.log('[RiderStore] Ping already exists, skipping:', ping.id);
      return;
    }
    set({ incomingPings: [...incomingPings, ping] });
  },

  removePing: (pingId) => {
    const { incomingPings } = get();
    set({ incomingPings: incomingPings.filter((p) => p.id !== pingId) });
  },

  setNavigationStops: (stops) => set({ navigationStops: stops, currentStopIndex: 0 }),

  advanceStop: () => {
    const { currentStopIndex, navigationStops } = get();
    if (currentStopIndex >= navigationStops.length) return; // Already past all stops

    const isLastStop = currentStopIndex === navigationStops.length - 1;
    const updatedStops = navigationStops.map((stop, i) => {
      if (i === currentStopIndex) return { ...stop, status: 'done' as const };
      if (!isLastStop && i === currentStopIndex + 1) return { ...stop, status: 'current' as const };
      return stop;
    });

    set({
      currentStopIndex: isLastStop ? currentStopIndex : currentStopIndex + 1,
      navigationStops: updatedStops,
    });
  },

  setVoiceActive: (active) => set({ voiceActive: active }),

  setVoiceInstruction: (instruction) => set({ currentVoiceInstruction: instruction }),

  updateEarnings: (amount) => {
    const { profile } = get();
    const newEarnings = profile.todayEarnings + amount;
    const newOrders = profile.todayOrders + 2; // Unified order = 2 orders
    const newGoalPercent = Math.round((newEarnings / profile.dailyGoal) * 100);
    set({
      profile: {
        ...profile,
        todayEarnings: newEarnings,
        todayOrders: newOrders,
        goalPercent: newGoalPercent,
      },
    });
  },

  reset: () => set({ ...initialState, profile: defaultProfile }),
}));
