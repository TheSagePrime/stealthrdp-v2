---
order: 37
title: Search Citadel domain logs
category: "Citadel: Traffic"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/logs
summary: Troubleshoot 15 days of access, security and origin-error history.
relatedSlugs:
  - citadel-insights
  - citadel-security
  - citadel-analytics
---
## Log types and retention
- Access entries include method, path, status, visitor IP, ASN, country, User-Agent, latency, bytes and request ID.
- Security entries show challenges, blocks, rate limits and allowlisted bypasses.
- Error entries show origin unavailability, timeouts and gateway failures 502, 503 or 504.
Logs are retained for 15 days in S3-backed storage. Full request and response bodies are not stored in this view, and sensitive query values are redacted before storage.
## Find a request
Open a domain's Logs page. Each page shows up to 200 rows; use Previous and Next for more. Filter by type, method or status, search for visitor IP, URL path, host or request ID, and sort oldest or newest first. Expand Show details for structured decision and visitor context. Older rows with empty detail objects are backfilled from their visible fields.
## Geo and IP details
ASN prefers `CF-ASN` or `CF-IPASNUM` when present; otherwise Citadel resolves the visitor IP through Team Cymru DNS. Country prefers a known ASN operational home country (for example AS135407 Transworld → Pakistan), then `CF-IPCountry`. Team Cymru's country code is a last resort because it can describe the registry country rather than visitor location. New visitor IPs are indexed as traffic arrives, and opening older pages backfills those rows for later IP searches.