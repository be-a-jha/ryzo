# TECH_STACK.md — RYZO
# All versions verified as latest stable as of April 2026

---

## Frontend

### Framework
Next.js 16.2.2 (App Router)
- Used for the single webpage with three phone UIs
- App router for modern routing patterns
- Server components where possible, client components
  for all interactive phone UI elements
- TypeScript throughout — strict mode enabled

### Language
TypeScript (latest, strict mode)
- All components, hooks, stores, and utilities typed
- Shared type definitions in /src/types/
- No `any` types — use `unknown` and narrow properly

### Styling
Tailwind CSS v4
- Utility-first, consistent design system
- Custom config extending with RYZO design tokens
- All colors, fonts, spacing defined in tailwind.config.ts
- No external UI component libraries — custom everything

### Animation
Framer Motion (latest)
- Phone frame entrance animations
- Screen transition animations inside phone UIs
- Order ping pulse animations
- Match trigger animations (all three phones react)
- Waveform bars for ElevenLabs voice UI

### Icons
Lucide React (latest)
- All icons in the UI come from Lucide
- Consistent 20–24px sizing
- White or #888888 coloring per design system

### State Management
Zustand (latest)
- Global state for: current screen per phone UI,
  integration status, active order, match state,
  rider dashboard data, voice command state
- Separate stores: ryzoStore, matchingStore, riderStore
- No Redux — Zustand is simpler and faster to build

### Maps
@react-google-maps/api (latest)
- Dark-themed map in Order Detail screen (Screen 9)
- Active navigation map with rider position (Screen 10)
- Route polylines: blue (Swiggy), red (Rapido),
  orange thick glow (RYZO AI optimized)
- Custom dark map style JSON applied

### Real-Time Client
spacetimedb@2.1.0
- Connects all three phone UIs to shared live state
- Syncs: active_matches, order_status, rider_location,
  agent_decisions tables
- React hooks from spacetimedb/react subpath

### Voice UI (Client)
@elevenlabs/react (latest)
@elevenlabs/client (latest)
- Browser-side voice playback for rider navigation
- Animated waveform UI component
- useConversation hook for managing voice state

### Authentication
next-auth (latest)
- Google OAuth provider only
- JWT strategy
- Session stored in MongoDB via @auth/mongodb-adapter

### HTTP Client
Axios (latest)
- Centralized API instance in /src/lib/api.ts
- Request/response interceptors for auth headers
- Error handling wrapper

### Utilities
- clsx + tailwind-merge: conditional class merging
- date-fns: timestamp formatting
- zod: runtime type validation for API responses

---

## Backend

### Runtime
Node.js >= 22.x (LTS)
- Native fetch support
- No undici needed for SpacetimeDB

### Framework
Express (latest)
- REST API layer
- All routes prefixed with /api/
- Middleware: helmet, cors, morgan, rate-limiter

### Language
TypeScript (strict mode)
- ts-node for development
- Compiled to dist/ for production
- Shared types with frontend via /src/types/

### Database
MongoDB Atlas (cloud) via Mongoose 9.x
- Document store for: users, riders, orders, matches,
  platforms, agent_decision_logs
- Geospatial indexing for proximity queries
- $near and $geoWithin for finding nearby riders
- Atlas connection string in environment variables

### AI — Route Matching
@google/generative-ai (Gemini 1.5 Pro)
- Route overlap percentage calculation
- Optimal stop sequence generation
- Natural language match explanation (AI Insight Card)
- Called via geminiService.ts

### AI Agent — Match Rules
ArmorIQ REST API
- The matching engine runs as an ArmorIQ agent
- Enforces all matching rules (overlap %, detour %, capacity)
- Returns: allowed/blocked decision + reason + log entry
- Called via armoriqAgent.ts

### Voice Generation
@elevenlabs/elevenlabs-js@2.39.0
- Text-to-speech for rider navigation commands
- Streaming audio sent to frontend
- Voice ID configured in environment variables
- Called via elevenLabsService.ts

### Real-Time Server
spacetimedb@2.1.0
- Server-side table updates
- Pushes match events to all connected clients
- Tables: active_matches, order_status, rider_location,
  agent_decisions

### Auth & Security
- jsonwebtoken: JWT generation and verification
- bcryptjs: password hashing (for mock credentials)
- helmet: HTTP security headers
- cors: configured for frontend origin only

### Validation
Zod (latest)
- All incoming request bodies validated
- Schema definitions in /src/schemas/
- Type inference from schemas

### Dev Tools
- nodemon: auto-restart on file changes
- ts-node: TypeScript execution
- @types/express, @types/node, @types/cors etc.

---

## Infrastructure

