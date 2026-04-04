# RYZO Complete Architecture & Technology Stack

## 🏗️ PROJECT STRUCTURE

```
ryzo/
├── backend/                    # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── agents/            # AI Agents
│   │   │   └── armoriqAgent.ts       # ArmorIQ decision-making agent
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.ts     # Login/signup
│   │   │   ├── matchingController.ts # Match creation/accept/decline
│   │   │   ├── orderController.ts    # Order CRUD
│   │   │   ├── riderController.ts    # Rider profile/orders
│   │   │   └── voiceController.ts    # Voice navigation
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── User.ts               # User accounts
│   │   │   ├── Rider.ts              # Rider profiles
│   │   │   ├── Order.ts              # Orders (food/ride)
│   │   │   └── Match.ts              # Matched orders
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   │   ├── armoriqService.ts     # ArmorIQ API + fallback
│   │   │   ├── elevenLabsService.ts  # Voice TTS
│   │   │   ├── geminiService.ts      # AI routing (future)
│   │   │   ├── mapsService.ts        # Google Maps API
│   │   │   ├── matchingService.ts    # Matching algorithm
│   │   │   └── spacetimeService.ts   # SpacetimeDB push
│   │   ├── scripts/
│   │   │   └── seed.ts               # Database seeding
│   │   └── index.ts           # Server entry point
│   └── package.json
│
└── frontend/                   # Next.js 16 + React + TypeScript
    ├── src/
    │   ├── app/               # Next.js App Router
    │   │   ├── layout.tsx            # Root layout
    │   │   ├── page.tsx              # Main page (3-phone UI)
    │   │   └── globals.css           # Global styles
    │   ├── components/        # React components
    │   │   ├── ryzo/                 # RYZO rider app
    │   │   │   ├── SplashScreen.tsx
    │   │   │   ├── LoginScreen.tsx
    │   │   │   ├── RoleSelection.tsx
    │   │   │   ├── InAppLogin.tsx
    │   │   │   ├── RiderDashboard.tsx
    │   │   │   ├── OrderDetail.tsx
    │   │   │   ├── ActiveNavigation.tsx
    │   │   │   ├── DeliveryComplete.tsx
    │   │   │   ├── RiderIntegration.tsx
    │   │   │   ├── UserIntegration.tsx
    │   │   │   └── ScreenRouter.tsx
    │   │   ├── zomato/               # Zomato clone
    │   │   │   ├── ZomatoCheckout.tsx
    │   │   │   └── OrderComplete.tsx
    │   │   ├── rapido/               # Rapido clone
    │   │   │   ├── RapidoBooking.tsx
    │   │   │   └── RideComplete.tsx
    │   │   └── shared/
    │   │       └── MapView.tsx       # Google Maps component
    │   ├── hooks/             # React hooks
    │   │   ├── useSpacetimeDB.ts     # SpacetimeDB subscriptions
    │   │   └── useVoice.ts           # Voice navigation
    │   ├── lib/               # Utilities
    │   │   ├── api.ts                # Axios instance
    │   │   ├── maps.ts               # Google Maps loader
    │   │   ├── mockData.ts           # Demo data
    │   │   ├── spacetimedb.ts        # SpacetimeDB connection
    │   │   └── utils.ts              # Helper functions
    │   ├── module_bindings/   # SpacetimeDB generated types
    │   │   ├── index.ts
    │   │   ├── active_match_table.ts
    │   │   ├── order_status_table.ts
    │   │   ├── insert_match_reducer.ts
    │   │   └── update_order_status_reducer.ts
    │   ├── services/          # API services
    │   │   ├── riderService.ts       # Rider API calls
    │   │   └── spacetimeService.ts   # SpacetimeDB push
    │   └── store/             # Zustand state management
    │       ├── ryzoStore.ts          # Screen navigation
    │       ├── riderStore.ts         # Rider data
    │       └── matchingStore.ts      # Match state
    └── package.json
```

