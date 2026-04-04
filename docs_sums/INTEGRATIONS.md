# INTEGRATIONS.md — RYZO
# Step-by-step integration process for every external technology
# Follow this file exactly. Do not guess API shapes.

---

## Integration 1: MongoDB Atlas

### Step 1: Create Atlas Account + Cluster
1. Go to cloud.mongodb.com → Create account
2. Create a new project: "RYZO"
3. Create a free M0 cluster:
   - Provider: AWS
   - Region: Mumbai (ap-south-1) — lowest latency for India
   - Cluster name: ryzo-cluster
4. Wait for cluster to provision (2–3 min)

### Step 2: Configure Access
1. Database Access → Add new database user:
   - Username: ryzo-user
   - Password: generate secure password
   - Role: Atlas admin
2. Network Access → Add IP Address:
   - For development: Add your current IP
   - For production: Add Vultr server IP
   - For demo safety: Allow access from anywhere (0.0.0.0/0)

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js | Version: 6.x or later
4. Copy the connection string:
   `mongodb+srv://ryzo-user:<password>@ryzo-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `<password>` with your actual password
6. Add database name: `...mongodb.net/ryzo?retryWrites...`

### Step 4: Backend Connection
File: backend/src/config/db.ts
```typescript
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'ryzo',
    });
    console.log(`✅ MongoDB Atlas connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
```

Add to backend/.env:
```
MONGODB_URI=mongodb+srv://ryzo-user:PASSWORD@ryzo-cluster.xxxxx.mongodb.net/ryzo?retryWrites=true&w=majority
```

Call in backend/src/index.ts before app.listen():
```typescript
import { connectDB } from './config/db';
await connectDB();
```

### Step 5: Verify Geospatial Index
In Order.ts Mongoose model, add 2dsphere index:
```typescript
orderSchema.index({ 'pickup.location': '2dsphere' });
orderSchema.index({ 'drop.location': '2dsphere' });
```

Order schema location field shape:
```typescript
pickup: {
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]  // [longitude, latitude]
  },
  address: String
}
```

### Step 6: Test the Connection
```bash
cd backend && npm run dev
# Should log: ✅ MongoDB Atlas connected: ryzo-cluster.xxxxx.mongodb.net
```

### Verification Checklist
- [ ] Cluster created and running
- [ ] Database user created with correct permissions
- [ ] IP whitelist configured
- [ ] Connection string in .env (not committed to git)
- [ ] connectDB() called and logs success on start
- [ ] Geospatial index on Order model
- [ ] Test insert to users collection succeeds

---

## Integration 2: Google Gemini API

### Step 1: Get API Key
1. Go to aistudio.google.com
2. Sign in with Google account
3. Click "Get API Key" → "Create API Key"
4. Select project or create new: "RYZO"
5. Copy the API key
6. Add to backend/.env:
   ```
   GEMINI_API_KEY=AIzaSy...
   ```

### Step 2: Install SDK
```bash
cd backend
npm install @google/generative-ai@latest
```

### Step 3: Create Gemini Service
File: backend/src/services/geminiService.ts

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

interface Coordinate {
  lat: number;
  lng: number;
}

interface OverlapResult {
  overlapScore: number;        // 0–100
  optimalSequence: string[];   // stop names in order
  distanceSaved: number;       // km saved vs individual routes
  explanation: string;         // natural language sentence
}

export const calculateRouteOverlap = async (
  routeA: Coordinate[],
  routeB: Coordinate[],
  stops: { name: string; lat: number; lng: number }[]
): Promise<OverlapResult> => {
  const prompt = `
You are a route optimization engine for a delivery app.

Route A coordinates (food delivery):
${JSON.stringify(routeA)}

Route B coordinates (ride pickup/drop):
${JSON.stringify(routeB)}

Delivery stops:
${JSON.stringify(stops)}

Analyze these two routes and return ONLY a JSON object (no markdown, no backticks):
{
  "overlapScore": <number 0-100 representing % path overlap>,
  "optimalSequence": [<stop names in optimal order>],
  "distanceSaved": <number km saved vs doing separately>,
  "explanation": "<one sentence explaining the match benefit>"
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    // Strip any accidental markdown code blocks
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as OverlapResult;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback mock data if API fails
    return {
      overlapScore: 84,
      optimalSequence: ["McDonald's Pickup", "BHEL Drop", "MP Nagar Pickup", "Sarvadharm Drop"],
      distanceSaved: 1.2,
      explanation: "Taking this unified order saves 1.2km and earns ₹42 more than either order separately."
    };
  }
};
```

### Step 4: Wire to Matching Controller
In matchingController.ts:
```typescript
import { calculateRouteOverlap } from '../services/geminiService';

// In the triggerMatch function:
const overlapResult = await calculateRouteOverlap(
  order1.route,
  order2.route,
  combinedStops
);
```

### Step 5: Display in Frontend (Screen 9)
The `overlapResult.overlapScore` value flows through:
Backend → POST /api/matching/trigger response
→ matchingStore.matchData.overlapScore
→ Screen 9 comparison badge: "Match Score: 84%"

### Verification Checklist
- [ ] API key created and in .env
- [ ] SDK installed
- [ ] geminiService.ts created with fallback
- [ ] calculateRouteOverlap returns valid JSON
- [ ] Overlap score displayed on Screen 9
- [ ] Explanation text shown in AI Insight Card

---

## Integration 3: ArmorIQ

### Step 1: Get ArmorIQ Access
1. Go to armoriq.com (or check hackathon sponsor docs)
2. Create account / get hackathon API key
3. Create a new agent: "RYZO Matching Engine"
4. Add to backend/.env:
   ```
   ARMORIQ_API_KEY=your_key_here
   ARMORIQ_AGENT_ID=your_agent_id_here
   ```

### Step 2: Define Agent Rules in ArmorIQ Dashboard
Create these rules in the ArmorIQ UI:

Rule 1 — ALLOW — Minimum Overlap:
  Condition: overlapScore >= 70
  Action: ALLOW
  Label: "Route overlap sufficient for matching"

Rule 2 — ALLOW — Maximum Detour:
  Condition: detourPercent <= 30
  Action: ALLOW
  Label: "Detour within acceptable range"

Rule 3 — BLOCK — Rider Capacity:
  Condition: riderCurrentTasks >= 2
  Action: BLOCK
  Label: "Rider already at maximum task capacity"

Rule 4 — BLOCK — Time Constraint:
  Condition: timeConstraintMet == false
  Action: BLOCK
  Label: "Time constraint would be violated"

Rule 5 — BLOCK — Minimum Overlap:
  Condition: overlapScore < 70
  Action: BLOCK
  Label: "Insufficient route overlap for match"

### Step 3: Create ArmorIQ Agent
File: backend/src/agents/armoriqAgent.ts

```typescript
interface MatchEvalInput {
  overlapScore: number;
  detourPercent: number;
  riderCurrentTasks: number;
  timeConstraintMet: boolean;
}

interface AgentDecision {
  decision: 'APPROVED' | 'BLOCKED';
  reason: string;
  logEntry: {
    timestamp: string;
    action: string;
    overlapScore: number;
    detourPercent: number;
    capacity: string;
  };
}

export const evaluateMatch = async (
  input: MatchEvalInput
): Promise<AgentDecision> => {
  try {
    const response = await fetch(
      `https://api.armoriq.com/v1/agents/${process.env.ARMORIQ_AGENT_ID}/evaluate`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.ARMORIQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context: {
            overlapScore: input.overlapScore,
            detourPercent: input.detourPercent,
            riderCurrentTasks: input.riderCurrentTasks,
            timeConstraintMet: input.timeConstraintMet
          }
        })
      }
    );

    const data = await response.json();

    const approved = data.result === 'ALLOW';
    return {
      decision: approved ? 'APPROVED' : 'BLOCKED',
      reason: data.reason || (approved
        ? `Overlap ${input.overlapScore}%, detour ${input.detourPercent}%`
        : `Blocked: ${data.reason}`),
      logEntry: {
        timestamp: new Date().toISOString(),
        action: approved ? 'MATCH_APPROVED' : 'MATCH_BLOCKED',
        overlapScore: input.overlapScore,
        detourPercent: input.detourPercent,
        capacity: `${input.riderCurrentTasks}/2`
      }
    };
  } catch (error) {
    // Fallback: apply rules locally if ArmorIQ unreachable
    const approved =
      input.overlapScore >= 70 &&
      input.detourPercent <= 30 &&
      input.riderCurrentTasks < 2 &&
      input.timeConstraintMet;

    return {
      decision: approved ? 'APPROVED' : 'BLOCKED',
      reason: approved
        ? `Local fallback: conditions met`
        : `Local fallback: conditions not met`,
      logEntry: {
        timestamp: new Date().toISOString(),
        action: approved ? 'MATCH_APPROVED' : 'MATCH_BLOCKED',
        overlapScore: input.overlapScore,
        detourPercent: input.detourPercent,
        capacity: `${input.riderCurrentTasks}/2`
      }
    };
  }
};
```

### Step 4: Wire to Matching Controller
```typescript
import { evaluateMatch } from '../agents/armoriqAgent';