### Backend Hosting
Vultr Compute Instance
- Ubuntu 22.04 LTS
- Node.js backend deployed here
- PM2 for process management
- Nginx as reverse proxy
- Live URL accessed during demo (not localhost)

### Database Hosting
MongoDB Atlas (free tier M0)
- Cluster: ryzo-cluster
- Database: ryzo
- Region: Mumbai (ap-south-1) for lowest latency

### Maps
Google Maps Platform
- Maps JavaScript API (map rendering)
- Directions API (route calculation)
- Geocoding API (address to coordinates)
- Loaded via @react-google-maps/api

### AI APIs
- Google Gemini API (route overlap + NL explanation)
- ArmorIQ API (agent matching rules)
- ElevenLabs API (voice generation)

### Real-Time
SpacetimeDB (cloud or self-hosted)
- Module: ryzo
- WebSocket connection from all three phone UIs

---

## File Structure Overview

```
ryzo/
├── frontend/                    ← Next.js 16 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         ← Main 3-phone webpage
│   │   │   ├── layout.tsx       ← Root layout + fonts
│   │   │   ├── globals.css      ← Base styles + CSS vars
│   │   │   └── api/             ← Next.js API routes (if needed)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── PhoneFrame.tsx
│   │   │   │   └── ThreePhoneLayout.tsx
│   │   │   ├── ryzo/            ← All 10 RYZO screens
│   │   │   │   ├── SplashScreen.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   ├── RoleSelection.tsx
│   │   │   │   ├── UserIntegration.tsx
│   │   │   │   ├── InAppLogin.tsx
│   │   │   │   ├── RiderIntegration.tsx
│   │   │   │   ├── RiderDashboard.tsx
│   │   │   │   ├── OrderDetail.tsx
│   │   │   │   └── ActiveNavigation.tsx
│   │   │   ├── zomato/
│   │   │   │   └── ZomatoCheckout.tsx
│   │   │   ├── rapido/
│   │   │   │   └── RapidoBooking.tsx
│   │   │   └── shared/
│   │   │       ├── AppCard.tsx
│   │   │       ├── OrderPingCard.tsx
│   │   │       ├── VoiceBanner.tsx
│   │   │       ├── ComparisonTable.tsx
│   │   │       ├── MapView.tsx
│   │   │       └── AgentDecisionLog.tsx
│   │   ├── hooks/
│   │   │   ├── useSpacetimeDB.ts
│   │   │   ├── useMatching.ts
│   │   │   ├── useVoice.ts
│   │   │   └── useRiderDashboard.ts
│   │   ├── store/
│   │   │   ├── ryzoStore.ts
│   │   │   ├── matchingStore.ts
│   │   │   └── riderStore.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── spacetimedb.ts
│   │   │   ├── maps.ts
│   │   │   └── mockData.ts
│   │   └── types/
│   │       ├── order.ts
│   │       ├── rider.ts
│   │       ├── match.ts
│   │       └── platform.ts
│   ├── public/
│   │   └── icons/               ← App logos (Swiggy, Zomato etc.)
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── .env.local
│
├── backend/
│   ├── src/
│   │   ├── index.ts             ← Express server entry
│   │   ├── config/
│   │   │   ├── db.ts            ← MongoDB Atlas connection
│   │   │   └── env.ts           ← Env vars + Zod validation
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Rider.ts
│   │   │   ├── Order.ts
│   │   │   └── Match.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── orders.ts
│   │   │   ├── riders.ts
│   │   │   ├── matching.ts
│   │   │   └── voice.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── riderController.ts
│   │   │   ├── matchingController.ts
│   │   │   └── voiceController.ts
│   │   ├── services/
│   │   │   ├── geminiService.ts
│   │   │   ├── elevenLabsService.ts
│   │   │   └── spacetimeService.ts
│   │   ├── agents/
│   │   │   └── armoriqAgent.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── schemas/
│   │   │   └── requestSchemas.ts
│   │   └── utils/
│   │       ├── geoUtils.ts
│   │       └── responseUtils.ts
│   ├── tsconfig.json
│   └── .env
│
└── docs/                        ← All MD documentation
    ├── PROJECT_OVERVIEW.md
    ├── TECH_STACK.md
    ├── PAGES.md
    ├── CONTENT.md
    ├── BRAND.md
    ├── PRD.md
    └── INTEGRATIONS.md
```

---

## Environment Variables Reference

### Frontend (.env.local)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SPACETIMEDB_URI=ws://localhost:3000
NEXT_PUBLIC_SPACETIMEDB_MODULE=ryzo
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
JWT_SECRET=
SPACETIMEDB_URI=ws://localhost:3000
ARMORIQ_API_KEY=
ARMORIQ_AGENT_ID=
```
