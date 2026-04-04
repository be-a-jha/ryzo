import type { PlatformApp } from '@/types/platform';
import type { RiderProfile, OrderPing } from '@/types/rider';
import type { MatchData, AgentDecisionEntry, ComparisonRow } from '@/types/match';
import type { OrderItem, OrderStop } from '@/types/order';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Platform Apps — User Side
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const USER_PLATFORM_APPS: PlatformApp[] = [
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'Food Delivery',
    color: '#FC8019',
    iconBg: '#FC8019',
    integrated: false,
  },
  {
    id: 'zomato',
    name: 'Zomato',
    category: 'Food Delivery',
    color: '#E23744',
    iconBg: '#E23744',
    integrated: false,
  },
  {
    id: 'blinkit',
    name: 'Blinkit',
    category: 'Grocery',
    color: '#F9D100',
    iconBg: '#F9D100',
    integrated: false,
  },
  {
    id: 'zepto',
    name: 'Zepto',
    category: 'Grocery',
    color: '#9B59B6',
    iconBg: '#9B59B6',
    integrated: false,
  },
  {
    id: 'dunzo',
    name: 'Dunzo',
    category: 'Multi-category',
    color: '#00B140',
    iconBg: '#00B140',
    integrated: false,
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Platform Apps — Rider Side
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RIDER_PLATFORM_APPS: PlatformApp[] = [
  {
    id: 'zomato-delivery',
    name: 'Zomato Delivery Partner',
    category: 'Food',
    color: '#E23744',
    iconBg: '#E23744',
    integrated: false,
  },
  {
    id: 'swiggy-delivery',
    name: 'Swiggy Delivery',
    category: 'Food',
    color: '#FC8019',
    iconBg: '#FC8019',
    integrated: false,
  },
  {
    id: 'blinkit-partner',
    name: 'Blinkit Partner',
    category: 'Grocery',
    color: '#F9D100',
    iconBg: '#F9D100',
    integrated: false,
  },
  {
    id: 'rapido-captain',
    name: 'Rapido Captain',
    category: 'Rides',
    color: '#1A6FE8',
    iconBg: '#1A6FE8',
    integrated: false,
  },
  {
    id: 'porter-partner',
    name: 'Porter Partner',
    category: 'Logistics',
    color: '#1C2951',
    iconBg: '#1C2951',
    integrated: false,
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Rider Profile
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MOCK_RIDER_PROFILE: RiderProfile = {
  name: 'Rahul Kumar',
  initials: 'RK',
  todayEarnings: 847,
  todayOrders: 6,
  dailyGoal: 1247,
  goalPercent: 68,
  status: 'online',
  currentLocation: { lat: 23.2215, lng: 77.4014 },
  integratedPlatforms: ['zomato-delivery', 'swiggy-delivery', 'blinkit-partner', 'rapido-captain'],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Order Pings (Rider Dashboard)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MOCK_UNIFIED_PING: OrderPing = {
  id: 'ping-unified-1',
  type: 'unified',
  platforms: ['ZOMATO', 'RAPIDO'],
  badge: 'UNIFIED ORDER',
  restaurant: "McDonald's, Arera Colony",
  dropAddress: 'Hoshangabad Rd, BHEL',
  distance: '4.2 km',
  distanceLabel: 'Route',
  earnings: '₹94',
  earningsLabel: 'Combined',
  time: '18 min',
  timeLabel: 'Est.',
  aiTag: '🤖 AI Optimized Route',
  agentTag: '✓ ArmorIQ Approved',
  expiresIn: 28,
};

export const MOCK_STANDARD_PING: OrderPing = {
  id: 'ping-standard-1',
  type: 'standard',
  platforms: ['ZOMATO'],
  restaurant: 'Burger King, MP Nagar',
  dropAddress: 'Tulsi Nagar, Bhopal',
  distance: '2.8 km',
  distanceLabel: 'Route',
  earnings: '₹52',
  earningsLabel: 'Earnings',
  time: '12 min',
  timeLabel: 'Est.',
  expiresIn: 104,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Zomato Checkout Data
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ZOMATO_ORDER_ITEMS: OrderItem[] = [
  { name: 'McSpicy Burger', quantity: 1, price: 189 },
  { name: 'Large Fries', quantity: 1, price: 139 },
  { name: 'Coke', quantity: 1, price: 69 },
];

export const ZOMATO_RESTAURANT = "McDonald's, Arera Colony";
export const ZOMATO_SUBTOTAL = 397;
export const ZOMATO_DELIVERY_FEE = 39;
export const ZOMATO_PLATFORM_FEE = 5;
export const ZOMATO_TOTAL = 441;
export const ZOMATO_STANDARD_TIME = '28–35 min';
export const ZOMATO_DELIVERY_ADDRESS = 'Hoshangabad Road, BHEL, Bhopal';
export const ZOMATO_FLEXIBLE_SAVINGS = 42;
export const ZOMATO_FLEXIBLE_TOTAL = 399;
export const ZOMATO_FLEXIBLE_WAIT = '~8 min';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Rapido Booking Data
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const RAPIDO_PICKUP = 'MP Nagar Zone 2, Bhopal';
export const RAPIDO_DROP = 'Sarvadharm Colony, Bhopal';
export const RAPIDO_DISTANCE = '5.2 km';
export const RAPIDO_EST_TIME = '~18 min';
export const RAPIDO_BASE_FARE = 78;
export const RAPIDO_CONVENIENCE_FEE = 8;
export const RAPIDO_TOTAL = 86;
export const RAPIDO_STANDARD_WAIT = '3–5 min';
export const RAPIDO_FLEXIBLE_SAVINGS = 28;
export const RAPIDO_FLEXIBLE_TOTAL = 58;
export const RAPIDO_FLEXIBLE_WAIT = '~6 min';

export const RAPIDO_RIDE_TYPES = [
  { type: 'Bike', price: 78, selected: true },
  { type: 'Auto', price: 124, selected: false },
  { type: 'Cab', price: 210, selected: false },
] as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Comparison Table (Screen 9)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const COMPARISON_DATA: ComparisonRow[] = [
  { metric: 'Distance', zomatoOnly: '5.1 km', rapidoOnly: '4.8 km', ryzoAI: '3.9 km' },
  { metric: 'Earnings', zomatoOnly: '₹52', rapidoOnly: '₹48', ryzoAI: '₹94' },
  { metric: 'Time Est.', zomatoOnly: '22 min', rapidoOnly: '20 min', ryzoAI: '17 min' },
  { metric: 'Fuel Est.', zomatoOnly: '₹18', rapidoOnly: '₹16', ryzoAI: '₹13' },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AI Insight Text
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const AI_INSIGHT_TEXT =
  "Taking this unified order saves you 1.2km and earns ₹42 more than either order separately. Optimal sequence: McDonald's pickup → BHEL drop → MP Nagar pickup → Sarvadharm drop.";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Agent Decision Log
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MOCK_AGENT_LOG: AgentDecisionEntry[] = [
  {
    id: 'decision-1',
    action: 'MATCH_APPROVED',
    timestamp: '14:32:11',
    overlapScore: 84,
    detourPercent: 12,
    capacity: '1/2',
    reason: 'Overlap 84%, detour 12%, capacity 1/2',
  },
  {
    id: 'decision-2',
    action: 'MATCH_APPROVED',
    timestamp: '14:18:44',
    overlapScore: 71,
    detourPercent: 28,
    capacity: '0/2',
    reason: 'Overlap 71%, detour 28%, capacity 0/2',
  },
  {
    id: 'decision-3',
    action: 'MATCH_BLOCKED',
    timestamp: '13:55:02',
    overlapScore: 58,
    detourPercent: 0,
    capacity: 'N/A',
    reason: 'Overlap 58%, below minimum 70% threshold',
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Navigation Stops (Screen 10)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MOCK_NAVIGATION_STOPS: OrderStop[] = [
  {
    name: "McDonald's",
    address: 'Arera Colony',
    location: { lat: 23.2215, lng: 77.4014 },
    type: 'pickup',
    status: 'done',
  },
  {
    name: 'BHEL Sector',
    address: 'Hoshangabad Rd',
    location: { lat: 23.2093, lng: 77.3783 },
    type: 'drop',
    status: 'current',
  },
  {
    name: 'MP Nagar',
    address: 'Zone 2',
    location: { lat: 23.2318, lng: 77.4272 },
    type: 'pickup',
    status: 'upcoming',
  },
  {
    name: 'Sarvadharm',
    address: 'Colony',
    location: { lat: 23.1982, lng: 77.4621 },
    type: 'drop',
    status: 'upcoming',
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Match Data (Full unified order mock)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MOCK_MATCH_DATA: MatchData = {
  matchId: '#RZ-2847',
  overlapScore: 84,
  detourPercent: 12,
  combinedEarnings: 94,
  individualEarnings: { zomato: 52, rapido: 48 },
  distanceSaved: 1.2,
  explanation: AI_INSIGHT_TEXT,
  optimalSequence: ["McDonald's Pickup", 'BHEL Drop', 'MP Nagar Pickup', 'Sarvadharm Drop'],
  stops: MOCK_NAVIGATION_STOPS,
  comparison: COMPARISON_DATA,
  agentDecisionLog: MOCK_AGENT_LOG,
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Voice Scripts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const VOICE_SCRIPTS = {
  match:
    "New unified order matched. Pickup at McDonald's, Arera Colony, then drop at B-H-E-L Sector. Rapido ride pickup at M-P Nagar, drop at Sarvadharm Colony. Combined route saves 1.2 kilometers. Extra earning: 42 rupees. Route is optimized.",
  navigation: 'Turn right on Hoshangabad Road in 200m',
  turnByTurn: [
    'In 200 meters, turn right on Hoshangabad Road.',
    'Continue straight for 1.4 kilometers.',
    'Your destination, B-H-E-L Sector, is on the left.',
    'Pickup confirmed. Now heading to M-P Nagar.',
    'In 400 meters, take a left on Zone 2 Main Road.',
    'You have arrived. Drop off the rider at Sarvadharm Colony.',
  ],
  stopArrival: [
    "You have arrived at McDonald's. Please pick up the food order.",
    'Food picked up. Now heading to B-H-E-L for drop off.',
    'You have arrived at the drop location.',
    'Ride pickup confirmed. Heading to final destination.',
  ],
  fallback: 'No match found within the time window. Proceeding with standard delivery.',
} as const;
