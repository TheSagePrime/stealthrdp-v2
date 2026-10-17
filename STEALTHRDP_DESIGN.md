# StealthRDP Product Design Contract

DESIGN.md is the single canonical visual source of truth.

This file contains only product boundaries that must survive visual redesigns.

## Product boundary

StealthRDP sells Windows and Linux VPS/RDP services.
WHMCS owns login, checkout, billing, tickets and client accounts.
VirtFusion owns server-control workflows.
The public website should make those transitions clear instead of recreating those systems.

## Truth

Use verified product data for pricing, availability, specifications, regions, licensing, refunds, uptime and provisioning claims. The approved wording is in `PRODUCT_FACTS.md`.

Do not fabricate reviews, scarcity, live telemetry, deadlines or guarantees.

## Required product surfaces

| Page | Job |
|---|---|
| `/` Home | Persuade and route to plans/checkout. |
| `/plans` | Compare all VPS plans by region and billing cycle. |
| `/windows-vps`, `/linux-vps` | Explain OS-specific value and options. |
| `/citadel` | Sell Citadel, the separate Layer 7 protection product. |
| `/rdp-vps`, `/vps-hosting-minecraft` | Buyer guides that target search intent. |
| `/resources` | Search and browse guides, Help Center and FAQ in one place. |
| `/docs`, `/citadel/docs` | Help users complete tasks. |
| `/blog` | Publish useful technical guides. |
| `/status` | Show current service state and 90-day uptime. |
| `/faq`, `/about`, `/privacy` | Answer trust and policy questions. |

## References

The visual direction is informed by CloudBlast, DeluxHost, Aspire Hosting and Servers.Guru.
Use them as composition and quality references. Do not copy their assets, wording or layouts.

## Review

Before a visual handoff:
- verify desktop and mobile.
- verify plan comparison.
- verify the WHMCS handoff.
- verify real data claims.
- run design, accessibility, SEO, security and build checks.
