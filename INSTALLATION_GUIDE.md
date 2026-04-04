# RYZO Installation & Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Git

## Step 1: Install Backend Dependencies

```bash
cd ryzo/backend
npm install axios@^1.7.2
npm install --save-dev @typescript-eslint/eslint-plugin@^6.21.0 @typescript-eslint/parser@^6.21.0 eslint@^8.57.0 eslint-config-prettier@^9.1.0 prettier@^3.2.5
```

## Step 2: Install Frontend Dependencies

```bash
cd ryzo/frontend
npm install
```

## Step 3: Environment Configuration

### Backend (.env)
File already exists at `ryzo/backend/.env` with:
- MongoDB Atlas connection
- ElevenLabs API key
- ArmorIQ API key
- SpacetimeDB config

### Frontend (.env.local)
File already exists at `ryzo/frontend/.env.local` with:
- Google Maps API key
- Backend API URL
- SpacetimeDB config

## Step 4: Seed Database

```bash
cd ryzo/backend
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
✅ Created demo rider: Rahul Kumar
✅ Created demo user: Demo User
✅ Created demo orders: [order1_id] [order2_id]
🎉 Seed completed successfully!
```

## Step 5: Build & Verify

### Backend Build
```bash
cd ryzo/backend
npm run build
```

Should complete with 0 errors.

### Frontend Build
```bash
cd ryzo/frontend
npm run build
```

Should complete with 0 errors.

## Step 6: Start Development Servers

### Terminal 1 - Backend
```bash
cd ryzo/backend
npm run dev
```

Expected output:
```
✅ MongoDB connected
RYZO backend running on port 5000
```

### Terminal 2 - Frontend
```bash
cd ryzo/frontend
npm run dev
```

Expected output:
```
▲ Next.js 16.2.2
- Local: http://localhost:3000
```

## Step 7: Test the Application

1. Open http://localhost:3000
2. Splash Screen → Role Selection → Choose "Rider"
3. Rider Integration → Add 2+ apps (mock login)
4. Dashboard unlocks → Real data loads from MongoDB!
5. Trigger match from Zomato + Rapido phones
6. Backend matching service runs
7. ArmorIQ validates match
8. Match appears on rider dashboard
9. Accept match → Navigate with voice + maps

## Step 8: Verify Services

### Check Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "RYZO API",
  "timestamp": "2024-..."
}
```

### Check Rider Profile
```bash
curl http://localhost:5000/api/riders/679f1234567890abcdef1234
```

Should return rider profile data.

## Step 9: Run Linting (Optional)

### Backend
```bash
cd ryzo/backend
npm run lint
npm run format
```

### Frontend
```bash
cd ryzo/frontend
npm run lint
```

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas: Whitelist your IP address

### Port Already in Use
- Backend: Change PORT in `.env`
- Frontend: Use `npm run dev -- -p 3001`

### API Key Errors
- Google Maps: Verify key in `.env.local`
- ElevenLabs: Check key in backend `.env`
- ArmorIQ: Verify API endpoint and key

### Build Errors
- Delete `node_modules` and reinstall
- Clear Next.js cache: `rm -rf .next`
- Clear TypeScript cache: `rm -rf tsconfig.tsbuildinfo`

## Production Deployment

### Backend
```bash
cd ryzo/backend
npm run build
npm start
```

### Frontend
```bash
cd ryzo/frontend
npm run build
npm start
```

### Environment Variables
Set all required env vars in production:
- `MONGODB_URI`
- `GOOGLE_MAPS_API_KEY`
- `ELEVENLABS_API_KEY`
- `ARMORIQ_API_KEY`
- `JWT_SECRET`
- `SPACETIMEDB_URI`

## Demo Credentials

- Rider ID: `679f1234567890abcdef1234`
- Automatically set after first login
- Stored in localStorage as `ryzo_rider_id`

## Support

For issues, check:
1. `docs/PRODUCTION_STATUS.md` - Current implementation status
2. `docs/FLOW_ANALYSIS.md` - Complete flow analysis
3. `docs/BACKEND_INTEGRATION_COMPLETE.md` - Backend integration details
