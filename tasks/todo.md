# Task Checklist

- [x] Inspect upstream checkout and verify clean status.
- [x] Copy upstream into the derived repository without changing upstream.
- [x] Write `tasks/plan.md` before implementation.
- [x] Write this task checklist before implementation.
- [x] Convert active npm workflow to pnpm and generate `pnpm-lock.yaml`.
- [x] Configure strict TypeScript, Oxlint, Oxfmt, and the default check.
- [x] Preserve optional ESLint and all listed optional extras.
- [x] Exclude the product AI layer; Sage and fleet agents handle AI orchestration externally.
- [x] Add disabled-by-default Polar checkout, portal, webhook, and entitlement boundaries.
- [x] Add health and readiness endpoints.
- [x] Add focused credential-free tests.
- [x] Convert workflows, docs, and cache keys to pnpm.
- [x] Run install, frozen install where possible, focused tests, default check, and build; the exact frozen offline run exposed a pre-existing semver trust-policy blocker.
- [x] Review diff, commit the verified result locally, and push it to `main`.
- [x] Replace the inherited marketing surface with the first-party Sage Prime frontend.
- [x] Remove inherited demo, partner, and screenshot assets.
- [x] Remove tracked environment files and add `.env.example`.
- [x] Add Sage Prime ownership and third-party notices.
