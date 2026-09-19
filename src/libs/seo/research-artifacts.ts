import { z } from 'zod';

export const WORKFLOWS_SEO_CONTRACT_REPOSITORY = 'TheSagePrime/workflows';
export const WORKFLOWS_SEO_CONTRACT_COMMIT = '9ffaeb371864c8375fa91dd61d03d5ff5a6fbfad';

const localePattern = /^[A-Z]{2,3}(?:-[A-Z0-9]{2,8})*$/i;
const countryPattern = /^[A-Z]{2}$/;
const freeToolKinds = [
  'free_tool',
  'calculator',
  'generator',
  'checker',
  'validator',
  'converter',
  'estimator',
] as const;

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
    note: z.string().optional(),
    project_id: z.string().trim().min(1),
    country: z.string().trim().regex(countryPattern),
    locale: z.string().trim().regex(localePattern),
    retrieved_at: z.string().trim().min(1),
  })
  .strict();

const demandClusterSchema = z
  .object({
    name: z.string().trim().min(1),
    queries: z.array(z.string().trim().min(1)),
    applies: z.boolean().default(true),
  })
  .strict();

export const demandOpportunityBaseSchema = z
  .object({
    target_query: z.string().trim().min(1),
    secondary_queries: z.array(z.string().trim().min(1)).optional(),
    intent: z.string().trim().min(1),
    page_type: z.string().trim().min(1),
    commercial_value: z.union([z.string(), z.number()]),
    product_relevance: z.union([z.string(), z.number()]).optional(),
    free_tool_potential: z.union([z.string(), z.boolean()]).optional(),
    serp_evidence: z.array(openSeoEvidenceRefSchema).min(1),
    content_gap: z.string().trim().min(1),
    proposed_unique_value: z.string().trim().min(1),
    funnel_destination: z.string().trim().min(1),
    cannibalization: z.string().trim().min(1),
    internal_link_targets: z.array(z.string().trim().min(1)).optional(),
    priority: z.union([z.string(), z.number()]).optional(),
    existing_url: z.union([z.string(), z.null()]).optional(),
    user_problem: z.string().trim().min(1).optional(),
    tool_kind: z.string().trim().min(1).optional(),
    usefulness_proof: z.string().trim().min(1).optional(),
    paid_product_bridge: z.string().trim().min(1).optional(),
  })
  .strict();

const demandOpportunitySchema = demandOpportunityBaseSchema.superRefine((value, ctx) => {
  if (!freeToolKinds.includes(value.page_type as (typeof freeToolKinds)[number])) {
    return;
  }

  for (const field of ['user_problem', 'tool_kind', 'usefulness_proof', 'paid_product_bridge'] as const) {
    if (value[field] === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: `${field} is required for free-tool opportunities`,
        path: [field],
      });
    }
  }
});

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

export const pageResearchPackageBaseSchema = z
  .object({
    artifact_type: z.literal('page_research_package'),
    version: z.literal(1),
    identity: marketIdentitySchema,
    status: z.enum(['draft', 'approved', 'blocked', 'rejected']).optional(),
    asset_type: z
      .enum([
        'saas_landing',
        'feature_page',
        'use_case_page',
        'comparison_page',
        'alternative_page',
        'free_tool',
        'calculator',
        'generator',
        'checker',
        'validator',
        'converter',
        'estimator',
        'article',
        'guide',
        'glossary',
        'supporting_page',
      ])
      .optional(),
    target_query: z.string().trim().min(1),
    secondary_queries: z.array(z.string().trim().min(1)).optional(),
    target_reader: z.string().trim().min(1),
    intent: z.string().trim().min(1),
    serp_evidence: z.array(openSeoEvidenceRefSchema).min(1),
    competing_pages: z.array(z.string().trim().min(1)),
    existing_results_do_well: z.array(z.string().trim().min(1)),
    existing_results_miss: z.array(z.string().trim().min(1)),
    related_questions: z.array(z.string().trim().min(1)).optional(),
    unique_value: z.string().trim().min(1),
    required_facts_evidence: z.array(z.string().trim().min(1)),
    internal_link_opportunities: z.array(z.string().trim().min(1)),
    commercial_connection: z.string().trim().min(1),
    conversion_path: z.string().trim().min(1).optional(),
    cannibalization: z.string().trim().min(1),
    existence_question: z.string().trim().min(1),
    existence_decision: z.enum(['produce', 'do-not-produce', 'merge', 'update-existing']),
    tool_kind: z.string().trim().min(1).optional(),
    user_problem: z.string().trim().min(1).optional(),
    required_inputs: z.array(z.string().trim().min(1)).min(1).optional(),
    expected_output: z.string().trim().min(1).optional(),
    calculation_or_validation_rule: z.string().trim().min(1).optional(),
    usefulness_proof: z.string().trim().min(1).optional(),
    limitations: z.array(z.string().trim().min(1)).optional(),
    paid_product_bridge: z.string().trim().min(1).optional(),
  })
  .strict();