## 🔧 TECHNOLOGY STACK

### Backend Technologies


| Technology | Purpose | Usage |
|------------|---------|-------|
| **Node.js** | Runtime | JavaScript server execution |
| **Express.js** | Web Framework | RESTful API endpoints |
| **TypeScript** | Language | Type-safe development |
| **MongoDB** | Database | Store users, riders, orders, matches |
| **Mongoose** | ODM | MongoDB object modeling |
| **JWT** | Authentication | Secure token-based auth |
| **Axios** | HTTP Client | External API calls |
| **CORS** | Security | Cross-origin requests |
| **ESLint** | Linting | Code quality |
| **Prettier** | Formatting | Code style |

### Frontend Technologies

| Technology | Purpose | Usage |
|------------|---------|-------|
| **Next.js 16** | Framework | React with SSR/SSG |
| **React 19** | UI Library | Component-based UI |
| **TypeScript** | Language | Type-safe development |
| **Tailwind CSS** | Styling | Utility-first CSS |
| **Zustand** | State Management | Global state (stores) |
| **Axios** | HTTP Client | Backend API calls |
| **Lucide React** | Icons | UI icons |
| **ESLint** | Linting | Code quality |
| **Prettier** | Formatting | Code style |

### External Services

| Service | Purpose | Fallback |
|---------|---------|----------|
| **SpacetimeDB** | Real-time sync | Required (no fallback) |
| **Google Maps API** | Directions, Distance Matrix | Haversine calculation |
| **ArmorIQ** | AI decision validation | Rule-based validation |
| **ElevenLabs** | Voice TTS | Web Speech API |
| **Gemini AI** | Route optimization (future) | N/A |

## 📊 DATA FLOW ARCHITECTURE

### 1. User Authentication Flow
```
User Input (Phone/Email)
    ↓
Frontend: LoginScreen.tsx
    ↓
API Call: POST /api/auth/login
    ↓
Backend: authController.ts
    ↓
MongoDB: User.findOne()
    ↓
JWT Token Generated
    ↓
Frontend: Store token in localStorage
    ↓
Navigate to RoleSelection
```

### 2. Rider Dashboard Flow
```
Rider Login
    ↓
Frontend: RiderDashboard.tsx (useEffect)
    ↓
API Call: GET /api/riders/:id/profile
    ↓
Backend: riderController.getRiderProfile()
    ↓
MongoDB: Rider.findById()
    ↓
Frontend: riderStore.setProfile()
    ↓
Display: Earnings, Stats, Active Orders
```

### 3. Order Placement Flow (Zomato/Rapido)
```
User Clicks "Order with Flexible Delivery"
    ↓
Frontend: ZomatoCheckout.tsx
    ↓
matchingStore.triggerMatch('zomato')
    ↓
Generate Order ID
    ↓
spacetimeService.pushOrderToSpacetime()
    ↓
SpacetimeDB: update_order_status reducer
    ↓
All Devices: Receive order update via subscription
    ↓
Check if both orders placed
    ↓
If YES → Trigger Match
```

### 4. Matching Algorithm Flow
```
Both Orders Placed (Zomato + Rapido)
    ↓
Frontend: matchingStore.fireBothMatched()
    ↓
Set status: 'searching'
    ↓
Generate Match ID
    ↓
Calculate Overlap Score (Haversine)
    ↓
Backend: POST /api/matching/find-match
    ↓
matchingService.findMatch()
    ↓
1. Fetch orders from MongoDB
2. Calculate route overlap (50% minimum)
3. Find best rider (nearby, online)
4. Calculate combined earnings
    ↓
armoriqService.armoriqValidateMatch()
    ↓
ArmorIQ API (or rule-based fallback)
    ↓
Decision: APPROVED / REJECTED
    ↓
If APPROVED:
    ↓
Create Match in MongoDB
    ↓
spacetimeService.pushMatchToSpacetime()
    ↓
SpacetimeDB: insert_match reducer
    ↓
All Devices: Receive match via subscription
    ↓
Rider Device: Show popup + play sound
```

