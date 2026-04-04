# RYZO Visual Flow Diagrams

## 🎯 COMPLETE SYSTEM FLOW

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RYZO UNIFIED DELIVERY SYSTEM                     │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   DEVICE 1   │      │   DEVICE 2   │      │   DEVICE 3   │
│   (Zomato)   │      │   (Rapido)   │      │   (Rider)    │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │ Order Food          │ Book Ride           │ Login
       │ (Flexible)          │ (Flexible)          │
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ ZomatoCheckout│      │RapidoBooking │      │RiderDashboard│
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                     │                     │
       │ pushOrderToSpacetime│                     │
       ▼                     ▼                     │
┌─────────────────────────────────────────┐       │
│         SPACETIMEDB (Real-Time)         │       │
│  ┌─────────────────────────────────┐   │       │
│  │  order_status table             │   │       │
│  │  - zomato_order_123 (pending)   │   │       │
│  │  - rapido_ride_456 (pending)    │   │       │
│  └─────────────────────────────────┘   │       │
└─────────────┬───────────────────────────┘       │
              │                                   │
              │ Both orders detected              │
              ▼                                   │
┌─────────────────────────────────────────┐       │
│      MATCHING SERVICE (Backend)         │       │
│  1. Calculate overlap (Haversine)       │       │
│  2. Find best rider (nearby, online)    │       │
│  3. Validate with ArmorIQ               │       │
│  4. Create match in MongoDB             │       │
└─────────────┬───────────────────────────┘       │
              │                                   │
              │ pushMatchToSpacetime              │
              ▼                                   │
┌─────────────────────────────────────────┐       │
│         SPACETIMEDB (Real-Time)         │       │
│  ┌─────────────────────────────────┐   │       │
│  │  active_match table             │   │       │
│  │  - match_789 (pending)          │   │       │
│  │  - overlap: 84%                 │   │       │
│  │  - earnings: ₹142               │   │       │
│  └─────────────────────────────────┘   │       │
└─────────────┬───────────────────────────┘       │
              │                                   │
              │ Subscription triggers             │
              └───────────────────────────────────┤
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │ Match Popup  │
                                          │ + Sound      │
                                          └──────┬───────┘
                                                 │
                                                 │ Accept
                                                 ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│"Rider found!"│      │"Ride matched"│      │ OrderDetail  │
│  ETA 15 min  │      │Driver coming │      │ Start Nav    │
└──────────────┘      └──────────────┘      └──────┬───────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │ActiveNavigation
                                            │Google Maps   │
                                            │Voice Guide   │
                                            └──────┬───────┘
                                                   │
                                                   │ Complete
                                                   ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│OrderComplete │      │RideComplete  │      │DeliveryComplete
│Saved ₹42     │      │Saved ₹28     │      │Earned ₹142   │
└──────────────┘      └──────────────┘      └──────────────┘
```

## 🔄 SPACETIMEDB SYNC MECHANISM

```
┌─────────────────────────────────────────────────────────────┐
│                    SPACETIMEDB ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  SpacetimeDB     │
                    │  Cloud Server    │
                    │  (WebSocket)     │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Device 1     │    │  Device 2     │    │  Device 3     │
│  Browser      │    │  Browser      │    │  Browser      │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        │ Subscribe          │ Subscribe          │ Subscribe
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│useActiveMatches    │useOrderStatuses    │useAgentDecisions
│useOrderStatuses    │useActiveMatches    │useActiveMatches│
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        │ React Hook         │ React Hook         │ React Hook
        │ Auto-updates       │ Auto-updates       │ Auto-updates
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  UI Updates   │    │  UI Updates   │    │  UI Updates   │
│  Instantly    │    │  Instantly    │    │  Instantly    │
└───────────────┘    └───────────────┘    └───────────────┘

WRITE FLOW:
Device 1 → conn.reducers.updateOrderStatus() → SpacetimeDB
                                                     ↓
                                          Broadcast to all
                                                     ↓
                              Device 1, 2, 3 receive update
                                                     ↓
                                          React state updates
                                                     ↓
                                              UI re-renders
