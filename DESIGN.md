# StealthRDP v2 — home page design

Direction: **MANIFEST**
Surface mode: **Persuade** · User job: decide whether StealthRDP fits the workload, then reach checkout.
Design owner: Suho / #Builder · Date: 2026-09-21 · Status: home page only, preview branch, not deployed

This document describes what is on the branch. Where the design changed while it was built, the
change and its reason are recorded rather than hidden.

---

## 1. What the previous two designs were, and why they failed

Two designs exist in this history: the live production page and the v2 tree. Both are the same
architecture with a different pigment.

| | production (the "golden one") | v2 tree before this work |
|---|---|---|
| primary accent | cobalt `#5B86F5` | cyan `#67E8F9` / `#00F0FF` |
| opening | copy left, terminal-window card right | copy left, layered server card right, aura + two orbit rings + three floating status chips |
| proof | 3-cell statistic card | 4-cell statistic row + 5-item icon rail |
| shape | rounded rectangles, 8–16px radius | rounded rectangles, 16–20px radius |
| plans | card grid | card grid |
| sections | hero, numbers, OS strip, pricing, regions, reviews, CTA | hero, proof rail, OS pills, pricing, rack, regions, reviews, CTA |

Both lead with a decorative product mockup, both sit on a blue-black field, both use rounded cards
as the only container, and both carry one saturated cool accent. The owner's complaint — the
redesign read as the same design as the golden one — is correct at the level of architecture.
Colour was the only variable, so colour is all that ever changed.

Moving sections around would not fix that. The failure mode is the *container*: a decorated hero
followed by a stack of rounded card sections.

## 2. References

Each is award-winning or carries published conversion evidence. I found and verified these myself.
I did not read Sage's research files.

| # | Reference | Qualification (verified) | What I take | What I do not take |
|---|---|---|---|---|
| 1 | **Hut 8** — https://www.awwwards.com/sites/hut-8 | Awwwards **Site of the Day, 2025-10-28**, 7.63/10. Awwwards records the palette as **two colours**: `#181818` and `#BCBFB0`. Tagged Minimal, Typography, Clean. | A data-centre company that wins SOTD with two pigments. Restraint forces composition and data to carry authority. Warm bone on ink, not cold blue-white. | Its WebGL universe and scroll choreography. That site is an experience piece; this page is a purchase decision. |
| 2 | **Modal** — https://www.awwwards.com/sites/modal | Awwwards **Honorable Mention, 2024-11-11**. Categorised Technology, Clean, Data Visualization. | A developer-infrastructure page where the product's own artefacts carry the imagery. No stock photography, no device mockups. | Its colour use and long-form marketing narrative. |
| 3 | **Cerebrium** — https://www.awwwards.com/sites/cerebrium | Awwwards **Site of the Day, 2026-09-10**. | An infrastructure page whose first screen states the offer and then shows live capacity. Big type, low ornament. | Its WebGL intro, which costs time-to-first-meaning. |
| 4 | **EternaCloud** — https://www.awwwards.com/sites/eternacloud | Awwwards **Honorable Mention, 2025**. | A cloud brand holding a technical tone without illustration. | Its one-page scroll format; a purchase path needs separable sections. |
| 5 | **Baymard Institute**, *50 Cart Abandonment Rate Statistics* — https://baymard.com/lists/cart-abandonment-rate | Published conversion evidence, updated 2025-09-22: average documented cart abandonment **70.22%** across 50 studies; **17%** of shoppers abandon because the "checkout process was too long / complicated"; Baymard calculates up to a **35.26% conversion increase** from checkout design alone. | The hand-off to WHMCS is the riskiest step in this funnel. State the price, the specification and the availability *before* the click, so the buyer compares on the page. | Nothing visual. This one is an argument, not a style. |

Reference count: **five**, five attributable.

## 3. Contract decision

`AGENTS.md`, `STEALTHRDP_DESIGN.md` and `design.contract.json` are kept, with **three revisions**.

**Revision A — the chromatic brand accent is removed. (`AGENTS.md`, `STEALTHRDP_DESIGN.md`)**

