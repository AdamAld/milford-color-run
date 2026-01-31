# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Milford High School Sources of Strength Color Run 5K landing page. Single-page Next.js 16 app deployed on Vercel at milford-color-run.vercel.app.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Dev server on localhost:3000
bun run build        # Production build
bun run start        # Start production server
bun run lint         # ESLint (next.js core-web-vitals + typescript)
vercel --prod        # Deploy to production
```

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Bun

**Single page app** — `app/page.tsx` composes all sections in order: Navbar → Hero → About → EventDetails → RouteMap → Registration → Sponsors → Volunteer → FAQ → Footer.

**Registration flow:** `components/RegistrationForm.tsx` submits to `app/api/register/route.ts`, which validates/sanitizes input and appends a row to Google Sheets via `googleapis` JWT auth. Age is calculated against EVENT_DATE (2026-03-22); minors require parent/guardian fields.

**Required env vars** (in `.env.local`):
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`

**Map system:** `components/RouteMap.tsx` + `components/LeafletMap.tsx` render the 5K route on a Leaflet map with hardcoded coordinates and POI markers. Both are loaded via `next/dynamic` with `ssr: false`.

**Lazy loading:** `components/LazyComponents.tsx` uses `next/dynamic` to code-split `ParticleBackground` and `RouteMap` (large client-only dependencies).

**Animations:** Framer Motion for section reveal animations, GSAP for hero/SOS wheel, Lenis for smooth scrolling.

**Theming:** Dark theme with SOS wheel color system defined as CSS variables in `app/globals.css` (orange, yellow, green, blue, gray, purple, lightblue, red). Glass/glow utility classes also defined there.

## Key Conventions

- All interactive components use `"use client"` directive
- Path alias: `@/*` maps to project root
- Image optimization is disabled in `next.config.ts`
- Phone numbers are validated as 10 digits and formatted `(XXX) XXX-XXXX` server-side