// After Gemini overlap calculation:
const agentDecision = await evaluateMatch({
  overlapScore: overlapResult.overlapScore,
  detourPercent: calculatedDetour,
  riderCurrentTasks: rider.currentTasks.length,
  timeConstraintMet: checkTimeConstraint(order)
});

if (agentDecision.decision === 'BLOCKED') {
  return res.status(200).json({
    matched: false,
    reason: agentDecision.reason
  });
}

// Save log entry to Match document
match.agentDecisionLog.push(agentDecision.logEntry);
```

### Step 5: Show in Frontend (Screen 8 Agent Log)
The agent decision log flows to the rider dashboard.
The collapsible log in Screen 8 reads from matchingStore.agentLog.

### Verification Checklist
- [ ] ArmorIQ account created, agent configured
- [ ] Rules defined in ArmorIQ dashboard
- [ ] API key and agent ID in .env
- [ ] evaluateMatch() returns APPROVED/BLOCKED with reason
- [ ] Local fallback works when ArmorIQ is unreachable
- [ ] Log entries saved to Match document
- [ ] Agent log visible and updating in Screen 8 dashboard

---

## Integration 4: SpacetimeDB

### Step 1: Install SpacetimeDB CLI
```bash
# Install the CLI
curl --proto '=https' --tlsv1.2 -sSf \
  https://install.spacetimedb.com | sh

