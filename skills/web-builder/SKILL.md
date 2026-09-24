# Web Builder

Use this skill for Sage Prime public web properties.

## Objective

Build public websites that compound traffic through useful content, free tools, technical SEO, internal linking, and strong user experience.

The site may monetize directly, promote a separate SaaS product, or remain non-commercial. Do not force a monetization model into the foundation.

## Default architecture

Keep the repository's canonical Next.js/React/TypeScript/Tailwind/shadcn/Radix stack.

Keep Neon + Drizzle + PGlite available as generic persistence. Use the database only when the site or a tool needs it.

Do not add authentication, organizations/tenants, dashboards, billing, checkout, customer portals, or subscription webhooks unless the child project explicitly requires an architecture change.

## SEO

Treat SEO infrastructure as protected. New public pages and tools must use the canonical metadata, canonical URL, sitemap, structured-data, article/research, and internal-link systems.

Free tools should exist because they solve a real user problem, not merely because they can target a keyword.

## Public tools

Validate inputs with Zod. Keep expensive operations bounded. Use rate limiting and same-origin checks where appropriate. Never expose raw secrets or private backend records.

## Frontend

Read DESIGN.md before visual work. It is the single project visual source of truth.

Use DESIGN_SYSTEM.md for component and layout implementation.
Use shadcn/Radix as the primary interactive foundation and custom product components for authored marketing surfaces.

For StealthRDP:
- build a modern commercial hosting site, not a dashboard or control-room UI.
- keep one shared container and section rhythm.
- use brand colour intentionally; keep status colours semantic.
- cards are valid for real product objects such as VPS plans, locations and reviews.
- do not revive fake terminals, orbit-ring dashboards, floating telemetry cards, numbered-clause layouts, or repetitive feature-card grids.
- verify meaningful frontend work at desktop and mobile sizes.

## Verification

Run the repository architecture, security, test, visual, and SEO gates before handoff.
