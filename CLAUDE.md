# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean lottery (로또 6/45) statistics and analysis site with an ethical, educational approach. Static Next.js application emphasizing that all number combinations have equal probability (1 in 8,145,060).

**Live site:** https://lotto.ysw.kr

## Commands

```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Build static export to /out directory
npm run lint             # Run ESLint
npm run update-data      # Fetch latest lottery data from 동행복권 API
npm run generate-sitemap # Generate sitemap.xml for SEO
```

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **React:** 19.2.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Charts:** Chart.js 4.5 with react-chartjs-2
- **Deployment:** Static export to GitHub Pages

## Architecture

### App Router Structure

```
src/app/
├── layout.tsx          # Root layout (Navigation, Footer, fonts)
├── page.tsx            # Home page
├── generator/page.tsx  # Random number generator with historical matching
├── statistics/page.tsx # Chart.js visualizations (frequency, odd/even)
├── results/page.tsx    # Searchable lottery results table
└── education/page.tsx  # Probability education (gambler's fallacy)
```

### Key Modules

- **`src/lib/lottery-utils.ts`** - Core logic: statistics calculation, random generation (crypto.getRandomValues), historical matching, number colors, currency formatting
- **`src/lib/types.ts`** - TypeScript interfaces (LotteryDraw, NumberStatistics, etc.)
- **`src/components/`** - Reusable components (Navigation, Footer, LottoBall, Disclaimer)
- **`public/data/lottery-history.json`** - Complete historical lottery data (auto-updated weekly)

### Data Flow

1. GitHub Actions fetches data weekly from 동행복권 API
2. Data saved to `public/data/lottery-history.json`
3. Pages import JSON directly (no runtime API calls)
4. Statistics calculated client-side with useMemo

### State Management

Simple local state using React hooks (`useState`, `useMemo`). All interactive pages use `'use client'` directive.

## Configuration

- **Static Export:** `output: 'export'` in next.config.ts (GitHub Pages compatible)
- **Path Alias:** `@/*` maps to `./src/*`
- **Korean Language:** `lang="ko"` with Korean fonts

## Lottery Ball Colors

Number ranges have specific colors (defined in `getNumberColor()`):
- 1-10: Yellow
- 11-20: Blue
- 21-30: Red
- 31-40: Gray
- 41-45: Green

## Ethical Guidelines

This site emphasizes responsible gambling education:
- All disclaimers highlight equal probability
- Expected value calculations show negative returns
- Educational content explains gambler's fallacy
- No "hot numbers" or prediction claims
- Gambling help resources prominently displayed (1336, KCGP)