# Verify
spacetime version
```

### Step 2: Create SpacetimeDB Account
1. Go to spacetimedb.com
2. Create account
3. Login via CLI: `spacetime login`

### Step 3: Create the Module
```bash
# Create a new TypeScript module
mkdir ryzo-spacetime && cd ryzo-spacetime
spacetime init --lang typescript ryzo-module
```

### Step 4: Define Tables in Module
File: ryzo-module/src/lib.ts

```typescript
import {
  Table,
  reducer,
  SpacetimeDBClient,
  AlgebraicType
} from '@clockworklabs/spacetimedb-sdk';

// Table: active_matches
export class ActiveMatch {
  matchId!: string;
  riderId!: string;
  orderIds!: string;     // JSON stringified array
  platforms!: string;    // JSON stringified array
  overlapScore!: number;
  combinedEarnings!: number;
  status!: string;
  timestamp!: bigint;
}

// Table: order_status
export class OrderStatus {
  orderId!: string;
  status!: string;
  discountApplied!: number;
  platform!: string;
  timestamp!: bigint;
}

// Table: agent_decisions
export class AgentDecision {
  decisionId!: string;
  decision!: string;
  reason!: string;
  overlapScore!: number;
  timestamp!: bigint;
}
```

### Step 5: Deploy Module
```bash
cd ryzo-module
spacetime publish ryzo
# Note the database address returned
```

### Step 6: Generate Client Bindings
```bash
cd frontend
spacetime generate --lang typescript \
  --out-dir src/lib/spacetimedb-bindings \
  --database ryzo
```

### Step 7: Frontend SpacetimeDB Setup
File: frontend/src/lib/spacetimedb.ts

```typescript
import { DbConnection } from './spacetimedb-bindings';

const SPACETIMEDB_URI = process.env.NEXT_PUBLIC_SPACETIMEDB_URI!;
const MODULE_NAME = process.env.NEXT_PUBLIC_SPACETIMEDB_MODULE!;

let connection: DbConnection | null = null;

