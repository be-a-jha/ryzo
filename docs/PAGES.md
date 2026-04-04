# PAGES.md — RYZO
# Complete screen inventory for all three phone UIs

---

## WEBPAGE LAYOUT (Root)

### Three-Phone Container
- Full viewport width, min-height 100vh
- Dark background: #000000
- Horizontal layout: three phones centered
- Subtle RYZO branding above the phones
- Three phones have slight depth/shadow separation
- Responsive: on smaller screens, show only center phone
  with tab switcher for left/right phones

### Phone Frame Component (shared)
- iPhone 14 proportions: 390x844 rendered at 65% scale
- Physical phone shell: dark grey #1A1A1A
- Status bar (mock): battery, wifi, time icons
- Home indicator at bottom
- Overflow hidden — screens clip inside frame
- Each phone has a label below: "Zomato", "RYZO", "Rapido"
- Shadow: 0 32px 80px rgba(0,0,0,0.6)

---

## LEFT PHONE — ZOMATO CLONE

### Single Screen: Food Order Checkout

#### Header
- Zomato logo (red) + "Checkout" title
- Back arrow left
- Order summary chip right

#### Order Items Section
- Restaurant name: "McDonald's, Arera Colony"
- Item list (mock):
  - McSpicy Burger x1 — ₹189
  - Large Fries x1 — ₹139
  - Coke x1 — ₹69
- Subtotal: ₹397

#### Delivery Address Section
- "Deliver to" label
- Address: "Hoshangabad Road, BHEL, Bhopal"
- Edit pencil icon

#### Standard Pricing Section
- Delivery fee: ₹39
- Platform fee: ₹5
- Total: ₹441
- Standard estimated time: 28–35 min

#### RYZO Integration Banner
(Shown only when RYZO integration is active)
Card: bg #111111, border 1px #FC8019, radius 12px, p-4

