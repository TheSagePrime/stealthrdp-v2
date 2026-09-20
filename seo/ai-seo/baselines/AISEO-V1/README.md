# StealthRDP AI SEO V1 durable baseline

This directory is the project-owned canonical storage for the AI SEO baseline.

## Canonical artifact

- Freeze ID: `AISEO-V1-CORE`
- Prompt set: `AISEO-V1-CORE`
- Canonical revision: `1.1`
- Canonical SHA-256: `a1c922f9cf09cdbedafcc59ce4d9b9055959e672254293a490a0159104d85b3e`
- Historical predecessor SHA-256: `eeac81b12190999e30cd9f1be9082654a76905a26872c6a0dc8ad45d3fb50881`
- Canonical Git blob object ID: `5ccd22359254c8a237037a54e44b418d66f0a97a`
- Historical Git blob object ID: `4068fc3a1d32b8226a9667443ddcb37173baf832`
- Prompt identity hash: `22b80e068712abed6c0d9c03063b36a9b251db54d9a04523196008452ced43a6`

The Core SHA-256 values are complete file-content hashes.
They are not Git object IDs.
Git blob object IDs are SHA-1 values calculated from Git blob headers and file bytes.

The `1.0` and `1.1` Core files preserve the same 40 prompt IDs, texts, and order.
Revision `1.1` contains metadata and sampling-contract corrections.
Revision `1.0` is historical and cannot become canonical again without owner approval.

## Layout

```text
AISEO-V1/
├── artifacts/1.0/AISEO-V1-CORE.json
├── artifacts/1.1/AISEO-V1-CORE.json
├── artifacts/1.1/companion-metadata.json
├── artifacts/1.1/observation-schema.json
├── discovery/AISEO-V1-DISCOVERY-1.1/discovery-pool.json
├── sampling-contracts/AISEO-V1-SAMPLING-1.0.json
├── sampling-contracts/AISEO-V1-SAMPLING-1.1.json
├── PROMPT-IDENTITY-SHA256.json
├── checksum-manifest.json
├── lineage-manifest.json
└── verify_baseline.py
```

## Prompt identity hash

The hash uses only ordered records.

```text
prompt_id + U+001F + exact prompt text + U+001E
```

The input uses UTF-8 encoding.
The hash excludes metadata, URLs, tiers, intents, and JSON formatting.

A prompt identity hash change requires a new baseline, such as `AISEO-V2`.
Metadata, schema, or sampling changes require the next artifact revision.
Discovery changes require a Discovery Pool revision only.

## Discovery Pool lineage

Current Discovery Pool revision: `AISEO-V1-DISCOVERY-1.1`.

It contains `62` prompts.
`DP-MC09` was removed from the predecessor count of `63`.
No merge or replacement occurred.
`DP-MC10` remains in the current pool.

## Write-once rule

Never overwrite an existing versioned snapshot.
A byte mismatch must stop the writer.
Create a new artifact revision for every approved metadata or schema change.

The checksum manifest and lineage manifest are committed with the snapshots.
Git history provides the project-owned change record.

## Measurement preflight

Run this validator before every measurement run:

```text
python3 /opt/data/stealthrdp-v2/seo/ai-seo/baselines/AISEO-V1/verify_baseline.py
```

The validator checks both Core revisions, the shared prompt identity hash, and Discovery Pool count.
