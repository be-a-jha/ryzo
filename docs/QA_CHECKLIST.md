# RYZO QA Checklist
# Phase 12 — Polish, Deploy, Demo Prep

---

## Task 12.1 — Responsive QA

### Desktop Viewports

#### 1920px (Full HD)
- [ ] All three phones visible side by side
- [ ] Phones centered with comfortable spacing
- [ ] No horizontal scroll
- [ ] Phone frames maintain 320x680px dimensions
- [ ] Animations play smoothly
- [ ] Text remains readable
- [ ] No layout breaks or overlaps

#### 1440px (Standard Desktop)
- [ ] All three phones visible
- [ ] Phones centered properly
- [ ] Spacing between phones appropriate (gap-8 = 32px)
- [ ] No horizontal scroll
- [ ] All content fits within viewport
- [ ] RYZO branding header visible and centered

#### 1280px (Minimum Desktop)
- [ ] All three phones still visible
- [ ] Layout doesn't feel cramped
- [ ] No horizontal scroll
- [ ] Phone frames don't shrink
- [ ] All interactive elements accessible

### Tablet/Mobile Viewports

#### 768px (Tablet)
- [ ] Only center phone visible (RYZO by default)
- [ ] Tab switcher visible above phone
- [ ] Tab switcher has three buttons: Zomato | RYZO | Rapido
- [ ] Clicking tabs switches phone content
- [ ] Smooth transition animation between tabs (300ms fade)
- [ ] Phone remains centered
- [ ] No horizontal scroll

#### 375px (Mobile)
- [ ] Single phone view works
- [ ] Tab switcher responsive
- [ ] All content within phone readable
- [ ] Touch targets large enough (min 44x44px)
- [ ] No text overflow

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Task 12.2 — Animation QA

### Entrance Animations

#### Three-Phone Layout
- [ ] Phones fade in from below (y: 40 → 0)
- [ ] Staggered entrance (150ms delay between phones)
- [ ] Duration: 600ms
- [ ] Easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- [ ] No layout shift during animation
- [ ] Smooth 60fps playback

#### RYZO Branding Header
- [ ] Fades in before phones
- [ ] No jarring appearance

### Screen Transitions (RYZO Center Phone)

#### Screen 1 → 2 (Splash to Login)
- [ ] Loading bar animates for exactly 2000ms
- [ ] Fade-out before navigation (no snap)
- [ ] Auto-navigation fires once only
- [ ] Smooth transition

#### All Screen Changes
- [ ] Consistent fade + slide animation (250ms)
- [ ] No flicker between screens
- [ ] Back navigation animates correctly
- [ ] History stack works properly

### Integration Flow Animations

#### Screen 4 → 5 (User Integration)
- [ ] App cards stagger-fade in (100ms delay each)
- [ ] "Add" button tap has scale(0.97) effect
- [ ] Modal slides up from bottom (300ms)
- [ ] Backdrop darkens smoothly
- [ ] Handle pill visible at modal top

#### Screen 5 → 6 (Login Success)
- [ ] Modal closes smoothly
- [ ] App card shows green checkmark
- [ ] Orange pulse → green settle animation (600ms)
- [ ] Toast slides from top
- [ ] Toast auto-dismisses after 2s
- [ ] Green glow effect on integrated card

### Rider Dashboard Animations

#### Order Ping Cards
- [ ] Cards fade in with y: 12 → 0
- [ ] Unified order card has continuous orange border pulse
- [ ] Pulse animation: 1.5s ease-in-out infinite
- [ ] Pulse not jarring or distracting
- [ ] Decline removes card with exit animation (x: -100)
- [ ] Timer counts down smoothly (1s intervals)

#### Agent Decision Log
- [ ] Expands/collapses smoothly (200ms)
- [ ] Height animates from 0 to auto
- [ ] No content jump

### THE DEMO MOMENT (Three-Phone Sync)

