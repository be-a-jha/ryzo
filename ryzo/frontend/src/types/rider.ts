import type { Coordinate } from './order';

export interface RiderProfile {
  name: string;
  initials: string;
  todayEarnings: number;
  todayOrders: number;
  dailyGoal: number;
  goalPercent: number;
  status: 'online' | 'offline';
  currentLocation: Coordinate;
  integratedPlatforms: string[];
}

export interface OrderPing {
  id: string;
  type: 'unified' | 'standard';
  platforms: string[];
  badge?: string;
  restaurant: string;
  dropAddress: string;
  distance: string;
  distanceLabel: string;
  earnings: string;
  earningsLabel: string;
  time: string;
  timeLabel: string;
  aiTag?: string;
  agentTag?: string;
  expiresIn: number;
}
