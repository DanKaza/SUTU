# SUTU Design System

Supersedes the original "Design Brief" (aurora mesh, glassmorphism, bento
grid, glow borders, iridescent gradient). That brief described the default
AI-generated dark landing page. This one is built from what the product
actually is, with every choice carrying a reason.

**The product:** people back Web3 communities. Not join them, not chat in
them. A contribution is a gesture that gets acknowledged, not a transaction
row. Everything below serves that.

---

## 1. Position

> Support is a gesture, not a payment.

The interface should feel like giving something to a project you follow,
then seeing it land. Calm, specific, a little warm. It is not a trading app,
not a social network, and not a marketplace.

**Deliberately not:** neon crypto, token charts, rocket/robot/matrix
imagery, "join the community" growth language, chat-first framing.

---

## 2. Colour

Dark-only. The reason is product, not trend: a support flow is a short,
focused, often one-handed action, and a dark ground keeps the amount, the
community mark, and the affirmation as the only lit things on screen.

| Role | Value | Reason |
|---|---|---|
| Canvas | `#07060A` | Near-black with a blue cast, not neutral black. Holds the violet accent without vibrating. |
| Surface 1 (resting card) | `#17131F` | One step off the canvas. Present, not loud. |
| Surface 2 (raised) | `#0D0B12`→`#1E1930` | Reserved for the one or two things per screen that matter. |
| Border | `rgba(255,255,255,0.11)` | Defines edges without drawing them. |
| Text primary | `#F7F5FB` | 18.7:1 on canvas. |
| Text secondary | `#AAA3B6` | 8.3:1 on canvas, 7.5:1 on card. |
| Text tertiary | `#837B8F` | 5.0:1 on canvas, 4.5:1 on card. Smallest step that still clears AA. |
| Accent | `#7C3AED` | The one accent. 5.3:1 against text primary, so it can carry a filled button. |

### Accent discipline

The accent appears on: the primary button of a screen, the active tab
indicator, the focus ring, and the affirmation moment. That is the whole
list.

`#8B5CF6` is available for accent *surfaces* only (a 10% wash behind an
active row) — never behind body text, where it drops to 3.9:1 and fails AA.

No second accent. Cyan and magenta are not in the palette. An iridescent
violet-to-cyan-to-magenta gradient is the single most recognisable
generated-UI tell and it is banned here.

---

## 3. Type

| Role | Face | Reason |
|---|---|---|
| Display | Space Grotesk | Geometric, slightly odd letterforms. Carries the "web3 but not casino" register. |
| Body | Inter | Neutral, high x-height, survives long paragraphs. |
| Numerals, addresses, tx hashes | JetBrains Mono | Anything a user might copy or compare must be monospaced. |

Scale: `88 / 64 / 48 / 32 / 24 / 18 / 16 / 14 / 12`. Body floor is 16px;
12px is reserved for labels and never for sentences.

### Banned typographic habits

- Uppercase with wide tracking as a section eyebrow. Six of these were on the
  landing page and every one duplicated information the heading below it
  already carried.
- Monospace as a decorative display face.
- A label in mono above a heading in mono.

---

## 4. Surfaces and depth

Depth comes from **surface level**, not from glow. Three levels, no more:

```
canvas        #07060A    the page
surface 1     #17131F    cards, list rows, inputs
surface 2     gradient    at most one element per screen
```

`shadow-glow-violet` is for the primary action of a screen and nothing else.
A card that lifts on hover gets a 1px border-colour shift, not a glow.

**Why this replaces the old approach.** The unused utilities in
`globals.css` — `aurora`, `aurora-orb`, `grid-lines`, `grain`,
`pointer-glow` — are a blurred-orb hero, a blueprint grid and a grain
overlay. That trio is the stock generated dark-landing recipe. They stay
unused. If a future screen genuinely needs texture, it gets a reason written
here first.

