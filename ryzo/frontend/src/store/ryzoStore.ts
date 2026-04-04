import { create } from 'zustand';
import type { Role, PlatformApp } from '@/types/platform';

type RyzoScreen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface RyzoState {
  /** Current active screen in the RYZO center phone (1-10) */
  currentScreen: RyzoScreen;
  /** Navigation history stack for back navigation */
  screenHistory: RyzoScreen[];
  /** Selected role: user or rider */
  selectedRole: Role | null;
  /** List of integrated apps (user or rider side) */
  integratedApps: string[];
  /** Currently selected app for the in-app login modal */
  currentLoginApp: PlatformApp | null;
  /** Whether the in-app login modal is open */
  loginModalOpen: boolean;

  /** Navigate to a specific screen, pushing current to history */
  navigateTo: (screen: RyzoScreen) => void;
  /** Go back to the previous screen in history */
  goBack: () => void;
  /** Set the selected role */
  setRole: (role: Role) => void;
  /** Add an app to the integrated list */
  addIntegratedApp: (appId: string) => void;
  /** Open the login modal for a specific app */
  openLoginModal: (app: PlatformApp) => void;
  /** Close the login modal */
  closeLoginModal: () => void;
  /** Reset the store to initial state */
  reset: () => void;
}

const initialState = {
  currentScreen: 1 as RyzoScreen,
  screenHistory: [] as RyzoScreen[],
  selectedRole: null as Role | null,
  integratedApps: [] as string[],
  currentLoginApp: null as PlatformApp | null,
  loginModalOpen: false,
};

export const useRyzoStore = create<RyzoState>((set, get) => ({
  ...initialState,

  navigateTo: (screen) => {
    const { currentScreen } = get();
    set({
      currentScreen: screen,
      screenHistory: [...get().screenHistory, currentScreen],
    });
  },

  goBack: () => {
    const { screenHistory } = get();
    if (screenHistory.length === 0) return;
    const previous = screenHistory[screenHistory.length - 1];
    set({
      currentScreen: previous,
      screenHistory: screenHistory.slice(0, -1),
    });
  },

  setRole: (role) => set({ selectedRole: role }),

  addIntegratedApp: (appId) => {
    const { integratedApps } = get();
    if (integratedApps.includes(appId)) return;
    set({ integratedApps: [...integratedApps, appId] });
  },

  openLoginModal: (app) => set({ currentLoginApp: app, loginModalOpen: true }),

  closeLoginModal: () => set({ currentLoginApp: null, loginModalOpen: false }),

  reset: () => set(initialState),
}));
