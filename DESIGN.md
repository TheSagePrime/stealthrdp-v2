# StealthRDP — DESIGN.md

The authoritative design specification for the public StealthRDP website.
Implementation reads this file. It is not a suggestion list.

```
Owner:                Sage Prime
Implementation owner: Suho / #Builder
Repo:                 TheSagePrime/stealthrdp-v2
Branch:               redesign/preview-ui   base ae5f38c
Status:               direction approved by Bhuvan, 2026-09-20
Stack:                FROZEN. Next.js 16.3.3, React 19.2.7, Tailwind, shadcn/Radix, Lucide.
Copy:                 FROZEN. No new words. Not one heading, not one label.
```

Evidence behind this file: six award-verified infrastructure sites (Awwwards SOTD / HM),
their tokens read from live CSS. Full research in
`/opt/data/stealthrdp-redesign-research/` (`groupA.md`, `groupB.md`, `groupC.md`,
`baseline.md`, `DIRECTION.md`).

---

## 1. Product truth

StealthRDP sells Windows and Linux VPS and RDP hosting.
The public site helps a buyer understand the service, compare plans, read operational
guidance, and move to WHMCS for checkout.
The site does not replace WHMCS. Login, billing, checkout and client accounts stay at
`dash.stealthrdp.com`. Nothing here may compete with that handoff; the site must carry
the entire credibility load before the buyer leaves.

## 2. Surfaces and modes

| Surface | Mode | Composition constraint |
|---|---|---|
| Home | Persuade | Earn the next click. One claim, one action, real proof. |
| Plans | Persuade | Comparison outranks atmosphere. |
| Docs index | Read | Search and task selection outrank marketing. |
| Docs article | Read | Reading and safe execution outrank decoration. |
| Status | Operate | Current state outranks any promotional claim. |
| FAQ, blog, policy | Read | Calm hierarchy, clear support path. |

## 3. Palette — Graphite / Restrained Gold

Jev ranked four directions; the incumbent cobalt scored lowest at 0.10, so we rebuild.

```
ground
  --bg              #0B0C0E
  --bg-elev         #101216
  --surface-1       #14171C
  --surface-2       #1A1E25
  --surface-3       #222831

text
  --text            #EAECF0
  --text-muted      #9BA3AF
  --text-dim        #6E7683

borders  (split by ROLE - never reuse one for another)
  --border-divider  #242A33    1.35:1   cosmetic only, never a control
  --border-soft     #42413E    1.92:1   subtle separator
  --border-control  #5F5E5B    3.02:1   inputs, controls, meaningful boundaries
  --focus-ring      #E8B84B   10.61:1

accent
  --accent          #E8B84B   10.61:1 on bg
  --accent-hover    #F2C86B
  --accent-press    #D2A338
  --accent-ink      #171204   text placed ON the accent

status  (ALWAYS with an icon and a label - never colour alone)
  --status-ok       #34D399   10.18:1
  --status-warn     #FB923C    8.65:1
  --status-bad      #F87171    7.07:1
  --status-unknown  #6E7683
```

Contrast: 15 of 15 checks pass at WCAG AA. Do not add a colour that has not been
measured. Do not introduce a second accent.

Rationale for gold rather than amber: amber (hue 37°) sat only 10° from the warning
orange (hue 27°). Gold (hue 42°) gives 15° of separation and higher contrast.

## 4. Type system — editorial contrast

```
display   Libre Caslon Display  (OFL)   display-1, display-2, display-3 only
body/UI   IBM Plex Sans         (OFL)   prose, interface, labels, heading-4
mono      JetBrains Mono        (OFL)   technical values, always
```

Self-host these. No Google Fonts CDN.

**Do not** use any face in the detector's actual overused set. This is the real
expanded list, not the shorter one its warning message prints:

```
inter · roboto · open sans · lato · montserrat · arial · helvetica
fraunces · instrument sans · instrument serif · geist · geist sans · geist mono
mona sans · plus jakarta sans · space grotesk · recoleta
```

Instrument Serif was chosen first and had to be replaced: it is on that list, grouped
as the agent-default wave. Choosing it would have rebuilt the same problem we are
removing.

Scale, fluid where noted:

```
display-1   clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)    lh 1.04   Libre Caslon Display
display-2   clamp(2rem, 1.4rem + 2.4vw, 3.25rem)     lh 1.08   Libre Caslon Display
display-3   clamp(1.5rem, 1.25rem + 1.1vw, 2.125rem) lh 1.15   Libre Caslon Display
heading-4   clamp(1.25rem, 1.13rem + 0.5vw, 1.5rem)  lh 1.25   IBM Plex Sans 600
body-lg     1.125rem                                  lh 1.65   IBM Plex Sans
body        1rem                                      lh 1.65   IBM Plex Sans
small       0.875rem                                  lh 1.5    IBM Plex Sans
micro       0.75rem                                   lh 1.4    IBM Plex Sans 500, tracking +0.02em
mono-sm     0.8125rem                                 lh 1.5    JetBrains Mono
```

Long-read rule: body line height never below 1.6 and measure never above 72 characters.
The site carries real documentation, so reading comfort constrains composition.

