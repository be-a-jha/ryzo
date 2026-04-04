# BRAND.md — RYZO
# Design language, tokens, and component rules

---

## Philosophy

Apple-inspired. Minimal. Premium. Dark mode only.
Looks expensive. Never cluttered. Every element earns its place.

The goal: when a judge sees this, they think
"this could ship on the App Store tomorrow."

Not flashy. Not "AI-built looking."
Calm, confident, and precise.

---

## Color System

### Base Palette
```
--ryzo-black:        #000000   Primary background — everything sits on this
--ryzo-surface-1:   #111111   Cards, elevated surfaces, primary panels
--ryzo-surface-2:   #1A1A1A   Inputs, secondary buttons, nested surfaces
--ryzo-surface-3:   #0D0D0D   Bottom nav, deepest layer
--ryzo-border:      #2A2A2A   Card borders, dividers, input borders
--ryzo-border-subtle: #1E1E1E  Bottom nav border, very subtle dividers
```

### Text
```
--ryzo-text-primary:   #FFFFFF   All primary content, headings, values
--ryzo-text-secondary: #888888   Labels, metadata, captions, subtitles
--ryzo-text-muted:     #555555   Timestamps, legal, hints, attribution
--ryzo-text-disabled:  #333333   Placeholder text in empty states
```

### Accent (Swiggy Orange) — USE SPARINGLY
```
--ryzo-orange:       #FC8019   THE only accent color in RYZO
--ryzo-orange-hover: #E8720A   Hover state for orange elements
--ryzo-orange-dim:   rgba(252, 128, 25, 0.1)   Background tint
--ryzo-orange-glow:  rgba(252, 128, 25, 0.25)  Glow/shadow effect
```

### Status Colors
```
--ryzo-success:      #22C55E   Integration confirmed, approved states
--ryzo-success-dim:  rgba(34, 197, 94, 0.1)   Success background tint
--ryzo-success-glow: rgba(34, 197, 94, 0.15)  Success glow
--ryzo-error:        #EF4444   Error states only
```

### The Orange Rule
#FC8019 appears ONLY on:
✅ Primary CTA buttons (the single most important action per screen)
✅ Active bottom nav icon + label
✅ Online toggle active state
✅ Unified order ping card border + glow
✅ "Accept" button on order ping cards
✅ Start Navigation button
✅ RYZO logo accent mark (thin underline under "Y")
✅ AI badge/chip text and border
✅ ElevenLabs waveform bars
✅ RYZO Flexible button in Zomato/Rapido clones
✅ Countdown timer text (when urgent)
✅ Progress bars (earnings goal, integration count)

❌ NEVER as large background fills
❌ NEVER on card backgrounds
❌ NEVER as section backgrounds
❌ NEVER decoratively without purpose
❌ NEVER on body text
❌ NEVER as the primary color in Zomato/Rapido clones
   (those clones use their own brand colors)

---

## Typography

### Font Family
```css
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
```
Load via Next.js Google Fonts: Inter with weights 400, 500, 600, 700

### Scale
```
Display:  48px / 700 / -1px tracking  → RYZO splash logo only
H1:       32px / 700 / -0.5px         → Major screen headings
H2:       24px / 700 / 0              → Section titles
H3:       20px / 600 / 0              → Card titles, screen subtitles
H4:       18px / 600 / 0              → Sub-headings
Body-L:   16px / 500 / 0              → Primary body content
Body:     15px / 400 / 0              → Standard body
Body-S:   14px / 400 / 0.1px          → Secondary body
Label:    13px / 500 / 0              → Form labels, metadata
Caption:  12px / 400 / 0              → Timestamps, helper text
Micro:    11px / 500 / 0.8px          → Section labels (uppercase)
Nano:     10px / 400 / 0              → Attribution, legal
```

### Numeric Values
Use tabular-nums for all money/distance/time values:
```css
font-variant-numeric: tabular-nums;
```
This prevents layout shift as numbers update in real-time.

---

## Spacing

Use Tailwind's default spacing scale consistently.
Key values used in RYZO:

```
Padding — Sections:  p-4 (16px) for cards, p-5 (20px) for sheets
Padding — Screens:   px-4 for horizontal padding throughout
Gaps — Card lists:   gap-3 (12px) between app cards
Gaps — Button rows:  gap-2 (8px) between paired buttons
Gaps — Stats row:    gap-2 between stat columns
Bottom nav height:   h-16 (64px)
Status bar:          h-10 (40px)
Card padding:        p-4 (16px)
Sheet padding:       p-5 (20px)
```

---

## Border Radius

```
Phone frame shell:   radius-[40px]   Physical phone corners
Phone screen:        radius-[32px]   Inner screen area
Cards:               rounded-2xl     (16px) — default for all cards
Sheets / modals:     rounded-3xl top (24px) — bottom sheets slide up
Buttons:             rounded-xl      (12px) — all buttons
Small buttons:       rounded-lg      (8px)  — "Add" chips, small CTAs
Chips / badges:      rounded-full    (9999px) — platform badges, tags
Inputs:              rounded-xl      (12px) — all form inputs
Progress bars:       rounded-full    — thin bars
Avatar:              rounded-full    — profile circles
App logos:           rounded-xl      (12px) — 44x44 app icons
```