### 5. Match Acceptance Flow
```
Rider Sees Popup
    ↓
Clicks "Accept Match"
    ↓
matchingStore.acceptMatch()
    ↓
API Call: POST /api/matching/:id/accept
    ↓
Backend: matchingController.acceptMatch()
    ↓
matchingService.acceptMatch()
    ↓
Update Match status: 'accepted'
    ↓
Update Orders status: 'active'
    ↓
SpacetimeDB: Push update
    ↓
All Devices: Receive confirmation
    ↓
Rider: Navigate to OrderDetail (Screen 9)
    ↓
Zomato/Rapido: Show "Rider found!" notification
```

### 6. Navigation Flow
```
Rider on OrderDetail Screen
    ↓
Clicks "Start Navigation"
    ↓
Navigate to ActiveNavigation (Screen 10)
    ↓
mapsService.getDirections()
    ↓
Google Maps Directions API
    ↓
Returns: Turn-by-turn steps, polyline
    ↓
Display: MapView with route
    ↓
Voice Navigation: useVoice.ts
    ↓
elevenLabsService.generateSpeech()
    ↓
ElevenLabs API (or Web Speech API)
    ↓
Play audio instructions
    ↓
Rider completes stops
    ↓
Last stop reached
    ↓
Navigate to DeliveryComplete (Screen 11)
```

### 7. Completion Flow
```
Delivery Complete
    ↓
Frontend: DeliveryComplete.tsx
    ↓
Update Rider Earnings
    ↓
riderStore.updateEarnings()
    ↓
matchingStore.completeOrder()
    ↓
All 3 Phones Show Completion:
    ↓
├─ RYZO: DeliveryComplete (₹142 earned)
├─ Zomato: OrderComplete (₹42 saved)
└─ Rapido: RideComplete (₹28 saved)
    ↓
Click "Back to Dashboard"
    ↓
Reset state, ready for next order
```

## 🔄 REAL-TIME SYNC (SpacetimeDB)

### Connection Establishment
```
Frontend Loads
    ↓
lib/spacetimedb.ts: connectSpacetimeDB()
    ↓
DbConnection.builder()
    .withUri('wss://maincloud.spacetimedb.com')
    .withDatabaseName('ryzo-0r856')
    .withToken(localStorage token)
    ↓
onConnect: Subscribe to tables
    ↓
Subscribe to:
    - active_match
    - order_status
    - agent_decision
    - rider_location
    ↓
Connection Ready
```

### Data Synchronization
```
Device 1: Order Placed
    ↓
spacetimeService.pushOrderToSpacetime()
    ↓
conn.reducers.updateOrderStatus({...})
    ↓
SpacetimeDB: Insert/Update row
    ↓
Broadcast to all subscribed clients
    ↓
Device 2, 3, 4...: Receive update
    ↓
hooks/useSpacetimeDB.ts: useOrderStatuses()
    ↓
React state updates
    ↓
UI re-renders with new data
```

### Match Notification
```
Match Created
    ↓
spacetimeService.pushMatchToSpacetime()
    ↓
conn.reducers.insertMatch({...})
    ↓
SpacetimeDB: Insert match row
    ↓
Broadcast to all subscribed clients
    ↓
Rider Device: useActiveMatches() detects new match
    ↓
RiderDashboard.tsx: useEffect triggers
    ↓
matchingStore.showRiderPopup()
    ↓
Play notification sound
    ↓
Show popup with match details
```

## 🧠 AI & DECISION MAKING

