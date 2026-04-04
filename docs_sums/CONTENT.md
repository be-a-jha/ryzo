# CONTENT.md — RYZO
# All copy, labels, mock data, and microcopy

---

## RYZO App Copy

### Splash Screen
```
Logo:     RYZO
Tagline:  One Rider. Every Platform.
Loading:  Loading...
```

### Login Screen
```
Logo:         RYZO
Tagline:      One Rider. Every Platform.
Heading:      Welcome back.
Subheading:   Sign in to continue
Button 1:     Continue with Google
Divider:      or
Button 2:     Create an account
Terms:        By continuing you agree to our Terms & Privacy Policy
```

### Role Selection Screen
```
Greeting:     Hello, Aryan 👋
Subtext:      How will you use RYZO today?

Card 1 Title:     I'm a User
Card 1 Sub:       Order food and rides across all
                  your apps in one place

Card 2 Title:     I'm a Rider
Card 2 Sub:       Get unified orders from all platforms
                  and maximize your earnings

Footer:           You can switch roles anytime from settings
```

### User Integration Screen
```
Header:           Connect Your Apps
Subtext:          Connect your delivery accounts. We add a
                  smarter layer on top.
Section Label:    DETECTED ON YOUR DEVICE
Button:           Add
Button (active):  Continue
Button (disabled): Continue  (greyed, not clickable)
```

### In-App Login Modal
```
For Swiggy:
  Title:      Swiggy
  Subtitle:   Login to link your Swiggy account
  Security:   🔒 Secured by RYZO
  Input 1:    Phone number or email
  Input 2:    Password
  Forgot:     Forgot Password?
  Button:     Login & Link Account

(Same pattern for Zomato, Blinkit, Zepto, Dunzo)
```

### Integration Success
```
Toast (Swiggy):   Swiggy linked successfully ✓
Toast (Zomato):   Zomato linked successfully ✓
Toast (Blinkit):  Blinkit linked successfully ✓
Card status:      Integrated
```

### Rider Integration Screen
```
Header:           Connect Rider Apps
Subtext:          Link your delivery partner accounts.
                  Start receiving unified orders.
Progress:         0 of 5 connected
Unlock msg:       Connect 2+ apps to unlock Dashboard
Unlocked msg:     Dashboard Unlocked! 🎉
Banner:           Your Rider Dashboard is ready →
```

### Rider Dashboard Screen
```
Greeting:         Good morning, Rahul 👋
Earnings Label:   Today's Earnings
Earnings Value:   ₹847
Orders Label:     Orders
Orders Value:     6
Goal Label:       68% of daily goal
Online:           ONLINE
Offline:          GO OFFLINE
Section:          INCOMING ORDERS

Ping Card 1:
  Badge:          UNIFIED ORDER
  Platform 1:     SWIGGY
  Platform 2:     RAPIDO
  Restaurant:     McDonald's, Arera Colony
  Drop:           Hoshangabad Rd, BHEL
  Distance:       4.2 km
  Dist Label:     Route
  Earnings:       ₹94
  Earn Label:     Combined
  Time:           18 min
  Time Label:     Est.
  AI Tag:         🤖 AI Optimized Route
  Agent Tag:      ✓ ArmorIQ Approved
  Btn 1:          Decline
  Btn 2:          Accept
  Timer:          Expires in 0:28

Ping Card 2:
  Platform:       SWIGGY
  Restaurant:     Burger King, MP Nagar
  Drop:           Tulsi Nagar, Bhopal
  Distance:       2.8 km
  Earnings:       ₹52
  Time:           12 min
  Btn 1:          Decline
  Btn 2:          Accept
  Timer:          Expires in 1:44

Agent Log Header:     View ArmorIQ Decision Log
Log Entry 1:      ✅ APPROVED | Overlap 84% | Detour 12% | Capacity 1/2
Log Entry 2:      ✅ APPROVED | Overlap 71% | Detour 28% | Capacity 0/2
Log Entry 3:      ❌ BLOCKED  | Overlap 58% | Below minimum threshold
```

