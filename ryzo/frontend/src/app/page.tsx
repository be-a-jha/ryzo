'use client';

import ThreePhoneLayout from '@/components/layout/ThreePhoneLayout';
import ScreenRouter from '@/components/ryzo/ScreenRouter';
import ZomatoCheckout from '@/components/zomato/ZomatoCheckout';
import RapidoBooking from '@/components/rapido/RapidoBooking';
import OrderComplete from '@/components/zomato/OrderComplete';
import RideComplete from '@/components/rapido/RideComplete';
import { useMatchingStore } from '@/store/matchingStore';

export default function Home() {
  const zomatoCompleted = useMatchingStore((s) => s.zomatoCompleted);
  const rapidoCompleted = useMatchingStore((s) => s.rapidoCompleted);

  return (
    <ThreePhoneLayout
      leftPhone={zomatoCompleted ? <OrderComplete /> : <ZomatoCheckout />}
      centerPhone={<ScreenRouter />}
      rightPhone={rapidoCompleted ? <RideComplete /> : <RapidoBooking />}
    />
  );
}
