import { describe, expect, it, vi } from 'vitest';
import {
  buildSearchDemandMapFromMetrics,
  getOpenSeoKeywordMetrics,
} from './open-seo-live-research';

const identity = {
  project: 'Example SaaS',
  canonical_domain: 'https://example.com',
  country: 'US',
  locale: 'en-US',
  open_seo: {
    project_id: 'project-example',
    location_code: 2840,
    language_code: 'en',
  },
} as const;

describe('getOpenSeoKeywordMetrics', () => {
  it('calls the OpenSEO MCP tool contract and parses structured metrics', async () => {
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const request = JSON.parse(String(init?.body));
      expect(request.method).toBe('tools/call');
      expect(request.params).toEqual({
        name: 'get_keyword_metrics',
        arguments: {
          projectId: identity.open_seo.project_id,
          keywords: ['example keyword'],
          locationCode: 2840,
          languageCode: 'en',
          includeMonthlyTrends: true,
          includeClickstreamData: false,
          sortBy: 'search_volume',
        },
      });

      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          result: {
            content: [{ type: 'text', text: 'ok' }],
            structuredContent: {
              keywords: [
                {
                  keyword: 'example keyword',
                  search_volume: 1000,
                  keyword_difficulty: 42,
                  main_intent: 'commercial',
                  cpc: 4.25,
                  competition: 0.7,
                  competition_level: 'HIGH',
                  monthly_searches: null,
                },
              ],
            },
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    });

    const rows = await getOpenSeoKeywordMetrics(
      { mcpUrl: 'https://seo.example.com/mcp', fetchImpl: fetchImpl as typeof fetch },
      { open_seo: identity.open_seo, keywords: ['example keyword'] },
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      keyword: 'example keyword',
      search_volume: 1000,
      keyword_difficulty: 42,
      main_intent: 'commercial',
      cpc: 4.25,
    });
  });

  it('fails closed on an OpenSEO JSON-RPC error', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          error: { code: -32603, message: 'provider failed' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    await expect(
      getOpenSeoKeywordMetrics(
        { mcpUrl: 'https://seo.example.com/mcp', fetchImpl: fetchImpl as typeof fetch },
        { open_seo: identity.open_seo, keywords: ['example keyword'] },
      ),
    ).rejects.toThrow('provider failed');
  });

  it('rejects invalid keyword input before a provider call', async () => {
    const fetchImpl = vi.fn();

    await expect(
      getOpenSeoKeywordMetrics(
        { mcpUrl: 'https://seo.example.com/mcp', fetchImpl: fetchImpl as typeof fetch },
        { open_seo: identity.open_seo, keywords: [] },
      ),
    ).rejects.toThrow();

    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe('buildSearchDemandMapFromMetrics', () => {
  it('creates a validated demand map with provider lineage', () => {
    const map = buildSearchDemandMapFromMetrics({
      identity,
      retrievedAt: '2026-09-14T00:00:00.000Z',
      metrics: [
        {
          keyword: 'example keyword',
          search_volume: 1000,
          keyword_difficulty: 42,
          main_intent: 'commercial',
          cpc: 4.25,
          competition: 0.7,
          competition_level: 'HIGH',
          monthly_searches: null,
        },
      ],
    });

    expect(map.decision).toBe('produce');
    expect(map.identity).toEqual(identity);
    expect(map.opportunities[0]?.serp_evidence[0]?.reference).toContain(
      'get_keyword_metrics/example%20keyword',
    );
    expect(map.research_sources[0]?.note).toContain('volume=1000');
  });
});