```

## 🧠 MATCHING ALGORITHM FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    MATCHING ALGORITHM                        │
└─────────────────────────────────────────────────────────────┘

Input: Order 1 (Zomato) + Order 2 (Rapido)
    │
    ▼
┌─────────────────────────────────────┐
│ 1. FETCH ORDERS FROM MONGODB        │
│    - Order 1: Food delivery         │
│    - Order 2: Ride booking          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 2. EXTRACT COORDINATES              │
│    Order 1:                         │
│    - Pickup: (23.2599, 77.4126)     │
│    - Drop: (23.2156, 77.4395)       │
│    Order 2:                         │
│    - Pickup: (23.2400, 77.4500)     │
│    - Drop: (23.2100, 77.4200)       │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 3. CALCULATE OVERLAP (Haversine)    │
│    Distance between:                │
│    - Pickup 1 ↔ Pickup 2: 2.1 km    │
│    - Drop 1 ↔ Drop 2: 1.8 km        │
│    Overlap Score: 84%               │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 4. CHECK THRESHOLD                  │
│    Overlap >= 50%? ✅ YES (84%)     │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 5. FIND BEST RIDER                  │
│    Query MongoDB:                   │
│    - Status: online                 │
│    - Location: within 5km           │
│    - Rating: >= 4.0                 │
│    Selected: Rider #679f1234        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 6. CALCULATE EARNINGS               │
│    Order 1 fare: ₹78                │
│    Order 2 fare: ₹92                │
│    Combined: ₹170                   │
│    Rider gets: ₹142 (after fees)    │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 7. ARMORIQ VALIDATION               │
│    Input:                           │
│    - overlapScore: 84               │
│    - combinedEarnings: 142          │
│    - riderId: 679f1234              │
│    Rules:                           │
│    ✅ overlap >= 50%                │
│    ✅ earnings >= ₹50               │
│    ✅ rider rating >= 4.0           │
│    Decision: APPROVED               │
│    Confidence: 0.95                 │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 8. CREATE MATCH IN MONGODB          │
│    Match document:                  │
│    - matchId: match_789             │
│    - riderId: 679f1234              │
│    - orderIds: [order1, order2]     │
│    - status: pending                │
│    - overlapScore: 84               │
│    - combinedEarnings: 142          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 9. PUSH TO SPACETIMEDB              │
│    conn.reducers.insertMatch({...}) │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ 10. NOTIFY ALL DEVICES              │
│     - Zomato: "Rider found!"        │
│     - Rapido: "Ride matched!"       │
│     - Rider: Popup + Sound          │
└─────────────────────────────────────┘
```

## 🗺️ NAVIGATION FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    NAVIGATION SYSTEM                         │
└─────────────────────────────────────────────────────────────┘

Rider clicks "Start Navigation"
    │
    ▼
┌─────────────────────────────────────┐
│ ActiveNavigation.tsx                │
│ - Load match data                   │
│ - Extract stops                     │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ mapsService.getDirections()         │
│ Input:                              │
│ - Origin: Rider location            │
│ - Waypoints: [Pickup1, Pickup2]     │
│ - Destination: Drop2                │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Google Maps Directions API          │
│ POST /directions/json               │
│ Returns:                            │
│ - distance: "12.5 km"               │
│ - duration: "25 mins"               │
│ - steps: [                          │
│     {instruction: "Turn left",      │
│      distance: "200m",              │
│      lat: 23.2599, lng: 77.4126}    │
│   ]                                 │
│ - polyline: encoded route           │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ MapView.tsx                         │
│ - Display Google Map                │
│ - Draw polyline route               │
│ - Show markers for stops            │
│ - Track rider location              │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Voice Navigation (useVoice.ts)      │
│ For each step:                      │
│   1. Generate speech                │
│   2. Play audio                     │
│   3. Wait for next step             │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ elevenLabsService.generateSpeech()  │
│ Input: "Turn left in 200 meters"    │
│ POST to ElevenLabs API              │
│ Returns: Audio buffer (MP3)         │
│ Fallback: Web Speech API            │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Play Audio Instruction              │
│ "Turn left in 200 meters"           │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Rider Completes Stop                │
│ - Mark stop as complete             │
│ - Move to next stop                 │
│ - Update progress bar               │
└─────────────┬───────────────────────┘
              │
              │ All stops complete?
              ▼
┌─────────────────────────────────────┐
│ Navigate to DeliveryComplete        │
│ - Show earnings: ₹142               │
│ - Show stats                        │
│ - Update rider profile              │
└─────────────────────────────────────┘
```

## 🔐 AUTHENTICATION FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION SYSTEM                     │
└─────────────────────────────────────────────────────────────┘

User enters phone/email + password
    │
    ▼
┌─────────────────────────────────────┐
│ LoginScreen.tsx                     │
│ - Validate input                    │
│ - Call API                          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ POST /api/auth/login                │
│ Body: { phone, password }           │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ authController.login()              │
│ 1. Find user in MongoDB             │
│ 2. Compare password (bcrypt)        │
│ 3. Generate JWT token               │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ JWT Token Generated                 │
│ Payload:                            │
│ {                                   │
│   userId: "679f1234...",            │
│   role: "rider",                    │
│   exp: 1735689600                   │
│ }                                   │
│ Signed with: JWT_SECRET             │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Response to Frontend                │
│ {                                   │
│   token: "eyJhbGc...",              │
│   user: { id, name, role }          │
│ }                                   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Frontend: Store Token               │
│ localStorage.setItem('token', ...)  │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ All Subsequent API Calls            │
│ Header:                             │
│ Authorization: Bearer eyJhbGc...    │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Backend: Verify JWT Middleware      │
│ 1. Extract token from header        │
│ 2. Verify signature                 │
│ 3. Check expiration                 │
│ 4. Attach user to req.user          │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Protected Route Handler             │
│ Access req.user.id, req.user.role   │
└─────────────────────────────────────┘
```

