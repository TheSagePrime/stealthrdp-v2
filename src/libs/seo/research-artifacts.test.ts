import { describe, expect, it } from 'vitest';
import {
  assertMarketScope,
  assertPageResearchPackage,
  assertSearchDemandMap,
  pageResearchPackageSchema,
  searchDemandMapSchema,
} from './research-artifacts';

const identity = {
  project: 'Northstar Ledger',
  canonical_domain: 'northstar-ledger.example',
  country: 'DE',
  locale: 'de-DE',
  open_seo: { project_id: 'simulation-northstar', location_code: 2276, language_code: 'de' },
};

const snapshot = {
  kind: 'snapshot' as const,
  reference: 'open-seo://snapshot/simulation-northstar/DE/de-DE/keyword-set-001',
  project_id: identity.open_seo.project_id,
  country: identity.country,
  locale: identity.locale,
  retrieved_at: '2026-09-20T00:00:00Z',
};

const demandMap = {
  artifact_type: 'search_demand_map' as const,
  version: 1 as const,
  identity,
  research_period: '2026-09-08',
  research_sources: [snapshot],
  clusters: [{ name: 'category/product', queries: ['digitale ausschreibungen'], applies: true }],
  opportunities: [
    {
      target_query: 'digitale ausschreibungen',
      intent: 'commercial investigation',
      page_type: 'category landing page',
      commercial_value: 'high',
      product_relevance: 'high',
      secondary_queries: ['ausschreibungen software'],
      serp_evidence: [snapshot],
      content_gap: 'Existing results do not explain the verified workflow boundary.',
      proposed_unique_value: 'Explain the workflow with verified product limits.',
      funnel_destination: '/signup',
      cannibalization: 'No existing page targets this query.',
      internal_link_targets: ['/plans'],
      priority: 1,
      existing_url: null,
    },
  ],
  decision: 'produce' as const,
};

const pagePackage = {
  artifact_type: 'page_research_package' as const,
  version: 1 as const,
  identity,
  status: 'approved' as const,
  asset_type: 'saas_landing' as const,
  target_query: 'digitale ausschreibungen',
  secondary_queries: ['ausschreibungen software'],
  target_reader: 'German procurement teams',
  intent: 'commercial investigation',
  serp_evidence: [snapshot],
  competing_pages: ['https://competitor.example/category'],
  existing_results_do_well: ['They explain the category.'],
  existing_results_miss: ['They omit the verified workflow limitation.'],
  related_questions: ['How does the workflow work?'],
  unique_value: 'Give the reader a source-linked explanation of the product boundary.',
  required_facts_evidence: ['truth://verified-fact-001'],
  internal_link_opportunities: ['/plans'],
  commercial_connection: 'The reader can inspect the verified plan after understanding fit.',
  conversion_path: '/signup',
  cannibalization: 'No existing page targets this intent.',
  existence_question: 'Why should this page exist when search already has competing results?',
  existence_decision: 'produce' as const,
};

describe('market-scoped SEO artifacts', () => {
  it('accepts canonical demand maps and page packages for the active project market', () => {
    expect(assertSearchDemandMap(demandMap, identity)).toMatchObject({ identity });
    expect(assertPageResearchPackage(pagePackage, identity)).toMatchObject({ identity });
  });

  it('requires complete market identity', () => {
    expect(searchDemandMapSchema.safeParse({ ...demandMap, identity: { ...identity, locale: '' } }).success).toBe(
      false,
    );
    expect(
      pageResearchPackageSchema.safeParse({
        ...pagePackage,
        identity: { ...identity, open_seo: { ...identity.open_seo, project_id: '' } },
      }).success,
    ).toBe(false);
  });

  it('blocks every cross-project identity mismatch', () => {
    const mismatches = [
      { ...identity, project: 'Other project' },
      { ...identity, canonical_domain: 'other.example' },
      { ...identity, country: 'US' },
      { ...identity, locale: 'en-US' },
      { ...identity, open_seo: { ...identity.open_seo, project_id: 'other-project' } },
      { ...identity, open_seo: { ...identity.open_seo, location_code: 2840 } },
      { ...identity, open_seo: { ...identity.open_seo, language_code: 'en' } },
    ];

    for (const expected of mismatches) {
      expect(() => assertMarketScope(identity, expected)).toThrow(/scope mismatch/);
    }
  });

  it('blocks evidence from another project or market', () => {
    const wrongEvidence = {
      ...snapshot,
      project_id: 'other-project',
    };

    expect(() =>
      assertSearchDemandMap(
        {
          ...demandMap,
          research_sources: [wrongEvidence],
        },
        identity,
      ),
    ).toThrow(/Evidence scope mismatch/);

    expect(() =>
      assertPageResearchPackage(
        {
          ...pagePackage,
          serp_evidence: [{ ...snapshot, locale: 'en-US' }],
        },
        identity,
      ),
    ).toThrow(/Evidence scope mismatch/);
  });

  it('requires provenance on decision-critical evidence', () => {
    const { project_id: _projectId, ...withoutProject } = snapshot;
    expect(
      searchDemandMapSchema.safeParse({
        ...demandMap,
        research_sources: [withoutProject],
      }).success,
    ).toBe(false);
  });

  it('enforces canonical free-tool requirements', () => {
    const freeToolOpportunity = {
      ...demandMap.opportunities[0],
      page_type: 'calculator',
    };
    expect(
      searchDemandMapSchema.safeParse({
        ...demandMap,
        opportunities: [freeToolOpportunity],
      }).success,
    ).toBe(false);

    expect(
      searchDemandMapSchema.safeParse({
        ...demandMap,
        opportunities: [
          {
            ...freeToolOpportunity,
            user_problem: 'Estimate procurement workflow cost.',
            tool_kind: 'calculator',
            usefulness_proof: 'Returns an actionable estimate from explicit inputs.',
            paid_product_bridge: 'Shows when the paid workflow becomes useful.',
          },
        ],
      }).success,
    ).toBe(true);

    expect(
      pageResearchPackageSchema.safeParse({
        ...pagePackage,
        asset_type: 'calculator',
      }).success,
    ).toBe(false);

    expect(
      pageResearchPackageSchema.safeParse({
        ...pagePackage,
        asset_type: 'calculator',
        tool_kind: 'calculator',
        user_problem: 'Estimate procurement workflow cost.',
        required_inputs: ['monthly records'],
        expected_output: 'Estimated workflow cost',
        calculation_or_validation_rule: 'Multiply verified unit cost by monthly records.',
        usefulness_proof: 'The reader receives an immediate estimate.',
        limitations: ['The estimate excludes custom services.'],
        paid_product_bridge: 'The paid product automates the workflow.',
      }).success,
    ).toBe(true);
  });
});
