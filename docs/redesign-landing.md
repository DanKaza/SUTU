# SUTU Landing — Redesign Plan

**Status: implemented and verified.** `docs/desain.md` remains the source of truth
for tokens and rules; this document cites it and does not replace it.

Method: the `redesign` skill (Scan → Diagnose → Direct → Apply → Verify) with
`design-doctrine` for the non-negotiables, and `ui-ux-pro-max` for the direction
check (installed this session). Two searches were run: a `--design-system` query,
whose top result was a light-mode "Vibrant & Block-based" gaming system with a
blue/pink palette and Russo One — recorded as **not a match** for this product and
not applied, and a narrowed `--domain style` retry that returned
**exaggerated-minimalism** ("single accent only", "no decorations", extreme
negative space) and **dark-mode-oled** ("deep black, minimal glow, visible
focus"). Both reinforce the direction below; neither changes a token.

Surface:

```
app/page.tsx                  renders <LandingPage />
components/landing/*.tsx      the page itself
components/layout/container.tsx  the 1200px page shell, shared with GlobalNav and Footer
app/layout.tsx                GlobalNav + Footer wrap every route, landing included
tailwind.config.ts            token source
app/globals.css               CSS-variable layer + utilities
```

---

## 0. What was on the page (pre-redesign record)

| # | Section | Composition | Lead element |
|---|---|---|---|
| 1 | `HeroSection` | 7-col text + 5-col object, `AsciiField` behind both | h1 88px, then a faux terminal |
| 2 | `EditorialStatement` | centred, 820px | 48px blockquote |
| 3 | `ShowcasePanel` | card, 5-col text + 7-col community list | h2 48px + 3 rows |
| 4 | `NarrativeSection` | 860px column, 4 equal blocks | h2 48px + 4 x (title + body) |
| 5 | `SupportFlowPreview` | centred 900px card | mock support flow |
| 6 | `BenefitsSection` | 5-col text + 7-col 3 cards | h2 48px + 3 equal cards |
| 7 | `HowItWorksSection` | raised `bg-section`, centred h2 + 3 equal cards | h2 48px + 3 equal cards |
| 8 | `FinalCTA` | centred 3xl | h2 60px + one filled button |

---

## 1. The reference that was sent, measured

I cannot view images, so the file was decoded and profiled instead of described
from memory (`84561d7e…-1600x837.avif`, 1600x837, sRGB, opaque).

| Measurement | Value |
|---|---|
| Pixels below luminance 32 / below 16 | **82.6%** / 35.9% of the frame |
| Two dark fields | `#191a1e` (lum 26) = 41.4%, `#010101` (lum 1) = 31.5% |
| Pixels in near-flat patches (total gradient < 2) | **80.4%** — large smooth fields, not photographic texture |
| Light content (>110 lum), grouped by row | y 42-64, **y 132-194**, **y 255-300**, y 637-649, y 691-725, y 752-789 |
| One large lit mass | occupies y ≈ 335-530, spans nearly the full width at y 376-460; peak mean luminance **115 at y ≈ 471** |
| Black gutter | y ≈ 535-620, full width, luminance 1, edge energy 0.1 |
| Second glow | saturated magenta→red mass in the bottom-right corner from y ≈ 730 |
| Palette beyond the darks | amber/peach `#d89758`, `#e8b677`, `#e3a967`, `#f3dab7`, white `#fcfcfc`/`#d8d8d8`, a violet-tinted dark `#0b0915`/`#140d24` |
| Structural edges | no vertical edge sustained over 90px, no horizontal edge over 300px → **no cards, frames, panels or browser chrome** |

**How that reads:** a near-black page where exactly **one soft luminous mass is
lit**, the type sits above it, a black gutter separates it from what comes next,
and a single saturated glow anchors one corner. The dark field is two-step (a
lifted `#191a1e` and a true black) — structurally the same idea as our
`ink-900` / `ink-950` ladder.

Two notes: the reference's own accent is warm amber, and §2 bans a second accent,
so the light is re-mapped to violet; and the asset is not webstacks' homepage hero
(that one is an `aspect-4/5` photo card in a 3D transform) — the file itself was
treated as the reference. **The composition was chosen, not the amber** (your
answer to §9 below).

---

## 2. Diagnosis (pre-redesign)

Severity: **P1** blocks the direction, **P2** visible quality, **P3** hygiene.

| # | Sev | Finding | Evidence | Clause |
|---|---|---|---|---|
| F1 | P1 | **The first screen had no single lead.** Four things competed: the h1, an animated `AsciiField`, a self-typing faux terminal, and two CTAs plus three tick-marked proof lines. | `hero-section.tsx:25-27, 41-46, 67-72, 80-86`; `support-terminal.tsx` | §7 "motion is never ambient"; doctrine "one thing leads" |
| F2 | P1 | **A dead control.** "Watch the Intro" rendered a `<Button>` with no `href`, no `onClick`, no dialog. | `hero-section.tsx:60-63` | §8 "every nav item and control has a real destination or is removed" |
| F3 | P1 | **A second accent was live.** Pink in the wordmark gradient, the nav scroll-progress line and the benefits orb cluster. | `global-nav.tsx:69, 134`; `benefits-section.tsx:66-67` | §2 "no second accent"; §4 "the orb trio stays unused" |
| F4 | P1 | **The hero's object carried an off-token palette.** Five hardcoded hexes and a third violet (`#A970FF` vs `#7C3AED` / `#8B5CF6`). | `support-terminal.tsx:143-240`, `crt-terminal.tsx:93-238` | doctrine "one theme, one source of truth" |
| F5 | P2 | **Two sections shared one composition** — both "5 columns of text left, 7 columns of list right". | `showcase-panel.tsx:25`, `benefits-section.tsx:30` | §5 |
| F6 | P2 | **Two blocks of equal cards** (3 + 3): equal weight means the eye lands nowhere. | `benefits-section.tsx:79-100`, `how-it-works-section.tsx:51-92` | doctrine "one thing leads" |
| F7 | P2 | **Mono labels used as eyebrows** — "Our point of view", "CHOOSE AN AMOUNT", "SUPPORT SENT", "Step 01/02/03". | `editorial-statement.tsx:16`, `support-flow-preview.tsx:36, 54`, `how-it-works-section.tsx:82` | §3 |
| F8 | P2 | **The type scale was bypassed**: 9.5, 11 (x6), 12.5, 13, 15, 17, 20px against a 88/64/48/32/24/18/16/14/12 scale. | `grep -o 'text-\[[0-9.]*px\]' components/landing/*.tsx` | §3 |
| F9 | P2 | **Invented data on screen** — a fabricated `0x1a2b…c3d4` and `5 MON` printed as a record. | `support-flow-preview.tsx:63` | §8 |
| F10 | P3 | **Off-token canvas** `#08080B` on the page wrapper and the artboard, plus the `grain` overlay §4 retires. | `landing-page.tsx:14`, `app/page.tsx:73`; `globals.css` | §2, §4 |
| F11 | P3 | **Content width 1280px** against the spec's 1200px. | `landing-page.tsx:15` | §5 |
| F12 | P3 | **Dead import**: `CrtTerminal` imported into the hero, never rendered. | `hero-section.tsx:8` | hygiene |
| F13 | P3 | **Touch targets** — nav links were 15px text with no padding (≈21px tall). | `global-nav.tsx:81` | §9 |
| F14 | P3 | **`HowItWorks` at `py-28`** (112px), not one of §5's five values. | `landing-page.tsx:43` | §5 |

Kept because they were already right: `revealUp` never starts at `opacity: 0`
(LCP), `prefers-reduced-motion` is honoured globally, decorative layers are
`aria-hidden` / `pointer-events-none`, community rows use real seed data, and the
section rhythm varies.

---

## 3. Direction

> **One lit thing per screen.** The page is near-black; on each screen exactly one
> mass, one object or one line is lit, and everything else recedes into the dark
> field. Type sits above the light, never on top of it.

It resolves F1, F3, F4, F5 and F6 at once, because "one lit thing" is the rule
those findings all violate — not five separate bugs.

---

## 4. As built

### 4.1 The fold (`hero-section.tsx`)

```
y  76 - 579   type, left-aligned on the 1200 column
y 579 - 967   the lit band, full-bleed, one object inside it
y 967 - 1080  black gutter, so the next section starts on black
```

- **h1** `font-display` 88px / 0.95 / `-0.03em`, two lines: "Back something that
  matters." — "matters" is `text-violet-400` (the token, not `#A855F7`) and no
  longer scrambles. No eyebrow above it.
- **Subhead** 18px `muted`, 520px.
- **One primary CTA** (filled violet, `h-14`, arrow) plus one quiet link to
  `/about`. "Watch the Intro" is deleted, not restyled.
- **One fact line** — 12px mono `faint`: `No account needed · On-chain record ·
  From 3 MON`. It replaces the three tick-marked proofs, which duplicated the
  showcase list three sections later. (The plan said "From 1 MON"; the smallest
  amount the preview offers is 3, so the line now agrees with the control.)
- **The band** — full-bleed, `h-[clamp(340px,37vh,420px)]`, holding one soft
  violet ellipse that falls to nothing inside the band, plus a 56px top fade and
  an 88px bottom fade so the band meets the black around it instead of ending on a
  seam. The light drifts on a single `ParallaxLayer` (distance 28).
- **The one object** — `SupportFlowPreview`, `max-w-[620px]`, opaque `ink-900`
  card, `aria-hidden` light behind it.
- **Retired from the fold** — `AsciiField`, `SupportTerminal`, `CrtTerminal`,
  `ScrambleText`, both hero parallax layers except the band's.

### 4.2 Statement (§4.2)
`EditorialStatement` keeps its one argument and 820px column; the mono eyebrow is
deleted. `py-32`.

### 4.3 "Everything you need to back a community" (§4.3)
Was a 5/7 panel. Now a full-width rail: 32px heading top-left (not 48 — the page
had five 48px displays), a quiet "How SUTU works" link, and the three real
communities as three columns, each a hairline-topped link. No card. `py-16`.

### 4.4 "What we believe" (§4.4)
Four blocks kept; the `bg-violet-500/50` bars deleted (accent discipline); the
first block leads at 24px against 18px for the rest. `py-32`.

### 4.5 "Support that compounds." (§4.5)
De-carded: a three-column fact strip on the canvas — 20px lucide icon in `muted`,
16px title, 16px body, no card borders, no orb cluster, no pink, no button (the
hero and the closing CTA already carry that action). `py-16`.

### 4.6 "Three steps" (§4.6)
A numbered editorial list inside the same `bg-section` band: `01 / 02 / 03` as
12px mono numerals, step **02** (the action) on the band's one raised
`ink-800` surface with the accent border, 01 and 03 flat. Icons dropped — the
numeral is the label. `py-24`.

### 4.7 Final CTA (§4.7)
Unchanged in substance. `shadow-glow-violet` stays here and is removed from the
hero button, so the two actionable screens do not both glow. Parallax dropped.

### 4.8 Tokens and rhythm
Canvas `#08080B` → `bg-ink-950`; the `pink` token, the violet→pink gradient, the
unused `hero` mesh, `shadow-glow-pink`, `.text-iridescent`, `.aurora*`,
`.grid-lines`, `.grain`, `.pointer-glow` and the whole `.crt-*` block deleted from
`globals.css`; wordmark solid `violet-400`; progress line `violet-500`; one 1200px
column for nav, footer, landing and `/discover`.

Section padding: `py-32 / py-16 / py-32 / py-16 / py-24 / pt-40 pb-24` — every
value from §5's table, no two adjacent equal.

---

## 5. Verification (measured, not eyeballed)

Gates, exit status preserved with `set -o pipefail`:

| Check | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npx eslint components/landing components/layout app` | exit 0 |
| `npm run build` | exit 0 — 11/11 routes generated |

Rendered checks through the real page (headless Chrome over CDP, artboard at
1920x1080, screenshot pixels decoded with `sharp`; the harness was temporary and
has been deleted):

| # | Check | Result |
|---|---|---|
| 1 | **Luminance profile of the fold** | **85.7%** below luminance 40 (target ≥85, reference's own figure 82.6% below 32); **exactly one** lit region — y 709-917, 209px tall, **5.21%** of the frame — against 0.74% for the next largest, i.e. **14% of it** (target ≤25%). Peak luma in the visible mass **68.7** (`#4d3d78`) |
| 2 | **Band edges / full-bleed** | At the mass's mid-row: 22.8 at x=0 and x=1919, 31.1 at ±100, 49.2 across the plateau at 319/320/321 and 1599/1600/1601. Largest adjacent-column step on that row: **1.0** — no cliff where the container used to cut it |
| 3 | **Band → gutter** | Last row above luma 12 at y=979 (mean 12.25); the next row **0.69 lower**; 60 rows of gutter below. Gutter mean luma **7.25**, max row-to-row step **0.90** (measured on identical geometry; the card's opacity cannot affect rows outside the card) |
| 4 | **Contrast on the changed surfaces** | canvas `#07060a`: 18.67 / 8.3 / 5.0 / 7.42. Card interior `#161022` (worst case — includes the accent-wash affirmation block): 17.16 / 7.62 / **4.59** / 6.82. Raised `ink-800` card `#17131f`: 16.89 / 7.5 / **4.52** / 6.71 (primary / secondary / tertiary / violet-400) |
| 5 | **Target sizes** | 24 controls measured; every one is ≥44x44 except the mobile menu toggle, which is `display:none` at 1920 (0x0). Nav wordmark 47.6x44, footer links 55.5x44, nav links 61.1x44 |
| 6 | **No ambient motion** | Two frames 700ms apart are **pixel-identical** (mean delta 0.0000, max 0) on a fresh load, with **0** CSS animations |
| 7 | **Reduced motion** | `prefers-reduced-motion: reduce`: mean delta 0, and the band still renders its still frame at the same peak (68.7) |
| 8 | **390x844** | `scrollWidth` 390 == `innerWidth` (no horizontal overflow, widest right edge 390); band 340px (the clamp floor), card 342px, h1 48px |
| 9 | **Other routes** | `/discover`, `/profile`, `/basket`, `/my-supports`, `/communities/pixel-forge`, `/` all render with no error boundary and no console errors |

One number that did not exist before this pass and is worth keeping: with the
plan's original geometry the *visible* mass peaked at **24.6** — the ellipse's lit
core sat entirely behind the card, so the fold was lit nowhere. Widening the
plateau past the object's silhouette is what took it to 68.7.

The one inter-frame change the harness ever saw (322 px, 0.016% of the frame, at
x=0, y=74, only after the harness itself scrolled to the footer and back) is the
nav's scroll-progress spring settling. That is scroll-linked feedback, the
`.motion-live` element §7 preserves by design.

---

## 6. Deviations from the plan, and why

1. **No `Aurora` component exists in this checkout.** §4.1 assumed an `ogl`
   shader component; the light is therefore CSS gradients. The reference's own
   metric (80.4% of its frame in near-flat patches) says the light is *still*, so
   a shader was never the requirement.
2. **Band height is `clamp(340px,37vh,420px)`, not `clamp(320px,34vh,400px)`.**
   At the plan's number the 380px card was clipped by the band's `overflow-hidden`
   — measured, not guessed.
3. **The mass's plateau is wider than the plan's ellipse**, after measuring that
   the narrow version hid its own core behind the card.
4. **The preview lost its totals line, not just the transaction hash.** The card
   has to fit the band, and the rail three sections down already carries the
   community's numbers.
5. **The amount chips are real local state** (`aria-pressed` buttons that move the
   affirmation) rather than static chips. A chip that looks tappable and does
   nothing is the dead-control pattern F2 removed from the same screen.
6. **Body text in the dense strips is 16px, not the plan's 14px.** §3's body floor
   is 16px and the plan cited no clause overriding it.
7. **The card is opaque.** Translucent versions (90%, then 95%) measured tertiary
   text on it at 4.34:1 and 4.46:1 — both under AA. The light now reads as
   surrounding the object rather than passing through it.
8. **A bottom fade was added** (88px) alongside the top one (56px, not 24px): the
   mass would otherwise meet the gutter on a seam.
9. **Spacing moved three wrappers, not one**: showcase 24→16, benefits 24→16,
   steps 28→24. Fixing only F14 would have left `py-24` next to `py-24`, which §5
   forbids for adjacent sections.
10. **The 1200px column was applied to nav, footer and `/discover` too.** Changing
    only the landing would have put the page's content 40px inside its own header.
11. **The `ui-ux-pro-max` search result was not applied.** Its top recommendation
    was a light-mode gaming palette; the narrowed retry agreed with this direction
    but added no token.

---

## 7. Deleted

`components/landing/ascii-field.tsx` (422 lines), `scramble-text.tsx`,
`crt-terminal.tsx`, `support-terminal.tsx` — `grep` confirmed nothing else
imported them. Plus the dead CSS utilities and tokens listed in §4.8, and the
`CrtTerminal` dead import that F12 recorded.

---

## 8. Decisions this plan asked for

1. **The reference read** — composition, not the amber. Answered: composition.
2. **The CRT/support terminal aesthetic** — answered: retire it from the landing.
   Done (the four component files are deleted).
3. **The artboard harness** — originally answered: keep it. Later reversed:
   `app/page.tsx` now renders `<LandingPage />` directly and `app/landing-frame/`
   is deleted. The iframe pinned the viewport at 1920x1080, which hid real
   responsive behaviour (§9); the landing is reviewed at its own width now.
4. **`ui-ux-pro-max`** — answered: install it. Installed to
   `.agents/skills/ui-ux-pro-max/`; see §3 method for what it changed (the
   direction check, not a token).

---

## 9. Known limits

- My evidence is numeric pixel and box measurement, not visible screenshots: I
  cannot see images, so "looks right" is inferred from the profiles in §5.
- The bare mass (`#4d3d78`) is not a text surface: `muted` on it measures 3.83:1.
  That is deliberate — the light is `aria-hidden` and the only text over the band
  lives inside the opaque card. Anything placed directly on the light needs its
  own surface first.
- The artboard hides real responsive behaviour by design. The 390px check covers
  overflow and the band's clamp floor, not a full mobile redesign.
- `sharp` was used by the deleted harness only; it is a transitive dependency, not
  a new one.

---

## 10. Follow-up: the page shell

§6.10 applied the 1200px column to nav, footer and `/discover`, and stopped
there. The other eight routes kept their own widths and `px-6` only, so nothing
below shared the header's left edge. Measured content edge at a 1440px viewport:

| Route | Before | After |
|---|---|---|
| `GlobalNav`, `/`, footer | 168 / 168 / 120 | 168 / 168 / 168 |
| `/discover` | 144 | 168 |
| `/communities/[id]`, `/my-supports` | 360 | 168 |
| `/profile` | 408 | 168 |
| `/basket`, `/communities/[id]/support`, `/my-supports/[id]` | 488 | 168 |

`components/layout/container.tsx` is now the only place that holds the shell —
`Container` for the 1200px column, `ContainerNarrow` for the reading measure
nested inside it. `GlobalNav` and `Footer` consume it too, so the width and the
padding cannot drift apart again. Reading measures are unchanged: a narrow page
still centres its content inside the full-width column.

Two smaller inconsistencies fixed in the same pass:

- `Badge` and `ConnectButton` used `text-cyan` — a Tailwind default that
  survived because `theme.extend` does not replace the palette — against the
  F3 "no second accent" rule. Now `text-violet-400`.
- The community logo was drawn two ways: `bg-ink text-void` (light disc) on the
  app routes and `bg-ink-800 text-ink` (dark disc) on the landing. Unified on the
  landing's treatment.
