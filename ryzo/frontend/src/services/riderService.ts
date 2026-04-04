import api from '@/lib/api';
import type { RiderProfile, OrderPing } from '@/types/rider';

export interface RiderProfileResponse {
  rider: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    integratedPlatforms: string[];
    currentLocation: { lat: number; lng: number };
    status: 'online' | 'offline';
    currentTasks: string[];
    todayEarnings: number;
    todayOrders: number;
    dailyGoal: number;
  };
}

export interface RiderOrdersResponse {
  orders: Array<{
    _id: string;
    platform: string;
    type: string;
    status: string;
    pickup: { address: string };
    drop: { address: string };
    originalFare: number;
    discountedFare: number;
  }>;
  count: number;
}

/**
 * Fetch rider profile from backend
 */
export async function getRiderProfile(riderId: string): Promise<RiderProfile> {
  try {
    const response = await api.get<RiderProfileResponse>(`/api/riders/${riderId}`);
    const rider = response.data.rider;
    
    // Transform backend data to frontend format
    return {
      name: rider.name,
      initials: rider.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      todayEarnings: rider.todayEarnings,
      todayOrders: rider.todayOrders,
      dailyGoal: rider.dailyGoal,
      goalPercent: Math.round((rider.todayEarnings / rider.dailyGoal) * 100),
      status: rider.status,
      currentLocation: rider.currentLocation,
      integratedPlatforms: rider.integratedPlatforms,
    };
  } catch (error) {
    console.error('Failed to fetch rider profile:', error);
    throw error;
  }
}

/**
 * Fetch rider's active orders/pings from backend
 */
export async function getRiderOrders(riderId: string): Promise<OrderPing[]> {
  try {
    const response = await api.get<RiderOrdersResponse>(`/api/riders/${riderId}/orders`);
    
    // Transform backend orders to frontend pings
    return response.data.orders.map((order, index) => ({
      id: order._id,
      type: index === 0 ? 'unified' as const : 'standard' as const,
      platforms: index === 0 ? ['SWIGGY', 'RAPIDO'] : [order.platform.toUpperCase()],
      restaurant: order.pickup.address.split(',')[0],
      dropAddress: order.drop.address,
      distance: '4.2 km',
      earnings: `₹${order.discountedFare}`,
      time: '~18 min',
      expiresIn: 180,
      badge: index === 0 ? 'AI PICK' : undefined,
      aiTag: index === 0 ? '🤖 84% Match' : undefined,
      agentTag: index === 0 ? '✅ ArmorIQ Approved' : undefined,
      distanceLabel: 'Distance',
      earningsLabel: 'Earnings',
      timeLabel: 'Time',
    }));
  } catch (error) {
    console.error('Failed to fetch rider orders:', error);
    throw error;
  }
}

/**
 * Update rider status (online/offline)
 */
export async function updateRiderStatus(riderId: string, status: 'online' | 'offline'): Promise<void> {
  try {
    await api.patch(`/api/riders/${riderId}/status`, { status });
  } catch (error) {
    console.error('Failed to update rider status:', error);
    throw error;
  }
}

/**
 * Update rider location
 */
export async function updateRiderLocation(riderId: string, lat: number, lng: number): Promise<void> {
  try {
    await api.patch(`/api/riders/${riderId}/location`, { lat, lng });
  } catch (error) {
    console.error('Failed to update rider location:', error);
    throw error;
  }
}
