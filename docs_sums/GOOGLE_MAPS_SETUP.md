# Google Maps API Setup Guide

## Quick Setup (5 minutes)

### Step 1: Go to Google Cloud Console

Visit: https://console.cloud.google.com/

### Step 2: Create a Project

1. Click "Select a project" dropdown (top bar)
2. Click "New Project"
3. Name: `RYZO` or `RYZO-HackByte`
4. Click "Create"
5. Wait for project creation (10-15 seconds)
6. Select your new project from the dropdown

### Step 3: Enable Maps JavaScript API

1. In the left sidebar, go to: **APIs & Services** → **Library**
2. Search for: `Maps JavaScript API`
3. Click on it
4. Click **"Enable"** button
5. Wait for it to enable (5-10 seconds)

### Step 4: Create API Key

1. In the left sidebar, go to: **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** (top bar)
3. Select **"API Key"**
4. A popup will show your API key — **Copy it!**
5. Click "Close" (we'll restrict it in the next step)

### Step 5: Restrict API Key (Important!)

1. Find your newly created API key in the list
2. Click the **pencil icon** (Edit) next to it
3. Under **"Application restrictions"**:
   - Select: **"HTTP referrers (web sites)"**
   - Click **"Add an item"**
   - Add: `http://localhost:3000/*`
   - Click **"Add an item"** again
   - Add: `http://localhost:*/*` (for any local port)
   - If you have a Vercel URL, add: `https://your-app.vercel.app/*`
   
4. Under **"API restrictions"**:
   - Select: **"Restrict key"**
   - Check: **"Maps JavaScript API"**
   
5. Click **"Save"** at the bottom

### Step 6: Add to Your Project

1. Open `ryzo/frontend/.env.local`
2. Replace the placeholder:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

3. Save the file

### Step 7: Restart Dev Server

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### Step 8: Verify It Works

1. Open http://localhost:3000
2. Navigate to Screen 9 (Order Detail) or Screen 10 (Active Navigation)
3. You should see Google Maps with dark theme and routes

---

## Troubleshooting

### Error: "This page can't load Google Maps correctly"

**Solution:** Your API key restrictions are too strict.

1. Go back to Google Cloud Console → Credentials
2. Click on your API key
3. Under "Application restrictions", temporarily select **"None"**
4. Save and test again
5. Once working, add back the HTTP referrer restrictions

### Error: "Google Maps JavaScript API error: RefererNotAllowedMapError"

**Solution:** Add your current URL to allowed referrers.

1. Check what URL you're accessing (e.g., `http://localhost:3000`)
2. Go to API key settings
3. Add that exact URL pattern: `http://localhost:3000/*`
4. Save

### Error: "This API project is not authorized to use this API"

**Solution:** Enable the Maps JavaScript API.

1. Go to APIs & Services → Library
2. Search "Maps JavaScript API"
3. Click "Enable"

### Maps show but are blank/grey

**Solution:** Billing not enabled (Google requires it even for free tier).

1. Go to Billing in Google Cloud Console
2. Link a credit card (you won't be charged for demo usage)
3. Google gives $200 free credit per month
4. RYZO demo uses < $1 of that

---

## Free Tier Limits

Google Maps offers generous free tier:
- **$200 free credit per month**
- Maps JavaScript API: 28,000 loads per month free
- For RYZO demo: ~100-200 loads during hackathon
- **Cost: $0** (well within free tier)

---

## For Demo Day

### Option 1: Use Your Personal Key
- Keep restrictions on localhost and Vercel domain
- Monitor usage in Google Cloud Console
- Should cost $0 for demo

### Option 2: Create Hackathon-Specific Key
- Create a separate key just for the event
- Add demo URL to restrictions
- Delete key after hackathon

### Option 3: Fallback to Mock Map
- If API issues on demo day, the app shows a placeholder
- Demo still works, just without live maps
- Explain: "Maps integration ready, API key restricted for security"

---

## Security Best Practices

✅ **DO:**
- Restrict API key to specific domains
- Use environment variables (never commit keys)
- Enable only required APIs
- Monitor usage in Cloud Console
- Delete unused keys after hackathon

❌ **DON'T:**
- Commit API keys to GitHub
- Use unrestricted keys in production
- Share keys publicly
- Leave test keys active indefinitely

---

## Quick Reference

**Google Cloud Console:** https://console.cloud.google.com/
**API Key Location:** APIs & Services → Credentials
**Enable APIs:** APIs & Services → Library
**Monitor Usage:** APIs & Services → Dashboard

**Environment Variable:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-key-here
```

**Restart Command:**
```bash
npm run dev
```

---

## Need Help?

- Google Maps Documentation: https://developers.google.com/maps/documentation/javascript
- API Key Best Practices: https://developers.google.com/maps/api-security-best-practices
- Billing FAQ: https://developers.google.com/maps/billing-and-pricing/billing

---

**Estimated Setup Time:** 5 minutes
**Cost:** $0 (free tier)
**Difficulty:** Easy ⭐

Good luck! 🗺️
