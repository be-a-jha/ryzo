'use client';

import ThreePhoneLayout from '@/components/layout/ThreePhoneLayout';
import ScreenRouter from '@/components/ryzo/ScreenRouter';
import ZomatoCheckout from '@/components/zomato/ZomatoCheckout';
import RapidoBooking from '@/components/rapido/RapidoBooking';
import OrderComplete from '@/components/zomato/OrderComplete';
import RideComplete from '@/components/rapido/RideComplete';
import DebugPanel from '@/components/shared/DebugPanel';
import { useMatchingStore } from '@/store/matchingStore';
import { useMatchTrigger } from '@/hooks/useSpacetimeDB';
import { useEffect } from 'react';
import { connectSpacetimeDB } from '@/lib/spacetimedb';

export default function Home() {
  const zomatoCompleted = useMatchingStore((s) => s.zomatoCompleted);
  const rapidoCompleted = useMatchingStore((s) => s.rapidoCompleted);
  
  // Connect to SpacetimeDB on mount
  useEffect(() => {
    try {
      connectSpacetimeDB();
      console.log('[Home] SpacetimeDB connection initiated');
    } catch (error) {
      console.error('[Home] SpacetimeDB connection failed:', error);
    }
  }, []);
  
  // Listen for both orders and trigger match
  useMatchTrigger();

  return (
    <>
      <ThreePhoneLayout
        leftPhone={zomatoCompleted ? <OrderComplete /> : <ZomatoCheckout />}
        centerPhone={<ScreenRouter />}
        rightPhone={rapidoCompleted ? <RideComplete /> : <RapidoBooking />}
      />
      <DebugPanel />
    </>
  );
}
