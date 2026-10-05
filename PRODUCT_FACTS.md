# Product facts

These are the only approved claims about StealthRDP. Use them as written. If a page needs a fact that is
not here, ask the owner first and add the fact here in the same pull request.

Never invent reviews, numbers, stock, deadlines, guarantees or live data.

## Approved facts

| Topic | Approved wording | Source of truth |
|---|---|---|
| Activation | Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes. | Owner, Sep 2026 |
| Refunds | 7-day refund, paid as account credit to the website wallet (not to the card). | `src/content/docs/1737944184-payment-terms.md`, `…-termination-of-service.md` |
| Uptime guarantee | There is **no SLA**. Show measured uptime only, from the status page. | Owner |
| Status data | Per monitored service: state, daily uptime for 90 days, 30- and 90-day uptime and incidents, from the UptimeRobot API (`UPTIMEROBOT_API_KEY`, production). Without the key: the public UptimeRobot page. When both fail: the snapshot in `src/content/uptime.json`. | `src/lib/stealth/uptime.ts` |
| Scale | 12,000+ VPS deployed. | Owner. Do **not** say "10,000 customers" or similar. |
| Support | 24/7 support through WhatsApp, client-area tickets and support@stealthrdp.com. | Owner, confirmed Oct 2026. Do **not** offer "priority support" or promise a response time. |
| Backups | Weekly backups. | Owner. An on-demand backup add-on is planned — do **not** mention it until it launches. |
| Storage | NVMe storage on every plan, USA and EU. | `src/content/plans.json` |
| Regions | USA and Europe. Data centers: Phoenix, Arizona (USA plans) and Amsterdam, Netherlands (EU plans). | `src/content/plans.json`; locations: owner, Oct 2026 |
| Access | Full Administrator access on Windows, full Root access on Linux. | FAQ |
| IP address | Every server has a dedicated IPv4 address. An IP change costs €5 per change, requested through support. | Owner, Oct 2026 |
| Windows licensing | Microsoft licensing is not included. Windows Server Evaluation may be provided for evaluation only. The customer is responsible for licensing. No licence add-on is offered. | `/docs/windows-licensing`; no add-on: owner, Oct 2026 |
| GDPR | Hosting in both data centers (Amsterdam and Phoenix) is GDPR-compliant. German: "DSGVO-konform". Spanish: "conforme al RGPD". | Owner, Oct 2026 |
| Windows versions | Windows Server 2019, 2022 and 2025. | `src/app/[locale]/(marketing)/windows-vps/page.tsx` |
| Linux distributions | The list on `/linux-vps` (`distros` in its page file). | WHMCS order form |
| VPS prices | EUR. The values in `src/content/plans.json` (verified from WHMCS; see `source.verifiedAt`). | WHMCS store |
| VPS stock | Read live from the WHMCS store pages every 6 hours. Never type stock numbers into copy. | `src/lib/stealth/live-plans.ts` |
| Citadel | A separate Layer 7 HTTP/HTTPS protection product. It does not need a StealthRDP VPS. Plans: Starter €0, Growth €49, Scale €149 per month. | `src/app/[locale]/(marketing)/citadel/page.tsx`, WHMCS |
| Reviews | Only real reviews with a source (Trustpilot or Discord), stored in `src/content/testimonials.json` and `reviews.json`. | Public review pages |

## Words to avoid

- "guaranteed", "99.99% uptime", "100% uptime", "SLA" (there is no SLA)
- "instant" without the 60-second wording above
- "cheap" and "cheapest", in copy, titles and meta descriptions (owner, Oct 2026). This applies to the
  English pages only: the German "günstig" and the Spanish "barato" and "económico" are allowed (owner,
  Oct 2026).
- "priority support", and any promised response time
- "SSD" alone (all storage is NVMe), "dedicated CPU", "no overselling", "guaranteed RAM"
- any customer count, rating or revenue number that is not in the table

## Not verified yet — ask the owner before you use it

- Nothing open right now.

## Archive data — do not use

`src/content/features.json` is the old v1 feature list. No page renders it; only a migration test
counts it. It contains claims that are no longer approved (99.99% uptime, SSD, 24/7 support). Do not
copy from it.

## When a fact changes

1. Change the source of truth (for example `plans.json` or the terms document).
2. Update this file in the same pull request.
3. Search the whole repository for the old wording, including `src/content/llms.md`,
   `src/content/faqs.json`, the guides and the help articles, and update every copy.
