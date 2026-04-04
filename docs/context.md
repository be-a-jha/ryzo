# CONTEXT.md — RYZO Complete Project Reference
# Version: Web Edition
# Last Updated: Hackathon Build

---

## 1. WHAT IS RYZO

RYZO is a single-webpage application that demonstrates an
AI-powered unified delivery and ride efficiency engine.
It is built as a proof-of-concept for a system that sits
as a middleware layer on top of existing fragmented delivery
and ride platforms — connecting them into one intelligent
network without replacing any of them.

The webpage shows three phone UIs simultaneously on a single
browser screen — representing three separate apps working
together as one ecosystem.

---

## 2. THE WEBPAGE LAYOUT

The entire product is presented on one webpage with a
three-phone UI layout:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   [ZOMATO CLONE]    [RYZO MAIN APP]    [RAPIDO CLONE]   │
│                                                         │
│   Left Phone        Center Phone       Right Phone      │
│   Food delivery     Bridge + Rider     Ride booking     │
│   user interface    dashboard hub      user interface   │
│                                                         │
└─────────────────────────────────────────────────────────┘

### Left Phone — Zomato Clone
A food delivery app interface showing an order/checkout page.
Standard Zomato-style UI. Key addition: an extra
"Flexible Delivery" button on the checkout screen that
appears after RYZO integration. When tapped it shows:
- Estimated discount (e.g. ₹42 off)
- Estimated extra wait time (e.g. +8 minutes)
- "Powered by RYZO" label

### Center Phone — RYZO Main App
The full RYZO application with complete navigation flow
for both user and rider roles. This is the primary product
being built. Contains:
- Full onboarding and role selection
- User integration flow (connect delivery apps)
- Rider integration flow (connect rider apps)
- Rider dashboard (unlocked after 2+ integrations)
- Live order pings with AI route comparison
- Active navigation with ElevenLabs voice UI

### Right Phone — Rapido Clone
A ride booking app interface showing a booking/destination
screen. Standard Rapido-style UI. Key addition: a
"Flexible Ride" button that appears after RYZO integration.
When tapped it shows:
- Estimated discount on ride fare
- Estimated extra wait time
- "Powered by RYZO" label

---

## 3. DESIGN SYSTEM

### Philosophy
Apple-inspired. Minimal. Premium. Dark mode only.
Clean like it costs money. Every pixel is intentional.

### Color Tokens
--color-bg-primary:    #000000   (pure black, all backgrounds)
--color-bg-surface:    #111111   (cards, elevated surfaces)
--color-bg-input:      #1A1A1A   (inputs, secondary buttons)
--color-border:        #2A2A2A   (card borders, dividers)
--color-text-primary:  #FFFFFF   (headings, primary content)
--color-text-secondary:#888888   (labels, metadata, captions)
--color-text-muted:    #555555   (timestamps, legal, hints)
--color-accent:        #FC8019   (Swiggy Orange — CTAs only)
--color-success:       #22C55E   (integrated/confirmed states)
--color-error:         #EF4444   (error states only)

### Orange Rule
#FC8019 is used ONLY on:
- Primary CTA buttons (most important action per screen)
- Active state indicators (online toggle, live ping border)
- Integration success moments (briefly, then settles green)
- RYZO logo accent mark
- AI badge/chip labels
- Active bottom nav icon

NEVER used as: large background fills, headers,
card backgrounds, or decorative elements.

### Typography
- Font Family: Inter (Google Fonts, loaded via Next.js)
- H1: 32px, 700 weight, #FFFFFF, letter-spacing -0.5px
- H2: 24px, 700 weight, #FFFFFF
- H3: 18–20px, 600 weight, #FFFFFF
- Body: 14–15px, 400 weight, #FFFFFF or #888888
- Label: 11–13px, 500 weight, uppercase, letter-spacing 0.8px
- Mono: For numbers/stats — tabular nums

### Components
- Cards: bg #111111, border 1px #2A2A2A, radius 16px, p-4
- Primary Button: bg #FFFFFF, text #000000, h-13, radius-xl
- Orange Button: bg #FC8019, text #000000 bold, h-13, radius-xl
- Secondary Button: bg #1A1A1A, text #FFFFFF, border #2A2A2A
- Input: bg #1A1A1A, border #2A2A2A, text #FFFFFF,
  placeholder #555555, radius-xl, h-13
