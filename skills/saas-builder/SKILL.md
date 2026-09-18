---
name: sage-prime-builder
description: Build Sage Prime products inside the canonical enforced architecture and design system.
---

# Sage Prime Builder

Use this repository as the canonical foundation for Sage Prime products. The repository contracts are authoritative. This skill explains how to work inside them; it does not override them.

## Before writing code

1. Read `stack.contract.json`, `design.contract.json`, `ARCHITECTURE.md`, and `DESIGN_SYSTEM.md`.
2. Inspect the existing product routes, components, data model, auth boundary, billing boundary, and SEO configuration.
3. Read the relevant Next.js version documentation in the installed package before relying on remembered APIs.
4. Reuse existing architecture and components before introducing new abstractions.

## Canonical stack

Keep Next.js, React, strict TypeScript, Tailwind, shadcn/ui, Radix, Lucide, Clerk, Neon PostgreSQL, Drizzle, Polar, PGlite for local development, pnpm, and Coolify.

Do not substitute competing frameworks, ORMs, databases, auth providers, UI systems, icon libraries, billing providers, or deployment platforms as an implementation shortcut.

## Frontend workflow

For UI work:

1. Understand the information hierarchy and real product state.
2. Reuse an existing product component where possible.
3. Reuse `src/components/ui` primitives.
4. Add a shadcn/Radix primitive when the needed behavior does not exist.
5. Create a reusable product component only after the previous options are exhausted.
6. Use theme tokens from `src/styles/global.css`; do not invent arbitrary colors.
7. Cover meaningful loading, empty, error, disabled, mobile, and desktop states.
8. Preserve keyboard behavior, semantics, focus states, and accessibility.
9. Render and visually inspect meaningful UI changes before considering them finished.

Avoid generic AI decoration: arbitrary gradients, glassmorphism, oversized radii, excessive cards, emoji-as-icons, random shadows, one-off color systems, and duplicated primitives.

## Data and platform boundaries

- Clerk is the authentication boundary.
- Neon is the production PostgreSQL provider.
- Drizzle is the ORM.
- The runtime DB boundary remains Drizzle over `pg`; PGlite is local-only.
- Keep workspace access server-side and fail closed.
- Keep Polar calls behind the existing billing boundary.
- Runtime secrets remain outside Git and client bundles.
- Use Coolify environment variables for deployment.

## SEO boundary

SEO is a protected subsystem. Do not refactor or simplify SEO infrastructure as collateral work.

Preserve:
- route classification
- metadata and canonical helpers
- robots and sitemap generation
- article registry and publication helpers
- SEO-specific article styles
- pre-build validation
- post-build audit
- the build order: SEO pre-build -> Next build -> SEO post-build

Project-specific SEO research, keywords, brand claims, markets, and content belong to the child product, not the generic starter.

## Verification

Before handing work off:

```bash
pnpm check:architecture
pnpm typegen
pnpm check:types
pnpm check:oxlint
pnpm check:format
pnpm test
pnpm build
```

Run Storybook/E2E/visual checks when the changed surface is covered by them.

Do not weaken a contract or checker merely to make a failing change pass. If the architecture itself must change, treat it as an explicit architecture migration and request owner review.
