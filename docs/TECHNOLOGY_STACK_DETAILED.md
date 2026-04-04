# RYZO Technology Stack - Detailed Breakdown

## 📚 TABLE OF CONTENTS
1. [Frontend Stack](#frontend-stack)
2. [Backend Stack](#backend-stack)
3. [Database & Storage](#database--storage)
4. [External Services](#external-services)
5. [Development Tools](#development-tools)
6. [Technology Interactions](#technology-interactions)

---

## 🎨 FRONTEND STACK

### Next.js 16.2.2
**Purpose:** React framework with server-side rendering and routing  
**Why:** Production-ready, optimized builds, built-in routing  
**Used For:**
- App Router (`src/app/`)
- Server-side rendering for SEO
- Automatic code splitting
- Image optimization
- API routes (future use)

**Key Files:**
- `src/app/layout.tsx` - Root layout
- `src/app/page.tsx` - Main page (3-phone UI)
- `next.config.ts` - Configuration

**Triggers:**
- User navigates → Next.js router handles page transitions
- Build time → Static generation for optimal performance
- Runtime → Server components for dynamic data

**Outcome:** Fast, SEO-friendly, production-ready web app

---

### React 19
**Purpose:** UI component library  
**Why:** Component-based architecture, virtual DOM, hooks  
**Used For:**
- All UI components (screens, buttons, forms)
- State management with hooks
- Component lifecycle management
- Event handling

**Key Patterns:**
```typescript
// Functional components with hooks
const RiderDashboard = () => {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    fetchProfile();
  }, []);
  return <div>...</div>;
};
```

**Triggers:**
- State changes → Component re-renders
- Props changes → Child components update
- User interactions → Event handlers fire

**Outcome:** Reactive, maintainable UI components

---

### TypeScript 5.x
**Purpose:** Type-safe JavaScript  
**Why:** Catch errors at compile time, better IDE support  
**Used For:**
- Type definitions for all variables, functions, components
- Interface definitions for data structures
- Enum definitions for constants
- Generic types for reusable code

**Example:**
```typescript
interface RiderProfile {
  id: string;
  name: string;
  earnings: number;
  rating: number;
}

const fetchProfile = async (id: string): Promise<RiderProfile> => {
  // TypeScript ensures return type matches
};
```

**Triggers:**
- Build time → Type checking
- Development → IDE autocomplete and error detection

**Outcome:** Fewer runtime errors, better developer experience

---

### Tailwind CSS 3.x
**Purpose:** Utility-first CSS framework  
**Why:** Rapid styling, consistent design, small bundle size  
**Used For:**
- All component styling
- Responsive design (mobile-first)
- Dark mode support (future)
- Custom animations

**Example:**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
</div>
```

**Triggers:**
- Build time → Purge unused CSS
- Runtime → Apply styles based on classes

**Outcome:** Fast, consistent, maintainable styling

---

### Zustand 4.x
**Purpose:** Lightweight state management  
**Why:** Simple API, no boilerplate, TypeScript support  
**Used For:**
- Global state management
- Screen navigation state
- Rider profile state
- Matching state

**Stores:**
1. **ryzoStore** - Screen navigation (11 screens)
2. **riderStore** - Rider profile, orders, earnings
3. **matchingStore** - Match status, popup visibility

**Example:**
```typescript
const useRiderStore = create<RiderState>((set) => ({
  profile: null,
  earnings: 0,
  updateEarnings: (amount) => set((state) => ({
    earnings: state.earnings + amount
  }))
}));
```

**Triggers:**
- Action called → State updates
- State updates → Components re-render
- Subscriptions → Multiple components sync

**Outcome:** Predictable state management, easy debugging

---

### Axios 1.x
**Purpose:** HTTP client for API calls  
**Why:** Promise-based, interceptors, automatic JSON parsing  
**Used For:**
- Backend API calls
- Request/response interceptors
- Error handling
- JWT token injection

**Configuration:**
```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Triggers:**
- Component mounts → API call
- User action → API call
- Response received → Update state

**Outcome:** Reliable API communication with error handling

---

### SpacetimeDB SDK
**Purpose:** Real-time database client  
**Why:** Cross-device sync, WebSocket-based, automatic updates  
**Used For:**
- Real-time order synchronization
- Match notifications across devices
- Rider location updates
- Agent decision logs

**Key Files:**
- `lib/spacetimedb.ts` - Connection management
- `hooks/useSpacetimeDB.ts` - React hooks
- `module_bindings/` - Generated types and reducers

**Flow:**
```typescript
// 1. Connect
const conn = connectSpacetimeDB();

// 2. Subscribe
conn.subscriptionBuilder()
  .subscribe(['SELECT * FROM active_match']);

// 3. Listen for updates
conn.db.activeMatch.onInsert((ctx, match) => {
  console.log('New match:', match);
});

// 4. Push data
await conn.reducers.insertMatch({...});
```

**Triggers:**
- App loads → Connect to SpacetimeDB
- Data inserted → All subscribed clients receive update
- Connection lost → Auto-reconnect

**Outcome:** Real-time cross-device synchronization

---

## 🔧 BACKEND STACK

### Node.js 20.x
**Purpose:** JavaScript runtime for server  
**Why:** Non-blocking I/O, large ecosystem, JavaScript everywhere  
**Used For:**
- Running Express server
- Executing business logic
- Handling concurrent requests
- Background tasks

**Triggers:**
- Server starts → Node.js process runs
- Request received → Event loop handles
- Async operations → Non-blocking execution

**Outcome:** Fast, scalable server

---

### Express.js 4.x
**Purpose:** Web framework for Node.js  
**Why:** Minimal, flexible, large middleware ecosystem  
**Used For:**
- RESTful API endpoints
- Middleware (CORS, JWT, error handling)
- Request routing
- Response formatting

**Structure:**
```typescript
// index.ts
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/matching', matchingRoutes);

// Error handler
app.use(errorHandler);

app.listen(5000);
```

**Triggers:**
- HTTP request → Route handler
- Middleware → Request processing
- Error → Error handler

**Outcome:** Organized, maintainable API

---

### MongoDB 7.x + Mongoose 8.x
**Purpose:** NoSQL database + ODM  
**Why:** Flexible schema, scalable, JSON-like documents  
**Used For:**
- Storing users, riders, orders, matches
- Geospatial queries (2dsphere indexes)
- Complex aggregations
- Transactions

**Models:**
1. **User** - Authentication, profile
2. **Rider** - Rider details, stats, location
3. **Order** - Food/ride orders, status
4. **Match** - Matched orders, earnings

**Example:**
```typescript
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  platform: { type: String, required: true },
  status: { type: String, enum: ['pending', 'matched', 'active'] },
  pickup: {
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    address: String
  }
});

// Geospatial index
orderSchema.index({ 'pickup.location': '2dsphere' });
```

**Triggers:**
- API call → Database query
- Match created → Insert document
- Order updated → Update document

**Outcome:** Persistent, queryable data storage

---

### JWT (jsonwebtoken)
**Purpose:** Stateless authentication  
**Why:** Secure, scalable, no server-side sessions  
**Used For:**
- User authentication
- Token generation on login
- Token verification on protected routes
- Role-based access control

**Flow:**
```typescript
// Login
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

**Triggers:**
- User logs in → Token generated
- API request → Token verified
- Token expired → 401 Unauthorized

**Outcome:** Secure, stateless authentication

---

## 🗄️ DATABASE & STORAGE

### MongoDB Atlas (Production)
**Purpose:** Cloud-hosted MongoDB  
**Why:** Managed service, automatic backups, scaling  
**Used For:**
- Production database
- Automatic failover
- Performance monitoring
- Backup and restore

**Configuration:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ryzo
```

**Triggers:**
- App starts → Connect to MongoDB
- Query executed → Database responds
- Connection lost → Auto-reconnect

**Outcome:** Reliable, scalable database

---

### SpacetimeDB Cloud
**Purpose:** Real-time database as a service  
**Why:** Built for real-time sync, WebSocket-based, low latency  
**Used For:**
- Cross-device synchronization
- Real-time match notifications
- Order status updates
- Rider location tracking

**Tables:**
1. **active_match** - Current matches
2. **order_status** - Order updates
3. **agent_decision** - AI decisions
4. **rider_location** - GPS tracking

**Reducers:**
1. **insert_match** - Create new match
2. **update_order_status** - Update order
3. **update_match_status** - Update match
4. **log_agent_decision** - Log AI decision

**Triggers:**
- Reducer called → Table updated
- Table updated → All clients notified
- Client subscribes → Receive initial data

**Outcome:** Real-time data synchronization

---

## 🌐 EXTERNAL SERVICES

### Google Maps API
**Purpose:** Mapping and routing  
**Why:** Accurate, reliable, comprehensive  
**Used For:**
- Directions API - Turn-by-turn navigation
- Distance Matrix API - Route optimization
- Maps JavaScript API - Map display
- Geocoding API - Address to coordinates

**Services Used:**
1. **Directions API**
   ```typescript
   GET /directions/json?
     origin=23.2599,77.4126&
     destination=23.2156,77.4395&
     waypoints=23.2400,77.4500&
     mode=driving
   ```
   Returns: Steps, distance, duration, polyline

2. **Distance Matrix API**
   ```typescript
   GET /distancematrix/json?
     origins=23.2599,77.4126|23.2400,77.4500&
     destinations=23.2156,77.4395|23.2100,77.4200
   ```
   Returns: Distance matrix for all combinations

**Fallback:** Haversine formula for straight-line distance

**Triggers:**
- Navigation starts → Directions API
- Match calculation → Distance Matrix API
- Map loads → Maps JavaScript API

**Outcome:** Accurate routing and navigation

---

### ArmorIQ API
**Purpose:** AI-powered decision validation  
**Why:** Intelligent match validation, risk assessment  
**Used For:**
- Match approval/rejection
- Confidence scoring
- Risk assessment
- Audit trail

**Request:**
```typescript
POST /agents/{agentId}/validate
{
  context: {
    order1Id, order2Id, riderId,
    overlapScore, combinedEarnings
  },
  rules: [
    'overlap_score >= 50',
    'combined_earnings >= 50',
    'rider_rating >= 4.0'
  ]
}
```

**Response:**
```typescript
{
  approved: true,
  reason: "Match approved: 84% overlap, ₹142 earnings",
  confidence: 0.95,
  riskScore: 0.05
}
```

**Fallback:** Rule-based validation in `armoriqService.ts`

**Triggers:**
- Match found → Validate with ArmorIQ
- API fails → Use rule-based fallback
- Decision made → Log to database

**Outcome:** Intelligent, auditable decisions

---

### ElevenLabs API
**Purpose:** Text-to-speech for voice navigation  
**Why:** Natural-sounding voices, multiple languages  
**Used For:**
- Turn-by-turn voice instructions
- Navigation announcements
- Arrival notifications

**Request:**
```typescript
POST /text-to-speech/{voiceId}
{
  text: "Turn left in 200 meters",
  model_id: "eleven_monolingual_v1",
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.5
  }
}
```

**Response:** Audio buffer (MP3)

**Fallback:** Web Speech API (`speechSynthesis`)

**Triggers:**
- Navigation step → Generate speech
- Audio ready → Play instruction
- API fails → Use browser TTS

**Outcome:** Natural voice guidance

---

## 🛠️ DEVELOPMENT TOOLS

### ESLint + Prettier
**Purpose:** Code quality and formatting  
**Why:** Consistent code style, catch errors early  
**Used For:**
- Linting TypeScript/JavaScript
- Auto-formatting on save
- Pre-commit hooks (future)

**Configuration:**
```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}

// .prettierrc.json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

**Triggers:**
- File saved → Auto-format
- Build → Lint check
- CI/CD → Fail on errors

**Outcome:** Clean, consistent codebase

---

### TypeScript Compiler (tsc)
**Purpose:** Compile TypeScript to JavaScript  
**Why:** Type checking, ES6+ support, source maps  
**Used For:**
- Backend compilation
- Type checking
- Build process

**Configuration:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  }
}
```

**Triggers:**
- `npm run build` → Compile TypeScript
- `npm run dev` → Watch mode
- Type error → Build fails

**Outcome:** Type-safe, compiled JavaScript

---

## 🔄 TECHNOLOGY INTERACTIONS

### Complete Request Flow
```
User Action (Frontend)
    ↓
React Component
    ↓
Zustand Store (state update)
    ↓
Axios HTTP Request
    ↓
Express Route Handler
    ↓
Controller (business logic)
    ↓
Service Layer
    ├─→ MongoDB (data persistence)
    ├─→ Google Maps API (routing)
    ├─→ ArmorIQ API (validation)
    └─→ SpacetimeDB (real-time sync)
    ↓
Response to Frontend
    ↓
Zustand Store Update
    ↓
React Re-render
    ↓
UI Updates
```

### Real-Time Sync Flow
```
Device 1: User Action
    ↓
Frontend: spacetimeService.pushOrderToSpacetime()
    ↓
SpacetimeDB: conn.reducers.updateOrderStatus()
    ↓
SpacetimeDB Server: Broadcast to all clients
    ↓
Device 2, 3, 4: useSpacetimeDB hook receives update
    ↓
React State Updates
    ↓
UI Re-renders on all devices
```

### Matching Flow
```
Frontend: Both orders placed
    ↓
Backend: POST /api/matching/find-match
    ↓
matchingService.findMatch()
    ├─→ MongoDB: Fetch orders
    ├─→ Calculate overlap (Haversine)
    ├─→ Find best rider (MongoDB query)
    ├─→ ArmorIQ: Validate match
    └─→ MongoDB: Create match document
    ↓
spacetimeService.pushMatchToSpacetime()
    ↓
SpacetimeDB: Broadcast match
    ↓
All Devices: Receive notification
```

---

## 📊 TECHNOLOGY SUMMARY TABLE

| Technology | Category | Purpose | Fallback |
|------------|----------|---------|----------|
| Next.js | Frontend Framework | SSR, Routing | N/A |
| React | UI Library | Components | N/A |
| TypeScript | Language | Type Safety | JavaScript |
| Tailwind | Styling | CSS Framework | Inline CSS |
| Zustand | State | Global State | React Context |
| Axios | HTTP | API Calls | Fetch API |
| SpacetimeDB | Real-time | Cross-device Sync | Required |
| Node.js | Runtime | Server | N/A |
| Express | Backend Framework | API Server | N/A |
| MongoDB | Database | Data Storage | N/A |
| Mongoose | ODM | Schema Modeling | Native Driver |
| JWT | Auth | Token Auth | Sessions |
| Google Maps | Mapping | Navigation | Haversine |
| ArmorIQ | AI | Decision Making | Rule-based |
| ElevenLabs | Voice | TTS | Web Speech API |
| ESLint | Linting | Code Quality | N/A |
| Prettier | Formatting | Code Style | N/A |

---

**This stack provides:**
- ✅ Type-safe development (TypeScript)
- ✅ Real-time synchronization (SpacetimeDB)
- ✅ Intelligent matching (ArmorIQ + algorithms)
- ✅ Accurate navigation (Google Maps)
- ✅ Natural voice guidance (ElevenLabs)
- ✅ Scalable architecture (Node.js + MongoDB)
- ✅ Production-ready (Next.js + optimizations)
- ✅ Fault-tolerant (fallbacks for all external services)
