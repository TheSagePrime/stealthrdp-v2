# Sage Prime Starter Implementation Plan

Source: `../SaaS-Boilerplate` at upstream commit `e3952a7`.
Derived repository: `/opt/data/research/starterpack-review/sage-prime-starter`.

## Guardrails

- Preserve all upstream files and SaaS features.
- Do not modify the upstream checkout.
- Preserve the MIT license and Ixartz attribution.
- Do not use credentials, push, or deploy.
- Keep optional integrations disabled unless their runtime variables enable them.
- Use only the specified Polar runtime variable names.

## Acceptance matrix

| Area | Acceptance criteria | Evidence |
| --- | --- | --- |
| Repository | Derived copy is independent and upstream remains clean | Git status and file comparison |
| Package manager | `pnpm-lock.yaml` is real and active; `package-lock.json` is not active | Lockfile and scripts/docs/workflow audit |
| Quality | Strict TypeScript, Oxlint, Oxfmt, tests, and build run in the default check | `pnpm check` output |
| Compatibility | Existing ESLint remains available through optional scripts | `pnpm lint:eslint` metadata |
| AI | AI SDK and one OpenAI-compatible provider exist; example route is disabled by default; env validation is safe | Focused unit tests and route code |
| Polar | Optional checkout, portal, signed webhook boundary, and entitlement sync boundary exist | Focused tests without credentials |
| Runtime | Health and readiness endpoints return deterministic status without secrets | Focused tests and route code |
| Extras | i18n, Sentry, Storybook, PGlite, Checkly, Chromatic, Codecov, Crowdin, Better Stack, analyzer, Knip, Lefthook, Commitlint, semantic-release, and ESLint remain present and opt-in | File/package/workflow audit |
| Verification | Install, frozen install where possible, focused tests, default check, and production build run | Captured command outputs |
| Delivery | Local commit contains the verified result | Commit SHA and status |

## Implementation sequence

1. Convert package scripts and metadata to pnpm, preserving optional upstream scripts.
2. Add Oxlint and Oxfmt configuration and wire the default check.
3. Add safe optional AI configuration, provider boundary, disabled example route, and tests.
4. Add safe optional Polar configuration, checkout/portal/webhook/entitlement boundaries, and tests.
5. Add health and readiness routes and tests.
6. Convert GitHub Actions, helper workflows, docs, cache keys, and local hooks to pnpm.
7. Run install and all requested verification commands.
8. Fix only real failures, review the complete diff, and commit locally.