### ArmorIQ Agent Flow
```
Match Request
    ↓
armoriqService.armoriqValidateMatch()
    ↓
Check if API key configured
    ↓
IF YES:
    ↓
    POST to ArmorIQ API
    ↓
    Send context:
        - order1Id, order2Id
        - riderId
        - overlapScore
        - combinedEarnings
    ↓
    Apply rules:
        - overlap_score >= 50
        - combined_earnings >= 50
        - rider_rating >= 4.0
    ↓
    Receive decision:
        - approved: boolean
        - reason: string
        - confidence: 0.0-1.0
        - riskScore: 0.0-1.0
    ↓
IF NO (or API fails):
    ↓
    Rule-based fallback:
        - Check overlap >= 50%
        - Check earnings >= ₹50
        - Calculate confidence based on overlap
    ↓
Return decision
```

### Voice Navigation (ElevenLabs)
```
Navigation Step
    ↓
elevenLabsService.generateSpeech(text)
    ↓
Check if API key configured
    ↓
IF YES:
    ↓
    POST to ElevenLabs API
    ↓
    Send:
        - text: "Turn left in 200 meters"
        - voice_id: configured voice
        - model_id: "eleven_monolingual_v1"
    ↓
    Receive: Audio buffer (MP3)
    ↓
    Play audio
    ↓
IF NO:
    ↓
    Web Speech API fallback:
        - speechSynthesis.speak()
        - Browser native TTS
    ↓
Play instruction
```

## 🗺️ GOOGLE MAPS INTEGRATION

### Directions API
```
Get Route
    ↓
mapsService.getDirections(origin, destination, waypoints)
    ↓
Check if API key configured
    ↓
IF YES:
    ↓
    GET https://maps.googleapis.com/maps/api/directions/json
    ↓
    Params:
        - origin: "23.2599,77.4126"
        - destination: "23.2156,77.4395"
        - waypoints: "23.2400,77.4500|..."
        - mode: "driving"
    ↓
    Receive:
        - distance: "12.5 km"
        - duration: "25 mins"
        - steps: [{instruction, lat, lng}]
        - polyline: encoded route
    ↓
IF NO:
    ↓
    Haversine fallback:
        - Calculate straight-line distance
        - Estimate duration (30 km/h avg)
        - Generate simple steps
    ↓
Return route data
```

### Distance Matrix API
```
Calculate Distances
    ↓
mapsService.getDistanceMatrix(origins[], destinations[])
    ↓
GET https://maps.googleapis.com/maps/api/distancematrix/json
    ↓
Returns: 2D array of distances
    ↓
Used for: Rider selection, overlap calculation
```

## 💾 DATABASE SCHEMA

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  role: 'user' | 'rider',
  createdAt: Date
}
```

#### Riders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  vehicleType: 'bike' | 'scooter',
  vehicleNumber: String,
  status: 'online' | 'offline' | 'busy',
  currentLocation: {
    lat: Number,
    lng: Number
  },
  stats: {
    totalEarnings: Number,
    totalDeliveries: Number,
    rating: Number,
    completionRate: Number
  },
  integratedPlatforms: {
    zomato: { connected: Boolean, earnings: Number },
    swiggy: { connected: Boolean, earnings: Number },
    rapido: { connected: Boolean, earnings: Number }
  }
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  platform: 'zomato' | 'swiggy' | 'rapido',
  type: 'food' | 'ride' | 'grocery',
  deliveryType: 'standard' | 'flexible',
  status: 'pending' | 'matched' | 'active' | 'delivered',
  pickup: {
    location: { type: 'Point', coordinates: [lng, lat] },
    address: String
  },
  drop: {
    location: { type: 'Point', coordinates: [lng, lat] },
    address: String
  },
  originalFare: Number,
  discountedFare: Number,
  items: [{ name, quantity, price }],
  matchId: ObjectId (ref: Match),
  createdAt: Date
}
```

