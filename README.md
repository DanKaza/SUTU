<div align="center">
  <img src="./public/brand/sutu-mark.png" alt="SUTU" width="96" />

  <h1>SUTU</h1>
  <p><strong>S</strong>upport <strong>U</strong>s <strong>T</strong>ogether</p>
  <p>One place to find, back, and stay with the Web3 communities you care about.</p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.5-000000?style=flat-square&logo=nextdotjs" alt="Next.js 15.5" />
    <img src="https://img.shields.io/badge/React-19-000000?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-000000?style=flat-square&logo=typescript" alt="TypeScript 5.7" />
    <img src="https://img.shields.io/badge/Monad_Testnet-10143-8B5CF6?style=flat-square" alt="Monad testnet, chain id 10143" />
  </p>
</div>

---

![The SUTU landing page — the fold, navigation, and the support object](./docs/images/spotlight.webp)

## The problem it solves

Web3 funding is scattered across a dozen tabs. The music collective drops a
wallet address in a Discord channel. The indie studio runs a separate donation
page with its own checkout. The mutual-aid group has a form that emails you a
wallet to send to. You end up holding donation addresses in bookmarks, with no
way to tell what a project will actually build or whether last month's money
arrived.

Most of that is unanswerable on purpose. There is no shared profile, no funding
goal, no history, and no receipt. You are asked for trust before you are given
evidence.

## What SUTU does

**Find.** One directory of communities with a profile each — who they are, what
they are building, what the projects cost, and the payout address on-chain.

**Price it.** Before you pay, `/donations/quote` returns the fee and discount
breakdown. Creating a donation intent locks that discount so it cannot change
under you between the quote and the signature.

**Back it.** Two rails, both real. *On-chain* settles in MON over Monad testnet.
*Demo wallet* runs on a USD ledger with no gas, so you can walk the whole flow
before spending anything.

**Do it in one go.** A basket holds several communities and settles them in a
single pass — one signature per community rather than one per tab.

**Keep the record.** Every contribution is written to the intent and confirmed
against chain. The receipt is verifiable rather than promised, so "did my money
land" stops being a question you have to ask someone.

## How a support runs

| Route | What happens there |
|---|---|
| `/discover` | Search, filter by category, sort by supporters or volume |
| `/communities/[id]` | Profile — projects, funding goals, payout address |
| `/communities/[id]/support` | `quote` → `intent` → sign → report tx → confirmed |
| `/basket` | Several communities, settled in one pass |
| `/my-supports` | History, per-record detail, transaction hash |

