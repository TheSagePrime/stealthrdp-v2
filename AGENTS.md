## StealthRDP v2 — rules for agents and contributors

This repository is the public website at https://www.stealthrdp.com. These rules apply to every change,
by a person or an AI agent. When a rule here and your own habit disagree, the rule wins.

### Read before you change anything

1. [README.md](README.md) — environments and release steps.
2. [CONTRIBUTING.md](CONTRIBUTING.md) — the recipe for your change.
3. [PRODUCT_FACTS.md](PRODUCT_FACTS.md) — before you write any claim about the product.
4. [ARCHITECTURE.md](ARCHITECTURE.md) — before you touch routing, data, SEO or deployment.
5. [DESIGN.md](DESIGN.md), [DESIGN_TOKENS.md](DESIGN_TOKENS.md) and [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — before you
   change how anything looks.
6. [SECURITY.md](SECURITY.md) — before you touch headers, CSP, tracking, secrets or APIs.
7. The contracts `stack.contract.json`, `design.contract.json`, `security.contract.json`.

### Never

- Never weaken a contract, a checker, a test or a pnpm/CI safety setting to make a change pass.
  Fix the change instead. If a rule blocks you, stop and ask the owner.
- Never skip hooks (`--no-verify`) or skip, disable or delete a test to get green.
- Never add the `architecture-approved` label. Only the owner adds it.
- Never merge a pull request that changes a protected file before the owner has added that label.
- Never invent reviews, numbers, stock, deadlines, guarantees or live data. Use
  [PRODUCT_FACTS.md](PRODUCT_FACTS.md).
- Never change plan-card styles (`.sr-pick-card` and the pricing cards). The owner has frozen them.
- Never rename an indexed URL without a 308 redirect from the old URL.
- Never put model names, secrets, tokens or customer data in commits, pull requests or code.
- Never rebuild WHMCS features here: login, checkout, billing, client accounts and tickets stay at
  `dash.stealthrdp.com`. Link to them.
- Never load a tracker outside `src/components/site/TrackingConsent.tsx`.

### Protected files

A pull request that changes any of these needs the owner's review and the `architecture-approved`
label (CI step "Require approval for protected architecture changes", `scripts/check-governance.mjs`):

`next.config.ts`, `package.json`, `pnpm-lock.yaml`, `vitest.config.ts`, `lefthook.yml`,
`components.json`, `drizzle.config.ts`, `stack.contract.json`, `design.contract.json`,
`security.contract.json`, `SECURITY.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`,
`.github/workflows/CI.yml`, `skills/web-builder/SKILL.md`, `src/styles/global.css`,
`src/utils/DBConnection.ts`, `src/components/ui/VisualContract.visual.test.tsx`, the contract scripts
`scripts/check-*-contract.mjs` and `scripts/test-security-guards.mjs`, and everything under
`src/libs/seo/`, `src/features/security/`, `src/features/runtime/`, `src/models/`, `migrations/`,
`.storybook/`, `src/components/ui/__screenshots__/`, `scripts/seo-*`, `src/app/robots.*`,
`src/app/sitemap.*`.

`scripts/check-governance.mjs` holds the authoritative list. If you are not sure, run
`node scripts/check-governance.mjs origin/main HEAD`.

### Product boundary

- This site: product pages, plan comparison, Windows/Linux pages, Citadel, Help Center, Citadel docs,
  guides, FAQ, status, about, privacy, SEO and AI-search files.
- WHMCS (`dash.stealthrdp.com`): login, checkout, billing, client accounts, tickets.
- Citadel panel (`citadel.stealthrdp.com`): the Citadel product itself.

### How to work

- Prefer the smallest change that solves the task. Reuse existing components, classes and helpers
  before you create new ones.
- Keep page text server-rendered. Search engines and AI agents read the HTML.
- Production-only features (analytics, structured data, `llms.txt`) must stay production-only; the
  preview must never be indexed.
- Before you hand off, run the checks in [README.md](README.md#before-you-open-a-pull-request) and look
  at the changed pages on desktop and mobile.
- Commit messages: Conventional Commits, lowercase subject, for example
  `feat(docs): add a guide for vps backups`.
- Work on a branch and open a pull request to `main`. Production deploys from `main`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