Layout:
- Top row: ⚡ icon + "Flexible Delivery" bold white left |
  "Save ₹42" chip right (bg #FC8019, text black, rounded-full)
- Middle: "Wait ~8 min more for a guaranteed discount"
  in #888888, 13px
- Divider line #2A2A2A
- Bottom row: "RYZO Flexible — ₹399 total" orange bold left |
  "Powered by RYZO" in #555555 10px right

Button below banner:
- "Order with Flexible Delivery" — full width, bg #FC8019,
  text black bold, h-13, radius-xl
- This triggers the matching engine

#### Standard Order Button
- "Place Order — ₹441" — full width, bg #E23744, text white
- Standard Zomato red button below the RYZO card

#### Demo Trigger Note
When user clicks "Order with Flexible Delivery":
→ The center RYZO phone's rider dashboard shows a new
  incoming unified order ping in real time via SpacetimeDB

---

## RIGHT PHONE — RAPIDO CLONE

### Single Screen: Ride Booking Confirmation

#### Header
- Rapido logo (blue) + "Book a Ride" title
- Current location chip at top

#### Map Preview Section
- Static dark map thumbnail (120px height)
- Shows pickup pin + destination pin
- Blue route line between them

#### Ride Details Section
- Pickup: "MP Nagar Zone 2, Bhopal"
- Drop: "Sarvadharm Colony, Bhopal"
- Distance: 5.2 km | Est. time: 18 min

#### Ride Type Selection
Three chips in a row:
- Bike (selected, blue border) — ₹78
- Auto — ₹124
- Cab — ₹210

#### Standard Pricing Section
- Base fare: ₹78
- Convenience fee: ₹8
- Total: ₹86
- Standard wait: 3–5 min

#### RYZO Integration Banner
(Shown only when RYZO integration is active)
Card: bg #111111, border 1px #FC8019, radius 12px, p-4

Layout:
- Top row: ⚡ icon + "Flexible Ride" bold white left |
  "Save ₹28" chip right (bg #FC8019, text black, rounded-full)
- Middle: "Wait ~6 min for a rider already heading your way"
  in #888888, 13px
- Divider line #2A2A2A
- Bottom row: "RYZO Flexible — ₹58 total" orange bold left |
  "Powered by RYZO" in #555555 10px right

Button:
- "Book Flexible Ride" — full width, bg #FC8019, text black

#### Standard Booking Button
- "Book Rapido Bike" — full width, bg #1A6FE8, text white
- Standard Rapido blue button

#### Demo Trigger Note
When user clicks "Book Flexible Ride":
→ Synchronizes with the ongoing food delivery flexible order
→ The RYZO center phone shows a unified match ping
→ The rider dashboard lights up with both orders combined

---

## CENTER PHONE — RYZO MAIN APP

### Screen 1 — Splash

Elements:
- Full black background
- Center: "RYZO" text, 48px, bold, white, letter-spacing 8px
- Orange accent: thin underline under the "Y" only, 2px
- Tagline below: "One Rider. Every Platform." #888888 14px
- Bottom: loading progress bar, orange, animating 0→100%
  width over 2 seconds, h-0.5, rounded-full
- "Loading..." text #555555 12px below bar

Behavior:
- Auto-navigates to Screen 2 after 2000ms
- Fade out transition

---

### Screen 2 — Google Login

Elements:
- Top 35%: RYZO logo (24px) + tagline centered
- Heading: "Welcome back." 28px bold white
- Subheading: "Sign in to continue" #888888 14px

Buttons:
- Google Sign In: bg #1A1A1A, border #2A2A2A, h-13, radius-xl
  → Left: Google G SVG icon (colorful, 20px)
  → Text: "Continue with Google" white 15px medium
  
- Divider: 1px #2A2A2A line with "or" centered in #555555

- Sign Up: bg #FFFFFF, text #000000, h-13, radius-xl,
  text: "Create an account" 15px medium

- Bottom: Terms text in #555555 12px centered

Behavior:
- Both buttons → Screen 3 (Role Selection)
- No real OAuth needed — mock navigation

---

### Screen 3 — Role Selection

Elements:
- Greeting: "Hello, Aryan 👋" white 24px bold
- Sub: "How will you use RYZO today?" #888888 15px

Two cards (stacked, gap-4):

Card A — User:
- bg #111111, border #2A2A2A, radius-2xl, p-6
- Top: shopping bag icon, white, 32px
- Title: "I'm a User" white 20px bold
- Subtitle: "Order food and rides across all your
  apps in one place" #888888 13px
- Right: → arrow in #FC8019
- Tap → Screen 4

Card B — Rider:
- Same dimensions as Card A
- Icon: motorcycle/bike icon, white, 32px
- Title: "I'm a Rider"
- Subtitle: "Get unified orders from all platforms
  and maximize your earnings"
- Right: → arrow in #FC8019
- Tap → Screen 7

Bottom: "You can switch roles anytime from settings"
#555555 12px centered

---

### Screen 4 — User App Integration

Elements:
- Top bar: back arrow + "Connect Your Apps" 18px bold + nothing right
- Subtext: "Connect your delivery accounts. We add a
  smarter layer on top." #888888 13px px-4

Section label: "DETECTED ON YOUR DEVICE"
#555555 11px uppercase letter-spacing-2 px-4

Scrollable app list (5 items):

Each app card:
- bg #111111, border #2A2A2A, radius-2xl, p-4, flex row
- Left: app logo 44x44 rounded-xl (colored brand logo)
- Center: app name white 16px bold / category #888888 12px
- Right: "Add" button — bg #1A1A1A, border #FC8019,
  text #FC8019, 13px, px-4 py-2, radius-lg

Apps shown:
1. Swiggy | Food Delivery | orange circle logo
2. Zomato | Food Delivery | red logo
3. Blinkit | Grocery | yellow-green logo
4. Zepto | Grocery | purple logo
5. Dunzo | Multi-category | green logo

"Continue" button fixed at bottom:
- Disabled state: bg #1A1A1A, text #555555
- Active (1+ integrated): bg #FFFFFF, text #000000

Tap "Add" on any → Screen 5

---

### Screen 5 — In-App Login Modal

Presentation:
- Slides up from bottom as a bottom sheet
- Handle pill: #333333, centered at top, w-10 h-1 rounded
- Backdrop: rgba(0,0,0,0.7) behind sheet

Sheet content:
- App logo + name, 20px bold white, centered
- "Login to link your [App] account" #888888 13px
- Lock icon + "Secured by RYZO" #555555 10px

Form:
- Phone/Email input: bg #1A1A1A, border #2A2A2A, radius-xl,
  h-13, white text, placeholder #555555
  placeholder: "Phone number or email"
- Password input: same style + eye icon right
  placeholder: "Password"
- "Forgot Password?" right-aligned #888888 12px underline

CTA button:
- "Login & Link Account"
- bg: app brand color (Swiggy=#FC8019, Zomato=#E23744,
  Blinkit=#F9D100, Zepto=#9B59B6, Dunzo=#00B140)
- text white bold, full width, h-13, radius-xl

Tap login → Screen 6

---

### Screen 6 — Integration Success

Returns to Screen 4 with updated card state:

Updated card:
- Right side: green ✓ icon + "Integrated" text #22C55E 13px
- Card border: 1px #22C55E
- Card glow: box-shadow 0 0 12px rgba(34,197,94,0.15)
- App icon: small orange dot badge (bottom-right corner)

Toast notification (slides in from top, auto-dismiss 2s):
- "[App] linked successfully ✓"
- bg #1A1A1A, border #22C55E, radius-xl
- Text white 14px

---

### Screen 7 — Rider App Integration

Identical structure to Screen 4.

Header: "Connect Rider Apps"
Subtext: "Link delivery partner accounts.
Get unified orders across all platforms."

Progress indicator (top, below header):
- "0 of 5 connected" updating live
- Thin orange progress bar, rounded-full

Unlock indicator:
- Lock icon + "Connect 2+ apps to unlock Dashboard"
- At 2 connected: lock becomes orange, text turns white
  "Dashboard Unlocked! 🎉"

Rider apps shown:
1. Zomato Delivery Partner | Food | red logo
2. Swiggy Delivery | Food | orange logo
3. Blinkit Partner | Grocery | yellow logo
4. Rapido Captain | Rides | blue logo
5. Porter Partner | Logistics | dark blue logo

Same "Add" → in-app login → integrated flow as Screens 5–6.

At 2+ integrations:
- Banner slides in from bottom: gradient-orange
  "Your Rider Dashboard is ready →"
  bg #FC8019, text black bold, full width, tappable
  Tap → Screen 8

---

### Screen 8 — Rider Dashboard

Most complex screen. Live, premium feel.

TOP SECTION:
- "Good morning, Rahul 👋" white 18px bold left
- Avatar right: "RK" initials circle, bg #1A1A1A,
  border-2 #FC8019, 40x40, rounded-full

EARNINGS CARD:
- bg #111111, border #2A2A2A, radius-2xl, p-4
- Left: "Today's Earnings" #888888 12px / "₹847" white 28px bold
- Right: "Orders" #888888 12px / "6" white 28px bold
- Bottom: progress bar, orange, 68% filled, rounded-full, h-1
- Label: "68% of daily goal" #888888 11px

ONLINE TOGGLE:
- Pill shape, full-width, bg #111111, border #2A2A2A, p-2
- Left half: "ONLINE" in #22C55E bold (active state)
- Right half: "GO OFFLINE" in #555555
- Left half has subtle green glow when online

SECTION LABEL:
- "INCOMING ORDERS" white 14px medium left
- Orange pulsing dot right (2px, animate-pulse) — live indicator

ORDER PING CARD 1 (Unified — Featured):
- bg #111111, border-2 #FC8019 (pulsing glow animation)
- animate: box-shadow pulse 1.5s infinite orange glow
- Top row: [SWIGGY] chip (bg rgba(FC8019,0.1), border #FC8019,
  text #FC8019 10px bold) + [RAPIDO] chip (same but blue)
- "UNIFIED ORDER" badge: #FC8019 11px uppercase letter-spacing-2
- Restaurant: "McDonald's, Arera Colony" white 15px bold
- Drop: "Hoshangabad Rd, BHEL" #888888 13px
- Stats row (3 columns, gap-2):
  → "4.2 km" white bold / "Route" #888888 11px
  → "₹94" white bold / "Combined" #888888 11px
  → "18 min" white bold / "Est." #888888 11px
- AI chip: "🤖 AI Optimized Route" bg #1A1A1A border #FC8019
  text #FC8019 11px
- Agent Log chip: "✓ ArmorIQ Approved" bg #1A1A1A border #22C55E
  text #22C55E 11px
- Buttons row (gap-2):
  → "Decline" bg #1A1A1A border #2A2A2A text #888888 flex-1
  → "Accept" bg #FC8019 text black bold flex-1 radius-xl
- Timer: "Expires in 0:28" #888888 12px right-aligned

ORDER PING CARD 2 (Standard — below Card 1):
- Same structure but no orange border, no UNIFIED badge
- Single platform: [SWIGGY] chip only
- Lower earnings: "₹52"

AGENT DECISION LOG (collapsed by default, expandable):
- "View ArmorIQ Decision Log" chevron button
- Expands to show last 3 agent decisions:
  → ✅ APPROVED | Overlap 84% | Detour 12% | Cap 1/2
  → ✅ APPROVED | Overlap 71% | Detour 28% | Cap 0/2
  → ❌ BLOCKED  | Overlap 58% | Below threshold

BOTTOM NAV:
- bg #0D0D0D, border-top #1E1E1E, 4 tabs
- Home (active): icon + "Home" label #FC8019
- Map: icon #555555
- Earnings: icon #555555
- Profile: icon #555555

Tap "Accept" on Card 1 → Screen 9

---

### Screen 9 — Order Detail / AI Comparison

TOP BAR:
- Back arrow left
- "Order Details" white 18px bold center
- "AI Pick 🤖" badge right: bg #1A1A1A border #FC8019
  text #FC8019 12px, radius-full

MAP SECTION (220px height):
- Dark-themed Google Map or dark static mockup
- Border-radius 16px, overflow hidden
- Three route polylines:
  → Blue (dashed): Swiggy-only route
  → Red (dashed): Rapido-only route
  → Orange (solid, 4px, glowing): RYZO AI route
- Pickup markers + drop markers on route
- Legend bottom-right:
  Blue dot "Swiggy" / Red dot "Rapido" /
  Orange dot "RYZO AI" — all 10px text #888888

COMPARISON TABLE:
Card: bg #111111, border #2A2A2A, radius-2xl, p-0 (overflow hidden)

Header row: bg #1A1A1A
| | Swiggy Only | Rapido Only | RYZO AI |

Column headers:
- Swiggy: white 13px
- Rapido: white 13px
- RYZO AI: bg #FC8019 (bg on header cell), black bold 13px

Data rows (border-bottom #2A2A2A each):
| Distance  | 5.1 km | 4.8 km | 3.9 km ✓ |
| Earnings  | ₹52    | ₹48    | ₹94 ✓    |
| Time Est. | 22 min | 20 min | 17 min ✓ |
| Fuel Est. | ₹18    | ₹16    | ₹13 ✓    |

RYZO AI column values: white bold + green ✓ icon after

AI INSIGHT CARD:
- bg #0D0D0D, border #FC8019, radius-xl, p-4
- "🤖" icon left
- Text: "Taking this unified order saves you 1.2km and
  earns ₹42 more than either order separately.
  Optimal sequence: McDonald's pickup → BHEL drop →
  MP Nagar pickup → Sarvadharm drop."
- white 13px body, #888888 for secondary detail

SPACETIMEDB STATUS:
- Small chip: "🔴 Live — SpacetimeDB" or "🟢 Connected"
  #555555 11px — shows real-time connection status

BOTTOM CTA:
- "Start Navigation" full-width, bg #FC8019, text black bold
- h-13, radius-xl
- Tap → Screen 10

---

### Screen 10 — Active Navigation

VOICE BANNER (ElevenLabs):
- bg #111111, border #FC8019, radius-2xl, p-4
- Left: 5 animated bars (waveform):
  each bar: bg #FC8019, w-1, rounded-full
  heights animate: [h-4, h-8, h-6, h-10, h-4]
  staggered animation delay, infinite bounce
- Center:
  → "🔊 Voice Navigation Active" white 14px bold
  → Current instruction #FC8019 13px:
    "Turn right on Hoshangabad Road in 200m"
- Right: speaker icon #FC8019 20px
- Bottom-right: "ElevenLabs" #555555 9px attribution

MAP SECTION (45% of phone height):
- Dark-themed Google Map (live or mock)
- Orange animated dot: rider current position
- Dotted orange line: route ahead
- Pins: stop markers numbered 1, 2, 3, 4

STOPS PROGRESS (horizontal stepper):
Flex row with connecting lines between circles:

Stop 1: "McDonald's" — filled green circle, ✓ icon
         "Pickup Food" strikethrough #888888
         Status: DONE

Stop 2: "BHEL Sector" — filled orange circle (current)
         "Drop Food" white bold
         Status: CURRENT (arrow indicator)

Stop 3: "MP Nagar" — empty circle #333333, border #555555
         "Pickup Rider" #888888
         Status: UPCOMING

Stop 4: "Sarvadharm" — empty circle #333333
         "Drop Rider" #888888
         Status: UPCOMING

Connecting lines: thin #333333 between stops

BOTTOM SHEET (fixed):
- bg #111111, border-top-radius-3xl, p-5, shadow-up
- Row 1: "Next Stop" #888888 12px left |
         "0.8 km away" #FC8019 12px right
- "BHEL Sector — Drop Food" white 18px bold
- ETA chip: "~6 min" bg #1A1A1A border #2A2A2A,
  radius-full px-3 py-1 white 12px
- "Mark as Delivered" button:
  bg #FFFFFF, text #000000 bold, full-width, h-13, radius-xl
- "Report an issue" #888888 13px underlined, centered

---

## NAVIGATION FLOW SUMMARY

```
Screen 1 (Splash) ──auto 2s──► Screen 2 (Login)
                                    │
                                    ▼
                              Screen 3 (Role)
                               │         │
                         "User"│         │"Rider"
                               ▼         ▼
                          Screen 4   Screen 7
                          (User      (Rider
                          Integration) Integration)
                               │         │
                         "Add" │         │ "Add"
                               ▼         ▼
                          Screen 5   Screen 5
                          (In-app    (In-app
                          Login)     Login)
                               │         │
                         Login │         │ Login
                               ▼         ▼
                          Screen 6   Screen 6
                          (returns   (returns
                          to S4)     to S7)
                                         │
                                    2+ apps
                                         │
                                         ▼
                                    Screen 8
                                    (Dashboard)
                                         │
                                    Accept
                                         │
                                         ▼
                                    Screen 9
                                    (Detail)
                                         │
                                    Start Nav
                                         │
                                         ▼
                                    Screen 10
                                    (Navigate)
```