## 📊 DATA FLOW LAYERS

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYERED ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Frontend)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Components   │  │ Hooks        │  │ Stores       │      │
│  │ - Screens    │  │ - useSpaceDB │  │ - Zustand    │      │
│  │ - UI         │  │ - useVoice   │  │ - State      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP / WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  API LAYER (Backend)                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Routes       │  │ Controllers  │  │ Middleware   │      │
│  │ - /auth      │  │ - Business   │  │ - JWT Auth   │      │
│  │ - /riders    │  │   Logic      │  │ - CORS       │      │
│  │ - /matching  │  │              │  │ - Error      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Service Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  SERVICE LAYER (Backend)                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Matching     │  │ ArmorIQ      │  │ Maps         │      │
│  │ Service      │  │ Service      │  │ Service      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ SpacetimeDB  │  │ ElevenLabs   │                        │
│  │ Service      │  │ Service      │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Database / API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ MongoDB      │  │ SpacetimeDB  │  │ External     │      │
│  │ - Users      │  │ - Real-time  │  │ APIs         │      │
│  │ - Riders     │  │ - Sync       │  │ - Google     │      │
│  │ - Orders     │  │              │  │ - ArmorIQ    │      │
│  │ - Matches    │  │              │  │ - ElevenLabs │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 COMPLETE USER JOURNEY

```
┌─────────────────────────────────────────────────────────────┐
│              COMPLETE USER JOURNEY (3 DEVICES)              │
└─────────────────────────────────────────────────────────────┘

TIME: 0:00
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Zomato User  │  │ Rapido User  │  │ Rider        │
│ Opens app    │  │ Opens app    │  │ Opens app    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │ Browse food     │ Enter pickup    │ Login
       │ Add to cart     │ Enter drop      │ Dashboard
       │                 │                 │

TIME: 0:30
       │                 │                 │
       │ Checkout        │                 │
       │ See "Flexible"  │                 │
       │ option          │                 │
       │ (Save ₹42)      │                 │
       │                 │                 │
       ▼                 │                 │
   Click "Order         │                 │
   with Flexible"       │                 │
       │                 │                 │
       │ → SpacetimeDB   │                 │
       │   order_status  │                 │
       │                 │                 │
   "Waiting for         │                 │
    match..."           │                 │

TIME: 1:00
                        │                 │
                        │ See "Flexible"  │
                        │ option          │
                        │ (Save ₹28)      │
                        │                 │
                        ▼                 │
                    Click "Book          │
                    Flexible Ride"       │
                        │                 │
                        │ → SpacetimeDB   │
                        │   order_status  │
                        │                 │
                    "Finding rider..."   │

TIME: 1:02 (Matching happens)
       │                 │                 │
       │ ← SpacetimeDB ← │ ← SpacetimeDB ← │
       │   match_789     │   match_789     │   match_789
       │                 │                 │
   "Rider found!"   "Ride matched!"   🔔 POPUP!
   "ETA 15 min"     "Driver coming"   "₹142 earnings"
                                          "84% overlap"

TIME: 1:05
                                          │
                                          ▼
                                      Accept Match
                                          │
                                          ▼
   "Rider: Raj"     "Rider: Raj"     OrderDetail
   "Arriving..."    "Arriving..."     "Start Nav"

TIME: 1:20 (Rider arrives at Pickup 1)
       │                 │                 │
   "Rider arrived"      │             ActiveNavigation
   "Order picked"       │             "Turn left..."
                        │             Voice guide

TIME: 1:35 (Rider arrives at Pickup 2)
       │                 │                 │
       │            "Rider arrived"    "Pickup 2"
       │            "Ride started"     "Next: Drop 1"

TIME: 1:50 (Rider at Drop 1)
       │                 │                 │
   "Order delivered"    │             "Drop 1 complete"
   ⭐⭐⭐⭐⭐            │             "Next: Drop 2"
       │                 │                 │
       ▼                 │                 │
   OrderComplete        │                 │
   "Saved ₹42"          │                 │

TIME: 2:05 (Rider at Drop 2)
                        │                 │
                    "Ride complete"   "All stops done"
                    ⭐⭐⭐⭐⭐         │
                        │                 │
                        ▼                 ▼
                    RideComplete     DeliveryComplete
                    "Saved ₹28"      "Earned ₹142"
                                     "Back to Dashboard"
```

---

**This visual architecture shows:**
- ✅ Complete system flow across 3 devices
- ✅ Real-time synchronization mechanism
- ✅ Matching algorithm step-by-step
- ✅ Navigation and voice guidance
- ✅ Authentication and security
- ✅ Layered architecture
- ✅ End-to-end user journey with timestamps
