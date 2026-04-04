# PRD.md — RYZO Product Requirements Document
# Phase-based build plan with RALPH loop passing criteria
# RALPH = Review → Adjust → Lock → Polish → Handoff

---

## What Is the RALPH Loop

Every task in this PRD has a RALPH loop gate.
A task is only "done" when it passes ALL criteria in its loop.

R — REVIEW:    Does it match the spec exactly?
A — ADJUST:    Are there visual/functional issues to fix?
L — LOCK:      Is the output stable and not breaking anything?
P — POLISH:    Does it feel premium (animations, transitions)?
H — HANDOFF:   Is it integrated with the rest of the system?

Never move to the next task until the current passes RALPH.
Never skip criteria because "it's close enough."

---

## Phase Overview

```
Phase 0:  Foundation setup (project init, config, structure)
Phase 1:  Frontend layout shell (3-phone layout, phone frame)
Phase 2:  RYZO center phone — all 10 screens (UI only, mock data)
Phase 3:  Zomato clone left phone (UI only, mock data)
Phase 4:  Rapido clone right phone (UI only, mock data)
Phase 5:  Backend foundation (Express, MongoDB, models, routes)
Phase 6:  Gemini AI integration (route overlap scoring)
Phase 7:  ArmorIQ agent integration (matching rules engine)
Phase 8:  SpacetimeDB integration (real-time sync)
Phase 9:  ElevenLabs integration (voice navigation)
Phase 10: Google Maps integration (route visualization)
Phase 11: End-to-end demo flow (all systems connected)
Phase 12: Polish, deploy, demo prep
```

---

## PHASE 0 — Foundation Setup

### Task 0.1 — Initialize Next.js Frontend

Steps:
1. Run: `npx create-next-app@latest frontend --typescript
   --tailwind --eslint --app --src-dir --import-alias "@/*"`
2. Verify: app runs at localhost:3000 with no errors
3. Remove all default Next.js boilerplate content
4. Set up blank page.tsx with a single div returning null
5. Configure next.config.ts (image domains, etc.)

RALPH Criteria:
- R: `npm run dev` starts without errors or warnings
- A: Default Next.js content fully removed
- L: No TypeScript errors in strict mode
- P: N/A (no UI yet)
- H: Repo committed, .gitignore includes node_modules + .env

---

### Task 0.2 — Tailwind Configuration

Steps:
1. Open tailwind.config.ts
2. Add all RYZO custom colors from BRAND.md as CSS vars
3. Add custom animation keyframes (pulse-orange, waveform,
   slide-up, fade-in, slide-down)
4. Add Inter font via next/font/google in layout.tsx
5. Set globals.css with base CSS variables

globals.css additions:
```css
:root {
  --ryzo-black: #000000;
  --ryzo-surface-1: #111111;
  --ryzo-surface-2: #1A1A1A;
  --ryzo-surface-3: #0D0D0D;
  --ryzo-border: #2A2A2A;
  --ryzo-border-subtle: #1E1E1E;
  --ryzo-text-primary: #FFFFFF;
  --ryzo-text-secondary: #888888;
  --ryzo-text-muted: #555555;
  --ryzo-orange: #FC8019;
  --ryzo-orange-dim: rgba(252,128,25,0.1);
  --ryzo-orange-glow: rgba(252,128,25,0.25);
  --ryzo-success: #22C55E;
  --ryzo-success-dim: rgba(34,197,94,0.1);
  --ryzo-success-glow: rgba(34,197,94,0.15);
}
* { box-sizing: border-box; }
body { background: #000000; color: #FFFFFF; }
```

RALPH Criteria:
- R: All CSS vars defined and accessible in components
- A: Tailwind custom colors resolve correctly in browser
- L: No purge issues — all custom classes appear in build
- P: Font Inter loads correctly (check network tab)
- H: tailwind.config.ts exported and committed

---

### Task 0.3 — Install All Frontend Dependencies

Steps:
```bash
cd frontend
npm install framer-motion@latest
npm install lucide-react@latest
npm install clsx@latest tailwind-merge@latest
npm install @react-google-maps/api@latest
npm install @googlemaps/js-api-loader@latest
npm install spacetimedb@latest
npm install @elevenlabs/react@latest
npm install @elevenlabs/client@latest
npm install next-auth@latest @auth/mongodb-adapter@latest
npm install axios@latest
npm install date-fns@latest
npm install zustand@latest
npm install zod@latest
```

