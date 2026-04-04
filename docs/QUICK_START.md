# RYZO Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally or connection string
- Git

## 1. Environment Setup

### Backend (.env)
```bash
cd ryzo/backend
cp .env.example .env
```

Edit `ryzo/backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/ryzo
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```bash
cd ryzo/frontend
```

Edit `ryzo/frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_SPACETIMEDB_URI=wss://maincloud.spacetimedb.com
NEXT_PUBLIC_SPACETIMEDB_MODULE=ryzo-0r856
```

## 2. Install Dependencies

```bash
# Backend
cd ryzo/backend
npm install

# Frontend
cd ryzo/frontend
npm install
```

## 3. Seed Database

```bash
cd ryzo/backend
npm run seed
```

This creates:
- Demo rider (ID: 679f1234567890abcdef1234)
- Demo user
- 2 pending orders

## 4. Start Services

### Terminal 1 - Backend
```bash
cd ryzo/backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd ryzo/frontend
npm run dev
```

## 5. Test the App

1. Open http://localhost:3000
2. Splash → Role Selection → Choose "Rider"
3. Add 2+ apps (mock login)
4. Dashboard loads with REAL backend data!

## Demo Credentials
- Rider ID: `679f1234567890abcdef1234`
- Stored automatically in localStorage after first login
