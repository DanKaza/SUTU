# SUTU

**Support Us Together** — one place to back the Web3 communities you care about.

SUTU puts community discovery, backing, and on-chain record-keeping in a single
dark-editorial interface. Payments settle on **Monad testnet**; every contribution
is recorded on-chain, so the record *is* the receipt.

![SUTU spotlight — hero, navigation, and the support object](./docs/images/spotlight.png)

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

Fonts are loaded through `next/font`: **Space Grotesk** (display), **Inter**
(body), **JetBrains Mono** (figures and technical labels).

---

## Quick start

```bash
git clone https://github.com/DanKaza/SUTU.git
cd SUTU
npm install
cp .env.example .env.local     # then edit if your key differs
npm run dev                    # http://localhost:3000
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint over the repo |
| `npm run typecheck` | `tsc --noEmit` |

Run `npm run typecheck && npm run lint` before pushing — both are clean on `main`.

---

## Environment

| Variable | Required | Default in code | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUTU_API_KEY` | yes | `sutu-dev-key` | Sent as `x-api-key` on every request |
| `NEXT_PUBLIC_SUTU_API_ORIGIN` | no | see `.env.example` | Backend origin the `/api/v1` and `/health` rewrites proxy to |

Because these are `NEXT_PUBLIC_*`, they are inlined at build time. **Restart the
dev server after changing them** — a hot reload will not pick up a new origin.

`API_ORIGIN` is read in `next.config.ts` only. Everything in the app talks to the
same-origin `/api/v1/*` path, so the browser never needs CORS and the origin
lives in exactly one place.

---

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
  landing/            Hero, FoldLight, ParallaxLayer, SupportFlowPreview, the section blocks
  community/          DirectoryCard, TopCommunities
  ui/                 Card, Button, Input, Badge, Tabs, CountUp
  support/            AffirmationPop

lib/
  motion.ts           Every transition and variant in the app
  community-data.ts   Live fetch + mock fallback
  api/                Client, endpoints, types, formatters
  web3/               wagmi config, auth context, wallet errors
  mock-data.ts        Seed communities used only when the API is unreachable

docs/                 Backend contract, design spec, redesign record
```

---

## Design system

### Colour

Defined in `tailwind.config.ts`. The app is dark-only by decision, not by trend —
`void` and `ink-950` are both `#07060A`.

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

**One accent.** Violet. The wordmark logo is the only place a wider gradient
appears, and that is artwork rather than UI.

### Radii, easing, glow

`card` 20px · `section` 32px · `button` 999px · easing `cubic-bezier(0.22, 1, 0.36, 1)`
as `ease-quintic-out`. Glow is capped at the closing CTA; it is not a surface default.

### Layout shell

`components/layout/container.tsx` is the only place the page shell is defined:

- `Container` — the 1200px column with `px-6 sm:px-12`. **`GlobalNav` and
  `Footer` consume it too**, so content on every route starts on the same
  vertical edge as the header. Adding a route without it is the regression that
  reintroduces misalignment.
- `ContainerNarrow` — the reading measure nested inside the column, for pages
  that should stay narrow (profile, support flow, basket).

### Motion

Everything comes from `lib/motion.ts`. Two rules are load-bearing:

1. **Entrances never start at `opacity: 0`.** An element painted at zero opacity
   is not eligible to be the largest contentful paint, so a fade-in above the
   fold pushes LCP out by the animation length. Entrances start at `0.001`.
   The h1 is a single reveal — it is never word-staggered, for the same reason.
2. **No ambient loops.** Motion is triggered by the reader: entrance on scroll,
   hover, or pointer. The fold's light follows the cursor rather than pulsing on
   a timer, because perpetual motion nobody asked for competes with the copy.

Springs (`softSpring`, `snappySpring`, `heavySpring`) are used for anything
tracking the pointer; the quintic curve is for one-shot entrances.

`MotionProvider` sets `MotionConfig reducedMotion="always"`, so
`prefers-reduced-motion` drops transform animations while keeping opacity fades.
`app/globals.css` carries a second net for motion that runs outside that context;
`.motion-live` opts out anything functional (the nav scroll-progress line) and
must keep tracking.

---

## Data layer

`lib/community-data.ts` is the single read path for communities. It calls
`fetchCommunities()` and `fetchStats()` in parallel, falls back to
`lib/mock-data.ts` if either fails, and reports which it used via `isFallback`.

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

Identity is the `x-wallet-address` header, not SIWE — the documented SIWE routes
were never deployed, so `lib/api/endpoints.ts` notes them as absent rather than
importing dead functions.

**The fallback is visible.** When the API is unreachable the UI shows seed data
labelled as sample data. Figures from `/stats` are confirmed donations only, so a
community with no confirmed support reads "No supporters yet" rather than "0".

### Wei handling

On-chain values are **decimal strings** and all arithmetic goes through `BigInt`.
`parseFloat` on a wei value loses precision. `lib/api/format.ts` holds the
converters; format at the point of display, never in storage.

---

## Brand asset

`public/brand/sutu-mark.png` is the supplied artwork with its transparent margin
trimmed (the original 2000×2000 held the mark in only 1512×1297, so untrimmed it
rendered at ~65% of its box with a bottom-heavy offset).
`public/brand/sutu_logo.png` is the untouched original — re-run the trim if the
artwork changes. `BrandLogo` renders the mark; `alt` stays `"SUTU"` because the
image is now the only place the product is named.

---

## Known issues

- **Community slugs are live.** `/communities/lofi-collective` existed only in
  seed data. With the API reachable the real slugs (`beatforge`, `pixelpilgrims`,
  `rinjai-aid`, …) are what resolve, and anything not returned by
  `GET /communities` 404s.
- **`Card` uses the `glass` utility** (16px blur) and `GlobalNav` blurs too when
  scrolled. Both are within the dose cap individually, but they are the app's two
  frosted surfaces at once — worth revisiting if the surface treatment ever
  feels flat.

---

## Documentation

| File | What it holds |
|---|---|
| `docs/backend.md` | Backend contract, proxy layout, status log |
| `docs/backend_update.md` | Endpoint and auth rules |
| `docs/sutu_desain_spesification.md` | Original design specification |
| `docs/redesign-landing.md` | Landing redesign record, measurements, decisions |