The mono face must do real work: IPv4/IPv6 addresses, CPU and RAM specs, bandwidth,
latency, timestamps, plan prices, status labels, commands.

## 5. Space and layout

```
base unit   4px
scale       4 8 12 16 24 32 48 64 96 128
two tiers   product/dense  4-24px     status, tables, forms
            marketing      24-128px   section rhythm
section     96px desktop / 64px mobile between sections
container   1200px max, 24px gutter
columns     12 desktop / 8 tablet / 4 mobile
```

Two-tier spacing is deliberate. Marketing pages breathe; data surfaces stay dense.

## 6. Radius and elevation

```
--radius-sm   6px
--radius-md   10px    dominant - use this by default
--radius-lg   16px    large panels only
--radius-full 999px   pills and avatars only
```

No ad-hoc radius values. Three of the four reference hosting sites used a wide,
untokenised spread of radii; that is the anti-pattern.

Elevation: two levels only.

```
elev-1   surface-1 + --border-divider
elev-2   surface-2 + shadow 0 12px 32px rgba(0,0,0,.45)
```

No glassmorphism. No frosted panel stacks. No orbs.

## 7. Motion

```
durations  120ms state change · 180ms focus and hover · 240ms content entrance
easing     cubic-bezier(.22, 1, .36, 1)
```

Motion is allowed for exactly three jobs: state change, focus, and the entrance of
primary content. Nothing else.

Banned: marquee, count-up counters, scroll-jacking, reveal-on-scroll applied to every
section, parallax decoration, animated gradients.

`prefers-reduced-motion: reduce` must disable all of it. Only two of the six award
references honoured this; we do.

## 8. Components

Present today: `badge`, `button`, `card`, `dropdown-menu`, `separator`. That is not
enough. Add, using shadcn/Radix primitives and Lucide icons only:

```
table        plans comparison, per-location data
tabs         Windows vs Linux
accordion    FAQ
tooltip      spec explanations
dialog       confirmations
alert        status and notices
pill         status, always icon + label
breadcrumb   docs
code-block   docs and commands
kbd          shortcuts
progress     provisioning steps
```

Also add a **named z-index scale** (`--z-header`, `--z-overlay`, `--z-modal`). Unnamed
z-index values are the usual source of layering bugs.

## 9. Per-surface composition

Home. Section order is deliberate; the first three are structural changes from the
incumbent, not refinements.

```
1  HERO            one claim, one primary action, one secondary
                   + proof strip: locations count, live status pill
2  SECTION INDEX   anchored links labelled with the incumbent's own headings
3  "The part that matters after checkout."   moved up from position 5
                   carries a numbered provisioning sequence
4  "Put the server closer to the work."      a data table, not a decorative map
                   per location: region, specs, network, IPv4/IPv6, test file
5  "Built for the workload, not the brochure."  claim + one measured property each
6  plans preview   a real comparison, not three equal cards
7  docs and FAQ entry points
8  closing action  single, repeats the primary
```

Plans.

```
1  hero, one line
2  COMPARISON TABLE FIRST, above the tier cards
3  tier cards, subordinate to the table
4  Windows / Linux split with real specs
5  "The essentials are already covered." as a scannable matrix, not prose
6  the custom-build path
7  closing action
```

Comparison table rules, from Baymard: comparison outranks atmosphere for spec-driven
products; optimise the table for scanning; keep the column set small and consistent.

## 10. Accessibility

```
contrast       AA on all text and every UI state - measured, not eyeballed
focus          visible ring, --focus-ring, never removed
target size    44px minimum for interactive elements
status         never colour alone; icon + label always
motion         prefers-reduced-motion honoured
structure      one h1 per page, semantic landmarks, logical heading order
language       the app is localised - never hard-code English strings
```

## 11. Banned patterns

Each of these is either already in the codebase or a known generated-design tell.

```
thick single-side card borders              [side-tab]            present today x3
two-axis grid-line gradient background      [codex-grid-background] present today x1
Arial / Inter in the primary voice          [overused-font]       present today x4
ad-hoc radius spread                        3 of 4 reference sites
glass orbs and frosted panel stacks
purple-to-blue gradient chrome
three equal feature cards as the default rhythm
marquee, count-up, reveal-on-scroll everywhere
a palette switcher                          the incumbent shipped ten; we ship one
status by colour alone
a badge wall of self-awarded trust marks
adjectives where a number belongs
```

## 12. Ship gate

```bash
node /opt/data/vendor/impeccable-src/cli/bin/cli.js detect <path>
```

Baseline today: **8 hits**, of which 1 sits in `src/styles/foundation.css`, a file that
is present but not imported. Before the count is used as the gate, re-scope the detector
to live files and re-report the true baseline.

Ship requires **0**. Any exception must be named and approved by Bhuvan.

## 13. What must not change

```
the stack          Dockerfile stays `next start`, package.json, pnpm, the [locale] routing
the copy           every word, price, spec, claim, link and WHMCS URL
the routes         existing public URLs keep their intent
the 51 commits     the marketing work already on this branch
```

Before any deploy, diff the run config against the base commit. A green build and 200
responses prove nothing about whether the same application is still running.
