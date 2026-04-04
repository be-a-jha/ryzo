# PROJECT_OVERVIEW.md — RYZO
# Version: 1.0 | Hackathon Build | HackByte 4.0

---

## What Is RYZO

RYZO is a unified delivery and ride efficiency engine that
demonstrates how fragmented last-mile logistics in Indian
cities can be intelligently connected without changing user
behavior or replacing existing platforms.

It is built as a single webpage that renders three phone UIs
simultaneously — showing a complete, working, interconnected
ecosystem across food delivery, ride booking, and the RYZO
bridge platform in one view.

---

## The Problem

In any Indian city at peak hours, hundreds of delivery riders
and ride drivers are traveling the same roads simultaneously,
each serving a different platform, each making a separate
redundant trip. A Swiggy rider and a Rapido driver going 80%
of the same route have no way to coordinate. Both complete
their tasks separately. The result:

- Duplicate fuel consumption for identical road coverage
- Riders earning from only one task when two are possible
- Users paying full price when a shared-route discount exists
- Higher traffic density from preventable redundant trips
- Elevated carbon emissions from unnecessary vehicle movement

---

## The Solution

RYZO introduces an opt-in "Flexible" mode for users.
When a user accepts a small additional wait (5–15 min),
RYZO's AI matching engine activates — scanning all active
rider routes for a ≥70% path overlap with the pending order.

If a match is found:
- Both users get a discount automatically
- The matched rider gets a unified task with higher earnings
- The AI calculates the most efficient combined route
- ElevenLabs delivers voice-guided navigation hands-free

If no match is found within the time window:
- The order falls back to standard delivery instantly
- Zero penalty, zero downside for the user

---

## The Webpage Concept

Rather than building three separate native apps, RYZO is
demonstrated as a single webpage showing three phone-framed
UIs side by side — each representing a different app in the
ecosystem, all connected via the same backend.

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

The three phones update in real-time via SpacetimeDB.
When a match is triggered, all three UIs respond simultaneously
— this is the single most impactful moment in the demo.

---

## Target Users

### Consumer / User
Someone who orders food or books rides regularly.
Values convenience but is open to saving money with
a slightly longer wait. No new app download required —
RYZO integrates into their existing apps.

### Delivery Rider / Driver
A gig worker registered on one or more platforms.
Currently losing time and earnings switching between apps.
RYZO gives them a unified dashboard, smarter order pairing,
and hands-free navigation — all in one place.

---

## Hackathon Context

Event: HackByte 4.0 — IIITDM Jabalpur
Track: Open Innovation (main prize)
Theme: Patch the Reality (bonus alignment)
Sponsor tracks targeted: ROVO, ArmorIQ, MongoDB,
  ElevenLabs, Vultr, Google Gemini, SpacetimeDB

---

## Goals

1. Win the Open Innovation main prize with a working demo
2. Stack as many sponsor prizes as naturally possible
3. Demonstrate a real, scalable urban logistics solution
4. Show a technically impressive live system (not slides)

---

## Success Definition

A judge can watch a 60-second demo, understand the entire
product, see three phones update simultaneously, hear the
ElevenLabs voice play in the room, and walk away saying
"this could actually work in the real world."

---

## Out of Scope (for hackathon build)

- Real OAuth with actual Swiggy/Zomato/Rapido APIs
- Actual GPS tracking of real riders
- Payment processing
- Push notifications on real devices
- Production-grade security hardening