### Order Detail / Comparison Screen
```
Header:           Order Details
AI Badge:         AI Pick 🤖

Route Legend:
  Blue:           Swiggy Only
  Red:            Rapido Only
  Orange:         RYZO AI Route

Table Headers:    | | Swiggy Only | Rapido Only | RYZO AI |
Row 1:            Distance | 5.1 km | 4.8 km | 3.9 km ✓
Row 2:            Earnings | ₹52 | ₹48 | ₹94 ✓
Row 3:            Time Est. | 22 min | 20 min | 17 min ✓
Row 4:            Fuel Est. | ₹18 | ₹16 | ₹13 ✓

AI Insight:       Taking this unified order saves you 1.2km
                  and earns ₹42 more than either order
                  separately. Optimal sequence: McDonald's
                  pickup → BHEL drop → MP Nagar pickup →
                  Sarvadharm drop.

SpacetimeDB:      🟢 Live — SpacetimeDB Connected
Button:           Start Navigation
```

### Active Navigation Screen
```
Voice Banner:
  Status:         🔊 Voice Navigation Active
  Instruction:    Turn right on Hoshangabad Road in 200m
  Attribution:    ElevenLabs

Stops:
  Stop 1:         McDonald's — Pickup Food    [DONE]
  Stop 2:         BHEL Sector — Drop Food     [CURRENT]
  Stop 3:         MP Nagar — Pickup Rider     [UPCOMING]
  Stop 4:         Sarvadharm — Drop Rider     [UPCOMING]

Bottom Sheet:
  Label:          Next Stop
  Distance:       0.8 km away
  Destination:    BHEL Sector — Drop Food
  ETA:            ~6 min
  Button:         Mark as Delivered
  Link:           Report an issue
```

---

## ZOMATO CLONE Copy

### Checkout Screen
```
Header:           Checkout
Restaurant:       McDonald's, Arera Colony

Items:
  McSpicy Burger x1                           ₹189
  Large Fries x1                              ₹139
  Coke x1                                     ₹69
  ─────────────────────────────────────────────────
  Subtotal                                    ₹397

Delivery Details:
  Label:          Deliver to
  Address:        Hoshangabad Road, BHEL, Bhopal

Pricing:
  Item total:                                 ₹397
  Delivery fee:                                ₹39
  Platform fee:                                 ₹5
  ─────────────────────────────────────────────────
  Total:                                      ₹441
  Standard time:  28–35 min

RYZO Card:
  Icon + Label:   ⚡ Flexible Delivery
  Savings chip:   Save ₹42
  Subtext:        Wait ~8 min more for a guaranteed discount
  Total shown:    RYZO Flexible — ₹399 total
  Attribution:    Powered by RYZO
  Button:         Order with Flexible Delivery

Standard Button:  Place Order — ₹441
```

---

## RAPIDO CLONE Copy

### Booking Screen
```
Header:           Book a Ride

Ride Details:
  Pickup:         MP Nagar Zone 2, Bhopal
  Drop:           Sarvadharm Colony, Bhopal
  Distance:       5.2 km
  Time:           ~18 min

Ride Types:
  Bike:           ₹78 (selected)
  Auto:           ₹124
  Cab:            ₹210

Pricing:
  Base fare:                                   ₹78
  Convenience fee:                              ₹8
  ─────────────────────────────────────────────────
  Total:                                       ₹86
  Standard wait:  3–5 min

RYZO Card:
  Icon + Label:   ⚡ Flexible Ride
  Savings chip:   Save ₹28
  Subtext:        Wait ~6 min for a rider already heading your way
  Total shown:    RYZO Flexible — ₹58 total
  Attribution:    Powered by RYZO
  Button:         Book Flexible Ride

Standard Button:  Book Rapido Bike
```

---

## ElevenLabs Voice Scripts

