import { z } from 'zod';

const localePattern = /^[A-Z]{2,3}(?:-[A-Z0-9]{2,8})*$/i;
const countryPattern = /^[A-Z]{2}$/;

export const marketIdentitySchema = z
  .object({
    project: z.string().trim().min(1),
    canonical_domain: z.string().trim().min(1),
    country: z.string().trim().regex(countryPattern),
    locale: z.string().trim().regex(localePattern),
    open_seo: z
      .object({
        project_id: z.string().trim().min(1),
        location_code: z.number().int().positive(),
        language_code: z.string().trim().min(1),
      })
      .strict(),
  })
  .strict();

export const openSeoEvidenceRefSchema = z
  .object({
    kind: z.enum(['snapshot', 'metric', 'serp', 'research_log', 'gsc', 'ga4']),
    reference: z.string().trim().min(1),
    note: z.string().trim().optional(),
    retrieved_at: z.string().trim().optional(),
  })
  .strict();

const demandClusterSchema = z
  .object({
    name: z.string().trim().min(1),
    queries: z.array(z.string().trim().min(1)),
    applies: z.boolean().default(true),
  })
  .strict();

const demandOpportunitySchema = z
  .object({
    target_query: z.string().trim().min(1),
    intent: z.string().trim().min(1),
    page_type: z.string().trim().min(1),
    commercial_value: z.union([z.string().trim().min(1), z.number()]),
    serp_evidence: z.array(openSeoEvidenceRefSchema).min(1),
    content_gap: z.string().trim().min(1),
    proposed_unique_value: z.string().trim().min(1),
    funnel_destination: z.string().trim().min(1),
    cannibalization: z.string().trim().min(1),
  })
  .strict();

export const searchDemandMapSchema = z
  .object({
    artifact_type: z.literal('search_demand_map'),
    version: z.literal(1),
    identity: marketIdentitySchema,
    research_period: z.string().trim().min(1),
    research_sources: z.array(openSeoEvidenceRefSchema),
    clusters: z.array(demandClusterSchema),
    opportunities: z.array(demandOpportunitySchema),
    decision: z.enum(['produce', 'refresh', 'consolidate', 'hold', 'reject']),
  })
  .strict();

export const pageResearchPackageSchema = z
  .object({
    artifact_type: z.literal('page_research_package'),
    version: z.literal(1),
    identity: marketIdentitySchema,
    target_query: z.string().trim().min(1),
    target_reader: z.string().trim().min(1),
    intent: z.string().trim().min(1),
    serp_evidence: z.array(openSeoEvidenceRefSchema).min(1),
    competing_pages: z.array(z.string().trim().min(1)),
    existing_results_do_well: z.array(z.string().trim().min(1)),
    existing_results_miss: z.array(z.string().trim().min(1)),
    unique_value: z.string().trim().min(1),
    required_facts_evidence: z.array(z.string().trim().min(1)),
    internal_link_opportunities: z.array(z.string().trim().min(1)),
    commercial_connection: z.string().trim().min(1),
    cannibalization: z.string().trim().min(1),
    existence_question: z.string().trim().min(1),
    existence_decision: z.enum(['produce', 'do-not-produce', 'merge', 'update-existing']),
  })
  .strict();

export type MarketIdentity = z.infer<typeof marketIdentitySchema>;
export type OpenSeoEvidenceRef = z.infer<typeof openSeoEvidenceRefSchema>;
export type SearchDemandMap = z.infer<typeof searchDemandMapSchema>;
export type PageResearchPackage = z.infer<typeof pageResearchPackageSchema>;

export function assertMarketScope(
  value: unknown,
  expected: Pick<MarketIdentity, 'project' | 'country' | 'locale'>,
): MarketIdentity {
  const identity = marketIdentitySchema.parse(value);
  if (
    identity.project !== expected.project
    || identity.country !== expected.country
    || identity.locale !== expected.locale
  ) {
    throw new Error(
      `Market scope mismatch: expected ${expected.project}/${expected.country}/${expected.locale}, `
      + `received ${identity.project}/${identity.country}/${identity.locale}`,
    );
  }
  return identity;
}

export function assertSearchDemandMap(
  value: unknown,
  expected: Pick<MarketIdentity, 'project' | 'country' | 'locale'>,
): SearchDemandMap {
  const map = searchDemandMapSchema.parse(value);
  assertMarketScope(map.identity, expected);
  return map;
}

export function assertPageResearchPackage(
  value: unknown,
  expected: Pick<MarketIdentity, 'project' | 'country' | 'locale'>,
): PageResearchPackage {
  const page = pageResearchPackageSchema.parse(value);
  assertMarketScope(page.identity, expected);
  return page;
}
