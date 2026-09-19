import { z } from 'zod';

const bcp47LocalePattern = /^[A-Z]{2,3}(?:-[A-Z0-9]{2,8})*$/i;
const hostnamePattern = /^(?=.{1,253}$)(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;

export const projectMarketSchema = z
  .object({
    country: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}$/, 'Use an uppercase ISO 3166-1 alpha-2 country code'),
    locale: z.string().trim().regex(bcp47LocalePattern, 'Use a BCP 47 locale such as en-US or de-DE'),
  })
  .strict();

const verifiedFactSchema = z
  .object({
    fact: z.string().trim().min(1),
    source: z.string().trim().min(1),
    scope: z.string().trim().optional(),
    as_of: z.string().trim().optional(),
  })
  .strict();

const brandEntitySchema = z
  .object({
    entity_name: z.string().trim().min(1),
    entity_type: z.enum(['Organization', 'Person', 'Product']),
    logo_url: z.string().url().optional(),
    same_as: z.array(z.string().url()).default([]),
  })
  .strict();

const competitorSchema = z
  .object({
    name: z.string().trim().min(1),
    domain: z.string().trim().optional(),
    source: z.string().trim().optional(),
  })
  .strict();

const claimsSchema = z
  .object({
    allowed: z.array(z.string().trim().min(1)),
    prohibited_or_unverified: z.array(z.string().trim().min(1)),
  })
  .strict();

export const projectTruthProfileSchema = z
  .object({
    artifact_type: z.literal('project_truth_profile'),
    version: z.literal(1),
    status: z.enum(['draft', 'verified', 'superseded']),
    project: z
      .object({
        project_id: z.string().trim().regex(/^[a-z0-9][a-z0-9._-]*$/).optional(),
        brand_id: z.string().trim().regex(/^[a-z0-9][a-z0-9._-]*$/).optional(),
        name: z.string().trim().min(1),
        canonical_domain: z.string().trim().regex(hostnamePattern, 'Use a public canonical hostname'),
        owner: z.string().trim().optional(),
        verified_at: z.string().trim().optional(),
      })
      .strict(),
    product: z
      .object({
        description: z.string().trim().min(1),
      })
      .strict(),
    audience: z.string().trim().min(1),
    business_model: z.string().trim().min(1),
    features: z.array(z.string().trim().min(1)),
    limitations: z.array(z.string().trim().min(1)),
    conversion_goal: z
      .object({
        action: z.string().trim().min(1),
        destination: z.string().trim().min(1),
      })
      .strict(),
    verified_facts: z.array(verifiedFactSchema).min(1),
    pricing_source: z.string().trim().min(1),
    truth_sync: z
      .object({
        enabled: z.literal(true),
        manifest_path: z.string().trim().min(1),
        current_path: z.string().trim().min(1),
      })
      .strict()
      .optional(),
    claims: claimsSchema,
    supported_markets: z.array(projectMarketSchema).min(1),
    brand_entity: brandEntitySchema.optional(),
    competitors: z.array(competitorSchema).default([]),
  })
  .strict()
  .superRefine((profile, ctx) => {
    if (profile.truth_sync && (!profile.project.project_id || !profile.project.brand_id)) {
      ctx.addIssue({
        code: 'custom',
        path: ['project'],
        message: 'project_id and brand_id are required when truth_sync is enabled',
      });
    }
  });

export type ProjectMarket = z.infer<typeof projectMarketSchema>;
export type ProjectTruthProfile = z.infer<typeof projectTruthProfileSchema>;

export function parseProjectTruthProfile(value: unknown): ProjectTruthProfile {
  return projectTruthProfileSchema.parse(value);
}

export function assertProjectTruthProfile(value: unknown): ProjectTruthProfile {
  const result = projectTruthProfileSchema.safeParse(value);
  if (result.success) {
    return result.data;
  }
  throw new Error(`Project Truth Profile is invalid: ${z.prettifyError(result.error)}`);
}

export function assertVerifiedProjectTruthProfile(value: unknown): ProjectTruthProfile {
  const profile = assertProjectTruthProfile(value);
  if (profile.status !== 'verified') {
    throw new Error(`Project Truth Profile must be verified before research: ${profile.status}`);
  }
  return profile;
}