RALPH Criteria:
- R: All packages in package.json
- A: No peer dependency conflicts (resolve if any)
- L: `npm run build` completes without errors
- P: N/A
- H: package-lock.json committed

---

### Task 0.4 — Initialize Express Backend

Steps:
1. `mkdir backend && cd backend && npm init -y`
2. Install all backend dependencies (see TECH_STACK.md)
3. Create tsconfig.json (see TECH_STACK.md)
4. Create src/index.ts with basic Express server
5. Create all folder structure (routes, controllers, etc.)
6. Create .env file with all env var placeholders
7. Test: `npm run dev` starts backend on port 5000

src/index.ts minimal:
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_, res) => {
  res.json({ status: 'ok', service: 'RYZO API' });
});

app.listen(PORT, () => {
  console.log(`RYZO backend running on port ${PORT}`);
});
```

RALPH Criteria:
- R: Server starts, /health returns 200 { status: 'ok' }
- A: No TypeScript errors in strict mode
- L: nodemon restarts correctly on file save
- P: N/A
- H: Backend folder structure committed

---

### Task 0.5 — Zustand Stores Setup

Create three stores:

src/store/ryzoStore.ts:
```typescript
// Controls which screen is active in RYZO center phone
// Tracks: currentScreen (1-10), selectedRole, integratedApps
```

src/store/matchingStore.ts:
```typescript
// Controls match state
// Tracks: matchActive, matchScore, matchData, agentLog
```

src/store/riderStore.ts:
```typescript
// Controls rider dashboard data
// Tracks: earnings, orders, status, incomingPings
```

RALPH Criteria:
- R: All three stores created with correct TypeScript types
- A: No circular dependency issues
- L: Stores importable in any component without error
- P: N/A
- H: Store files committed, exported correctly

---

### Task 0.6 — Mock Data Setup

Create src/lib/mockData.ts with ALL mock data from CONTENT.md:
- Platform apps (user side + rider side)
- Rider profile
- Unified order mock
- Agent decision log mock
- Comparison table data

RALPH Criteria:
- R: All data from CONTENT.md present in mockData.ts
- A: All TypeScript types match the data shapes
- L: No runtime errors when importing mockData
- P: N/A
- H: mockData.ts imported into relevant stores

---

## PHASE 1 — Frontend Layout Shell

### Task 1.1 — Three-Phone Layout Component

Create: src/components/layout/ThreePhoneLayout.tsx

Spec:
- Full viewport width container
- min-h-screen, bg #000000
- Flex row, items-center, justify-center, gap-8
- Subtle RYZO branding header: "RYZO" logo + tagline centered above phones
- Three phone slots: left, center, right
- Each phone label below: "Zomato" | "RYZO" | "Rapido"
- Labels: #555555, 12px, uppercase, letter-spacing

Responsive behavior:
- Desktop (lg+): all three phones visible side by side
- Tablet (md): center phone only visible, left/right hidden
  Show tab switcher: [Zomato] [RYZO] [Rapido] above center

RALPH Criteria:
- R: Three phone slots render in correct horizontal order
- A: Centered on all desktop viewport widths (1280px, 1440px, 1920px)
- L: No layout overflow, no horizontal scroll
- P: Entrance animation — phones fade in from below on page load
- H: Layout component wraps all three phone frames correctly

---

### Task 1.2 — PhoneFrame Component

Create: src/components/layout/PhoneFrame.tsx

Props:
```typescript
interface PhoneFrameProps {
  children: React.ReactNode;
  label: string;         // "Zomato" | "RYZO" | "Rapido"
  variant?: 'light' | 'dark'; // for Zomato (light) vs others (dark)
}
```

Spec:
- Outer shell: bg #1A1A1A, rounded-[44px], shadow-2xl
  custom shadow: 0 32px 80px rgba(0,0,0,0.6)
- Inner screen: bg based on variant, rounded-[36px], overflow-hidden
- Dimensions: w-[320px] h-[680px] (scaled-down phone)
- Status bar (top): mock battery, wifi, time — h-10, px-4
- Home indicator (bottom): thin bar, bg #333333, rounded-full,
  w-16 h-1, centered, mb-2
- Screen area: fills remaining height, overflow-y-auto,
  overflow-x-hidden, scrollbar-hide
- Label: below phone, #555555, 12px, uppercase, mt-3

RALPH Criteria:
- R: Phone frame matches visual spec exactly
- A: Content inside clips correctly (overflow hidden)
- L: No scroll bleed from inner screens to outer page
- P: Subtle depth feel — shadow creates 3D impression
- H: Accepts any children and renders correctly

---

## PHASE 2 — RYZO Center Phone (All 10 Screens)

### Task 2.1 — Screen Router + Navigation

Create screen navigation system inside RYZO phone:
- Uses ryzoStore.currentScreen to determine which screen renders
- Wraps each screen in a fade-in animation
- Back navigation updates store

```typescript
// In ryzoStore: 
navigateTo: (screen: number) => void
goBack: () => void
screenHistory: number[]
```

RALPH Criteria:
- R: navigateTo(n) renders correct screen inside phone
- A: Back navigation works correctly through history
- L: No flicker between screen transitions
- P: Fade + slide transition on every screen change (250ms)
- H: All 10 screens registered in the router

---

### Task 2.2 — Screen 1: Splash

Spec: See PAGES.md Screen 1

RALPH Criteria:
- R: RYZO text, tagline, orange underline accent, loading bar all present
- A: Loading bar animation runs for exactly 2000ms
- L: Auto-navigation to Screen 2 fires exactly once
- P: Fade-out before navigating (screen doesn't snap)
- H: Auto-navigates to Screen 2 via ryzoStore

---

### Task 2.3 — Screen 2: Login

Spec: See PAGES.md Screen 2

RALPH Criteria:
- R: Google button, Sign Up button, divider, terms text all present
- A: Google G icon renders as SVG (colorful)
- L: Both buttons navigate to Screen 3 on tap
- P: Buttons have scale(0.97) tap animation
- H: Uses ryzoStore.navigateTo(3)

---

### Task 2.4 — Screen 3: Role Selection

Spec: See PAGES.md Screen 3

RALPH Criteria:
- R: Two role cards with correct icons, titles, subtitles
- A: Arrow icon visible on right of each card
- L: User card → Screen 4, Rider card → Screen 7
- P: Card has hover/tap state (border brightens slightly)
- H: Sets ryzoStore.selectedRole on tap

---

### Task 2.5 — Screen 4: User App Integration

Spec: See PAGES.md Screen 4

RALPH Criteria:
- R: All 5 mock apps shown with correct logos + "Add" buttons
- A: App logos are colored correctly (not generic)
- L: Continue button disabled at 0 apps, active at 1+
- P: App cards enter with staggered fade animation
- H: Tapping "Add" opens Screen 5 modal, sets current app

---

### Task 2.6 — Screen 5: In-App Login Modal

Spec: See PAGES.md Screen 5

RALPH Criteria:
- R: Modal slides up from bottom, handle pill visible
- A: App name + logo shown correctly in modal header
- L: Form inputs styled correctly, eye icon on password
- P: Backdrop darkens correctly, modal slides smoothly (300ms)
- H: Login tap navigates to Screen 6, closes modal

---

### Task 2.7 — Screen 6: Integration Success

Spec: See PAGES.md Screen 6

RALPH Criteria:
- R: App card shows green checkmark + "Integrated" state
- A: Toast slides from top and auto-dismisses in 2s
- L: Previously integrated apps retain their state
- P: Green glow on card, orange pulse settles to green (600ms)
- H: Updates ryzoStore.integratedApps array

---

### Task 2.8 — Screen 7: Rider App Integration

Spec: See PAGES.md Screen 7

RALPH Criteria:
- R: All 5 rider apps shown, progress counter works
- A: Lock icon visible, turns orange at 2+ integrations
- L: Unlock banner slides up exactly when 2nd app integrated
- P: Progress bar animates smoothly on each integration
- H: Banner tap navigates to Screen 8, sets ryzoStore.selectedRole = 'rider'

---

### Task 2.9 — Screen 8: Rider Dashboard

Spec: See PAGES.md Screen 8

This is the most complex screen. Build in sub-tasks:

Sub-task 2.9a — Earnings card + online toggle
Sub-task 2.9b — Unified order ping card 1 (orange border, pulsing)
Sub-task 2.9c — Standard order ping card 2
Sub-task 2.9d — Agent decision log (expandable)
Sub-task 2.9e — Bottom navigation bar

RALPH Criteria:
- R: All elements from spec present exactly as described
- A: Orange border pulse animation runs continuously
- L: "Accept" button on Card 1 navigates to Screen 9
  "Decline" removes the card from view
- P: Ping cards stagger-animate in on load
  Countdown timer on Card 1 counts down in real-time
- H: Order data comes from matchingStore, updates
  when SpacetimeDB pushes a new match (Phase 8)

---

### Task 2.10 — Screen 9: Order Detail / AI Comparison

Spec: See PAGES.md Screen 9

RALPH Criteria:
- R: Map section, comparison table, AI insight card all present
- A: RYZO AI column has orange header, green checkmarks on wins
- L: All comparison values match CONTENT.md mock data
- P: Table rows fade in sequentially for visual effect
- H: "Start Navigation" → Screen 10, Google Maps renders (Phase 10)

---

### Task 2.11 — Screen 10: Active Navigation

Spec: See PAGES.md Screen 10

RALPH Criteria:
- R: Voice banner with waveform, stops progress, map, bottom sheet
- A: Waveform bars animate continuously (staggered bounce)
- L: Stop 1 shows as DONE (green), Stop 2 as CURRENT (orange)
- P: "Mark as Delivered" tap advances to next stop with animation
- H: Voice banner connected to ElevenLabs (Phase 9)

---

## PHASE 3 — Zomato Clone (Left Phone)

### Task 3.1 — Zomato Checkout Screen

Spec: See PAGES.md Left Phone

RALPH Criteria:
- R: All mock order items, pricing breakdown, address present
- A: Zomato red branding used correctly (header, button)
- L: Light mode background (#FFFFFF) inside phone only
- P: Standard Zomato-like visual feel — clean, practical
- H: RYZO integration card visible, triggers matching when clicked

---

### Task 3.2 — RYZO Injection Card (Zomato)

The orange RYZO card overlaid in the Zomato checkout.

RALPH Criteria:
- R: ⚡ icon, "Flexible Delivery", savings chip, subtext, button all present
- A: Card uses dark theme (#111111) inside the light Zomato screen
  creating intentional visual contrast — RYZO feels like an overlay
- L: "Order with Flexible Delivery" triggers matchingStore.triggerMatch()
- P: Card has subtle entrance animation (slide up from below)
- H: Button dispatches matching event to backend (Phase 11)

---

## PHASE 4 — Rapido Clone (Right Phone)

### Task 4.1 — Rapido Booking Screen

Spec: See PAGES.md Right Phone

RALPH Criteria:
- R: Pickup, drop, distance, ride types, pricing all present
- A: Rapido blue branding (#1A6FE8) used correctly
- L: Dark mode inside Rapido phone, ride type selection works
- P: Static map thumbnail shows route between pins
- H: RYZO injection card visible

---

### Task 4.2 — RYZO Injection Card (Rapido)

RALPH Criteria:
- R: ⚡ icon, "Flexible Ride", savings chip, subtext, button present
- A: Same dark card styling as Zomato injection card
- L: "Book Flexible Ride" triggers matchingStore.triggerMatch()
- P: Same entrance animation as Zomato card
- H: Coordinates with Zomato trigger — both can initiate matching

---

## PHASE 5 — Backend Foundation

### Task 5.1 — MongoDB Atlas Connection

Create: src/config/db.ts

```typescript
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI!;
  await mongoose.connect(uri);
  console.log('MongoDB Atlas connected');
};
```

RALPH Criteria:
- R: Connection established on server start
- A: Connection error throws with clear message
- L: Mongoose connection events logged (connected, error, disconnected)
- P: N/A
- H: connectDB() called in index.ts before app.listen()

---

### Task 5.2 — Mongoose Models

Create all four models with full TypeScript interfaces:

User.ts — fields: googleId, email, name, avatar,
  integratedPlatforms[], role, createdAt

Rider.ts — fields: name, email, integratedPlatforms[],
  currentLocation {lat, lng}, status, currentTasks[],
  todayEarnings, todayOrders, dailyGoal, createdAt

Order.ts — fields: userId, platform, type, deliveryType,
  status, pickup {lat, lng, address}, drop {lat, lng, address},
  originalFare, discountedFare, matchWindowExpiry,
  matchId, createdAt
  Index: 2dsphere on pickup.location and drop.location

Match.ts — fields: riderId, orderIds[], platforms[],
  overlapScore, combinedRoute[], detourPercentage,
  combinedEarnings, individualEarnings[], timeSaved,
  fuelSaved, status, agentDecisionLog[], createdAt

RALPH Criteria:
- R: All models created with correct field types
- A: Geospatial index on Order model works for $near queries
- L: No Mongoose schema validation errors on test insert
- P: N/A
- H: All models exported and importable in controllers

---

### Task 5.3 — API Routes Setup

Create all route files and wire to controllers:

routes/auth.ts:     POST /api/auth/google, POST /api/auth/refresh
routes/orders.ts:   POST /api/orders, GET /api/orders/:id,
                    PATCH /api/orders/:id/status
routes/riders.ts:   GET /api/riders/nearby,
                    PATCH /api/riders/:id/location,
                    PATCH /api/riders/:id/status
routes/matching.ts: POST /api/matching/trigger,
                    GET /api/matching/:id,
                    POST /api/matching/:id/accept,
                    POST /api/matching/:id/decline
routes/voice.ts:    POST /api/voice/generate

RALPH Criteria:
- R: All 12 endpoints defined and registered in index.ts
- A: Each endpoint returns appropriate status codes
- L: Test all endpoints with a REST client (Postman/Thunder)
- P: N/A
- H: Error handling middleware catches all unhandled errors

---

### Task 5.4 — Axios Client Setup (Frontend)

Create: src/lib/api.ts

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ryzo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

RALPH Criteria:
- R: Axios instance created with correct baseURL
- A: Auth interceptor adds token to every request
- L: API calls from frontend reach backend correctly
- P: N/A
- H: api.ts imported in all service hooks

---

## PHASE 6 — Gemini AI Integration

### Task 6.1 — Gemini Service (Backend)

Create: src/services/geminiService.ts

Two functions:

Function 1: calculateRouteOverlap
```typescript
// Input: routeA: Coordinate[], routeB: Coordinate[]
// Sends both routes to Gemini 1.5 Pro
// Prompt asks for: overlapScore (0-100), optimalSequence,
//   distanceSaved, naturalExplanation
// Returns: { overlapScore, optimalSequence, distanceSaved,
//            explanation }
```

Function 2: generateMatchExplanation
```typescript
// Input: matchData object
// Returns: single sentence natural language explanation
// Example: "Taking this unified order saves you 1.2km
//           and earns ₹42 more than either order separately."
```

RALPH Criteria:
- R: Both functions call Gemini API and return structured data
- A: Response JSON parsed correctly (strip markdown code blocks)
- L: Errors handled gracefully (fallback to mock data if API fails)
- P: Response time < 3s for demo viability
- H: geminiService imported in matchingController.ts

---

### Task 6.2 — Display Overlap Score in UI

In Screen 9 (Order Detail), the overlap score "84%" should
come from the Gemini API response via the match data.

RALPH Criteria:
- R: Score displays as "Match Score: 84%" on Screen 9
- A: Score is clearly visible with orange accent
- L: Score matches what ArmorIQ agent used for decision
- P: Score animates counting up from 0 to final value
- H: Data flows: Gemini → backend → matchingStore → Screen 9

---

## PHASE 7 — ArmorIQ Agent Integration

### Task 7.1 — ArmorIQ Agent Setup (Backend)

Create: src/agents/armoriqAgent.ts

Agent configuration:
```typescript
// Define agent with these rules:
const AGENT_RULES = {
  minOverlapPercent: 70,
  maxDetourPercent: 30,
  maxTasksPerRider: 2,
  timeWindowMinutes: 10,
};

