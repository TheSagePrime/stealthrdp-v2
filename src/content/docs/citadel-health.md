---
order: 29
title: Check Citadel origin health
sidebarTitle: Origin health checks
category: "Citadel: Domains"
date: Sep 27, 2026
sourceUrl: https://citadel.stealthrdp.com/docs/health
summary: "Run Citadel origin health probes to diagnose latency, failed checks and 502 errors, then fix origin host, port, TLS or firewall settings and re-test."
relatedSlugs:
  - citadel-origin
  - citadel-security
---
## Run a health check

Open the domain and select Health. Review the latest probe's latency, status and error text, or run a new probe after changing Origin settings.

## When a probe fails

Check the origin IP or hostname, port, TLS setting, and firewall rules that must allow Citadel egress. Save corrections on Origin, then re-check Health. Visitor-facing 502 errors may indicate an unreachable origin.

Origin-health monitoring does not silently change a fixed challenge level to Interaction. Security keeps the level you saved.