export const getSpacetimeConnection = () => {
  if (connection) return connection;

  connection = DbConnection.builder()
    .withUri(SPACETIMEDB_URI)
    .withDatabaseName(MODULE_NAME)
    .onDisconnect(() => console.log('SpacetimeDB disconnected'))
    .onConnectError(() => console.log('SpacetimeDB connect error'))
    .onConnect((conn, identity, token) => {
      console.log('✅ SpacetimeDB connected');
      // Subscribe to all tables
      conn.subscriptionBuilder().subscribe([
        'SELECT * FROM active_matches',
        'SELECT * FROM order_status',
        'SELECT * FROM agent_decisions'
      ]);
    })
    .build();

  return connection;
};
```

### Step 8: React Hooks for Live Data
File: frontend/src/hooks/useSpacetimeDB.ts

```typescript
import { useEffect, useState } from 'react';
import { getSpacetimeConnection } from '../lib/spacetimedb';

export const useActiveMatches = () => {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const conn = getSpacetimeConnection();
    // Listen for insert/update on active_matches table
    conn.db.activeMatch.onInsert((ctx, match) => {
      setMatches(prev => [...prev, match]);
    });
    conn.db.activeMatch.onUpdate((ctx, oldMatch, newMatch) => {
      setMatches(prev =>
        prev.map(m => m.matchId === newMatch.matchId ? newMatch : m)
      );
    });
  }, []);

  return matches;
};
```

### Step 9: Backend Pushes to SpacetimeDB
File: backend/src/services/spacetimeService.ts

```typescript
// Use SpacetimeDB REST API to insert rows
export const pushMatchToSpacetime = async (matchData: {
  matchId: string;
  riderId: string;
  orderIds: string[];
  platforms: string[];
  overlapScore: number;
  combinedEarnings: number;
}) => {
  await fetch(`${process.env.SPACETIMEDB_URI}/database/ryzo/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SPACETIMEDB_TOKEN}`
    },
    body: JSON.stringify({
      reducer: 'insert_match',
      args: [matchData]
    })
  });
};
```

### Step 10: Wire Everything Together

In matchingController.ts, after ArmorIQ approves:
```typescript
import { pushMatchToSpacetime } from '../services/spacetimeService';

// After match is APPROVED:
await pushMatchToSpacetime({
  matchId: match._id.toString(),
  riderId: rider._id.toString(),
  orderIds: [order1._id.toString(), order2._id.toString()],
  platforms: ['swiggy', 'rapido'],
  overlapScore: overlapResult.overlapScore,
  combinedEarnings: 94
});
// This triggers all three frontend phones simultaneously
```

### Verification Checklist
- [ ] SpacetimeDB CLI installed and logged in
- [ ] Module created and deployed (spacetime publish ryzo)
- [ ] Client bindings generated in frontend
- [ ] Frontend connects to SpacetimeDB on load
- [ ] useActiveMatches() hook returns live data
- [ ] Backend pushes to SpacetimeDB after match approved
- [ ] All three phone UIs update within 500ms of push
- [ ] SpacetimeDB status chip shows "🟢 Connected" on Screen 9

---

## Integration 5: ElevenLabs

### Step 1: Create ElevenLabs Account
1. Go to elevenlabs.io
2. Create free account
3. Go to API Keys section
4. Generate an API key
5. Add to backend/.env:
   ```
   ELEVENLABS_API_KEY=sk_...
   ```

### Step 2: Choose a Voice
1. In ElevenLabs dashboard → Voices
2. Browse premade voices
3. Choose a voice that sounds natural for Indian English
   (Suggested: "Rachel" or any clear, neutral voice)
4. Copy the Voice ID
5. Add to backend/.env:
   ```
   ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
   ```

### Step 3: Install SDK (Backend)
```bash
cd backend
npm install @elevenlabs/elevenlabs-js@latest
```

### Step 4: Create ElevenLabs Service
File: backend/src/services/elevenLabsService.ts

```typescript
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!
});

type VoiceCommandType = 'match' | 'navigation' | 'arrival' | 'fallback';

const VOICE_SCRIPTS: Record<VoiceCommandType, string> = {
  match: "New unified order matched. Pickup at McDonald's Arera Colony, then drop at B H E L Sector. Rapido ride pickup at M P Nagar, drop at Sarvadharm Colony. Combined route saves 1.2 kilometers. Extra earning: 42 rupees. Route is optimized.",
  navigation: "Turn right on Hoshangabad Road in 200 meters.",
  arrival: "You have arrived at the delivery location. Please complete the handover.",
  fallback: "No match found within the time window. Proceeding with standard delivery."
};

