# Design tokens and patterns

The values below are copied from the code. The source of truth is `src/styles/global.css`
(protected). If this file and the CSS disagree, the CSS wins — then fix this file.

Use the token, never its hex value. The design contract check fails on hard-coded colours outside
`global.css`.

## Colour — light theme (the live site)

The site runs in light mode only. `.dark` values exist in `global.css` for primitives, but no page
uses them.

### Brand and actions

| Token | Value | Use |
|---|---|---|
| `--primary` / `--accent` | `#2038c8` | brand blue: primary buttons, links, selected controls, focus |
| `--accent-hover` | `#1a2fae` | hover on primary actions |
| `--accent-press` | `#16279a` | pressed state |
| `--primary-foreground` / `--accent-ink` | `#ffffff` | text on brand blue |
| `--ring` / `--focus-ring` | `#2038c8` | keyboard focus outline |

### Surfaces and text

| Token | Value | Use |
|---|---|---|
| `--background` / `--bg` | `#eceff4` | page background (cool grey) |
| `--bg-elev` | `#e7ebf2` | slightly raised page bands |
| `--surface-1` / `--card` / `--popover` | `#ffffff` | cards, panels, menus |
| `--surface-2` / `--secondary` | `#f5f7fa` / `#f4f6fa` | inset areas, secondary buttons |
| `--surface-3` / `--muted` | `#e9edf4` / `#eef1f6` | wells, table stripes, muted blocks |
| `--foreground` / `--text` | `#0b1220` | headings and body text |
| `--text-muted` / `--muted-foreground` | `#39465e` | secondary text |
| `--text-dim` | `#5a6780` | captions, meta, footer links |
| `--border` / `--border-divider` | `#d5dbe6` | dividers, card borders |
| `--border-soft` / `--input` | `#c3cbda` | input borders, soft outlines |
| `--border-control` | `#9aa6bd` | strong control borders |

### Status (semantic only — never decoration or brand)

| Token | Value | Meaning |
|---|---|---|
| `--status-ok` | `#1d7f52` | healthy, operational, success |
| `--status-warn` | `#8a5a06` | degraded, warning |
| `--status-bad` / `--destructive` | `#b3261e` | down, error, destructive action |
| `--status-unknown` | `#5c6a84` | paused, unknown |

Always pair a status colour with a word or icon (for example the `Pill` component: "Operational").

### Citadel product surfaces

| Token | Value |
|---|---|
| `--citadel-canvas` | `#f5f8fd` |
| `--citadel-surface` | `#ffffff` |
| `--citadel-ink` | `#10182b` |
| `--citadel-muted` | `#53647f` |
| `--citadel-border` | `#dce6f3` |
| `--citadel-glow` | `#1fa8d8` (Citadel accent only) |

### Charts

`--chart-1` `#2038c8`, `--chart-2` `#1d7f52`, `--chart-3` `#8a5a06`, `--chart-4` `#5c6a84`,
`--chart-5` `#b3261e`.

### Legacy raw colours

`global.css` also holds about 90 `--sr-raw-<hex>` variables. They are old literal colours moved out of
`stealth-v3.css` so that file has no hex values. Do not use them in new work; use the role tokens
above. The WhatsApp green (`--sr-raw-16a34a`, `--sr-raw-22c55e`) is the one brand
colour that stays in this set; it is used only for WhatsApp marks and `.srv-whatsapp-float`.

### Mixing

For tints and shadows, mix a token with `transparent`:
`color-mix(in srgb, var(--primary) 12%, transparent)`.

## Typography

| Token | Value | Use |
|---|---|---|
| `--font-display`, `--font-body` | IBM Plex Sans (self-hosted, `public/fonts/`) | all text |
| `--font-mono` | JetBrains Mono (self-hosted) | commands, code, IPs, technical values only |
| `--text-display-1` | `clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)`, line-height 1.05 | homepage hero H1 only |
| `--text-page-title` (= display-2) | `clamp(2rem, 1.4rem + 2.4vw, 3.25rem)`, 1.1 | every other page H1 |
| `--text-section-title` (= display-3) | `clamp(1.5rem, 1.25rem + 1.1vw, 2.125rem)`, 1.15 | marketing section H2 |
| `--text-subsection-title` (= heading-4) | `clamp(1.25rem, 1.13rem + 0.5vw, 1.5rem)`, 1.25 | docs, legal and article H2 |
| `--text-card-title` (= body-lg) | `1.125rem`, 1.35 | H3 and card titles |
| `--text-body-lg` | `1.125rem`, 1.65 | lead paragraphs |
| `--text-body` | `1rem`, 1.65 | body text |
| `--text-small` | `0.875rem`, 1.5 | supporting text |
| `--text-micro` | `0.75rem`, 1.4 | labels, meta (minimum size) |
| `--text-mono-sm` | `0.8125rem`, 1.5 | inline technical values |