#### Matches Collection
```javascript
{
  _id: ObjectId,
  riderId: ObjectId (ref: Rider),
  orderIds: [ObjectId] (ref: Order),
  platforms: ['zomato', 'rapido'],
  overlapScore: Number,
  combinedRoute: [{ lat, lng }],
  detourPercentage: Number,
  combinedEarnings: Number,
  individualEarnings: [{ platform, amount }],
  timeSaved: String,
  fuelSaved: String,
  distanceSaved: Number,
  explanation: String,
  optimalSequence: [String],
  status: 'pending' | 'accepted' | 'declined' | 'completed',
  agentDecisionLog: [{
    action: 'MATCH_APPROVED' | 'MATCH_BLOCKED',
    timestamp: Date,
    overlapScore: Number,
    reason: String
  }],
  createdAt: Date
}
```

### SpacetimeDB Tables

#### active_match
```rust
{
  matchId: String (primary key),
  riderId: String,
  orderIds: String (comma-separated),
  platforms: String (comma-separated),
  overlapScore: u64,
  combinedEarnings: u64,
  status: String,
  explanation: String,
  timestamp: u64
}
```

#### order_status
```rust
{
  orderId: String (primary key),
  status: String,
  discountApplied: u64,
  platform: String,
  savingsMessage: String,
  timestamp: u64
}
```

#### agent_decision
```rust
{
  decisionId: String (primary key),
  matchId: String,
  decision: String,
  reason: String,
  confidence: f64,
  timestamp: u64
}
```

#### rider_location
```rust
{
  riderId: String (primary key),
  lat: f64,
  lng: f64,
  heading: f64,
  speed: f64,
  timestamp: u64
}
```

## 🎯 STATE MANAGEMENT (Zustand)

### ryzoStore
```typescript
{
  currentScreen: number,        // 1-11 (screen navigation)
  navigateTo: (screen) => void,
  goBack: () => void,
  reset: () => void
}
```

### riderStore
```typescript
{
  profile: RiderProfile | null,
  activeOrders: Order[],
  pings: Ping[],
  loading: boolean,
  error: string | null,
  
  fetchProfile: (riderId) => Promise<void>,
  fetchOrders: (riderId) => Promise<void>,
  updateEarnings: (amount) => void,
  addPing: (ping) => void
}
```

### matchingStore
```typescript
{
  matchStatus: 'idle' | 'searching' | 'matched' | 'accepted',
  matchData: MatchData | null,
  agentLog: AgentDecisionEntry[],
  zomatoFlexibleTriggered: boolean,
  rapidoFlexibleTriggered: boolean,
  riderPopupVisible: boolean,
  
  triggerMatch: (source) => void,
  acceptMatch: () => void,
  declineMatch: () => void,
  completeOrder: (phone) => void
}
```

## 🔐 SECURITY & AUTHENTICATION

### JWT Flow
```
User Login
    ↓
Backend: Generate JWT
    ↓
Token contains:
    - userId
    - role
    - exp (expiration)
    ↓
Frontend: Store in localStorage
    ↓
All API requests:
    - Header: Authorization: Bearer <token>
    ↓
Backend: Verify JWT middleware
    ↓
Extract user from token
    ↓
Proceed with request
```

### CORS Configuration
```javascript
// Backend: index.ts
app.use(cors({
  origin: ['http://localhost:3000', 'https://ryzo.app'],
  credentials: true
}));
```

## 📱 SCREEN FLOW (RYZO App)

```
Screen 1: SplashScreen
    ↓ (2s delay)
Screen 2: LoginScreen
    ↓ (login success)
Screen 3: RoleSelection
    ↓ (select "Rider")
Screen 4: RiderIntegration (connect platforms)
    ↓ (platforms connected)
Screen 5: InAppLogin (rider credentials)
    ↓ (login success)
Screen 8: RiderDashboard
    ↓ (match received)
Popup: Match notification
    ↓ (accept match)
Screen 9: OrderDetail
    ↓ (start navigation)
Screen 10: ActiveNavigation
    ↓ (complete delivery)
Screen 11: DeliveryComplete
    ↓ (back to dashboard)
Screen 8: RiderDashboard
```