- Badge/Chip: bg #1A1A1A, border #FC8019 or #2A2A2A,
  text 11px, radius-full, px-2 py-1
- Bottom Nav: bg #0D0D0D, border-top #1E1E1E

### Motion
- Page transitions: fade + slide, 250ms ease-out
- Card tap: scale(0.97), 100ms
- Integration success: orange pulse → green settle, 600ms
- Order ping border: pulsing orange glow, 1.5s infinite
- Waveform bars: bounce animation, staggered, infinite

---

## 4. SCREEN INVENTORY — RYZO CENTER PHONE

### Screen 1 — Splash
- Pure black, RYZO logo centered (48px bold, letter-spacing)
- Tagline: "One Rider. Every Platform." in #888888
- Orange loading bar animating bottom
- Auto-advances to Screen 2 after 2s

### Screen 2 — Google Login
- RYZO logo + "Welcome back." heading
- "Continue with Google" button (#1A1A1A + Google G icon)
- "Create an account" button (white bg, black text)
- Terms copy at bottom in #555555
- Both buttons → Screen 3

### Screen 3 — Role Selection
- Greeting: "Hello, [name] 👋"
- Two large tappable cards:
  Card A: Shopping bag icon, "I'm a User"
         "Order food and rides across all your apps"
         → Screen 4 (User flow)
  Card B: Motorcycle icon, "I'm a Rider"
         "Get unified orders and maximize earnings"
         → Screen 7 (Rider flow)

### Screen 4 — User App Integration
- Header: "Connect Your Apps"
- Subtext about adding a smarter layer
- "DETECTED ON YOUR DEVICE" section label
- Scrollable list of mock delivery apps:
  - Swiggy (orange logo)
  - Zomato (red logo)
  - Blinkit (yellow logo)
  - Zepto (purple logo)
  - Dunzo (green logo)
- Each app card has "Add" button (orange border, orange text)
- Fixed "Continue" button at bottom (disabled until 1+ added)
- Tapping "Add" → Screen 5

### Screen 5 — In-App Login (Modal Sheet)
- Slides up from bottom as a modal
- Shows specific delivery app's logo + name
- Mock login form: phone/email + password inputs
- CTA button uses app's brand color
  (Swiggy=#FC8019, Zomato=#E23744, Blinkit=#F9D100)
- Tapping login → Screen 6

### Screen 6 — Integration Success (Returns to Screen 4)
- App card updates: "Add" → green checkmark + "Integrated"
- Card border turns green (#22C55E)
- Subtle green glow on card
- Toast notification slides from top: "Swiggy linked ✓"

### Screen 7 — Rider App Integration
- Same structure as Screen 4 but for rider-side apps:
  - Zomato Delivery Partner (red)
  - Swiggy Delivery (orange)
  - Blinkit Partner (yellow)
  - Rapido Captain (blue)
  - Porter Partner (dark blue)
- Progress indicator: "0 of 5 connected"
- Lock indicator: "Connect 2+ apps to unlock Dashboard"
- At 2+ integrations: lock turns orange, banner slides up
  "Your Rider Dashboard is ready →" → Screen 8

### Screen 8 — Rider Dashboard
The core rider experience. Premium live-feeling interface.

TOP STRIP:
- Greeting: "Good morning, Rahul 👋"
- Profile avatar (initials, orange border ring)

EARNINGS CARD:
- "Today's Earnings: ₹847"
- "Orders: 6"
- Orange progress bar: "68% of daily goal"

ONLINE TOGGLE:
- Large pill-shaped toggle, currently ONLINE (green glow)

INCOMING ORDERS SECTION:
- "INCOMING ORDERS" label with pulsing orange dot

ORDER PING CARD 1 (Unified — Active):
- Orange border with pulsing glow animation
- Platform chips: [SWIGGY] [RAPIDO] side by side
- "UNIFIED ORDER" badge in orange
- Pickup: "McDonald's, Arera Colony"
- Drop: "Hoshangabad Rd, BHEL"
- Stats row: 4.2 km | ₹94 Combined | 18 min Est.
- "🤖 AI Optimized Route" chip
- Two buttons: "Decline" (secondary) | "Accept" (#FC8019)
- Countdown: "Expires in 0:28"
- Tapping Accept → Screen 9

ORDER PING CARD 2 (Standard):
- No orange border, single platform
- Normal order appearance

BOTTOM NAV:
- 4 tabs: Home (active/orange) | Map | Earnings | Profile

### Screen 9 — Order Detail / AI Comparison
- Header: "Order Details" + "AI Pick 🤖" orange badge

MAP SECTION:
- Dark-themed map mock (220px height)
- Three route lines:
  Blue = Swiggy only route
  Red = Rapido only route
  Orange (thick, glowing) = RYZO AI optimized
- Legend bottom-right of map

COMPARISON TABLE:
| Metric    | Swiggy | Rapido | RYZO AI |
|-----------|--------|--------|---------|
| Distance  | 5.1km  | 4.8km  | 3.9km ✓ |
| Earnings  | ₹52    | ₹48    | ₹94 ✓  |
| Time      | 22min  | 20min  | 17min ✓|
| Fuel Est. | ₹18    | ₹16    | ₹13 ✓  |

RYZO AI column: orange header, green checkmarks on wins

AI INSIGHT CARD:
- Orange border card
- "🤖 Taking this unified order saves 1.2km and earns ₹42
  more. Recommended sequence: McDonald's first, then BHEL."

CTA: "Start Navigation" → Screen 10

### Screen 10 — Active Navigation
VOICE BANNER (ElevenLabs):
- Animated orange waveform bars (5 bars bouncing)
- "🔊 Voice Navigation Active"
- Current instruction in orange: "Turn right in 200m"
- "Powered by ElevenLabs" attribution in #555555

MAP (45% height):
- Dark map, orange animated rider dot
- Dotted orange route path
- Destination pin

STOPS PROGRESS (horizontal stepper):
● Stop 1: "McDonald's — Pickup" DONE (green)
● Stop 2: "BHEL — Drop Food" CURRENT (orange)
● Stop 3: "MP Nagar — Pickup Rider" UPCOMING (grey)
● Stop 4: "Sarvadharm — Drop Rider" UPCOMING (grey)

BOTTOM CARD:
- "Next Stop: BHEL Sector"
- "0.8 km away | ~6 min"
- "Mark as Delivered" button (white bg, black text)
- "Report an issue" link in #888888

---

## 5. SCREENS — ZOMATO CLONE (LEFT PHONE)

Single screen: Order/Checkout page

### Standard Zomato-style checkout:
- Restaurant name, items ordered, pricing breakdown
- Standard delivery button (full width, red #E23744)

### RYZO Integration Layer (shown when RYZO connected):
An extra card appears ABOVE the standard checkout button:
┌──────────────────────────────────────────────┐
│  ⚡ Flexible Delivery          Save ₹42      │
│  Wait ~8 min more for a guaranteed discount   │
│  ─────────────────────────────────────────── │
│  [RYZO Flexible — ₹42 off]    Powered by RYZO│
└──────────────────────────────────────────────┘

Card: bg #111111, border 1px #FC8019, radius 12px
The orange button triggers the RYZO matching engine.
Standard red "Order Now" button remains below.

---

## 6. SCREENS — RAPIDO CLONE (RIGHT PHONE)

Single screen: Ride booking / destination confirmed page

### Standard Rapido-style booking:
- Pickup location, destination
- Ride type selection (Bike, Auto, Cab)
- Standard "Book Now" button (blue)

### RYZO Integration Layer (shown when RYZO connected):
An extra card appears ABOVE the standard booking button:
┌──────────────────────────────────────────────┐
│  ⚡ Flexible Ride              Save ₹28      │
│  Wait ~6 min for a discounted fare            │
│  ─────────────────────────────────────────── │
│  [RYZO Flexible — ₹28 off]    Powered by RYZO│
└──────────────────────────────────────────────┘

Same styling as Zomato card. Orange border, orange CTA button.

---

## 7. COMPLETE TECH STACK

### Frontend
Framework:    Next.js 16.2.2 (App Router)
Language:     TypeScript
Styling:      Tailwind CSS v4
Animation:    Framer Motion (latest)
Icons:        Lucide React (latest)
State:        Zustand (latest)
Maps:         @react-google-maps/api (latest)
Real-time:    spacetimedb@2.1.0
Voice UI:     @elevenlabs/react (latest)
Auth:         NextAuth.js (latest) — Google OAuth
HTTP:         Axios (latest)
Utilities:    clsx, tailwind-merge, date-fns

### Backend
Runtime:      Node.js >= 22.x
Framework:    Express (latest)
Language:     TypeScript
Database:     MongoDB Atlas via Mongoose 9.x
AI/Matching:  @google/generative-ai (Gemini)
AI Agent:     ArmorIQ API (REST)
Voice:        @elevenlabs/elevenlabs-js 2.39.0
Real-time:    spacetimedb 2.1.0
Auth:         JWT + bcryptjs
Validation:   Zod
Security:     Helmet, CORS
Logging:      Morgan
Dev Tools:    ts-node, nodemon

### Infrastructure
Backend Host: Vultr Compute Instance
Database:     MongoDB Atlas (cloud)
Maps API:     Google Maps Platform
AI API:       Google Gemini API
Voice API:    ElevenLabs API
Agent:        ArmorIQ
Real-time DB: SpacetimeDB

---

## 8. FOLDER STRUCTURE
ryzo/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              ← Main webpage (3-phone layout)
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ryzo/
│   │   │   │   ├── SplashScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RoleSelection.tsx
│   │   │   │   ├── UserIntegration.tsx
│   │   │   │   ├── InAppLogin.tsx
│   │   │   │   ├── RiderIntegration.tsx
│   │   │   │   ├── RiderDashboard.tsx
│   │   │   │   ├── OrderDetail.tsx
│   │   │   │   └── ActiveNavigation.tsx
│   │   │   ├── zomato-clone/
│   │   │   │   └── ZomatoCheckout.tsx
│   │   │   ├── rapido-clone/
│   │   │   │   └── RapidoBooking.tsx
│   │   │   └── shared/
│   │   │       ├── PhoneFrame.tsx    ← Reusable phone shell
│   │   │       ├── AppCard.tsx
│   │   │       ├── OrderPingCard.tsx
│   │   │       └── VoiceBanner.tsx
│   │   ├── hooks/
│   │   │   ├── useSpacetimeDB.ts
│   │   │   ├── useRiderDashboard.ts
│   │   │   └── useMatching.ts
│   │   ├── store/
│   │   │   ├── ryzoStore.ts          ← Zustand global state
│   │   │   └── matchingStore.ts
│   │   ├── lib/
│   │   │   ├── api.ts                ← Axios instance + endpoints
│   │   │   ├── spacetimedb.ts
│   │   │   └── mockData.ts           ← All mock data centralized
│   │   └── types/
│   │       ├── order.ts
│   │       ├── rider.ts
│   │       ├── match.ts
│   │       └── platform.ts
│   └── .env.local
│
└── backend/
├── src/
│   ├── index.ts                  ← Express server entry
│   ├── config/
│   │   ├── db.ts                 ← MongoDB Atlas connection
│   │   └── env.ts                ← Env validation via Zod
│   ├── models/
│   │   ├── User.ts
│   │   ├── Rider.ts
│   │   ├── Order.ts
│   │   └── Match.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── orders.ts
│   │   ├── riders.ts
│   │   └── matching.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── orderController.ts
│   │   ├── riderController.ts
│   │   └── matchingController.ts
│   ├── services/
│   │   ├── geminiService.ts      ← Route overlap calculation
│   │   ├── elevenLabsService.ts  ← Voice generation
│   │   └── spacetimeService.ts   ← Real-time push
│   ├── agents/
│   │   └── armoriqAgent.ts       ← Matching rules engine
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   └── utils/
│       ├── geoUtils.ts           ← Distance/overlap helpers
│       └── responseUtils.ts
└── .env

---

## 9. DATA MODELS

### Order
```typescript
{
  _id: ObjectId,
  userId: string,
  platform: 'swiggy' | 'zomato' | 'blinkit' | 'zepto',
  type: 'delivery' | 'ride',
  deliveryType: 'instant' | 'flexible',
  status: 'pending' | 'matching' | 'matched' | 'active' | 'completed',
  pickup: { lat: number, lng: number, address: string },
  drop: { lat: number, lng: number, address: string },
  originalFare: number,
  discountedFare: number,
  matchWindowExpiry: Date,
  matchId: ObjectId | null,
  createdAt: Date
}
```

### Rider
```typescript
{
  _id: ObjectId,
  name: string,
  integratedPlatforms: string[],
  currentLocation: { lat: number, lng: number },
  status: 'online' | 'offline' | 'on_task',
  currentTasks: ObjectId[],      // max 2
  todayEarnings: number,
  todayOrders: number,
  dailyGoal: number,
  createdAt: Date
}
```

### Match
```typescript
{
  _id: ObjectId,
  riderId: ObjectId,
  orderIds: ObjectId[],          // [deliveryOrderId, rideOrderId]
  platforms: string[],           // ['swiggy', 'rapido']
  overlapScore: number,          // 0–100, from Gemini
  combinedRoute: RouteStep[],    // AI-optimized stop sequence
  detourPercentage: number,
  combinedEarnings: number,
  individualEarnings: number[],
  timeSavedMinutes: number,
  fuelSavedKm: number,
  status: 'proposed' | 'accepted' | 'rejected' | 'completed',
  agentDecisionLog: AgentDecision[],
  createdAt: Date
}
```

---

## 10. AI MATCHING ENGINE — ARMORIQ AGENT

The matching engine is built as an ArmorIQ AI agent.
It is the brain of RYZO. All match decisions pass through it.

### Agent Rules (Enforced by ArmorIQ)

ALLOWED actions:
- Match two orders when route overlap >= 70%
- Assign combined task when rider detour <= 30%
- Trigger fallback when time window expires
- Accept third order ONLY if detour <= 10%

BLOCKED actions:
- Match when any time constraint would be violated
- Assign to rider already carrying 2 active tasks
- Override rider's OFFLINE status
- Match orders with < 70% route overlap
- Accept match if combined distance > 2x original

FALLBACK triggers:
- Auto-revert to standard delivery after time window
- Notify user of fallback in real time via SpacetimeDB

### Agent Decision Log (visible in demo)
Each match decision generates a log entry:
```json
{
  "timestamp": "2025-04-04T14:32:11Z",
  "action": "MATCH_APPROVED",
  "reason": "Overlap 84%, detour 12%, time constraint met",
  "overlapScore": 84,
  "detourPct": 12,
  "riderCapacity": "1/2 tasks"
}
```
This log is shown live in the rider dashboard.

---

## 11. GEMINI AI USAGE

### Use 1: Route Overlap Scoring
Input: Two arrays of lat/lng coordinates (route A, route B)
Prompt: Analyze these two delivery routes and return:

Overlap percentage (0-100)
Optimal stop sequence for combined completion
Estimated combined distance vs individual distances
Output: JSON with overlapScore, stopSequence, distanceSavings


### Use 2: Natural Language Match Explanation
Input: Match data object
Output: One-sentence human-readable recommendation shown
in the AI Insight Card on Screen 9
Example: "Taking this unified order saves 1.2km and earns
₹42 more than either order separately."

---

## 12. SPACETIMEDB — REAL-TIME SYNC

Three clients connect simultaneously to SpacetimeDB:
1. Zomato clone (user watching order status)
2. Rapido clone (user watching ride status)
3. RYZO rider dashboard (rider watching incoming orders)

### Tables synced in real-time:
- `active_matches` — when match forms, all clients update
- `order_status` — delivery/ride status changes
- `rider_location` — rider position on map
- `agent_decisions` — live ArmorIQ decision log

### The Demo Moment:
Trigger a match → all three phone UIs update simultaneously:
- Zomato clone: "Flexible rider found! ₹42 saved"
- Rapido clone: "Flexible ride matched! ₹28 saved"
- RYZO dashboard: New unified order ping appears with
  orange border and ElevenLabs voice plays out loud

---

## 13. ELEVENLABS — VOICE NAVIGATION

### Usage: Rider navigation voice commands
Triggered when rider accepts an order and starts navigation.

### Voice Script Templates:
- Match found: "New unified order matched. Pickup at
  [restaurant], drop at [address]. Combined route
  saves [X]km. Extra earning: ₹[amount]."
- Navigation: "In [distance], turn [direction] onto
  [street name]."
- Stop arrival: "You have arrived at stop [N].
  [Action: Pick up food / Drop off rider]."
- Fallback: "No match found. Proceeding with
  standard delivery."

### Frontend representation:
- Animated waveform (5 orange bars, staggered bounce)
- Current instruction text in orange
- "Powered by ElevenLabs" attribution
- Audio plays via browser Web Audio API

---

## 14. MOCK DATA (for frontend demo)

All frontend mock data lives in `/src/lib/mockData.ts`

### Mock Apps (User side)
Swiggy, Zomato, Blinkit, Zepto, Dunzo

### Mock Apps (Rider side)
Zomato Delivery, Swiggy Delivery, Blinkit Partner,
Rapido Captain, Porter Partner

### Mock Rider Profile
Name: Rahul Kumar | Today: ₹847 | Orders: 6 | Goal: 68%

### Mock Unified Order Ping
Platform: Swiggy + Rapido | Distance: 4.2km
Earnings: ₹94 combined | Time: 18 min | Overlap: 84%
Pickup: McDonald's, Arera Colony, Bhopal
Drop 1: BHEL Sector (food)
Drop 2: Sarvadharm Colony (rider)

### Mock Comparison Table
Swiggy: 5.1km, ₹52, 22min, ₹18 fuel
Rapido: 4.8km, ₹48, 20min, ₹16 fuel
RYZO AI: 3.9km, ₹94, 17min, ₹13 fuel ← all wins

---

## 15. NAVIGATION FLOW
Screen 1 (Splash)
└──auto──► Screen 2 (Login)
└──tap──► Screen 3 (Role Selection)
├──"User"──► Screen 4 (User Integration)
│             └──"Add"──► Screen 5 (In-App Login)
│                          └──login──► Screen 6
│                                       (back to S4)
└──"Rider"─► Screen 7 (Rider Integration)
└──2+ apps──► Screen 8 (Dashboard)
└──Accept──► Screen 9
└──Start──►
Screen 10

---

## 16. API ENDPOINTS

### Auth
POST   /api/auth/google          ← Google OAuth callback
POST   /api/auth/refresh         ← Refresh JWT

### Orders
POST   /api/orders               ← Create new flexible order
GET    /api/orders/:id           ← Get order status
PATCH  /api/orders/:id/status    ← Update order status

### Riders
GET    /api/riders/nearby        ← Find riders near coordinates
PATCH  /api/riders/:id/location  ← Update rider location
PATCH  /api/riders/:id/status    ← Toggle online/offline

### Matching
POST   /api/matching/trigger     ← Trigger matching for an order
GET    /api/matching/:id         ← Get match details + agent log
POST   /api/matching/:id/accept  ← Rider accepts match
POST   /api/matching/:id/decline ← Rider declines match

### Voice
POST   /api/voice/generate       ← Generate ElevenLabs audio
  Body: { text: string, type: 'match' | 'nav' | 'arrival' }

---

## 17. SPONSOR INTEGRATIONS (Demo-visible)

| Sponsor     | Where visible in demo                          |
|-------------|------------------------------------------------|
| Gemini      | Overlap score "84%" on Screen 9 comparison     |
| ArmorIQ     | Agent decision log on rider dashboard          |
| MongoDB     | Geospatial rider query shown in network tab    |
| SpacetimeDB | All 3 phones update simultaneously on match    |
| ElevenLabs  | Voice plays out loud, waveform on Screen 10    |
| Vultr       | Live URL shown at demo — not localhost         |
| ROVO        | 3 blog posts written throughout hackathon      |

---

## 18. THE DEMO SCRIPT (60 seconds)

"Every day in Indian cities, the same roads are traveled
twice — by different riders, serving different apps.
RYZO fixes that."

[Point to left phone] "Priya orders biryani on Zomato.
She picks Flexible — okay with 8 extra minutes for ₹42 off."

[Point to center phone — matching screen]
"Gemini AI finds Rahul — already heading 84% the same route.
ArmorIQ checks: detour under 30%? Yes. Match approved."

[Trigger match live — all 3 phones update simultaneously]
"Watch. Three apps. One moment."

[ElevenLabs voice plays through speakers]
"Rahul hears it hands-free. He earns ₹94 instead of ₹52."

[Point to comparison table on Screen 9]
"Less distance. More money. One rider. This is RYZO."

"Live right now at [Vultr URL]."

---

## 19. WHAT JUDGES SEE IN 60 SECONDS

1. Three phones on screen → immediately understood as system
2. Flexible button on Zomato/Rapido → clear user value
3. Matching animation → AI doing something visible
4. Three-phone simultaneous update → SpacetimeDB wow moment
5. Voice playing in room → ElevenLabs unforgettable
6. Comparison table → data-backed, all metrics won by RYZO
7. Live URL → real deployment, not localhost

---

*This document is the single source of truth for the RYZO
hackathon build. Update it as decisions change during build.*