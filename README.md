# NiBL Brand Partner Portal

Performance dashboard for CPG beverage brands sampling through [NiBL](https://nibl.food). Brand partners (e.g. Kace Beverages, LEVL, Olipop) sign in and immediately see how their drink is performing in NiBL pairings: who's drinking it, where, and how often.

Built for the NiBL hackathon. Standalone Next.js 14 app — drops in alongside the main NiBL stack but ships independently.

## Quick start

```bash
git clone <this repo>
cd nibl-brand-portal
npm install
npm run dev
# → http://localhost:3004
```

That's it. The app boots into mock-data mode by default (Kace Beverages demo) so you can click through every screen without any environment configuration.

## Features

### Overview (`/dashboard`)
- **Hero card** — "Your drink reached 847 customers this month" with scan-rate + rating sub-line.
- **4 KPI tiles** — Drinks delivered · Customers scanned · Loved it · Would buy again. Trend deltas vs prior period.
- **Daily reach** — area chart with 7D / 30D / 90D range pills.
- **Top 3 highlights** — best food pairing, top neighborhood, best time window.
- **Performance vs NiBL benchmark** — per-metric horizontal bars comparing this brand to the platform average.
- **Top brands on NiBL** — leaderboard of partner brands ranked by pairings. Your brand's row is highlighted and a "you're #N — X pairings behind <leader>" callout sits in the header.

### My Campaign (`/campaigns`)
- **Campaign progress card** — budget bar showing samples used vs total budget.
- **3 KPIs** — cost per engagement, total invested, samples remaining.
- **Per-variant performance** — every drink variant (e.g. Yuzu, Yuzu Mint, Hibiscus Lime) with its own pairings, share-of-total bar, scan rate, rating, and would-buy-again %.
- **Campaign timeline** — single-axis area chart.
- **Geographic breakdown** — ranked neighborhood list with status dots (green / amber / red).
- **AI insight** — single-paragraph campaign recommendation from Claude. Hides silently if the API key isn't set or the call fails (no error UI shown to brand partners).

### Audience (`/taste-analytics`)
- **Taste preferences** — six dimensions (Sweet, Spice, Citrus, Carbonation, Umami, Bold) on one card with progress bars; highest dimension highlighted in accent.
- **Customer-type donut** — segments breakdown with legend below.
- **Retention KPIs** — Come-back rate · Days to reorder.
- **Top cuisines** — ranked list of cuisines ordered alongside the drink.
- **AI insight** — single-paragraph audience insight from Claude.

### Settings (`/settings`)
- Display brand info, change password, sign out.

## Tech stack

- **Next.js 14** (App Router, TypeScript strict, React 18)
- **Tailwind CSS** with a NiBL design-token preset (light theme: white surfaces, 1px black borders, hard-offset shadows, `#FF5C25` accent)
- **Recharts** for all charts
- **Supabase Auth** (email + password) — `@supabase/ssr` + `@supabase/supabase-js`
- **Anthropic Claude** (`claude-sonnet-4-6`) for the two AI insight cards, called server-side via `/api/insight/*` route handlers
- **Mock data mode** for demos — no backend required

## Environment

Copy `.env.local.example` → `.env.local`. All vars are optional — the app degrades gracefully if any are missing.

| Var | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCK_DATA` | When `true` (default), reads from the Kace mock dataset | No |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Enables real email + password auth + reading `brand_partners` row | No — without them, the protected layout falls through to the mock brand |
| `SUPABASE_SERVICE_ROLE_KEY` | Reserved for elevated server-side reads | No |
| `ANTHROPIC_API_KEY` | Enables the AI insight cards on Audience + Campaigns. If missing, the cards just don't render (silent fail by design — brand partners never see an error) | No |
| `NEXT_PUBLIC_SITE_URL` | Used in metadata only | No |

## Database schema

`migrations/2026-05-28_brand_portal_schema.sql` creates:

- `brand_partners` — auth user → brand mapping
- `brand_campaigns` — one row per sampling campaign
- `qr_scans` — QR code scan events
- New numeric columns on `customer_icp`: `sweet_affinity`, `citrus_pref`, `carbonation_pref`, `umami_pref`, `bold_pref`

Row-level security on the brand-scoped tables: each Supabase Auth user only sees rows linked to their `brand_partners` row.

To apply against a real Supabase project, paste the SQL into Supabase → SQL Editor and run.

## Project layout

```
src/
├── app/
│   ├── layout.tsx              # root: fonts + html shell
│   ├── globals.css             # imports ../styles/tokens.css + tailwind layers
│   ├── page.tsx                # /  → redirects to /dashboard or /login
│   ├── login/                  # Supabase email+password sign-in
│   ├── signup/                 # invite-token signup
│   ├── (app)/                  # auth-gated routes (protected layout + sidebar)
│   │   ├── dashboard/          # Overview
│   │   ├── campaigns/          # My Campaign
│   │   ├── taste-analytics/    # Audience
│   │   ├── pairing-insights/   # redirects → /dashboard
│   │   └── settings/
│   └── api/insight/            # server-side Claude calls (taste + campaign)
├── components/
│   ├── brand/                  # BrandContext provider
│   ├── cards/                  # KPICard, HeroCard, HighlightCard, BenchmarkRows,
│   │                           # TasteList, RankedList, CampaignProgress,
│   │                           # VariantBreakdown, BrandLeaderboard, AISummaryCard
│   ├── charts/                 # AreaChart, DonutChart + shared theme
│   ├── layout/                 # Sidebar, Header, MobileNav
│   ├── ui/                     # Button, Input, Badge, Skeleton, ErrorState, ProgressBar
│   └── range-toggle.tsx        # 7D / 30D / 90D pill toggle
├── lib/
│   ├── env.ts                  # parses NEXT_PUBLIC_* + server-only vars
│   ├── supabase/{client,server}.ts
│   ├── brand.ts                # getCurrentBrand() — auth gate + mock fallback
│   ├── api/                    # one file per feature; branches on env.useMockData
│   ├── claude.ts               # server-only Anthropic client + prompts
│   └── mock-data.ts            # Kace Beverages, 90 days, 5 variants, leaderboard
├── styles/
│   └── tokens.css              # NiBL design tokens (HSL CSS vars)
└── types/
    └── index.ts
```

## License

MIT — see source files.
