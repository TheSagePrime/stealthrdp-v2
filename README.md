# StealthRDP v2

Next-generation public website for StealthRDP, built from the Sage Prime `web-starter`.

## Product boundary

This repository owns the public website: product discovery, VPS plan comparison, Windows/Linux landing pages, documentation, blog content, FAQ, public status presentation, SEO, and future traffic tools.

It does **not** replace WHMCS. `dash.stealthrdp.com` continues to own login, checkout, billing, tickets, and client-account flows.

## Stack

- Next.js App Router + React + strict TypeScript
- Tailwind CSS + shadcn/ui + Radix + Lucide
- Neon PostgreSQL + Drizzle; PGlite locally
- pnpm
- Coolify-compatible deployment
- Vitest, Playwright, Storybook
- protected SEO/security/design contracts

## Migrated public routes

The V2 build includes the current homepage, plans, Windows VPS, Linux VPS, status, FAQ, about, privacy, docs, blog, and the Minecraft VPS page. Existing public content data is stored under `src/content/`.

## Development

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

For preview on Coolify use:

```text
SITE_URL=https://preview.antah.de
APP_ENV=preview
```

Preview remains noindex through the SEO environment contract.

## Verification

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