export const generateVoiceAudio = async (
  type: VoiceCommandType,
  customText?: string
): Promise<Buffer> => {
  const text = customText || VOICE_SCRIPTS[type];

  const audioStream = await client.textToSpeech.stream(
    process.env.ELEVENLABS_VOICE_ID!,
    {
      text,
      modelId: 'eleven_multilingual_v2',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75
      }
    }
  );

  // Collect stream into buffer
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};
```

### Step 5: Create Voice API Route
File: backend/src/routes/voice.ts

```typescript
import express from 'express';
import { generateVoiceAudio } from '../services/elevenLabsService';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { type, customText } = req.body;

  const audioBuffer = await generateVoiceAudio(type, customText);

  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Length': audioBuffer.length,
    'Cache-Control': 'no-cache'
  });
  res.send(audioBuffer);
});

export default router;
```

### Step 6: Frontend Voice Hook
File: frontend/src/hooks/useVoice.ts

```typescript
import { useState, useCallback } from 'react';
import api from '../lib/api';

export const useVoice = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScript, setCurrentScript] = useState('');

  const playVoice = useCallback(async (
    type: 'match' | 'navigation' | 'arrival' | 'fallback',
    customText?: string
  ) => {
    try {
      setIsPlaying(true);

      const response = await api.post('/voice/generate',
        { type, customText },
        { responseType: 'arraybuffer' }
      );

      // Play via Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(
        response.data
      );
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      source.start(0);

      if (customText) setCurrentScript(customText);

    } catch (error) {
      console.error('Voice playback error:', error);
      setIsPlaying(false);
    }
  }, []);

  return { playVoice, isPlaying, currentScript };
};
```

### Step 7: Wire to Screen 10 Navigation
In ActiveNavigation.tsx:
```typescript
const { playVoice, isPlaying } = useVoice();

// On component mount (when rider starts navigation):
useEffect(() => {
  playVoice('match'); // Play match announcement first
}, []);

// On "Mark as Delivered" tap:
const handleNextStop = () => {
  playVoice('navigation',
    'Turn right on Hoshangabad Road in 200 meters');
  // Advance stop progress
};
```

### Step 8: VoiceBanner Component
File: frontend/src/components/shared/VoiceBanner.tsx
(See PAGES.md Screen 10 spec for full visual details)

```typescript
// Props: isPlaying: boolean, instruction: string
// When isPlaying: bars animate
// When not playing: bars are flat
```

### Verification Checklist
- [ ] ElevenLabs account created, API key in .env
- [ ] Voice ID chosen and in .env
- [ ] SDK installed in backend
- [ ] generateVoiceAudio() returns mp3 buffer
- [ ] POST /api/voice/generate returns audio
- [ ] useVoice() hook plays audio in browser
- [ ] Audio plays when rider taps "Accept" (not before)
- [ ] VoiceBanner waveform syncs with isPlaying state
- [ ] Audio audible from laptop speakers in demo room

---

## Integration 6: Google Maps API

### Step 1: Get Maps API Key
1. Go to console.cloud.google.com
2. Create project or select "RYZO"
3. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Create API key → restrict to your domain
5. Add to frontend/.env.local:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```

### Step 2: Install SDK (Frontend)
```bash
cd frontend
npm install @react-google-maps/api@latest
npm install @googlemaps/js-api-loader@latest
```

### Step 3: Map Provider Setup
Wrap the relevant section in GoogleMapsProvider:

In MapView.tsx or parent component:
```typescript
import { LoadScript } from '@react-google-maps/api';

const LIBRARIES: ('places' | 'geometry')[] = ['places', 'geometry'];

export const MapProvider = ({ children }: { children: React.ReactNode }) => (
  <LoadScript
    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
    libraries={LIBRARIES}
  >
    {children}
  </LoadScript>
);
```

### Step 4: Dark Map Style
File: frontend/src/lib/maps.ts

