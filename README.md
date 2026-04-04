# RYZO — One Rider. Every Platform.

<div align="center">

![RYZO Logo](https://img.shields.io/badge/RYZO-FC8019?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMiAyMkgyMkwxMiAyWiIgZmlsbD0iI0ZDODAxOSIvPgo8L3N2Zz4=)

**Unified delivery and ride efficiency engine for Indian cities**

Built for HackByte 4.0 — IIITDM Jabalpur

[Live Demo](#) • [Documentation](docs/) • [Video Demo](#)

</div>

---

## 🎯 The Problem

In any Indian city at peak hours, hundreds of delivery riders and ride drivers are traveling the same roads simultaneously, each serving a different platform, each making a separate redundant trip.

A Swiggy rider and a Rapido driver going 80% of the same route have no way to coordinate. Both complete their tasks separately.

**The result:**
- Duplicate fuel consumption for identical road coverage
- Riders earning from only one task when two are possible
- Users paying full price when a shared-route discount exists
- Higher traffic density from preventable redundant trips
- Elevated carbon emissions from unnecessary vehicle movement

---

## 💡 The Solution

RYZO introduces an opt-in "Flexible" mode for users. When a user accepts a small additional wait (5–15 min), RYZO's AI matching engine activates — scanning all active rider routes for a ≥70% path overlap with the pending order.

**If a match is found:**
- Both users get a discount automatically
- The matched rider gets a unified task with higher earnings
- The AI calculates the most efficient combined route
- ElevenLabs delivers voice-guided navigation hands-free

**If no match is found:**
- The order falls back to standard delivery instantly
- Zero penalty, zero downside for the user

---

## 🚀 The Demo

RYZO is demonstrated as a single webpage showing three phone-framed UIs side by side — each representing a different app in the ecosystem, all connected via the same backend.

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [ZOMATO CLONE]    [RYZO MAIN APP]    [RAPIDO CLONE]     │
│                                                          │
│  Left Phone        Center Phone       Right Phone        │
│  Food delivery     Bridge app +       Ride booking       │
│  with Flexible     Rider Dashboard    with Flexible      │
│  button injected   (full RYZO flow)   button injected    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**THE DEMO MOMENT:** When a match is triggered, all three phones update simultaneously in real-time via SpacetimeDB.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.2.2** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS v4** — Utility-first styling
- **Framer Motion** — Premium animations
- **Zustand** — State management
- **Google Maps API** — Route visualization
- **SpacetimeDB** — Real-time sync

### Backend
- **Node.js 22.x** — Runtime
- **Express** — REST API framework
- **TypeScript** — Type-safe backend
- **MongoDB Atlas** — Database with geospatial queries
- **Mongoose** — ODM

### AI & Integrations
- **Google Gemini 1.5 Pro** — Route overlap calculation
- **ArmorIQ** — Agent-based matching rules
- **ElevenLabs** — Voice navigation
- **SpacetimeDB** — Real-time state sync
- **Google Maps** — Route visualization

### Infrastructure
- **Vultr** — Backend hosting
- **Vercel** — Frontend hosting
- **MongoDB Atlas** — Database hosting
- **PM2** — Process management
- **Nginx** — Reverse proxy

---

## 📁 Project Structure

```
ryzo/
├── frontend/                 # Next.js 16 app
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   │   ├── layout/      # Phone frames, layout
│   │   │   ├── ryzo/        # 10 RYZO screens
│   │   │   ├── zomato/      # Zomato clone
│   │   │   ├── rapido/      # Rapido clone
│   │   │   └── shared/      # Reusable components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # Utilities, API client
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── backend/                  # Express API
│   ├── src/
│   │   ├── index.ts         # Server entry
│   │   ├── config/          # DB connection
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # External APIs
│   │   ├── agents/          # ArmorIQ agent
│   │   └── middleware/      # Auth, error handling
│   └── package.json
│
└── docs/                     # Documentation
    ├── PRD.md               # Product requirements
    ├── PAGES.md             # Screen specifications
    ├── CONTENT.md           # Copy and data
    ├── BRAND.md             # Design system
    ├── TECH_STACK.md        # Technical details
    ├── DEPLOYMENT.md        # Deployment guide
    ├── QA_CHECKLIST.md      # QA checklist
    ├── DEMO_SCRIPT.md       # 60-second demo script
    └── PHASE_12_COMPLETE.md # Final status
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 22.x or higher
- MongoDB Atlas account
- **Google Maps API key** (see [GOOGLE_MAPS_SETUP.md](docs/GOOGLE_MAPS_SETUP.md))
- API keys for: Gemini, ElevenLabs, ArmorIQ, SpacetimeDB (optional for demo)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/ryzo.git
cd ryzo
```

2. **Setup Backend**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

3. **Setup Frontend**

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your API keys
# IMPORTANT: Get a Google Maps API key (see docs/GOOGLE_MAPS_SETUP.md)
npm run dev
```

4. **Open in browser**

```
http://localhost:3000
```

---

## 📖 Documentation

- **[PRD.md](docs/PRD.md)** — Complete product requirements with RALPH loop
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Vultr + Vercel deployment guide
- **[QA_CHECKLIST.md](docs/QA_CHECKLIST.md)** — Comprehensive QA checklist
- **[DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)** — 60-second demo script
- **[TECH_STACK.md](docs/TECH_STACK.md)** — Technical architecture
- **[PAGES.md](docs/PAGES.md)** — All 10 screen specifications
- **[CONTENT.md](docs/CONTENT.md)** — Copy, data, voice scripts
- **[BRAND.md](docs/BRAND.md)** — Design system and guidelines

---

## 🎨 Features

### For Users
- ✅ Opt-in "Flexible" mode for guaranteed discounts
- ✅ 20-30% cost savings on matched orders
- ✅ Zero penalty if no match found
- ✅ Real-time notifications across platforms
- ✅ Transparent pricing and time estimates

### For Riders
- ✅ Unified dashboard across all platforms
- ✅ 30-40% higher earnings per hour
- ✅ AI-optimized routes with voice navigation
- ✅ Reduced fuel costs and vehicle wear
- ✅ Smart order pairing with capacity limits

### Technical Highlights
- ✅ Real-time sync across three phones via SpacetimeDB
- ✅ AI route overlap calculation with Gemini 1.5 Pro
- ✅ Agent-based matching rules with ArmorIQ
- ✅ Natural voice navigation with ElevenLabs
- ✅ Dark-themed Google Maps with animated polylines
- ✅ Premium animations with Framer Motion
- ✅ Type-safe throughout (TypeScript strict mode)
- ✅ Zero build errors, zero warnings

---

## 🎯 Impact

### Environmental
- 25-30% reduction in vehicle trips
- ~25,000 liters fuel saved daily (Mumbai scale)
- ~20,000 tons CO2 prevented annually

### Economic
- Users save ₹40-60 per order
- Riders earn ₹300-400 more per day
- Platforms reduce operational costs

### Social
- Less traffic congestion
- Improved rider quality of life
- More efficient urban logistics

---

## 🏆 Hackathon Alignment

**Event:** HackByte 4.0 — IIITDM Jabalpur  
**Track:** Open Innovation (Main Prize)  
**Theme:** Patch the Reality (Bonus Alignment)

### Sponsor Integration

- **MongoDB** — Geospatial queries, document storage
- **Google Gemini** — Route intelligence, natural language
- **ArmorIQ** — Agent-based decision making
- **ElevenLabs** — Voice navigation
- **SpacetimeDB** — Real-time sync (THE DEMO MOMENT)
- **Vultr** — Backend hosting
- **Google Maps** — Route visualization

---

## 📊 Demo Metrics

- **Build Time:** 12 phases, ~40 hours
- **Lines of Code:** ~8,000 (frontend + backend)
- **Components:** 25+ React components
- **API Endpoints:** 12 REST endpoints
- **Screens:** 10 RYZO screens + 2 clone apps
- **Integrations:** 7 external APIs
- **Animations:** 15+ custom animations
- **Documentation:** 2,500+ lines

---

## 🎬 Demo Flow (60 seconds)

1. **[0-10s]** Show three phones, explain problem
2. **[10-25s]** Trigger match, all phones update simultaneously
3. **[25-40s]** Show AI comparison table, explain integrations
4. **[40-50s]** Show voice navigation and Google Maps
5. **[50-60s]** Summarize impact, mention sponsors

---

## 🚀 Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

**Quick Deploy:**

```bash
# Backend (Vultr)
ssh root@YOUR_VULTR_IP
cd /var/www/ryzo/backend
npm install && npm run build
pm2 start dist/index.js --name ryzo-backend

# Frontend (Vercel)
vercel --prod
```

---

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run build  # Should pass with 0 errors

# Backend
cd backend
npm run build  # Should pass with 0 errors

# Test API
curl http://localhost:5000/health
```

---

## 📝 License

MIT License — See [LICENSE](LICENSE) for details

---

## 👥 Team

Built with ❤️ for HackByte 4.0

---

## 🙏 Acknowledgments

- **HackByte 4.0** — For the opportunity
- **IIITDM Jabalpur** — For hosting
- **All Sponsors** — For amazing APIs and tools
- **Open Source Community** — For incredible libraries

---

## 📞 Contact

- **Live Demo:** [YOUR_DEMO_URL]
- **GitHub:** [YOUR_GITHUB_URL]
- **Email:** [YOUR_EMAIL]

---

<div align="center">

**RYZO — Patching the Reality of Urban Logistics**

Made with 🚀 for HackByte 4.0

</div>
