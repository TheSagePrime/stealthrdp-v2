---
name: measurement-discipline
description: >
  Audit (or help set up) whether a site can actually tell what caused a ranking/traffic change,
  or whether it's just making changes and hoping. Use when auditing a site's SEO/content-change
  process, when a user asks "why did my traffic move" and can't isolate the cause, or when
  reviewing whether past optimization changes were ever actually measured.
---

> **StealthRDP rules come first.** This skill is from the SEOO skill pack v1.0.0 (MIT, see
> `.claude/skills/SEOO-LICENSE.md`). In this repository `AGENTS.md`, `PRODUCT_FACTS.md`, the contracts
> and `scripts/check-governance.mjs` override it.
>
> - Where this skill says "ask, but never block" or "proceed on a best guess", follow `AGENTS.md`
>   instead: when a rule or a missing owner answer blocks you, stop and ask the owner.
> - Facts about StealthRDP come only from `PRODUCT_FACTS.md` and `src/content/plans.json`, never from
>   "general knowledge of the niche".
> - Skills named below that are not installed here: `verify-primary-source` → `PRODUCT_FACTS.md`;
>   `page-quality-audit`, `technical-seo-audit`, `protected-field-audit` → the SEO checks in `pnpm build`
>   (`seo:pre-build`, `seo:post-build`) and `ARCHITECTURE.md`; `seo-growth-stage-strategy` → the site
>   is early-stage (few non-brand clicks), so favour coverage over polishing; `internal-linking-audit`,
>   `backlink-profile-audit`, `ctr-snippet-optimization`, `traffic-drop-diagnosis`, `legal-regulatory-compliance`,
>   `content-freshness-audit` → ask the owner before acting.
> - Keep the change and decision logs in `.sageprime/seo/changelog.md` and `.sageprime/seo/decisions.md`.
> - Search Console, GA4 and keyword data come from the OpenSEO tools (project `StealthRDP`).

# Measurement Discipline Audit

Checks whether a site's change process lets it isolate cause and effect, or invites the
"we changed several things, something moved, no idea which change did it" failure.

---

## Step 0 — Ask before assuming

1. How many distinct optimization/structural changes (not new-content additions — see Step 4)
   get made per week or month currently?
2. Is there any record of when a change was made and what the metrics looked like right before
   it? Without a real baseline, nothing after is measurable.
3. Has anything been "fixed twice" — the same page changed again before the first change's
   effect was known? The most common symptom of missing discipline.
4. What's the actual crawl/re-index/re-rank timeline for the relevant search context? (For
   Google web search: typically days to crawl, 2–4 weeks for rankings to adjust, 4–6 weeks to
   fully stabilize — use this to size the measurement window, not an arbitrary shorter one.)

**If no historical change/baseline data is given:** don't block on it — this is the one place
where the honest answer is that a *retroactive* assessment genuinely can't be produced without
some record of what changed and when. Say that plainly, then pivot to what can still be
delivered without any additional data: recommend starting the discipline (Steps 1, 2, and 5)
from this point forward, and give the setup guidance (what a change ledger should capture, what
window length to use per Step 3) so the site has the mechanism in place before the next change,
rather than waiting for a fuller history to exist.

---

## Step 1 — Check for a real baseline-before-change habit

For any past change, check whether a baseline was recorded at the time — date, description,
target pages, pre-change metrics — not reconstructed afterward from memory. If this doesn't
exist, the recommendation is to build it: a simple ledger logging every change with its
baseline, as the single source of truth for what's pending measurement.

---

## Step 2 — Check for change-isolation discipline

Rule: don't make a second change to a page (or a page competing for the same query) while a
previous change's measurement window is still open. Check whether changes get layered on top of
each other reactively instead. Related check: if changes are made in large batches, has
anything ever gone wrong in a way that couldn't be traced to a specific item in the batch? If
so, the batch size is too large relative to the ability to isolate cause.

---

## Step 3 — Check the measurement window is long enough to mean anything

A measurement taken too early mostly reflects noise. Check whether early checks get treated as
conclusive rather than as the necessarily-early data they are. Also check for a control-period
habit — comparing against an equivalent-length prior period, not just eyeballing the number.

---

## Step 4 — Check the cap applies to the right category of change

The isolation discipline above should apply to changes to *existing* pages/structure — not to
adding genuinely new content, which doesn't compete for the same attribution problem. Check
whether the site's process correctly distinguishes these.

---

## Step 5 — Check for a staleness backstop on the tracking mechanism itself

Check whether updating the ledger is a required step inside the process that makes changes and
measures them, or a separate habit someone has to remember — the latter reliably lapses.

---

## Output shape

Whether a real baseline-before-change record exists; evidence of the layered-changes/
can't-isolate-cause failure mode; whether measurement windows and control periods are used
correctly; whether the change-cap applies to the right category; whether the tracking
mechanism has a structural staleness safeguard.