Weights: 400, 500, 600, 700 only.

## Spacing

Base unit `--spacing: 4px` (Tailwind `p-4` = 16px).

| Scale | Tokens |
|---|---|
| Product (inside components) | `--spacing-product-1..5` = 4, 8, 12, 16, 24px |
| Marketing (between sections and blocks) | `--spacing-marketing-1..6` = 24, 32, 48, 64, 96, 128px |

Section padding scales with the viewport:

- Page heroes: about 64–118px top, 48–92px bottom (`clamp()` in the `.srv-*` hero classes).
- Content sections: about 48–104px (`clamp(52px, 6vw, 78px)` to `clamp(76px, 7vw, 104px)` in
  `stealth-v3.css`, or Tailwind `py-10`/`py-12 sm:py-14 lg:py-16` on the homepage).

Reuse an existing section class or one of these values. Do not invent a new rhythm per page.

## Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 10px | small controls, tags |
| `--radius-md` (`--radius`) | 12px | buttons, inputs, small cards |
| `--radius-lg` / `--radius-xl` | 18px | cards, panels, banners |
| `--radius-full` | 999px | pills, round buttons |

Known exception: plan cards use 16px/14px. They are frozen (see `DESIGN.md`).

## Layout

| Item | Value | Where |
|---|---|---|
| Content width | 1240px max (`.sr-container`); some page types use `--srv-page-width` 1160–1240px | `stealth-v3.css` |
| Gutters | 32px desktop, 20px under 1040px, 16px under 640px | `.sr-container` |
| Reading width | about 680–760px | articles, docs, legal |
| Main breakpoints | 1040px (desktop nav → Menu), 760px, 640px, 520px (small phones) | `stealth-v3.css` |

## Elevation

Shadows are soft and tinted from the text colour, never pure black:

| Level | Value | Use |
|---|---|---|
| Low | `0 8px 24px color-mix(in srgb, var(--foreground) 5%, transparent)` | cards at rest |
| Medium | `0 18px 40px color-mix(in srgb, var(--foreground) 6%, transparent)` | hero panels |
| High | `0 18px 40px color-mix(in srgb, var(--foreground) 12%, transparent)` | floating elements (consent banner) |

Do not use `shadow-2xl`, `shadow-[…]`, `backdrop-blur` or gradient utilities (design contract).

## Icons and images

| Kind | Source | Rule |
|---|---|---|
| Interface and feature icons | `@phosphor-icons/react` (primary; use `/dist/ssr` in server components) | one weight per surface; `fill` for feature icons; sizes 16/20/24/32 |
| Brand marks (Discord, Telegram, X, WhatsApp…) | `@icons-pack/react-simple-icons` or the vendor SVG | never redraw a logo |
| OS and product logos | `public/brand/*.svg` (Windows, Linux/Tux, Ubuntu, Debian, CentOS, AlmaLinux, Fedora, Citadel shield) | sources in `public/brand/provenance.json` |
| Lucide | `lucide-react` | legacy; do not use for new work |

Decorative icons get `aria-hidden="true"`. Icon-only controls need an accessible name and a 44px hit
area.

## Components to reuse

| Need | Use |
|---|---|
| Button / link that looks like a button | `Button` (`src/components/ui/button.tsx`): variants `default`, `outline`, `secondary`, `ghost`, `link`, `destructive`; sizes `default`, `sm`, `lg` (all at least 44px high). Use `asChild` with `Link` for navigation. |
| Small label | `Badge` |
| Status label | `Pill` with state `ok`, `warn`, `bad`, `unknown`, `neutral` |
| Card | `Card`, `CardContent` — only for real objects (plan, review, location, doc) |
| Tabs, accordion, dialog, dropdown, tooltip, table, separator | the matching file in `src/components/ui/` |
| Code with copy button | Markdown code fences in docs; `code-block` component elsewhere |
| Checkout button | text **Order Now**, link from `checkoutUrl()` |

## Motion

- Short transitions (about 160ms) for hover and state changes.
- Every animation must stop or reduce under `@media (prefers-reduced-motion: reduce)`.
- Status animations (for example the status scan) run only when the data is live.

## External audit scale

`design-tokens.json` is the list of allowed raw values (spacing, radius, font size) for an external
design-audit tool (`.hermes/gates.json`). It is not the token source. Keep it in step when you add a
genuinely new value to the scales above.
