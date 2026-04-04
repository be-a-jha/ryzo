import ThreePhoneLayout from '@/components/layout/ThreePhoneLayout';
import ScreenRouter from '@/components/ryzo/ScreenRouter';
import ZomatoCheckout from '@/components/zomato/ZomatoCheckout';
import RapidoBooking from '@/components/rapido/RapidoBooking';

export default function Home() {
  return (
    <ThreePhoneLayout
      leftPhone={<ZomatoCheckout />}
      centerPhone={<ScreenRouter />}
      rightPhone={<RapidoBooking />}
    />
  );
}