### Match Announcement
```
"New unified order matched. Pickup at McDonald's,
Arera Colony, then drop at B-H-E-L Sector.
Rapido ride pickup at M-P Nagar, drop at Sarvadharm Colony.
Combined route saves 1.2 kilometers.
Extra earning: 42 rupees. Route is optimized."
```

### Turn-by-Turn (examples)
```
"In 200 meters, turn right on Hoshangabad Road."
"Continue straight for 1.4 kilometers."
"Your destination, B-H-E-L Sector, is on the left."
"Pickup confirmed. Now heading to M-P Nagar."
"In 400 meters, take a left on Zone 2 Main Road."
"You have arrived. Drop off the rider at Sarvadharm Colony."
```

### Fallback
```
"No match found within the time window.
Proceeding with standard delivery."
```

### Stop Arrival
```
"You have arrived at McDonald's. Please pick up the food order."
"Food picked up. Now heading to B-H-E-L for drop off."
"You have arrived at the drop location."
"Ride pickup confirmed. Heading to final destination."
```

---

## Mock Data Reference

### Rider Profile
```
Name:         Rahul Kumar
Initials:     RK
Today:        ₹847 earned
Orders:       6 completed
Daily Goal:   ₹1,247 (68% reached)
Status:       Online
Platforms:    Zomato Delivery, Swiggy Delivery,
              Blinkit Partner, Rapido Captain
```

### Unified Order (Mock)
```
Order ID:         #RZ-2847
Platforms:        Swiggy + Rapido
Match Score:      84% overlap
Detour:           12% additional distance
Rider Capacity:   1/2 tasks

Stop 1 (Pickup):  McDonald's, Arera Colony
                  Lat: 23.2215, Lng: 77.4014
Stop 2 (Drop 1):  BHEL Sector, Hoshangabad Rd
                  Lat: 23.2093, Lng: 77.3783
Stop 3 (Pickup):  MP Nagar Zone 2
                  Lat: 23.2318, Lng: 77.4272
Stop 4 (Drop 2):  Sarvadharm Colony
                  Lat: 23.1982, Lng: 77.4621

Combined:         4.2 km | 18 min | ₹94
Swiggy alone:     5.1 km | 22 min | ₹52
Rapido alone:     4.8 km | 20 min | ₹48
Savings for Rahul: ₹42 extra, 1.2 km less
Discount for User 1: ₹42 on food order
Discount for User 2: ₹28 on ride
```

### Platform Apps (User Side)
```
1. Swiggy       | Food Delivery  | #FC8019  | swiggy-icon.svg
2. Zomato       | Food Delivery  | #E23744  | zomato-icon.svg
3. Blinkit      | Grocery        | #F9D100  | blinkit-icon.svg
4. Zepto        | Grocery        | #9B59B6  | zepto-icon.svg
5. Dunzo        | Multi-category | #00B140  | dunzo-icon.svg
```

### Platform Apps (Rider Side)
```
1. Zomato Delivery Partner  | Food      | #E23744  | zomato-d-icon.svg
2. Swiggy Delivery          | Food      | #FC8019  | swiggy-d-icon.svg
3. Blinkit Partner          | Grocery   | #F9D100  | blinkit-d-icon.svg
4. Rapido Captain           | Rides     | #1A6FE8  | rapido-icon.svg
5. Porter Partner           | Logistics | #1C2951  | porter-icon.svg
```

### ArmorIQ Agent Decisions (Mock Log)
```
Entry 1:
  Action:   MATCH_APPROVED
  Time:     14:32:11
  Reason:   Overlap 84%, detour 12%, capacity 1/2
  Score:    84
  Detour:   12%
  Capacity: 1/2

Entry 2:
  Action:   MATCH_APPROVED
  Time:     14:18:44
  Reason:   Overlap 71%, detour 28%, capacity 0/2
  Score:    71
  Detour:   28%
  Capacity: 0/2

Entry 3:
  Action:   MATCH_BLOCKED
  Time:     13:55:02
  Reason:   Overlap 58%, below minimum 70% threshold
  Score:    58
  Detour:   N/A
  Capacity: N/A
```
