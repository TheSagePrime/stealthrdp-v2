<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Sage Prime contracts

Before changing application code, read:

- `stack.contract.json`
- `design.contract.json`
- `security.contract.json`
- `ARCHITECTURE.md`
- `DESIGN_SYSTEM.md`
- `SECURITY.md`

The repository contracts are authoritative. Do not weaken a contract or checker to make a change pass.

### Canonical architecture

Keep Next.js + React + strict TypeScript + Tailwind + shadcn/ui + Radix + Lucide + Clerk + Neon PostgreSQL + Drizzle + Polar, with PGlite for local development, pnpm for packages, and Coolify-compatible deployment.

Do not introduce a competing ORM, auth provider, database provider, UI framework, icon library, billing provider, or deployment platform as an implementation shortcut.

### Security and privacy

- API resources are private by default unless explicitly allowlisted.
- Authenticate and authorize inside the resource; middleware only supplies request context and routing.
- Derive user, organization, tenant, and billing identity from Clerk server-side.
- Never accept a tenant owner ID or Polar customer selector from client input.
- Keep secrets server-only and out of logs, telemetry, screenshots, CI artifacts, and source control.
- Preserve privacy-safe Sentry/logging defaults, CSP/security headers, rate limits, dependency audit, and pinned GitHub Actions.
- Scope tenant-owned data through the canonical data boundary.
- Durable webhook writes require durable idempotency in the same persistence boundary.

### Frontend

Reuse existing product and `src/components/ui` components before creating new primitives. Use shared theme tokens rather than hardcoded colors. Preserve responsive states, keyboard behavior, accessibility, Storybook tests, and visual regression references.

### SEO

SEO is a protected subsystem. Preserve route classification, metadata/canonical helpers, robots/sitemap, article publishing helpers, SEO styles, pre-build validation, and post-build audit.

`robots.txt` is crawler guidance only; authentication is enforced by application resources.

For child projects, configure only real routes, brand facts, markets, articles, and research data. Never add fictional product claims to the starter.

### Verification

Before handoff run:

```bash
pnpm check:architecture
pnpm test:contracts
pnpm test:security
pnpm typegen
pnpm check:types
pnpm check:oxlint
pnpm check:format
pnpm test
pnpm storybook:test
pnpm test:visual
pnpm build
```

CI remains authoritative even when local hooks are bypassed.