---

## Shadows

```
Phone frame:     box-shadow: 0 32px 80px rgba(0,0,0,0.6)
Cards (default): box-shadow: 0 4px 24px rgba(0,0,0,0.3)
Cards (hover):   box-shadow: 0 8px 32px rgba(0,0,0,0.4)
Orange glow:     box-shadow: 0 0 20px rgba(252,128,25,0.25)
Green glow:      box-shadow: 0 0 12px rgba(34,197,94,0.15)
Bottom sheet:    box-shadow: 0 -8px 40px rgba(0,0,0,0.5)
```

---

## Animations

### Defined Keyframes

Pulse glow (unified order card border):
```css
@keyframes pulse-orange {
  0%, 100% { box-shadow: 0 0 8px rgba(252,128,25,0.2); }
  50%       { box-shadow: 0 0 24px rgba(252,128,25,0.5); }
}
animation: pulse-orange 1.5s ease-in-out infinite;
```

Waveform bars (ElevenLabs voice UI):
```css
/* 5 bars, each with staggered animation-delay */
@keyframes waveform {
  0%, 100% { height: 8px; }
  50%       { height: 24px; }
}
Bar delays: 0ms, 100ms, 200ms, 100ms, 50ms
```

Slide up (bottom sheets, banners):
```css
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
duration: 300ms, ease-out
```

Fade in (screen transitions):
```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
duration: 250ms, ease-out
```

Toast (slide from top):
```css
@keyframes slide-down {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
duration: 300ms, ease-out
Auto-dismiss: 2000ms after appear
```

Tap state (all interactive elements):
```css
transition: transform 100ms ease;
:active { transform: scale(0.97); }
```

---

## Component Reference

### Primary Button
```
bg: #FFFFFF
text: #000000, 15px, 600 weight
height: 52px (h-13)
width: full (w-full)
radius: rounded-xl
tap: scale(0.97)
```

### Orange Button (CTA)
```
bg: #FC8019
text: #000000, 15px, 700 weight (bold)
height: 52px
width: full
radius: rounded-xl
hover: bg #E8720A
```

### Secondary Button
```
bg: #1A1A1A
text: #FFFFFF, 15px, 500 weight
border: 1px solid #2A2A2A
height: 52px
radius: rounded-xl
```

### Danger / Decline Button
```
bg: #1A1A1A
text: #888888, 15px
border: 1px solid #2A2A2A
height: 52px
radius: rounded-xl
```

### App Card
```
bg: #111111
border: 1px solid #2A2A2A
radius: rounded-2xl
padding: p-4
layout: flex row, items-center
gap: gap-3
```

### "Add" Chip Button
```
bg: #1A1A1A
border: 1px solid #FC8019
text: #FC8019, 13px, 500 weight
padding: px-4 py-2
radius: rounded-lg
```

### "Integrated" State
```
Replaces "Add" button
border: 1px solid #22C55E (on card)
glow: box-shadow 0 0 12px rgba(34,197,94,0.15)
Right content: ✓ icon #22C55E + "Integrated" #22C55E 13px
```

### Platform Chip (e.g. [SWIGGY])
```
bg: rgba(252,128,25,0.1) (or relevant color dim)
border: 1px solid #FC8019 (or relevant)
text: #FC8019, 10px, 700, uppercase, letter-spacing 0.5px
padding: px-2 py-0.5
radius: rounded-full
```

### Stats Column (3-col row in ping card)
```
Main value: white, 16px, 700 weight, tabular-nums
Label:      #888888, 11px, 400, uppercase
alignment:  text-center
```

### Input Field
```
bg: #1A1A1A
border: 1px solid #2A2A2A
text: #FFFFFF, 15px
placeholder: #555555
height: 52px (h-13)
padding: px-4
radius: rounded-xl
focus: border-color #FC8019, outline none
```

### Section Label
```
text: #555555, 11px, 500, uppercase, letter-spacing 2px
margin-bottom: mb-3
padding: px-4
```

---

## Zomato Clone Brand
Inside the Zomato phone only:
- Logo color: #E23744 (Zomato red)
- Primary button: bg #E23744, text white
- Header: bg #FFFFFF (light — Zomato is a light-mode app)
- Text: dark text (#1A1A1A) on white background
- RYZO injection card overlaid with our dark theme + orange

## Rapido Clone Brand
Inside the Rapido phone only:
- Logo color: #1A6FE8 (Rapido blue)
- Primary button: bg #1A6FE8, text white
- Header: bg #121212 (Rapido is dark mode)
- Text: white on dark
- RYZO injection card: same dark + orange styling

---

## Do Not
- Do not use any green color outside of success states
- Do not use white backgrounds inside RYZO phone
- Do not use color gradients (except Zomato/Rapido clones)
- Do not center-align body text (only headings/display)
- Do not use more than 2 font weights per screen
- Do not use shadows that are too visible on dark backgrounds
- Do not use orange on secondary actions — only THE primary
- Do not add decorative elements that have no function