The contract asked for "a restrained electric-gold deployment signal". Gold is the pigment of the
design the owner rejected, and the tree's pigment is cyan. Those are the only two identities this
repository has shipped. A third pigment simply becomes the next thing that looks like the last
thing. The contract's own state palette is green = healthy, orange = warning, red = failure, grey =
unknown. Remove the brand hue and nothing is left that has not already been used. So the identity
moves from *pigment* to *form* — composition, rules, type and tabular data — and colour is demoted
to meaning only.

**Revision B — "modest radii" becomes "no radii; rules instead of boxes". (`STEALTHRDP_DESIGN.md`)**

The contract already said "do not nest cards without a clear information relationship". A page
whose only container is a rounded card has no other relationship available. This design uses
hairline rules and margins as the container, so there is nothing left to round.

**Revision C — the reading face changes from Inter to IBM Plex Sans. (`STEALTHRDP_DESIGN.md`)**

Inter is a saturated-pattern font. More importantly, the contract declared three typefaces and the
repository loaded none of them: every route was falling back to `system-ui`. That is why the last
redesign's only visible change was "the font". The three families are now self-hosted and applied,
and the reading face is IBM Plex Sans, which is drawn for technical documentation and pairs better
with Space Grotesk and JetBrains Mono than Inter did. The contract line itself now reads
`Use IBM Plex Sans for reading and interface text.`, so the document and the shipped page agree.

`design.contract.json` is **unchanged**: shadcn/ui new-york, lucide, and every required token remain
in place, and the existing primitives are still the only interactive primitives used.

## 4. Identity

Two pigments, and colour only where it means something.

```
ink-000   #0A0B0C   page
ink-100   #0E1011   sheet, sticky rule
ink-200   #141617   raised cell, table row hover
rule      #23272B   hairline
rule-hi   #34393E   emphasised hairline, focus outline
paper     #E8E6E1   primary text, headings, primary action fill
paper-dim #A9AAA3   secondary text
paper-fnt #8B8D87   labels, metadata
ok        #5BC98C   reporting / healthy / in stock
warn      #E0A75E   out of stock, degraded
stop      #E4695F   not reporting / failure
```

Warm bone rather than blue-white, learned from Hut 8. Every chromatic value in the page is a state
value. Nothing decorative is coloured.

**A hairline and a control boundary are different objects, and they are held to different rules.**

```
rule      #23272B   1.31:1   decorative hairline — separates content
rule-hi   #34393E   1.69:1   decorative hairline, emphasised — a line of the document
paper-fnt #8B8D87   5.87:1   control boundary — the border or underline that identifies
                             an operable element
paper     #E8E6E1  15.79:1   focus outline, primary action fill
```

A hairline that only separates rows of a record may sit below 3:1, and both values are declared
here so they are reviewed rather than exempted. Anything that identifies a *control* may not:
WCAG 2.2 SC 1.4.11 requires 3:1 for a UI component boundary and for a component state, and a focus
ring is the textbook case. So button borders, the underline of a standalone link and the focus
outline use `paper-faint` (5.87:1 on ink-000, 5.68:1 on ink-100, 5.41:1 on ink-200) or `paper`
(15.79:1). The lowest control pair on the page is 5.41:1.

**The signature is a rule, not a glow.** A 1px hairline, a tabular figure and a left gutter carry
the identity. Inside the design system this document owns — `.sr-home` plus the home route's chrome
corrections in §10 — there is no aura, no ring, no gradient, no glow, no shadow and no backdrop
blur. The shared mobile menu was the one exception in the first build; it is now corrected on the
home route (§10), and other routes keep their own chrome untouched.

## 5. Type system

The contract's three families, implemented for real and self-hosted in `public/fonts` (OFL), so no
build step depends on the network.

```
display   Space Grotesk 300-700   the claim, clause titles, the featured citation
text      IBM Plex Sans 100-700   sentences, descriptions, controls
data      JetBrains Mono 100-800  every figure, label, region, availability, price
```

Home page only: the three faces are declared under `@font-face` with page-scoped family names
(`SR Ledger Display`, `SR Ledger Text`, `SR Ledger Mono`). The stacks on the home route name the
loaded families first, so no tool reads the page as an unloaded family.

Floors and rules, established by measurement rather than taste:

- **12px floor** for anything that carries content. The detector's 11px floor is the legal minimum;
  12px is the legibility bar. Nothing on the page renders below 12px.
- **Tabular figures** on every number in a column, right-aligned, so a column can be compared by eye.
- **No tracking above 0.08em**, and no tracking at all on sentence-length text. Tracking is kept
  only for the two-character clause index and the short clause label.

