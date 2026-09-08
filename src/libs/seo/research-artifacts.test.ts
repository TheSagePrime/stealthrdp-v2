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
      serp_evidence: [snapshot],
      content_gap: 'Existing results do not explain the verified workflow boundary.',
      proposed_unique_value: 'Explain the workflow with verified product limits.',
      funnel_destination: '/signup',
      cannibalization: 'No existing page targets this query.',
    },
  ],
  decision: 'produce' as const,
};

const pagePackage = {
  artifact_type: 'page_research_package' as const,
  version: 1 as const,
  identity,
  target_query: 'digitale ausschreibungen',
  target_reader: 'German procurement teams',
  intent: 'commercial investigation',
  serp_evidence: [snapshot],
  competing_pages: ['https://competitor.example/category'],
  existing_results_do_well: ['They explain the category.'],
  existing_results_miss: ['They omit the verified workflow limitation.'],
  unique_value: 'Give the reader a source-linked explanation of the product boundary.',
  required_facts_evidence: ['truth://verified-fact-001'],
  internal_link_opportunities: ['/plans'],
  commercial_connection: 'The reader can inspect the verified plan after understanding fit.',
  cannibalization: 'No existing page targets this intent.',
  existence_question: 'Why should this page exist when search already has competing results?',
  existence_decision: 'produce' as const,
};

describe('market-scoped SEO artifacts', () => {
  it('accepts demand maps and page packages with the same project market', () => {
    expect(assertSearchDemandMap(demandMap, identity)).toMatchObject({ identity });
    expect(assertPageResearchPackage(pagePackage, identity)).toMatchObject({ identity });
  });

  it('rejects a missing market identity', () => {
    expect(searchDemandMapSchema.safeParse({ ...demandMap, identity: { ...identity, locale: '' } }).success).toBe(
      false,
    );
    expect(
      pageResearchPackageSchema.safeParse({ ...pagePackage, identity: { ...identity, country: 'US' } }).success,
    ).toBe(true);
  });

  it('blocks cross-project and cross-locale reuse', () => {
    expect(() => assertMarketScope(identity, { project: 'Other project', country: 'DE', locale: 'de-DE' })).toThrow(
      /scope mismatch/,
    );
    expect(() => assertMarketScope(identity, { project: identity.project, country: 'DE', locale: 'en-US' })).toThrow(
      /scope mismatch/,
    );
  });
});
