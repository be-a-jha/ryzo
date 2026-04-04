# Cross-Device Testing Guide

## 🎯 What Was Fixed

The issue was that Zustand state is LOCAL to each browser tab/window. When Device 1 (Zomato) clicked "Order", it only updated its own local state. Device 2 (Rapido) had no way to know Device 1 already clicked.

### Solution
Now the app uses SpacetimeDB as the source of truth:
1. Device 1 clicks → Pushes order to SpacetimeDB
2. Device 2 clicks → Pushes order to SpacetimeDB
3. ALL devices listen to SpacetimeDB `order_status` table
4. When BOTH orders detected → Trigger match on ALL devices
5. Match pushed to SpacetimeDB → Rider popup appears

## 🧪 Testing Steps

### Setup (One Time)
1. Make sure SpacetimeDB module is deployed and running
2. Check `.env.local` has correct SpacetimeDB URI and module name

### Test Scenario 1: Same Computer, Different Browsers

**Device 1 (Zomato):**
```
1. Open Chrome: http://localhost:3000
2. Look at LEFT phone (Zomato)
3. Click "Order with Flexible Delivery"
4. Should see: "Flexible order placed! Waiting for ride match..."
```

**Device 2 (Rapido):**
```
1. Open Brave (or Chrome Incognito): http://localhost:3000
2. Look at RIGHT phone (Rapido)
3. Click "Book Flexible Ride"
4. Should see: "Flexible ride booked! Waiting for delivery match..."
```

**Device 3 (Rider):**
```
1. Open Firefox (or another browser): http://localhost:3000
2. Look at CENTER phone (RYZO)
3. Login as rider (skip to Screen 8)
4. Should see: POPUP appears with match details!
```

### Test Scenario 2: Different Physical Devices

**Find your computer's IP address:**
```bash
# Windows
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)

# Mac/Linux
ifconfig
# Look for inet address
```

**Device 1 (Phone/Tablet - Zomato):**
```
1. Connect to same WiFi network
2. Open browser: http://192.168.1.100:3000
3. Click "Order with Flexible Delivery"
```

**Device 2 (Another Phone - Rapido):**
```
1. Connect to same WiFi network
2. Open browser: http://192.168.1.100:3000
3. Click "Book Flexible Ride"
```

**Device 3 (Laptop - Rider):**
```
1. Open browser: http://localhost:3000
2. Login as rider
3. Wait for popup!
```

## 🔍 Debugging

### Check SpacetimeDB Connection
Open browser console (F12) and look for:
```
✅ SpacetimeDB connected: <identity>
✅ SpacetimeDB subscriptions applied
✅ SpacetimeDB Connected (green dot on rider dashboard)
```

### Check Order Sync
When you click "Order" or "Book Ride", console should show:
```
[SpacetimeDB] Order synced: zomato_1234... (zomato)
[SpacetimeDB] Order synced: rapido_5678... (rapido)
```

### Check Match Trigger
When both orders are placed, console should show:
```
[useMatchTrigger] Both orders detected! Triggering match...
[SpacetimeDB] Match synced: match_9012... (84% overlap)
```

### Check Rider Popup
On rider device, console should show:
```
[RiderDashboard] Match from SpacetimeDB: {...}
SpacetimeDB: new match inserted: match_9012...
```

## ❌ Common Issues

### Issue 1: "SpacetimeDB Offline" (red dot)
**Cause:** SpacetimeDB module not running or wrong URI/module name  
**Fix:**
1. Check `.env.local`:
   ```env
   NEXT_PUBLIC_SPACETIMEDB_URI=wss://maincloud.spacetimedb.com
   NEXT_PUBLIC_SPACETIMEDB_MODULE=ryzo-0r856
   ```
2. Verify module is deployed on SpacetimeDB cloud
3. Restart dev server: `npm run dev`

### Issue 2: Orders placed but no match
**Cause:** `useMatchTrigger` hook not running  
**Fix:**
1. Check browser console for errors
2. Verify `useMatchTrigger()` is called in `page.tsx`
3. Check if both orders are in SpacetimeDB:
   - Open browser console
   - Type: `window.spacetimeOrders` (if you add debug logging)

### Issue 3: Match created but no popup on rider
**Cause:** Rider not subscribed to SpacetimeDB matches  
**Fix:**
1. Check rider is on Screen 8 (Dashboard)
2. Check console for: `[RiderDashboard] Match from SpacetimeDB`
3. Verify `useActiveMatches()` hook is working
4. Check `riderPopupVisible` state in React DevTools

### Issue 4: Popup shows on same device but not others
**Cause:** SpacetimeDB not broadcasting to all clients  
**Fix:**
1. Verify all devices are connected to SpacetimeDB (green dot)
2. Check all devices have same module name in `.env.local`
3. Try refreshing all browser tabs
4. Check SpacetimeDB cloud dashboard for active connections

## 🎬 Expected Flow

```
TIME: 0:00
Device 1 (Zomato): Click "Order with Flexible Delivery"
    ↓
    SpacetimeDB: order_status table updated
    ↓
    All devices: Receive order update
    ↓
    Console: "[SpacetimeDB] Order synced: zomato_..."

TIME: 0:05
Device 2 (Rapido): Click "Book Flexible Ride"
    ↓
    SpacetimeDB: order_status table updated
    ↓
    All devices: Receive order update
    ↓
    Console: "[SpacetimeDB] Order synced: rapido_..."
    ↓
    useMatchTrigger detects BOTH orders
    ↓
    Console: "[useMatchTrigger] Both orders detected!"
    ↓
    Status: "searching" (1.5s delay)

TIME: 0:06.5
    Match created
    ↓
    SpacetimeDB: active_match table updated
    ↓
    All devices: Receive match update
    ↓
    Device 3 (Rider): Popup appears + sound plays
    ↓
    Console: "[RiderDashboard] Match from SpacetimeDB"
```

## 📊 Success Criteria

✅ Device 1 clicks → All devices see order in SpacetimeDB  
✅ Device 2 clicks → Match triggered on ALL devices  
✅ Device 3 (Rider) → Popup appears automatically  
✅ All devices show "SpacetimeDB Connected" (green dot)  
✅ Console logs show order sync and match creation  
✅ No errors in browser console  

## 🚀 Production Testing

For production, replace `localhost:3000` with your deployed URL:
```
https://ryzo.app
```

All devices should connect to the same SpacetimeDB module and sync in real-time.

## 📝 Notes

- SpacetimeDB connection is established on page load
- Each device maintains its own WebSocket connection
- Orders are synced via `order_status` table
- Matches are synced via `active_match` table
- The `useMatchTrigger` hook runs on ALL devices
- Only ONE device needs to create the match (first one to detect both orders)
- All other devices receive the match via SpacetimeDB broadcast

---

**If you still don't see the popup:**
1. Open browser console on ALL 3 devices
2. Check for SpacetimeDB connection logs
3. Check for order sync logs
4. Check for match trigger logs
5. Share the console logs for debugging
