# StealthRDP v2 Architecture

## Purpose

StealthRDP v2 is the public product and traffic surface for StealthRDP. It is built on the Sage Prime public-web foundation and is intentionally separate from the billing/client backend.

## System boundaries

### This repository owns

- public marketing pages
- VPS plan comparison
- Windows and Linux landing pages
- public documentation and blog
- FAQ, about, privacy, and public status presentation
- SEO, structured data, sitemap, robots, RSS, and content discovery
- future public tools and traffic features

### WHMCS owns

`https://dash.stealthrdp.com`

- login
- checkout
- billing
- customer accounts
- support tickets
- service lifecycle/account actions

The public website links into WHMCS. It does not duplicate WHMCS authentication, billing, or dashboard logic.

## Data

Current public plans, FAQ, reviews, blog, docs, and status snapshots were migrated from the existing StealthRDP public repository into `src/content/`.

Neon/Drizzle/PGlite remain available for future public-site persistence. They are not a customer-account or tenant database.

## SEO migration

Existing public route intent is preserved wherever practical. Preview deployments must remain non-indexable. Production canonical origin is `https://www.stealthrdp.com`.

## Deployment

Coolify is the intended deployment path. V2 should be validated on `preview.antah.de` before any production switch.