// Function: evaluateMatch
// Input: { overlapScore, detourPercent, riderCurrentTasks,
//          timeConstraintMet }
// Sends to ArmorIQ API
// Returns: {
//   decision: 'APPROVED' | 'BLOCKED',
//   reason: string,
//   logEntry: AgentDecisionLog
// }
```

RALPH Criteria:
- R: ArmorIQ API called with correct agent ID and rules
- A: APPROVED/BLOCKED decisions return with reasons
- L: Decision log entry saved to Match document
- P: N/A
- H: armoriqAgent.evaluateMatch() called in matchingController

---

### Task 7.2 — Agent Decision Log UI

In Screen 8 (Rider Dashboard), the collapsible log shows
real ArmorIQ decisions from the backend.

RALPH Criteria:
- R: Log shows last 3 decisions with ✅/❌ icons
- A: APPROVED entries show green, BLOCKED show red
- L: Log updates in real-time when new decisions made
- P: Log expands/collapses with smooth animation
- H: Data flows: ArmorIQ → backend → SpacetimeDB → Screen 8

---

## PHASE 8 — SpacetimeDB Integration

### Task 8.1 — SpacetimeDB Module Setup

Define SpacetimeDB tables (Rust or TS module):
```
Table: active_matches
  - matchId: string (primary key)
  - riderId: string
  - orderIds: string[]
  - status: string
  - timestamp: u64

