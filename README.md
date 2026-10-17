# StealthRDP v2

The public website of StealthRDP: https://www.stealthrdp.com

It sells Windows and Linux VPS hosting and Citadel (Layer 7 DDoS protection). It explains the products,
compares plans, publishes guides and help articles, and shows service status. Checkout, login, billing
and tickets stay in WHMCS at `dash.stealthrdp.com`.

## Read this first

| You want to | Read |
|---|---|
| Change anything (people and AI agents) | [AGENTS.md](AGENTS.md) — the rules |
| Add or edit a page, guide, help article, FAQ, plan or redirect | [CONTRIBUTING.md](CONTRIBUTING.md) — step-by-step recipes |
| Write a claim about the product (price, speed, refund, support…) | [PRODUCT_FACTS.md](PRODUCT_FACTS.md) — the only approved facts |
| Understand how the site works | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Change how something looks | [DESIGN.md](DESIGN.md) (direction), [DESIGN_TOKENS.md](DESIGN_TOKENS.md) (colours, type, spacing, components), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) (implementation rules) |
| Touch headers, CSP, tracking, secrets | [SECURITY.md](SECURITY.md) |

## Environments

| Environment | URL | Built from | Host |
|---|---|---|---|
| Production | https://www.stealthrdp.com | `main` | Vercel project `stealthrdp-v2` (region iad1, Node 24) |
| Preview | https://preview.antah.de | `redesign/homepage-production-parity` | Coolify (Dockerfile, Node 24) |
| Local | http://localhost:3000 | your branch | `pnpm dev` |

- The apex `stealthrdp.com` and `http://` redirect to `https://www.stealthrdp.com`.
- Preview is never indexed (robots disallow and an `X-Robots-Tag` header).
- Analytics, ad tags and structured data run in production only.
- The old site (v1, repository `TheSagePrime/stealthrdp`) is locked on Vercel: it has no domains, no
  builds, and its Vercel URLs need a Vercel login. It is kept only for rollback.

## Quick start

```bash
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev            # starts local PGlite and Next.js on http://localhost:3000
```

Use Node 24 LTS (production and preview run Node 24; `package.json` allows Node 22 or later) and the
pnpm version in the `packageManager` field.

## Before you open a pull request

```bash
pnpm check:architecture   # stack, design, SEO and security contracts
pnpm test:contracts
pnpm test:security
pnpm check:types
pnpm check:oxlint
pnpm test                 # unit + UI tests
pnpm build                # SEO pre-build, Next build, SEO post-build audit
```

The pre-commit hook runs the contract checks, ESLint, type checks and knip. Do not skip it
(`--no-verify` is not allowed). Commit messages follow Conventional Commits with a lowercase subject,
for example `fix(seo): add canonical to the faq page`.

## Release

1. Work on a branch. Open a pull request to `main`.
2. If the pull request changes a protected file (see [AGENTS.md](AGENTS.md#protected-files)), the
   owner reviews it and adds the `architecture-approved` label. Only the owner adds this label.
3. Merge to `main`. Vercel deploys production in about 2 minutes.
4. Bring `main` into `redesign/homepage-production-parity` with a pull request so the preview matches.
5. Check the live site: the changed pages, `/sitemap.xml`, and the browser console.