## 6. Composition

The page the owner was unhappy with ran hero → proof rail → OS pills → pricing → rack → regions →
reviews → CTA: eight rounded-card sections with centred headers.

**MANIFEST replaces the hero with a record, and the card stack with a ruled sheet.**

```
                          (existing site header, unchanged)

  ┌─ SHEET ONE ────────────────────────────────────────────────────────────┐
  │  Your server, online in 60 seconds.      [Space Grotesk, 70px, 1 line] │
  │  ─────────────────────────────────────────────────────────────────────  │
  │  Windows or Linux, USA or EU. Full        ORDERS      10,000+ delivered │
  │  administrator access, NVMe storage       ENTRY       €9.50 / month     │
  │  and unlimited transfer on every plan     PLANS       11                │
  │  — from €9.50/month.                      IMAGES      Windows + Linux   │
  │                                           ACCESS      Full administrator│
  │  [ DEPLOY A SERVER → ]                    REGIONS     USA + EU           │
  │  Compare all 11 plans                     UPTIME SLA  99.9%             │
  │                                           MONEY-BACK  7 days            │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ STICKY STATE RULE — under the header for the whole page ──────────────┐
  │ ● ALL REPORTING · 9 MONITORS · LOWEST 99.923% · 9/9 UP · STATUS        │
  └────────────────────────────────────────────────────────────────────────┘

  ┌─ LIVE LEDGER — the dominant element of the second screenful ───────────┐
  │  9 ruled rows, one per real monitor in uptime.json:                     │
  │  region / node / uptime figure / state                                  │
  │  LOWEST 99.923% · CONTROL PANEL NODE 01 · ALL MONITORS REPORTING        │
  └────────────────────────────────────────────────────────────────────────┘

  §01 CAPACITY    eleven plans, one ruled inventory table per region
  §02 HARDWARE    four facts, ruled, value-aligned
  §03 SYSTEMS     nine operating systems in one ruled grid
  §04 REGIONS     USA and EU, each with its real monitor count
  §05 THE RECORD  one featured citation + ruled rows with source and date
  §06 START       one line, one action

                          (existing site footer, unchanged)
```

**Nine material differences from the incumbent**, not a rearrangement:

1. The opening is a **ruled record**, not a split hero with a decorative product mockup.
2. The page's proof is **live data**, not a drawn device.
3. A **sticky state rule** persists the real figures for the whole page. The base has no persistent
   element; this is a spine.
4. **Zero rounded containers.** All structure is hairline rules and margins.
5. **Plan cards become an inventory table** with aligned, comparable numeric columns — the Baymard
   argument, answered on the page instead of inside WHMCS.
6. **Section headers leave the centre.** Each clause is a left gutter (`§NN` + label) against a
   content column — a document, not a stack of headings.
7. **The testimonial grid becomes a citation ledger** — one quotation set at reading size with its
   source, the rest as ruled rows. Six equal boxes become one statement and a list.
8. **No accent colour exists.** Colour appears only as state.
9. **Removed outright:** the aura, the two orbit rings, the floating status chips, the drawn server
   card, the five-icon proof rail, the OS pill strip, the rack diagram, the region card grid, and the
   closing CTA banner.

**Hierarchy.** One dominant element per screenful: sheet one → the claim; the ledger screen → the
live ledger; each clause → its own single subject. Nothing competes at equal weight.

**The spine is one line at every mandated width.** At 430 and 390 the two derived counts
(`9 MONITORS`, `9/9 UP`) would push the `STATUS` link onto a second line, so below 470px they leave
the visual line and stay in the accessibility tree. The ledger directly under the spine renders all
nine rows with their real figures, so no figure leaves the page and none leaves the DOM.

**Copy change.** The claim reads "Your server, online in 60 seconds." — the second fragment became
the first line rather than a stacked two-sentence fragment. Every other figure on the page traces to
`uptime.json`, `plans.json` or existing approved copy.

## 7. Motion

Almost none, and nothing that animates a number.

- The state dot pulses at 2.4s where a monitor reports `status: "up"`. Under
  `prefers-reduced-motion: reduce` it stops, and transitions are reduced to 0.01ms.
- Hover: table rows take an `ink-200` fill; links underline; a paper-filled action inverts to
  transparent. No transform, no lift, no shadow.