export const pageResearchPackageSchema = pageResearchPackageBaseSchema.superRefine((value, ctx) => {
  if (value.asset_type === undefined || !freeToolKinds.includes(value.asset_type as (typeof freeToolKinds)[number])) {
    return;
  }

  for (const field of [
    'tool_kind',
    'user_problem',
    'required_inputs',
    'expected_output',
    'calculation_or_validation_rule',
    'usefulness_proof',
    'limitations',
    'paid_product_bridge',
  ] as const) {
    if (value[field] === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: `${field} is required for free-tool page packages`,
        path: [field],
      });
    }
  }
});

export type MarketIdentity = z.infer<typeof marketIdentitySchema>;
export type OpenSeoEvidenceRef = z.infer<typeof openSeoEvidenceRefSchema>;
export type SearchDemandMap = z.infer<typeof searchDemandMapSchema>;
export type PageResearchPackage = z.infer<typeof pageResearchPackageSchema>;

function assertEvidenceScope(ref: OpenSeoEvidenceRef, identity: MarketIdentity): void {
  if (
    ref.project_id !== identity.open_seo.project_id
    || ref.country !== identity.country
    || ref.locale !== identity.locale
  ) {
    throw new Error(
      `Evidence scope mismatch: expected ${identity.open_seo.project_id}/${identity.country}/${identity.locale}, `
      + `received ${ref.project_id}/${ref.country}/${ref.locale}`,
    );
  }
}

export function assertMarketScope(value: unknown, expected: MarketIdentity): MarketIdentity {
  const identity = marketIdentitySchema.parse(value);
  if (
    identity.project !== expected.project
    || identity.canonical_domain !== expected.canonical_domain
    || identity.country !== expected.country
    || identity.locale !== expected.locale
    || identity.open_seo.project_id !== expected.open_seo.project_id
    || identity.open_seo.location_code !== expected.open_seo.location_code
    || identity.open_seo.language_code !== expected.open_seo.language_code
  ) {
    throw new Error('Market scope mismatch: artifact identity does not match the active project identity');
  }
  return identity;
}

export function assertSearchDemandMap(value: unknown, expected: MarketIdentity): SearchDemandMap {
  const map = searchDemandMapSchema.parse(value);
  const identity = assertMarketScope(map.identity, expected);
  for (const ref of map.research_sources) {
    assertEvidenceScope(ref, identity);
  }
  for (const opportunity of map.opportunities) {
    for (const ref of opportunity.serp_evidence) {
      assertEvidenceScope(ref, identity);
    }
  }
  return map;
}

export function assertPageResearchPackage(value: unknown, expected: MarketIdentity): PageResearchPackage {
  const page = pageResearchPackageSchema.parse(value);
  const identity = assertMarketScope(page.identity, expected);
  for (const ref of page.serp_evidence) {
    assertEvidenceScope(ref, identity);
  }
  return page;
}