Table: order_status
  - orderId: string (primary key)
  - status: string
  - discountApplied: f64
  - timestamp: u64

Table: rider_location
  - riderId: string (primary key)
  - lat: f64
  - lng: f64
  - timestamp: u64

Table: agent_decisions
  - decisionId: string (primary key)
  - decision: string
  - reason: string
  - overlapScore: f64
  - timestamp: u64
```

RALPH Criteria:
- R: Module deploys to SpacetimeDB successfully
- A: All four tables created and accessible
- L: Client can connect and subscribe to tables
- P: N/A
- H: Module name matches NEXT_PUBLIC_SPACETIMEDB_MODULE

---

### Task 8.2 — SpacetimeDB Client (Frontend)

Create: src/lib/spacetimedb.ts

```typescript
// Initialize connection to SpacetimeDB
// Subscribe to: active_matches, order_status, agent_decisions
// Export: connection, subscribe hooks
```

Create: src/hooks/useSpacetimeDB.ts
- useActiveMatches(): returns live match data
- useOrderStatus(orderId): returns live order status
- useAgentDecisions(): returns live agent decision log

RALPH Criteria:
- R: Connection established to SpacetimeDB on app load
- A: Table subscriptions update React state in real-time
- L: Connection survives page refresh (reconnects)
- P: N/A
- H: Hooks used in matchingStore and riderStore

---

### Task 8.3 — THE DEMO MOMENT: Three-Phone Sync

This is the most critical integration in the project.

When a match is triggered:
1. Backend: creates match, updates SpacetimeDB
2. Zomato phone: shows "Flexible rider found! ₹42 saved"
   notification banner slides in from top
3. Rapido phone: shows "Flexible ride matched! ₹28 saved"
   notification banner slides in from top
4. RYZO center phone: new ping card appears in dashboard
   with orange border pulsing animation

All three update SIMULTANEOUSLY.

Implementation:
- matchingStore.triggerMatch() → POST /api/matching/trigger
- Backend creates match → pushes to SpacetimeDB active_matches
- All three phone UIs subscribe to active_matches
- When table updates → all three react at same time

Notification banners:
- Slide from top, bg #111111, border #22C55E (success)
- Zomato: "Rider found! Your flexible delivery is matched ✓"
- Rapido: "Ride matched! Flexible ride confirmed ✓"
- Auto-dismiss after 3 seconds

RALPH Criteria:
- R: All three phones update when match triggers
- A: Timing is truly simultaneous (no visible lag)
- L: SpacetimeDB connection stable for full demo duration
- P: Notification banners animate in smoothly, dismiss cleanly
- H: This flow works end-to-end: click → backend → SpacetimeDB
    → all three UIs react within 500ms

---

## PHASE 9 — ElevenLabs Integration

### Task 9.1 — ElevenLabs Service (Backend)

Create: src/services/elevenLabsService.ts

```typescript
// Function: generateVoice
// Input: { text: string, type: VoiceCommandType }
// Calls ElevenLabs TTS API with configured voice ID
// Returns: audio buffer (mp3)
// VoiceCommandType: 'match' | 'navigation' | 'arrival' | 'fallback'
```

Voice scripts for each type: (see CONTENT.md Voice Scripts)

RALPH Criteria:
- R: ElevenLabs API called, returns audio buffer
- A: Voice sounds natural for Indian city names (Bhopal, BHEL)
- L: Audio streams to frontend without timeout
- P: Voice quality clear enough for demo room playback
- H: Route: POST /api/voice/generate → elevenLabsService

---

### Task 9.2 — Voice Playback (Frontend)

Create: src/hooks/useVoice.ts

```typescript
// Fetches audio from /api/voice/generate
// Plays via Web Audio API (AudioContext)
// Returns: { playVoice, isPlaying, currentScript }
```

VoiceBanner component updates:
- While isPlaying: waveform bars animate
- When stopped: bars settle flat

RALPH Criteria:
- R: Voice plays automatically when rider accepts order
- A: Waveform animation synced with audio playback
- L: Audio plays without browser autoplay restrictions
  (trigger on user interaction — Accept button click)
- P: Voice starts within 1 second of Accept tap
- H: useVoice() called in ActiveNavigation screen (Screen 10)

---

### Task 9.3 — Voice UI Component

Create: src/components/shared/VoiceBanner.tsx

Spec: See PAGES.md Screen 10 Voice Banner section

RALPH Criteria:
- R: 5 waveform bars with correct heights and orange color
- A: Staggered animation delays make bars look like real audio
- L: "Powered by ElevenLabs" attribution visible
- P: Banner has subtle orange border glow
- H: isPlaying prop controls animation state

---

## PHASE 10 — Google Maps Integration

### Task 10.1 — Maps Setup

Configure @react-google-maps/api:

Create: src/lib/maps.ts
```typescript
// Dark map style JSON for all map instances
// Applies apple-like dark aesthetic to Google Maps
```

MapView component: src/components/shared/MapView.tsx
```typescript
// Renders GoogleMap with dark theme
// Props: routes, riderPosition, stops, variant
// Variants: 'comparison' (Screen 9) | 'navigation' (Screen 10)
```

RALPH Criteria:
- R: Map renders with dark theme (not default white Google Map)
- A: Map background matches #1A1A1A, roads slightly lighter
- L: Map loads without CORS or API key errors
- P: Map renders inside phone frame without overflow
- H: API key in env var, loaded via @googlemaps/js-api-loader

---

### Task 10.2 — Route Polylines (Screen 9)

On the comparison map in Screen 9, draw three polylines:

- Blue dashed: coordinates of Swiggy-only route
- Red dashed: coordinates of Rapido-only route
- Orange solid thick glowing: RYZO AI optimized route

RALPH Criteria:
- R: All three polylines render on the dark map
- A: Orange line is visually dominant (thick, glowing)
- L: Polylines fit within the 220px map height frame
- P: Polylines draw with animation (from start to end, 1s)
- H: Route coordinates from matchingStore (Gemini output)

---

### Task 10.3 — Navigation Map (Screen 10)

On the active navigation map in Screen 10:

- Dark themed map, 45% phone height
- Orange animated dot at current position
- Dotted orange path ahead
- Numbered stop markers (1, 2, 3, 4)

RALPH Criteria:
- R: Map renders with rider position marker
- A: Dotted path visible between current pos and next stop
- L: Map doesn't overflow phone frame boundaries
- P: Rider position marker is orange, clearly visible
- H: Stop markers correspond to stops in progress stepper

---

## PHASE 11 — End-to-End Demo Flow

### Task 11.1 — Demo Flow: Zomato → Match → Dashboard

Complete flow:
1. User clicks "Order with Flexible Delivery" (Zomato phone)
2. POST /api/matching/trigger fires
3. Backend: Gemini calculates overlap → ArmorIQ approves
4. Backend: creates Match doc, pushes to SpacetimeDB
5. All three phones update simultaneously
6. Rider clicks Accept in RYZO phone
7. PATCH /api/matching/:id/accept fires
8. Screen 9 loads with comparison data
9. User clicks "Start Navigation"
10. POST /api/voice/generate fires for match announcement
11. Screen 10 loads, ElevenLabs voice plays

RALPH Criteria:
- R: All 11 steps complete without manual intervention
- A: No step takes longer than 2 seconds
- L: Repeat the full flow 3 times with no errors
- P: Every transition is animated correctly
- H: Flow works on deployed Vultr instance (not just localhost)

---

### Task 11.2 — Demo Flow: Rapido → Match → Dashboard

Same flow but initiated from Rapido phone.
Verifies that either phone can initiate matching.

RALPH Criteria:
- Same as Task 11.1

---

### Task 11.3 — Fallback Flow

1. User clicks Flexible Delivery
2. Backend: no rider match found in 10 second demo window
3. All phones show: "No match found. Standard delivery."
4. Notification banner in orange → fades to grey
5. Standard order button becomes active

RALPH Criteria:
- R: Fallback triggers correctly after timeout
- A: UI communicates fallback clearly (no match banner)
- L: After fallback, another flexible order can be placed
- P: Fallback animation distinct from success (grey, not green)
- H: Fallback state resets matchingStore correctly

---

## PHASE 12 — Polish, Deploy, Demo Prep

### Task 12.1 — Responsive QA

Test all viewport widths:
- 1280px: all three phones visible
- 1440px: phones centered, comfortable spacing
- 1920px: phones spaced, not stretched
- 768px (tablet): only center phone, tab switcher visible

RALPH Criteria:
- R: All viewports render without layout breaks
- A: No horizontal scroll at any tested width
- L: Phone frames maintain correct proportions
- P: Tab switcher on tablet has smooth transitions
- H: Responsive CSS committed and tested

---

### Task 12.2 — Animation QA

Review every animation in the product:
- Splash loading bar: smooth, correct duration
- Screen transitions: consistent fade + slide
- App card stagger: correct delay sequence
- Integration success: orange pulse → green settle
- Order ping pulse: continuous, not jarring
- Waveform: natural-looking, staggered
- Three-phone sync: simultaneous, dramatic
- Comparison table rows: stagger fade in
- Stops progress: advances with satisfying animation

RALPH Criteria:
- R: All animations present and correct
- A: No janky or stuttering animations (60fps)
- L: Animations don't cause layout shift (no CLS)
- P: Animations feel premium — not too fast, not slow
- H: All animations work on deployed version

---

### Task 12.3 — Vultr Deployment

Steps:
1. Create Vultr compute instance (Ubuntu 22.04)
2. Install Node.js 22.x, nginx, pm2
3. Clone repository
4. Set all environment variables in .env
5. `npm run build` on backend, `npm start` via PM2
6. Configure nginx as reverse proxy for port 5000
7. Get public IP / domain
8. Test all API endpoints from public URL
9. Update frontend NEXT_PUBLIC_API_URL to Vultr URL
10. Deploy frontend to Vercel or same Vultr instance
11. Test complete demo flow on public URL

RALPH Criteria:
- R: Backend accessible at public URL
- A: All endpoints respond correctly from external network
- L: PM2 keeps backend running (test with server restart)
- P: Response times < 500ms for all endpoints
- H: Demo URL ready to show judges

---

### Task 12.4 — Demo Rehearsal

Rehearse the 60-second demo script 5 times.
Each rehearsal includes:
1. Open the URL on a laptop (full screen)
2. Deliver the verbal script
3. Trigger match at correct moment
4. All three phones update
5. Voice plays through laptop speakers
6. Show comparison table
7. Deliver closing line + live URL

RALPH Criteria:
- R: Demo completes in 60 seconds or less
- A: No hesitation or technical issues during 5 rehearsals
- L: Works on the actual demo device (not just dev machine)
- P: Verbal delivery is confident, not reading from notes
- H: Backup plan: screen recording ready if live demo fails

---

## Phase Completion Checklist

```
Phase 0:   [ ] Foundation setup
Phase 1:   [ ] Three-phone layout
Phase 2:   [ ] RYZO center phone (all 10 screens)
Phase 3:   [ ] Zomato left phone
Phase 4:   [ ] Rapido right phone
Phase 5:   [ ] Backend foundation
Phase 6:   [ ] Gemini AI
Phase 7:   [ ] ArmorIQ agent
Phase 8:   [ ] SpacetimeDB (THE DEMO MOMENT)
Phase 9:   [ ] ElevenLabs voice
Phase 10:  [ ] Google Maps
Phase 11:  [ ] End-to-end demo flow
Phase 12:  [ ] Polish + deploy + rehearse
```

All phases complete = ready to demo.
