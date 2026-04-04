'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRyzoStore } from '@/store/ryzoStore';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import RoleSelection from './RoleSelection';
import UserIntegration from './UserIntegration';
import InAppLogin from './InAppLogin';
import RiderIntegration from './RiderIntegration';
import RiderDashboard from './RiderDashboard';
import OrderDetail from './OrderDetail';
import ActiveNavigation from './ActiveNavigation';

const screenComponents: Record<number, React.ComponentType> = {
  1: SplashScreen,
  2: LoginScreen,
  3: RoleSelection,
  4: UserIntegration,
  // 5 is a modal overlay (InAppLogin), handled separately
  // 6 is a state change on Screen 4 (Integration Success), not a separate screen
  7: RiderIntegration,
  8: RiderDashboard,
  9: OrderDetail,
  10: ActiveNavigation,
};

export default function ScreenRouter() {
  const currentScreen = useRyzoStore((s) => s.currentScreen);
  const loginModalOpen = useRyzoStore((s) => s.loginModalOpen);

  // Screen 5 and 6 are handled by Screen 4/7 + InAppLogin modal overlay
  const displayScreen = currentScreen === 5 || currentScreen === 6
    ? useRyzoStore.getState().selectedRole === 'rider' ? 7 : 4
    : currentScreen;

  const ScreenComponent = screenComponents[displayScreen];

  if (!ScreenComponent) {
    return (
      <div className="flex items-center justify-center h-full text-ryzo-text-muted text-[13px]">
        Screen {currentScreen}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayScreen}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <ScreenComponent />
        </motion.div>
      </AnimatePresence>

      {/* In-App Login Modal Overlay (Screen 5) */}
      <AnimatePresence>
        {loginModalOpen && <InAppLogin />}
      </AnimatePresence>
    </div>
  );
}