#### Match Trigger Animation
- [ ] All three phones update simultaneously (< 500ms)
- [ ] Zomato notification slides from top
- [ ] Rapido notification slides from top
- [ ] RYZO ping card appears with fade-in
- [ ] Notifications have green border (#22C55E)
- [ ] Auto-dismiss after exactly 3 seconds
- [ ] Timing feels dramatic and impressive

### Comparison Table (Screen 9)

#### Table Row Animation
- [ ] Rows stagger-fade in sequentially
- [ ] Delay: 100ms + (index * 100ms)
- [ ] Smooth opacity 0 → 1
- [ ] No layout shift
- [ ] Green checkmarks visible on RYZO AI column

### Navigation Screen (Screen 10)

#### Voice Banner
- [ ] Waveform bars animate continuously
- [ ] Staggered delays: [0, 100, 200, 100, 50]ms
- [ ] Heights: [16, 32, 24, 40, 16]px when active
- [ ] Bars settle to 8px when stopped
- [ ] Animation: 800ms ease-in-out infinite
- [ ] Natural-looking, not robotic

#### Stop Progress
- [ ] "Mark as Delivered" advances stop
- [ ] Current stop changes from orange to green
- [ ] Next stop becomes orange (current)
- [ ] Smooth color transition
- [ ] Checkmark appears on completed stops

### Google Maps Animations

#### Comparison Map (Screen 9)
- [ ] Polylines draw from start to end
- [ ] Animation duration: 1000ms
- [ ] All three routes animate simultaneously
- [ ] Orange RYZO route is visually dominant
- [ ] Legend fades in after 500ms delay

#### Navigation Map (Screen 10)
- [ ] Map loads without flash
- [ ] Rider position marker visible
- [ ] Stop markers have correct colors
- [ ] Dotted path visible

---

## Task 12.3 — Functional QA

### End-to-End Flow Testing

#### Flow 1: Zomato → Match → Navigation
1. [ ] Open demo URL
2. [ ] All three phones visible
3. [ ] Click "Order with Flexible Delivery" (Zomato)
4. [ ] All three phones update within 500ms
5. [ ] Notifications appear on Zomato and Rapido
6. [ ] Ping card appears in RYZO dashboard
7. [ ] Click "Accept" in RYZO
8. [ ] Screen 9 loads with comparison data
9. [ ] Map shows three routes
10. [ ] Click "Start Navigation"
11. [ ] Screen 10 loads
12. [ ] Voice plays or text fallback appears
13. [ ] Map shows rider position and stops

#### Flow 2: Rapido → Match → Navigation
1. [ ] Refresh page
2. [ ] Click "Book Flexible Ride" (Rapido)
3. [ ] All three phones update
4. [ ] Same flow as above works

#### Flow 3: Fallback (No Match)
1. [ ] Trigger match with backend down
2. [ ] Fallback to mock data works
3. [ ] No errors in console
4. [ ] Demo continues smoothly

### API Integration Testing

#### Backend Endpoints
- [ ] `POST /api/matching/trigger` returns match data
- [ ] `POST /api/matching/:id/accept` updates match status
- [ ] `POST /api/voice/generate` returns audio or script
- [ ] All endpoints respond in < 500ms
- [ ] Error handling works (try with invalid data)

#### External APIs
- [ ] Google Maps loads correctly
- [ ] Gemini API calculates overlap (check backend logs)
- [ ] ArmorIQ agent evaluates match (check logs)
- [ ] ElevenLabs generates voice (or fallback works)
- [ ] SpacetimeDB connection stable

### Error Handling

#### Network Errors
- [ ] Backend down → fallback to mock data
- [ ] Maps API key invalid → loading state shown
- [ ] Voice API fails → text fallback works
- [ ] No crashes or white screens

#### User Errors
- [ ] Rapid clicking doesn't break state
- [ ] Back navigation works correctly
- [ ] Refresh page doesn't lose critical state

---

## Task 12.4 — Performance QA

### Load Times
- [ ] Initial page load < 2s
- [ ] Time to Interactive < 3s
- [ ] Largest Contentful Paint < 2.5s
- [ ] First Input Delay < 100ms
- [ ] Cumulative Layout Shift < 0.1

### Runtime Performance
- [ ] Animations run at 60fps
- [ ] No janky scrolling
- [ ] No memory leaks (check DevTools)
- [ ] CPU usage reasonable (< 50% on laptop)

### Network Performance
- [ ] API calls complete in < 500ms
- [ ] Images optimized (if any)
- [ ] No unnecessary re-renders (React DevTools)

---

## Task 12.5 — Content QA

### Text Content
- [ ] No typos in UI text
- [ ] All numbers formatted correctly (₹ symbol, commas)
- [ ] Tabular numbers used for money/distance/time
- [ ] All labels match CONTENT.md

### Visual Consistency
- [ ] Orange (#FC8019) used sparingly per brand guidelines
- [ ] Dark theme consistent across all screens
- [ ] Zomato phone uses light theme correctly
- [ ] Font sizes consistent (13-15px for body text)
- [ ] Spacing consistent (px-4, py-3 patterns)

### Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Interactive elements have visible focus states
- [ ] Touch targets minimum 44x44px
- [ ] Alt text on images (if any)
- [ ] Semantic HTML structure

---

## Task 12.6 — Demo Rehearsal Checklist

### Pre-Demo Setup
- [ ] Laptop fully charged
- [ ] Demo URL bookmarked
- [ ] Browser in full-screen mode (F11)
- [ ] Zoom level at 100%
- [ ] Volume at 70% for voice playback
- [ ] Close all other tabs/apps
- [ ] Disable notifications
- [ ] Test internet connection

### 60-Second Demo Script

**0:00-0:10** — Introduction
- [ ] "RYZO connects fragmented last-mile logistics in Indian cities"
- [ ] Point to three phones on screen

**0:10-0:20** — Problem Statement
- [ ] "Right now, a Swiggy rider and Rapido driver going the same route have no way to coordinate"
- [ ] "Both make separate trips, wasting fuel and time"

**0:20-0:30** — Solution Demo
- [ ] Click "Order with Flexible Delivery" on Zomato
- [ ] "Watch this — all three phones update simultaneously"
- [ ] Point to notifications appearing

**0:30-0:40** — AI Integration
- [ ] Click "Accept" in RYZO phone
- [ ] "Gemini AI calculated 84% route overlap"
- [ ] "ArmorIQ agent approved the match"
- [ ] Show comparison table

**0:40-0:50** — Voice + Maps
- [ ] Click "Start Navigation"
- [ ] "ElevenLabs provides hands-free voice guidance"
- [ ] Point to Google Maps with optimized route

**0:50-0:60** — Impact + Close
- [ ] "Both users save money, rider earns more, less traffic, lower emissions"
- [ ] "Live demo at [YOUR_URL]"
- [ ] "Built with MongoDB, Gemini, ArmorIQ, ElevenLabs, SpacetimeDB"

### Rehearsal Checklist
- [ ] Rehearsal 1: Timing and flow
- [ ] Rehearsal 2: Smooth transitions
- [ ] Rehearsal 3: Confident delivery
- [ ] Rehearsal 4: Handle questions
- [ ] Rehearsal 5: Final polish

### Backup Plan
- [ ] Screen recording ready (60s, 1080p)
- [ ] GitHub repo link ready
- [ ] Architecture diagram printed
- [ ] Slide deck as fallback

---

## Final Sign-Off

### All Phases Complete
- [✅] Phase 0: Foundation setup
- [✅] Phase 1: Three-phone layout
- [✅] Phase 2: RYZO center phone (all 10 screens)
- [✅] Phase 3: Zomato left phone
- [✅] Phase 4: Rapido right phone
- [✅] Phase 5: Backend foundation
- [✅] Phase 6: Gemini AI
- [✅] Phase 7: ArmorIQ agent
- [✅] Phase 8: SpacetimeDB
- [✅] Phase 9: ElevenLabs voice
- [✅] Phase 10: Google Maps
- [✅] Phase 11: End-to-end demo flow
- [ ] Phase 12: Polish + deploy + rehearse

### Ready for Demo
- [ ] All QA items checked
- [ ] Deployed to production
- [ ] Demo rehearsed 5 times
- [ ] Backup plan ready
- [ ] Confident and prepared

---

**Demo Day:** HackByte 4.0 — IIITDM Jabalpur
**Target:** Open Innovation Main Prize + Sponsor Prizes
**Live URL:** _____________
**GitHub:** _____________

Good luck! 🚀
