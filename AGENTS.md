# StealthRDP v2 agent contract

Read `stack.contract.json`, `design.contract.json`, `security.contract.json`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `SECURITY.md`, and `STEALTHRDP_DESIGN.md` before material changes.

## Product boundary

This repository is the public StealthRDP website. Do not add a replacement login, customer dashboard, organizations, tenant architecture, subscription billing, or checkout system. Those flows remain in WHMCS at `dash.stealthrdp.com`.

## Product truth

Use current verified public StealthRDP data before changing pricing, availability, specifications, licensing language, refund language, uptime claims, locations, or provisioning claims.

Do not fabricate live status, reviews, scarcity, deadlines, or service guarantees.

## Frontend

Preserve the StealthRDP dark control-room direction: restrained gold deployment signal, charcoal/navy surfaces, clear information hierarchy, modest radii, and technical motifs only where they explain infrastructure.

Reuse shadcn/Radix primitives and Lucide icons. Avoid generic AI dashboard chrome.

## SEO

Preserve current public URL intent and the protected SEO pipeline. Preview must remain noindex. Do not casually rename indexed routes.

## External systems

WHMCS owns login, billing, checkout, client accounts, and tickets. Links to it are allowed; copying those systems into V2 is not.

## Verification

Run the repository architecture, security, types, lint, tests, Storybook, visual, and SEO build gates before handoff.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
