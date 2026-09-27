# StealthRDP Visual Direction

Status: canonical visual source of truth
Applies to: public StealthRDP website

References:
- https://cloudblast.io/
- https://deluxhost.net/en
- https://aspirehosting.net/
- https://servers.guru/?aff=62

## Goal

StealthRDP should feel like a modern, premium infrastructure hosting company.

The site is commercial first and technical second. It must help a visitor understand the offer, compare plans, trust the infrastructure, and reach checkout quickly.

Do not design the public website like an admin dashboard, monitoring console, fake terminal, SOC panel, or developer tool.

## Visual personality

- Dark, polished, high-contrast foundation.
- One clear StealthRDP brand accent plus a restrained secondary accent.
- Large, confident sans-serif typography.
- Generous spacing and strong visual hierarchy.
- Product and infrastructure visuals instead of decorative dashboards.
- Moderate radii. Cards are allowed when the content is a real discrete object.
- Gradients and glow are allowed only as controlled brand atmosphere, never as filler.
- Status colours stay semantic and separate from brand colours.
- Monospace is reserved for commands and technical values.

## Composition

The default page hierarchy is:

Page → Section → Container → Layout → Component → Element

Ownership:
- Page owns route-level composition.
- Section owns vertical rhythm.
- Container owns max width and horizontal gutters.
- Layout owns columns, grid and gap.
- Component owns its internal padding.
- Elements do not invent page-level spacing.

Homepage order:
1. Hero with one primary visual idea and two actions maximum.
2. Compact trust/proof strip.
3. Featured VPS plans.
4. Infrastructure/performance explanation.
5. USA + Europe location section.
6. Verified customer proof.
7. Resources/support.
8. Final conversion CTA.

## Layout contract

- Content max width: 1240px.
- Desktop gutter: 32px minimum.
- Mobile gutter: 20px.
- Marketing section rhythm: 72–112px depending on viewport.
- Reading width: approximately 680–760px.
- Hero text must dominate its visual.
- Use asymmetry selectively to create hierarchy.
- Avoid repeating the same 3-card or 4-card grid section after section.

## Components

Use shadcn/ui + Radix as the canonical interactive foundation.
Use Lucide for interface icons.
Build custom StealthRDP marketing components for hero, plans, infrastructure, locations, trust and conversion surfaces.

Do not add another general-purpose UI kit.

Cards are appropriate for:
- VPS plans.
- Reviews.
- Locations.
- A coherent product or feature object.

Cards are not the default wrapper for every paragraph.

## Colour

Brand colour is allowed and expected.

Roles:
- primary / brand: main StealthRDP action and recognition.
- secondary accent: limited visual depth and illustration support.
- green: healthy / success only.
- amber: warning / degraded only.
- red: destructive / failure only.
- neutral: secondary information.

Never use status colours as the brand identity.

## Typography

Use **IBM Plex Sans** for all public display, body, navigation, button, pricing, documentation, blog, and utility text.
Use **JetBrains Mono** only for commands, code, IP-like values, server/spec measurements, and genuinely technical identifiers.

Approved text weights are **400 / 500 / 600 / 700** only. Create hierarchy with scale, spacing, colour, and these four weights — not with extra font families or synthetic intermediate weights.

The public site must not introduce a separate serif/display family. `--font-display` and `--font-body` intentionally resolve to the same IBM Plex Sans family.

Avoid terminal-style labels across normal marketing copy, excessive uppercase microcopy, numbered clauses as the main identity, and multiple unrelated type treatments in one section.

## Visual imagery

Prefer purpose-built infrastructure illustrations, server/rack/network compositions, real product screenshots when useful, truthful datacenter/location imagery, and restrained abstract brand atmosphere.

For recognizable platforms and operating systems, use the **real approved brand mark** when available (for example Windows, Linux/Tux, Ubuntu, Debian, CentOS, AlmaLinux, Fedora). Do not replace a recognizable logo with a generic outline icon.

Outside the dedicated Windows/Linux product visuals, generic feature icons must be **substantial filled/solid or carefully chosen duotone technical glyphs**. Thin outline icons are not the default for feature/product communication. Do not put icons inside neon/glowing boxes, glass tiles, halos, faux-3D bevels, or decorative icon backgrounds. Generic icons use a coherent neutral/primary colour system; reserve green/amber/red for genuine semantic states such as protection, success, warning, or failure.

Avoid childish illustrations, random flat icon packs, mixed icon styles, or decorative icons that compete with the content.

Avoid generic floating glass cards, orbit rings around fake dashboards, fake live telemetry, decorative terminal windows, and stock-photo filler.

## Pricing

VPS is a spec-driven purchase.

Homepage:
- show a small useful featured set.
- keep CPU, RAM, storage, bandwidth, region and price scannable.
- provide a clear route to all plans.

Plans page:
- support region and billing comparison.
- visually align price and core specifications.
- keep checkout actions obvious.

## Motion

Motion is optional and subordinate to clarity.
Use short transitions for hover, state changes and small visual emphasis.
Respect reduced motion.
Do not introduce heavy WebGL or scroll choreography.

## Quality bar

A redesign is complete only when desktop and mobile renders look intentionally designed, hierarchy is obvious, spacing stays consistent, pages do not all use the same composition, product information remains easy to compare, and accessibility/SEO/security/performance gates pass.
