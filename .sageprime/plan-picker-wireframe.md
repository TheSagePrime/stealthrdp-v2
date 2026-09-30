# Plan picker — structure proposal (surface: plans)

## Order (one guided stack, top to bottom)

1. `Region + use case` — one compact row: USA/EU segmented control left,
   use-case chips right (Remote desktop, Web hosting, Automation & bots,
   Trading, Storage & backups). Picks the highlighted starting tier.
2. `Billing cycle strip` — one compact row of 5 segmented options
   (Monthly, Quarterly, 6-month, Annual, 2-year), each with its save tag
   inline (e.g. Annual −15%). Tapping reprices every card below instantly.
3. `Plan cards` — vertical stack (mobile) / 2-column grid (desktop).
   Each card: plan name + region + Best-fit/Popular badge; one spec line
   (2 Core · 4 GB · 60 GB NVMe · Unlimited); big total-due-today price
   with effective-per-month small; full-width Buy Now (or Out-of-stock
   + named in-stock alternative). Nothing scrolls sideways.
4. `Selection summary` — sticky bottom bar on mobile, inline panel on
   desktop: "Bronze USA · Annual · €96.50 due today" + Buy button.
   Every tap above updates it. This is the answer to "what do I do next".
5. `Compare all specs` — the current ledger table, collapsed in a
   details expander for buyers who want the full grid.

## Structural differences from today (anti-reference)

1. Five large billing cards → one compact segmented strip bound to the list.
2. Horizontal-scroll ledger table as the primary surface → stacked cards
   primary; the table demoted to a collapsed comparison.
3. Three separated sections (finder / controls / table) → one guided order:
   region → cycle → plan, with a sticky summary.
4. Price changes that happen far from the tap → selection and consequence
   share the viewport; the summary always shows the current total + action.

## Rejected patterns

- Plan carousel (hides options, same discoverability sin as the swipe table).
- Table stays primary with sticky columns only (still hides plans on mobile).
- Accordion-per-plan (adds a tap per plan to see the price).
- Cycle toggle that only rewrites numbers somewhere below the fold.

## Reference → principle

Hetzner / DigitalOcean configurators: every option mutates one visible
order summary. Principle kept: selection and consequence share the viewport.
Rejected: their multi-page wizard — ours stays on one screen.

## Visual system

Unchanged. Existing Card, Button, Badge, segmented-control styles and the
dark surface, type scale, and spacing. No new visual world, no new tokens.