```typescript
export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#888888' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2a2a2a' }]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#333333' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3a3a3a' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0d0d0d' }]
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }]    // Hide POI clutter
  },
];

export const MAP_CENTER = {
  lat: 23.2215,   // Bhopal center (for mock data)
  lng: 77.4014
};

export const MAP_OPTIONS = {
  disableDefaultUI: true,
  clickableIcons: false,
  scrollwheel: false,
  styles: DARK_MAP_STYLE
};
```

### Step 5: Comparison Map (Screen 9)
File: frontend/src/components/shared/MapView.tsx

```typescript
import { GoogleMap, Polyline, Marker } from '@react-google-maps/api';
import { DARK_MAP_STYLE, MAP_OPTIONS } from '../../lib/maps';

// Three polylines for comparison:
const ROUTES = {
  swiggy: [
    { lat: 23.2215, lng: 77.4014 },  // McDonald's
    { lat: 23.2093, lng: 77.3783 },  // BHEL drop
  ],
  rapido: [
    { lat: 23.2318, lng: 77.4272 },  // MP Nagar pickup
    { lat: 23.1982, lng: 77.4621 },  // Sarvadharm drop
  ],
  ryzoAI: [
    { lat: 23.2215, lng: 77.4014 },  // McDonald's
    { lat: 23.2093, lng: 77.3783 },  // BHEL
    { lat: 23.2318, lng: 77.4272 },  // MP Nagar
    { lat: 23.1982, lng: 77.4621 },  // Sarvadharm
  ]
};

// Polyline options:
const swiggyLine = { strokeColor: '#3B82F6', strokeOpacity: 0.7,
  strokeWeight: 2, icons: [{ icon: { path: 'M 0,-1 0,1' },
  offset: '0', repeat: '10px' }] };  // dashed
const rapidoLine = { strokeColor: '#EF4444', strokeOpacity: 0.7,
  strokeWeight: 2, icons: [...] };    // dashed
const ryzoLine = { strokeColor: '#FC8019', strokeOpacity: 1,
  strokeWeight: 4 };                  // solid thick orange
```

### Step 6: Navigation Map (Screen 10)
Same map setup but with:
- Animated position marker (orange dot)
- Dotted path ahead of current position
- Numbered stop markers

```typescript
// Custom orange marker for rider position:
const riderIcon = {
  path: google.maps.SymbolPath.CIRCLE,
  scale: 10,
  fillColor: '#FC8019',
  fillOpacity: 1,
  strokeColor: '#FFFFFF',
  strokeWeight: 2
};
```

### Verification Checklist
- [ ] Google Maps API key created with correct APIs enabled
- [ ] Key in .env.local (not committed to git)
- [ ] Map renders with dark theme (not default white)
- [ ] Three colored polylines visible on comparison map
- [ ] Orange route is visually dominant (thick, solid)
- [ ] Maps render within phone frame without overflow
- [ ] No billing errors (free tier handles demo volume)

---

## Integration 7: Vultr Deployment

### Step 1: Create Vultr Account + Instance
1. Go to vultr.com → Create account
2. Deploy a new server:
   - Type: Cloud Compute — Shared CPU
   - Location: Mumbai (lowest latency for India demo)
   - Image: Ubuntu 22.04 LTS
   - Plan: $6/month (1 vCPU, 1GB RAM) — sufficient for demo
3. Add SSH key for access
4. Note the public IP address

### Step 2: Initial Server Setup
```bash
# SSH into server
ssh root@YOUR_VULTR_IP

# Update system
apt update && apt upgrade -y

# Install Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install nginx
apt install -y nginx

# Install git
apt install -y git

# Verify
node --version   # Should be v22.x
npm --version
pm2 --version
nginx -v
```

### Step 3: Clone and Setup Backend
```bash
# Create app directory
mkdir -p /var/www/ryzo
cd /var/www/ryzo

# Clone your repo
git clone https://github.com/YOUR_USERNAME/ryzo.git .

# Install backend dependencies
cd backend
npm install

# Create production .env
nano .env
# Paste all production environment variables

# Build TypeScript
npm run build

# Start with PM2
pm2 start dist/index.js --name "ryzo-backend"
pm2 save
pm2 startup  # Follow the output command to enable auto-start
```

### Step 4: Configure Nginx
```bash
nano /etc/nginx/sites-available/ryzo
```

Paste:
```nginx
server {
    listen 80;
    server_name YOUR_VULTR_IP;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://localhost:5000/health;
    }
}
```