Glass stays at 1–2 elements per screen. `glass` on every card flattens the
hierarchy it is supposed to create.

---

## 5. Layout

**Content width** 1200px, page gutters 24px mobile / 48px desktop.

**Section rhythm — vary it.** The old landing page wrapped all eight
sections in an identical `py-[clamp(80px,10vw,140px)]`, which reads as one
flat strip. Spacing is a signal, so it carries meaning:

| Section kind | Top / bottom padding |
|---|---|
| Statement (one line of argument) | 128 / 128 |
| Feature set | 96 / 96 |
| Dense content (search, grid, list) | 64 / 64 |
| Transition into a CTA | 160 / 96 |
| CTA itself | 96 / 160 |

Adjacent sections must not share a padding value.

**Composition varies too.** Not every section is centred-heading-plus-card-
grid. Alternate text-heavy and visual, symmetric and asymmetric. If two
consecutive sections share a composition, one of them is wrong.

**Cards are not uniform.** When several cards carry equal weight, they are a
list, not a mosaic. A mosaic is only honest when the content genuinely has
items of different sizes. The flagship item may take the full width.

---

## 6. Components

- **Primary button** — filled `#7C3AED`, pill, one per screen. Carries the
  glow on hover only.
- **Secondary** — outline, no fill.
- **Ghost** — text only, for tertiary actions.
- **Card** — surface 1, 1px border, 20px radius. Hover shifts border to
  `rgba(255,255,255,0.2)`. No glow.
- **Amount button** — the support flow's real control. Selected state is a
  filled accent wash with an accent border, not a colour change alone.
- **Affirmation** — the moment support lands. The one place a large,
  confident, animated treatment is correct, because it is the product's
  payoff. `lib/affirmations.ts` already models it as a gesture word plus a
  caption.
- **Empty state** — names the cause and gives the one action that fills it.
  "No supports yet. Back a community to start your history." Never a bare
  "No data".

### Radius

Three values only: `8px` (inputs, small chips), `20px` (cards),
`999px` (pills and buttons). A fourth ad-hoc radius is a decision that was
not made.

### Icons

Relevance first, library second. Lucide is fine but it is the project's
default and uniformity is its own tell, so an icon that carries no meaning
gets dropped rather than filled in. No emoji in the interface at all.

---

## 7. Motion

Motion answers "what just happened". It is never ambient.

- Entrance: one staggered reveal per section, `once`, 300ms, quintic-out.
- Interaction: 150–200ms on colour and border.
- The affirmation: the one place with a spring entrance.
- Nothing loops forever. A pulsing dot that marks no state is deleted, not
  styled.

`prefers-reduced-motion` is already honoured globally in `globals.css`; keep
it that way.

---

## 8. Honesty rules

These are product rules that happen to be visible.

- No invented metrics. The hero's "12,000+ people already showing up" with
  five placeholder avatars is removed or labelled as placeholder.
- No invented activity, names, avatars or event feeds.
- Empty form fields stay empty or use obvious placeholders (`Your name`,
  `you@example.com`) — never `John Doe`.
- Every nav item and control has a real destination or is removed. `/join`
  and `/stories` do not exist as routes and must not appear in the nav.
- Placeholder values that are still mock are visible as placeholders.

---

## 9. Accessibility floor

Not optional, and the current state is below it.

- Every interactive control has a visible focus indicator. `focus-visible`
  ring at minimum; the current build has none.
- Every `<label>` is bound to its input via `htmlFor`/`id`. Four labels are
  currently unbound.
- Icon-only controls carry `aria-label`.
- Body text clears 4.5:1; large text and non-text clears 3:1.
- Touch targets are at least 44×44px.

---

## 10. What this document is for

When a change is proposed, it either cites a section here or it does not
belong in the interface. Anything that adds a glow, a gradient mesh, a
background grid, an uppercase eyebrow, an emoji icon or a decorative status
dot needs a written reason in this file before it ships.