## 🚀 DEPLOYMENT ARCHITECTURE

### Production Setup
```
┌─────────────────────────────────────────┐
│         Load Balancer (Nginx)           │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│  Frontend      │    │   Backend       │
│  (Vercel)      │    │   (AWS EC2)     │
│  Next.js SSR   │    │   Node.js       │
└────────────────┘    └─────────┬───────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼──┐  ┌────▼────┐  ┌──▼──────┐
            │ MongoDB  │  │ SpaceDB │  │ Redis   │
            │ Atlas    │  │ Cloud   │  │ Cache   │
            └──────────┘  └─────────┘  └─────────┘
```

### External Services
```
Backend
    ├─→ Google Maps API (directions, distance)
    ├─→ ArmorIQ API (decision validation)
    ├─→ ElevenLabs API (voice TTS)
    └─→ SpacetimeDB (real-time sync)
```

## 📊 PERFORMANCE METRICS

### Response Times (Target)
- API Endpoints: < 200ms
- Database Queries: < 100ms
- SpacetimeDB Sync: < 50ms
- Google Maps API: < 500ms
- ArmorIQ Decision: < 1s

### Scalability
- Concurrent Users: 10,000+
- Matches per Second: 100+
- Database Connections: 100 pool
- SpacetimeDB Subscriptions: Unlimited

## 🎉 COMPLETE FLOW EXAMPLE

### End-to-End Scenario
```
1. DEVICE 1 (Zomato User)
   - Opens app → ZomatoCheckout
   - Clicks "Order with Flexible Delivery"
   - Order pushed to SpacetimeDB
   - Shows "Waiting for match..." notification

2. DEVICE 2 (Rapido User)
   - Opens app → RapidoBooking
   - Clicks "Book Flexible Ride"
   - Ride pushed to SpacetimeDB
   - Matching algorithm triggered

3. BACKEND
   - Detects both orders in SpacetimeDB
   - Calculates route overlap: 84%
   - Finds nearby rider
   - ArmorIQ validates: APPROVED
   - Creates match in MongoDB
   - Pushes match to SpacetimeDB

4. DEVICE 3 (Rider)
   - Subscribed to SpacetimeDB
   - Receives match notification
   - Popup appears with sound
   - Shows: ₹142 earnings, 84% overlap
   - Rider clicks "Accept"

5. ALL DEVICES
   - Device 1: "Rider found! ETA 15 mins"
   - Device 2: "Ride matched! Driver arriving"
   - Device 3: Navigate to OrderDetail

6. NAVIGATION
   - Rider starts navigation
   - Google Maps provides route
   - Voice instructions play
   - Real-time location updates

7. COMPLETION
   - Rider completes all stops
   - Device 1: OrderComplete (saved ₹42)
   - Device 2: RideComplete (saved ₹28)
   - Device 3: DeliveryComplete (earned ₹142)
```

## 🔧 CONFIGURATION FILES

### Backend .env
```env
MONGODB_URI=mongodb://localhost:27017/ryzo
JWT_SECRET=your-secret-key
GOOGLE_MAPS_API_KEY=your-key
ARMORIQ_API_KEY=your-key
ELEVENLABS_API_KEY=your-key
SPACETIMEDB_URI=wss://maincloud.spacetimedb.com
SPACETIMEDB_MODULE=ryzo-0r856
```

### Frontend .env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key
NEXT_PUBLIC_SPACETIMEDB_URI=wss://maincloud.spacetimedb.com
NEXT_PUBLIC_SPACETIMEDB_MODULE=ryzo-0r856
```

---

**This architecture enables:**
- ✅ Real-time cross-device synchronization
- ✅ AI-powered match validation
- ✅ Intelligent route optimization
- ✅ Voice-guided navigation
- ✅ Scalable microservices architecture
- ✅ Fault-tolerant with fallbacks
- ✅ Production-ready deployment
