import { z } from 'zod';
import {
  marketIdentitySchema,
  searchDemandMapSchema,
  type MarketIdentity,
  type OpenSeoEvidenceRef,
  type SearchDemandMap,
} from './research-artifacts';

const keywordMetricSchema = z
  .object({
    keyword: z.string().trim().min(1),
    search_volume: z.number().nullable().optional(),
    keyword_difficulty: z.number().nullable().optional(),
    main_intent: z.string().nullable().optional(),
    cpc: z.number().nullable().optional(),
    competition: z.number().nullable().optional(),
    competition_level: z.string().nullable().optional(),
    monthly_searches: z
      .array(
        z
          .object({
            year: z.number().int(),
            month: z.number().int().min(1).max(12),
            search_volume: z.number().nullable(),
          })
          .passthrough(),
      )
      .nullable()
      .optional(),
  })
  .passthrough();

const keywordListSchema = z
  .array(z.string().trim().min(1).max(80))
  .min(1)
  .max(700)
  .transform((keywords) => [...new Set(keywords)]);

const structuredKeywordMetricsSchema = z
  .object({
    keywords: z.array(keywordMetricSchema),
  })
  .passthrough();

const toolCallResultSchema = z
  .object({
    isError: z.boolean().optional(),
    content: z.array(z.unknown()).optional(),
    structuredContent: structuredKeywordMetricsSchema.optional(),
  })
  .passthrough();

const jsonRpcResponseSchema = z
  .object({
    result: toolCallResultSchema.optional(),
    error: z
      .object({
        code: z.number().optional(),
        message: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type OpenSeoKeywordMetric = z.infer<typeof keywordMetricSchema>;

export type OpenSeoClientOptions = {
  mcpUrl: string;
  apiKey?: string;
  fetchImpl?: typeof fetch;
};

export type LiveResearchInput = {
  identity: MarketIdentity;
  keywords: string[];
  retrievedAt?: string;
};

export async function getOpenSeoKeywordMetrics(
  options: OpenSeoClientOptions,
  input: Pick<MarketIdentity, 'open_seo'> & { keywords: string[] },
): Promise<OpenSeoKeywordMetric[]> {
  const mcpUrl = new URL(options.mcpUrl).toString();
  const keywords = keywordListSchema.parse(input.keywords);
  const headers: Record<string, string> = {
    Accept: 'application/json, text/event-stream',
    'Content-Type': 'application/json',
  };
  if (options.apiKey) headers['x-api-key'] = options.apiKey;

  const response = await (options.fetchImpl ?? fetch)(mcpUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'get_keyword_metrics',
        arguments: {
          projectId: input.open_seo.project_id,
          keywords,
          locationCode: input.open_seo.location_code,
          languageCode: input.open_seo.language_code,
          includeMonthlyTrends: true,
          includeClickstreamData: false,
          sortBy: 'search_volume',
        },
      },
    }),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`OpenSEO MCP request failed (${response.status}): ${bodyText.slice(0, 500)}`);
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    throw new Error('OpenSEO MCP returned a non-JSON response');
  }

  const parsed = jsonRpcResponseSchema.parse(body);
  if (parsed.error) {
    throw new Error(
      `OpenSEO MCP error${parsed.error.code == null ? '' : ` ${parsed.error.code}`}: ${parsed.error.message ?? 'unknown error'}`,
    );
  }
  if (!parsed.result || parsed.result.isError) {
    throw new Error('OpenSEO get_keyword_metrics returned an error result');
  }
  if (!parsed.result.structuredContent) {
    throw new Error('OpenSEO get_keyword_metrics returned no structured content');
  }

  return parsed.result.structuredContent.keywords;
}

function evidenceForMetric(
  identity: MarketIdentity,
  metric: OpenSeoKeywordMetric,
  retrievedAt: string,
): OpenSeoEvidenceRef {
  return {
    kind: 'metric',
    reference:
      `open-seo://project/${identity.open_seo.project_id}/get_keyword_metrics/`
      + `${encodeURIComponent(metric.keyword)}?location=${identity.open_seo.location_code}`
      + `&language=${encodeURIComponent(identity.open_seo.language_code)}`,
    note:
      `DataForSEO-backed keyword metrics: volume=${metric.search_volume ?? 'n/a'}, `
      + `KD=${metric.keyword_difficulty ?? 'n/a'}, intent=${metric.main_intent ?? 'n/a'}, `
      + `CPC=${metric.cpc ?? 'n/a'}`,
    retrieved_at: retrievedAt,
  };
}

export function buildSearchDemandMapFromMetrics(
  input: Pick<LiveResearchInput, 'identity'> & {
    metrics: OpenSeoKeywordMetric[];
    retrievedAt?: string;
  },
): SearchDemandMap {
  if (input.metrics.length === 0) {
    throw new Error('OpenSEO returned no keyword metrics');
  }

  const identity = marketIdentitySchema.parse(input.identity);
  const retrievedAt = input.retrievedAt ?? new Date().toISOString();
  const evidence = input.metrics.map((metric) =>
    evidenceForMetric(identity, metric, retrievedAt),
  );

  return searchDemandMapSchema.parse({
    artifact_type: 'search_demand_map',
    version: 1,
    identity,
    research_period: retrievedAt.slice(0, 10),
    research_sources: evidence,
    clusters: [
      {
        name: 'provider-verified demand',
        queries: input.metrics.map((metric) => metric.keyword),
        applies: true,
      },
    ],
    opportunities: input.metrics.map((metric) => ({
      target_query: metric.keyword,
      intent: metric.main_intent ?? 'unknown',
      page_type:
        metric.main_intent === 'commercial' || metric.main_intent === 'transactional'
          ? 'commercial-landing-page'
          : 'content-page',
      commercial_value: metric.cpc ?? 0,
      serp_evidence: [evidenceForMetric(identity, metric, retrievedAt)],
      content_gap: 'Provider-backed demand is verified; run SERP research before drafting.',
      proposed_unique_value:
        'Use verified demand, difficulty, intent, and CPC to prioritize the page before implementation.',
      funnel_destination: identity.canonical_domain,
      cannibalization: 'Not assessed by this metrics-only validation; check existing routes before production.',
    })),
    decision: input.metrics.some((metric) => (metric.search_volume ?? 0) > 0) ? 'produce' : 'hold',
  });
}

export async function runLiveOpenSeoResearch(
  options: OpenSeoClientOptions,
  input: LiveResearchInput,
): Promise<SearchDemandMap> {
  const identity = marketIdentitySchema.parse(input.identity);
  const keywords = keywordListSchema.parse(input.keywords);
  const metrics = await getOpenSeoKeywordMetrics(options, {
    open_seo: identity.open_seo,
    keywords,
  });
  return buildSearchDemandMapFromMetrics({
    identity,
    metrics,
    retrievedAt: input.retrievedAt,
  });
}
