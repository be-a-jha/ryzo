export interface Coordinate {
  lat: number;
  lng: number;
}

export interface OrderStop {
  name: string;
  address: string;
  location: Coordinate;
  type: 'pickup' | 'drop';
  status: 'done' | 'current' | 'upcoming';
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  platform: string;
  type: 'food' | 'ride' | 'grocery';
  deliveryType: 'standard' | 'flexible';
  status: 'pending' | 'matched' | 'active' | 'delivered';
  pickup: {
    location: Coordinate;
    address: string;
  };
  drop: {
    location: Coordinate;
    address: string;
  };
  originalFare: number;
  discountedFare: number;
  items?: OrderItem[];
  estimatedTime: string;
}
