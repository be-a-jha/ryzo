# RYZO Deployment Guide
# Vultr + Vercel Deployment for HackByte 4.0 Demo

---

## Prerequisites

- Vultr account (for backend hosting)
- Vercel account (for frontend hosting, optional)
- MongoDB Atlas cluster (already set up)
- All API keys ready:
  - Google Maps API key
  - Gemini API key
  - ElevenLabs API key
  - ArmorIQ API key
  - SpacetimeDB credentials

---

## Part 1: Backend Deployment (Vultr)

### Step 1: Create Vultr Instance

1. Log in to Vultr dashboard
2. Deploy New Server → Cloud Compute
3. Choose location: Mumbai (closest to demo location)
4. Server Type: Ubuntu 22.04 LTS
5. Plan: $6/month (2 vCPU, 2GB RAM) — sufficient for demo
6. Add SSH key or use password
7. Deploy instance

### Step 2: Initial Server Setup

SSH into your Vultr instance:

```bash
ssh root@YOUR_VULTR_IP
```

Update system:

```bash
apt update && apt upgrade -y
```

Install Node.js 22.x:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node --version  # Verify: v22.x.x
```

Install PM2 (process manager):

```bash
npm install -g pm2
```

Install Nginx (reverse proxy):

```bash
apt install -y nginx
```

### Step 3: Clone Repository

```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/ryzo.git
cd ryzo/backend
```

### Step 4: Configure Environment Variables

Create `.env` file:

```bash
nano .env
```

Add all environment variables:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://YOUR_MONGODB_URI
GEMINI_API_KEY=YOUR_GEMINI_KEY
ELEVENLABS_API_KEY=YOUR_ELEVENLABS_KEY
ELEVENLABS_VOICE_ID=YOUR_VOICE_ID
JWT_SECRET=YOUR_JWT_SECRET
SPACETIMEDB_URI=ws://YOUR_SPACETIMEDB_URI
ARMORIQ_API_KEY=YOUR_ARMORIQ_KEY
ARMORIQ_AGENT_ID=YOUR_AGENT_ID
FRONTEND_URL=https://YOUR_FRONTEND_URL
```

Save and exit (Ctrl+X, Y, Enter)

### Step 5: Install Dependencies and Build

```bash
npm install
npm run build
```

### Step 6: Start Backend with PM2

```bash
pm2 start dist/index.js --name ryzo-backend
pm2 save
pm2 startup  # Follow the command it outputs
```

Verify backend is running:

```bash
pm2 status
pm2 logs ryzo-backend
```

Test health endpoint:

```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","service":"RYZO API"}
```

### Step 7: Configure Nginx Reverse Proxy

Create Nginx config:

```bash
nano /etc/nginx/sites-available/ryzo
```

Add configuration:

```nginx
server {
    listen 80;
    server_name YOUR_VULTR_IP;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site and restart Nginx:

```bash
ln -s /etc/nginx/sites-available/ryzo /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

### Step 8: Test Public Access

From your local machine:

```bash
curl http://YOUR_VULTR_IP/health
```

Should return the health check JSON.

Test all endpoints:

```bash
# Test matching endpoint
curl -X POST http://YOUR_VULTR_IP/api/matching/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "riderId": "507f1f77bcf86cd799439011",
    "orderIds": ["507f1f77bcf86cd799439012"],
    "platforms": ["swiggy", "rapido"]
  }'
```

---

## Part 2: Frontend Deployment (Vercel)

### Option A: Deploy to Vercel (Recommended)

1. Push code to GitHub repository
2. Go to vercel.com and sign in
3. Import your repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `ryzo/frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables in Vercel dashboard:

```env
NEXTAUTH_URL=https://YOUR_VERCEL_URL
NEXTAUTH_SECRET=YOUR_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_MAPS_KEY
NEXT_PUBLIC_API_URL=http://YOUR_VULTR_IP
NEXT_PUBLIC_SPACETIMEDB_URI=ws://YOUR_SPACETIMEDB_URI
NEXT_PUBLIC_SPACETIMEDB_MODULE=ryzo
```

6. Deploy!

### Option B: Deploy Frontend on Same Vultr Instance

If you want everything on one server:

```bash
cd /var/www/ryzo/frontend
npm install
npm run build

# Serve with PM2
pm2 start npm --name ryzo-frontend -- start
pm2 save
```

Update Nginx to serve both:

```nginx
server {
    listen 80;
    server_name YOUR_VULTR_IP;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Part 3: Final Testing

### Test Complete Demo Flow

1. Open frontend URL in browser
2. Click "Order with Flexible Delivery" on Zomato phone
3. Verify all three phones update simultaneously
4. Check browser console for any errors
5. Accept match in RYZO phone
6. Verify navigation screen loads with Google Maps
7. Check voice plays (or fallback text appears)

### Performance Check

```bash
# Check backend response times
curl -w "@curl-format.txt" -o /dev/null -s http://YOUR_VULTR_IP/health

# Create curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_total:  %{time_total}\n
```

All endpoints should respond in < 500ms.

### Monitor Logs

```bash
# Backend logs
pm2 logs ryzo-backend

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Part 4: Demo Day Checklist

### Before Demo

- [ ] Test demo URL on actual demo device (laptop)
- [ ] Verify all three phones visible at 1920px width
- [ ] Test match trigger 3 times successfully
- [ ] Verify voice plays through laptop speakers
- [ ] Check internet connection at venue
- [ ] Have backup screen recording ready
- [ ] Print QR code linking to live demo URL
- [ ] Charge laptop fully

### Backup Plan

If live demo fails:

1. Play pre-recorded screen recording (60 seconds)
2. Show GitHub repository with code
3. Explain architecture with diagram
4. Show MongoDB Atlas dashboard with live data

### Demo URL

Your live demo URL: `http://YOUR_VULTR_IP` or `https://YOUR_VERCEL_URL`

---

## Troubleshooting

### Backend Not Starting

```bash
pm2 logs ryzo-backend --lines 50
# Check for MongoDB connection errors
# Verify all env vars are set correctly
```

### Frontend Build Fails

```bash
# Check Node version
node --version  # Should be 22.x

# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### CORS Errors

Update backend `.env`:

```env
FRONTEND_URL=https://YOUR_ACTUAL_FRONTEND_URL
```

Restart backend:

```bash
pm2 restart ryzo-backend
```

### Maps Not Loading

- Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check Google Cloud Console for API restrictions
- Enable Maps JavaScript API and Directions API

---

## Cost Estimate

- Vultr: $6/month (can cancel after hackathon)
- Vercel: Free tier (sufficient for demo)
- MongoDB Atlas: Free tier M0
- Total: ~$6 for demo month

---

## Post-Hackathon

To keep costs minimal:

1. Stop Vultr instance (or destroy it)
2. Keep Vercel deployment (free)
3. Keep MongoDB Atlas (free tier)
4. Repository stays on GitHub (free)

Demo will remain accessible via Vercel URL with mock data fallback.