```bash
# Enable the config
ln -s /etc/nginx/sites-available/ryzo /etc/nginx/sites-enabled/
nginx -t    # Test config
systemctl restart nginx
```

### Step 5: Open Firewall Ports
In Vultr dashboard → Firewall:
- Allow port 80 (HTTP)
- Allow port 443 (HTTPS if needed)
- Allow port 22 (SSH)

### Step 6: Update Frontend Environment
In frontend/.env.local (or Vercel env vars):
```
NEXT_PUBLIC_API_URL=http://YOUR_VULTR_IP/api
```

### Step 7: Verify Deployment
```bash
# From your local machine:
curl http://YOUR_VULTR_IP/health
# Should return: {"status":"ok","service":"RYZO API"}

# Check PM2 status:
ssh root@YOUR_VULTR_IP
pm2 status  # Should show "ryzo-backend" as "online"
pm2 logs ryzo-backend  # Check for errors
```

### Step 8: Auto-Deploy Script (Optional)
```bash
# /var/www/ryzo/deploy.sh
#!/bin/bash
git pull origin main
cd backend
npm install
npm run build
pm2 restart ryzo-backend
echo "✅ RYZO backend deployed"
```

### Verification Checklist
- [ ] Vultr instance running Ubuntu 22.04
- [ ] Node.js 22.x installed
- [ ] PM2 running ryzo-backend as daemon
- [ ] Nginx proxying /api to port 5000
- [ ] Firewall allows ports 80 and 22
- [ ] GET http://YOUR_IP/health returns 200
- [ ] All API endpoints respond from public URL
- [ ] Frontend NEXT_PUBLIC_API_URL points to Vultr
- [ ] Full demo flow works from deployed URL

---

## Integration Order Recommendation

Build integrations in this order for minimum risk:

```
1. MongoDB Atlas     → Database first, everything depends on it
2. Google Maps       → Visual, easy to verify, high demo impact
3. Gemini AI         → Core intelligence, test with mock routes
4. ArmorIQ           → Agent rules, verify with Gemini output
5. SpacetimeDB       → Real-time layer (most complex)
6. ElevenLabs        → Voice (last because it's standalone)
7. Vultr             → Deploy everything at end
```

---

## Shared Environment Variable Checklist

Before demo, verify ALL these are set on Vultr + local:

Backend (.env):
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSy...
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
JWT_SECRET=...
SPACETIMEDB_URI=ws://...
SPACETIMEDB_TOKEN=...
ARMORIQ_API_KEY=...
ARMORIQ_AGENT_ID=...
FRONTEND_URL=http://localhost:3000
```

Frontend (.env.local):
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSy...
NEXT_PUBLIC_API_URL=http://YOUR_VULTR_IP/api
NEXT_PUBLIC_SPACETIMEDB_URI=ws://...
NEXT_PUBLIC_SPACETIMEDB_MODULE=ryzo
```

---

## Common Integration Errors + Fixes

### MongoDB
Error: "MongoServerSelectionError"
Fix: Check IP whitelist in Atlas Network Access.
     Add 0.0.0.0/0 for demo if needed.

### Gemini
Error: "Response was not valid JSON"
Fix: The cleanup step `text.replace(/```json|```/g, '')` handles this.
     Also check: model returned empty response → check prompt clarity.

### ArmorIQ
Error: "401 Unauthorized"
Fix: Verify ARMORIQ_API_KEY is correct. Check agent ID matches.

### SpacetimeDB
Error: "Connection refused"
Fix: Verify module was published (`spacetime publish ryzo`).
     Check NEXT_PUBLIC_SPACETIMEDB_URI has correct address.

### ElevenLabs
Error: "Audio does not play in browser"
Fix: Web Audio API requires user gesture before playing.
     Trigger playVoice() from inside the Accept button onClick handler.

### Google Maps
Error: "This page can't load Google Maps correctly"
Fix: Check API key is unrestricted or whitelisted for localhost.
     Ensure Maps JavaScript API is enabled (not just Directions API).

### Vultr
Error: "502 Bad Gateway"
Fix: PM2 process crashed. Run: `pm2 logs ryzo-backend` to see error.
     Usually a missing .env var. Fix and `pm2 restart ryzo-backend`.
