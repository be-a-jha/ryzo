'use client';

import { useMatchingStore } from '@/store/matchingStore';
import ThreePhoneLayout from '@/components/layout/ThreePhoneLayout';
import ScreenRouter from '@/components/ryzo/ScreenRouter';
import ZomatoCheckout from '@/components/zomato/ZomatoCheckout';
import RapidoBooking from '@/components/rapido/RapidoBooking';
import OrderComplete from '@/components/zomato/OrderComplete';
import RideComplete from '@/components/rapido/RideComplete';
import DebugPanel from '@/components/shared/DebugPanel';
import SpacetimeInitializer from '@/components/shared/SpacetimeInitializer';

export default function ClientHome() {
  const zomatoCompleted = useMatchingStore((s) => s.zomatoCompleted);
  const rapidoCompleted = useMatchingStore((s) => s.rapidoCompleted);

  return (
    <>
      <SpacetimeInitializer />
      <ThreePhoneLayout
        leftPhone={zomatoCompleted ? <OrderComplete /> : <ZomatoCheckout />}
        centerPhone={<ScreenRouter />}
        rightPhone={rapidoCompleted ? <RideComplete /> : <RapidoBooking />}
      />
      <DebugPanel />
    </>
  );
}