- No scroll-triggered reveals, no parallax, no counters.

**Change from the first proposal, and why.** The proposal specified nine uptime bars drawing from 0
to their true width on load. The real figures run from 99.923% to 100.000%. At page width those
widths are visually identical, so the bar would have been decoration dressed as data. The bars were
removed before the page was built and the figures are set large in tabular mono instead.

## 8. Spacing scale

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96  (px, plus clamp() at section level)
```

Clause rhythm: `--srx-pad: clamp(3rem, 6vw, 6rem)` desktop, `48px` at 768, `40px` at 470.
Gutter column `118px` at desktop, `92px` at 1100, collapsing to a stacked label at 768.

## 9. What happened to the existing assets

| Asset | Decision | Why |
|---|---|---|
| `src/content/uptime.json` | **kept, now load-bearing** | The opening evidence and the sticky rule. Nine real monitors. |
| `src/content/plans.json` | **kept, now load-bearing** | The inventory table reads name, specs, availability, price and checkout URL from it alone. |
| `src/content/testimonials.json` | **kept** | The citation ledger. Sources and dates shown as published. |
| `src/components/site/PricingExplorer.tsx` | **kept, unchanged, no longer on home** | `/plans` still uses it. The home page needs a comparison table, not a guided finder. |
| `src/components/site/StatusGrid.tsx` | **kept, unchanged** | `/status` still uses it. |
| `SessionPreview.tsx` | **absent from the tree** | The reset to `ae5f38c` removed it. Not restored: a drawn session device is exactly the decoration this direction removes. |
| `src/components/ui/*` primitives | **kept** | Still the only interactive primitives on the page, per `design.contract.json`. |
| the five anti-pattern fixes (`f8bd915`) | **kept** | They live in the base and the base is the starting point. |
| `.sr-*` stylesheet rules for the removed home sections | **left in place** | They serve other routes; deleting them risks those routes. |
| `tests/e2e/DefaultUI.keyless.e2e.ts` | **two assertions retargeted** | It asserted "Plans priced for the work", a section this design removes. It now asserts the new h2s. The h1 assertion still passes unchanged. |

## 10. Home-route-only corrections to shared chrome

Eight real defects sit in shared `src/styles/stealth.css` and shared components. They are corrected
**on the home route only**, scoped with `:has(.sr-home)`, so every other route is byte-identical in
behaviour:

| Defect | Correction |
|---|---|
| `.sr-site { overflow-x: hidden }` computes `overflow-y: auto`, which makes `.sr-site` a scroll container and silently disables `position: sticky` for every descendant — including the site header, on every route. | `overflow-x: visible` on the home route. The home page has zero horizontal overflow at 1440/1024/768/430/390/360/320, so nothing needs clipping. **This defect is unfixed on every other route.** |
| `.sr-site` paints a radial cyan wash and a navy field. The home page paints its own opaque surface, so they were invisible behind it. | `background: none` on the home route. |
| The header action renders white text on a cyan fill, measured **1.4:1**. | Repainted with the home shape language on the home route. **The 1.4:1 failure remains on every other route.** |
| The topline, footer headings, footer legal line and social labels set 11.5px text. | Raised to 12px on the home route. |
| The footer legal line runs to 81 characters per line. | Capped on the home route. |
| The shared mobile menu is a `0.7rem`-radius trigger plus a navy panel with a `1rem` radius and a `0px 22px 70px` shadow — a rounded, shadowed container on a page whose premise is squared rules. | Repainted with the home shape language on the home route: square `paper-faint` trigger, `ink-100` panel, no radius, no shadow, square links. Contrast: panel links `paper-dim` on `ink-100` = 8.14:1, hover `paper` on `ink-200` = 14.55:1, trigger border `paper-faint` = 5.68:1. **Other routes keep the shared menu.** |
| The shared header nav paints `0.65rem`-radius hover chips in the shared palette, and the footer social links are `0.6rem`-radius chips with a `--border` outline — two more rounded containers in the home route's chrome. | Squared and repainted in the home palette on the home route: nav links `paper-dim`, hover `paper` on `ink-200`; social chips `paper-dim` with a `paper-faint` boundary. **Other routes keep the shared chips.** |

## 11. Constraints check

- No dependency, config or route change. `git diff --stat ae5f38c -- Dockerfile package.json
  pnpm-lock.yaml next.config.ts` is empty.
- `git diff --stat ae5f38c -- src/content` is empty.
- New words on the home page only. Every figure traces to `uptime.json`, `plans.json` or existing
  approved copy. No invented statistic, no superlative, no unverifiable promise.
- Prices, specs and checkout URLs come from `plans.json` only.
- Nothing styled as an affordance that does not act.
- Files touched: `AGENTS.md`, `STEALTHRDP_DESIGN.md`, `THIRD_PARTY_NOTICES.md`, `DESIGN.md`,
  `public/fonts/*`, `src/components/home/*`, `src/app/[locale]/(marketing)/page.tsx`,
  `src/styles/stealth.css`, `tests/e2e/DefaultUI.keyless.e2e.ts`.

## 12. Corrections after the first review

A review round found four blocking items and one undecided one. All five are closed, and the reasons
are recorded rather than the diffs.

| Item | Finding | Decision and reason |
|---|---|---|
| 1 | The focus outline used `rule-hi` `#34393E`, measured live at 1.69:1 on ink-000 and 1.64:1 on ink-100 — under the 3:1 that SC 1.4.11 requires for a component state. The "decorative hairline" justification covered the hairline, not the focus ring. | The focus outline is now `paper` (`15.79:1` on ink-000, `15.29:1` on ink-100), measured live with the ring in place. The same finding was taken as a class, not a single rule: every border or underline that identifies an operable element moved to `paper-faint` — `.srx-btn-quiet`, the plan-table action buttons, the `.srx-quiet` underline, and the status link's separator. The home route's shared chrome (header nav, footer links, social chips, mobile menu) is included, because it otherwise fell back to the user-agent ring — `3.60:1` on ink-000 and painted in the tree's cyan, the chromatic accent this design removed. `rule-hi` is now used only for decorative hairlines, and §4 states the difference. |
| 2 | `DESIGN.md` claimed revision C was recorded in `STEALTHRDP_DESIGN.md`, but that file still read "Use Inter for reading and interface text", so the contract mandated a family no route loads. | The contract was completed rather than the claim withdrawn: `STEALTHRDP_DESIGN.md` now reads "Use IBM Plex Sans for reading and interface text". The revision is real and now true in the document as well as the page. |
| 3 | The reported `jev_review` pass did not reproduce: on the shipped page r4 ("not describable as a reskin") triggers at 0.79 and 0.82 against a 0.7 threshold. | Accepted as a real discrepancy. The earlier claim came from a run against the description of the work before it was built, and it is not a result for the shipped page. The shipped-page run is reported with its numbers in the handoff, including the trigger, and the gate is left for the owner and the independent verifier to weigh. |
| 4 | `DESIGN.md` said "no shadow anywhere on the page" while the shared mobile-menu panel paints a 16px radius and a `0px 22px 70px` shadow on the home route; and the stylesheet comment at the site wrapper said `clip` while the rule sets `overflow-x: visible`. | Both fixed at the source instead of reworded. The shared menu — and, with it, the shared header nav and footer social chips, which carried rounded `0.65rem`/`0.6rem` fills — is repainted square in the home palette on the home route (§10, rows 6–7), so the claim is now true of what the home route renders. The comment now describes the code: the route sets `overflow-x: visible`, which is safe because the page has zero horizontal overflow at 1440/1024/768/430/390/360/320. |
| 5 | The sticky spine was two lines at 430 and 390, against the one-line rule drawn in §6. | Decided, not disclosed. Below 470px the two derived counts (`9 MONITORS`, `9/9 UP`) leave the visual line and remain in the accessibility tree, so the spine — state, lowest figure, action — stays one line at every mandated width. Recorded in §6. |
| 6 | Rendered review found a defect no automated gate reported: in the stacked table below 768px, the price cell held the currency as one grid item and the amount as another, so `€` and `9.50` landed in different columns and read as two unrelated values. The same desktop `width: 12%` on `th:first-child` kept the plan-name cell at ~44px on a phone, wrapping every name and overrunning its box by 7px. | Both fixed at the source. The price is now one grid item (`<span class="srx-price-value">`), and the stacked table resets `th:first-child` to `width: auto`. Verified at 768/470/430/390/360/320: `€9.50` renders as one value, plan names render on one line, and horizontal overflow stays 0px. |