The endpoint behind each step is listed under [Data layer](#data-layer).

---

## Stack

| Layer | Choice | Note |
|---|---|---|
| Framework | **Next.js 15.5** (App Router, RSC) | `reactStrictMode` on |
| UI | **React 19** + **TypeScript 5.7** | strict |
| Styling | **Tailwind CSS 3.4** | tokens live in `tailwind.config.ts`, not in `@theme` |
| Motion | **Framer Motion 11** | one token file: `lib/motion.ts` |
| Web3 | **wagmi 3** + **viem 2** | Monad testnet, chain id `10143` |
| Server state | **TanStack Query 5** | mounted once in `lib/web3/web3-provider.tsx` |
| Icons | **lucide-react** | |
| Backend | SUTU REST API behind a same-origin rewrite | see [Data layer](#data-layer) |

Typefaces load through `next/font`: **Space Grotesk** for display, **Inter** for
body, **JetBrains Mono** for figures and technical labels.

## Getting started

```bash
git clone https://github.com/DanKaza/SUTU.git
cd SUTU
npm install
cp .env.example .env.local     # edit if your API key differs
npm run dev                    # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint over the repo |
| `npm run typecheck` | `tsc --noEmit` |

`npm run typecheck && npm run lint` is clean on `main` — worth running before
you push.

## Environment

| Variable | Required | Default in code | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUTU_API_KEY` | yes | `sutu-dev-key` | Sent as `x-api-key` on every request |
| `NEXT_PUBLIC_SUTU_API_ORIGIN` | no | see `.env.example` | Backend origin that `/api/v1` and `/health` proxy to |

These are `NEXT_PUBLIC_*`, so they are inlined at build time. **Restart the dev
server after changing one** — a hot reload will not pick up a new origin.

`API_ORIGIN` is read in `next.config.ts` and nowhere else. The browser only ever
talks to the same-origin `/api/v1/*` path, so there is no CORS surface and the
origin cannot drift between two files.

## Project structure

```
app/
  layout.tsx          Root shell: fonts, providers, GlobalNav + Footer
  page.tsx            Landing — renders <LandingPage /> directly
  globals.css         Design tokens, focus ring, reduced-motion rules
  discover/           Search, category tabs, sort, directory grid
  communities/[id]/   Community profile
  communities/[id]/support/   Two-rail support flow (demo wallet | on-chain)
  basket/             Multi-community basket and checkout
  my-supports/        Support history + per-record detail
  profile/            Wallet profile
  about/  contact/    Static copy

components/
  layout/             Container, GlobalNav, Footer, MotionProvider, BrandLogo, ConnectButton
  landing/            Hero, FoldLight, ParallaxLayer, SupportFlowPreview, section blocks
  community/          DirectoryCard, TopCommunities
  ui/                 Card, Button, Input, Badge, Tabs, CountUp
  support/            AffirmationPop

lib/
  motion.ts           Every transition and variant in the app
  community-data.ts   Live fetch + mock fallback
  api/                Client, endpoints, types, formatters
  web3/               wagmi config, auth context, wallet errors
  mock-data.ts        Seed communities, used only when the API is unreachable

docs/                 Backend contract, design spec, redesign record
```

---

## Design system

### Colour

Defined in `tailwind.config.ts`. The app is dark-only by decision rather than by
trend — `void` and `ink-950` are both `#07060A`.

| Token | Value | Role |
|---|---|---|
| `ink-950` | `#07060A` | Canvas |
| `ink-900` | `#0D0B12` | Dark section |
| `ink-800` | `#17131F` | Raised surface |
| `ink-700` | `#24202E` | Border |
| `white` / `ink` | `#F7F5FB` | Headline |
| `muted` | `#AAA3B6` | Secondary text |
| `faint` | `#837B8F` | Caption |
| `violet-400` | `#A78BFA` | Highlight / accent text |
| `violet-500` | `#8B5CF6` | Primary accent |
| `violet-700` | `#5B21B6` | Deep glow |

**One accent: violet.** The logo is the only place a wider gradient appears, and
that is artwork rather than UI.

### Radii, easing, glow

`card` 20px · `section` 32px · `button` 999px · easing
`cubic-bezier(0.22, 1, 0.36, 1)` exposed as `ease-quintic-out`. Glow is capped
at the closing CTA rather than used as a surface default.

### Layout shell

`components/layout/container.tsx` is the only place the page shell is defined:

- **`Container`** — the 1200px column with `px-6 sm:px-12`. `GlobalNav` and
  `Footer` consume it too, so content on every route starts on the same vertical
  edge as the header. Adding a route that skips it reintroduces the
  misalignment this exists to prevent.
- **`ContainerNarrow`** — the reading measure nested inside the column, for pages
  that should stay narrow: profile, support flow, basket.

### Motion

Every transition comes from `lib/motion.ts`. Two rules are load-bearing:

1. **Entrances never start at `opacity: 0`.** An element painted at zero opacity
   is not eligible to be the largest contentful paint, so a fade above the fold
   pushes LCP out by the length of the animation. Entrances start at `0.001`. The
   `h1` is a single reveal for the same reason — it is never word-staggered.
2. **No ambient loops.** Motion is triggered by the reader: on scroll, on hover,
   or on pointer. The fold's light follows the cursor rather than pulsing on a
   timer, because perpetual motion nobody asked for competes with the copy.

Springs (`softSpring`, `snappySpring`, `heavySpring`) carry anything tracking the
pointer. The quintic curve is for one-shot entrances.

`MotionProvider` sets `MotionConfig reducedMotion="always"`, so
`prefers-reduced-motion` drops transform animations while opacity fades remain.
`app/globals.css` carries a second net for motion that runs outside that
context; `.motion-live` opts out anything functional — the nav scroll-progress
line — which has to keep tracking.

---

## Data layer

`lib/community-data.ts` is the single read path for communities. It calls
`fetchCommunities()` and `fetchStats()` in parallel, falls back to
`lib/mock-data.ts` if either fails, and reports which it used through
`isFallback`.

| Endpoint | Auth | Used by |
|---|---|---|
| `GET /health` | key | status check |
| `GET /communities` | key | directory, landing rail, hero object |
| `GET /communities/:slug` | key | community profile |
| `GET /stats` | key | supporter counts and totals |
| `POST /donations/quote` | key | support flow — discount preview |
| `POST /donations/intents` | key + wallet | locks the discount before payment |
| `POST /donations/intents/:id/tx` | key + wallet | reports a broadcast hash for instant confirm |
| `GET /users/me`, `/wallet/*`, `/donations/mine` | key + wallet | profile, basket, history |

Identity travels in the `x-wallet-address` header rather than SIWE. The
documented SIWE routes were never deployed, so `lib/api/endpoints.ts` records
them as absent instead of importing functions that would 404.

**The fallback is visible.** When the API is unreachable the UI shows seed data
labelled as sample data. `/stats` counts confirmed donations only, so a community
with nothing confirmed reads "No supporters yet" rather than a flat `0`.

### Wei handling

On-chain values are **decimal strings**, and every calculation goes through
`BigInt`. `parseFloat` on a wei value loses precision. `lib/api/format.ts` holds
the converters — format at the point of display, never in storage.

---

## Brand asset

`public/brand/sutu-mark.png` is the supplied artwork with its transparent margin
trimmed. The original 2000×2000 held the mark in only 1512×1297 of that, so
untrimmed it rendered at roughly 65% of whatever box it was given, sitting
bottom-heavy inside it.

`public/brand/sutu_logo.png` is the untouched original — re-run the trim if the
artwork is ever replaced. `BrandLogo` renders the mark, and its `alt` stays
`"SUTU"`, because the image is now the only place the product is named.

## Known issues

- **Wallet connection is desktop-only right now.** `lib/web3/config.ts`
  registers a single `injected()` connector, which needs a browser extension to
  exist. iOS Safari and Android Chrome have no extension model, so `signIn()`
  refuses and the connect button points at a desktop download. The fix is the
  `metaMask()` connector, which deep-links into the MetaMask mobile app and falls
  back to a QR code on desktop.
- **`auth-context.tsx` picks `connectors[0]` by index.** Harmless with one
  connector, wrong the moment a second one is registered.
- **Community slugs are live.** `/communities/lofi-collective` existed only in
  seed data. With the API reachable the real slugs — `beatforge`,
  `pixelpilgrims`, `rinjai-aid` — are what resolve, and anything absent from
  `GET /communities` 404s.
- **`Card` uses the `glass` utility** (16px blur), and `GlobalNav` blurs too once
  scrolled. Each is within the dose cap alone, but they are the app's two frosted
  surfaces at the same time.

## Documentation

| File | What it holds |
|---|---|
| `docs/backend.md` | Backend contract, proxy layout, status log |
| `docs/backend_update.md` | Endpoint and auth rules |
| `docs/sutu_desain_spesification.md` | Original design specification |
| `docs/redesign-landing.md` | Landing redesign record, measurements, decisions |