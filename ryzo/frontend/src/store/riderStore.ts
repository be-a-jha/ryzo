import { create } from 'zustand';
import type { RiderProfile, OrderPing } from '@/types/rider';
import type { OrderStop } from '@/types/order';

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

  /** Toggle rider online/offline status */
  toggleStatus: () => void;
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
};

export const useRiderStore = create<RiderState>((set, get) => ({
  ...initialState,

  toggleStatus: () => {
    const { profile } = get();
    set({
      profile: {
        ...profile,
        status: profile.status === 'online' ? 'offline' : 'online',
      },
    });
  },

  setProfile: (profile) => set({ profile }),

  addPing: (ping) => {
    const { incomingPings } = get();
    set({ incomingPings: [...incomingPings, ping] });
  },

  removePing: (pingId) => {
    const { incomingPings } = get();
    set({ incomingPings: incomingPings.filter((p) => p.id !== pingId) });
  },

  setNavigationStops: (stops) => set({ navigationStops: stops, currentStopIndex: 0 }),

  advanceStop: () => {
    const { currentStopIndex, navigationStops } = get();
    if (currentStopIndex < navigationStops.length - 1) {
      const updatedStops = navigationStops.map((stop, i) => {
        if (i === currentStopIndex) return { ...stop, status: 'done' as const };
        if (i === currentStopIndex + 1) return { ...stop, status: 'current' as const };
        return stop;
      });
      set({
        currentStopIndex: currentStopIndex + 1,
        navigationStops: updatedStops,
      });
    }
  },

  setVoiceActive: (active) => set({ voiceActive: active }),

  setVoiceInstruction: (instruction) => set({ currentVoiceInstruction: instruction }),

  reset: () => set({ ...initialState, profile: defaultProfile }),
}));
