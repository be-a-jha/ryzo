export interface PlatformApp {
  id: string;
  name: string;
  category: string;
  color: string;
  iconBg: string;
  integrated: boolean;
}

export type UserPlatformId = 'swiggy' | 'zomato' | 'blinkit' | 'zepto' | 'dunzo';
export type RiderPlatformId = 'zomato-delivery' | 'swiggy-delivery' | 'blinkit-partner' | 'rapido-captain' | 'porter-partner';

export type Role = 'user' | 'rider';
