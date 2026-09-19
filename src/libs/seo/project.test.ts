import { describe, expect, it } from 'vitest';
import {
  assertProjectTruthProfile,
  assertVerifiedProjectTruthProfile,
  parseProjectTruthProfile,
  projectTruthProfileSchema,
} from './project';

const profile = {
  artifact_type: 'project_truth_profile',
  version: 1,
  status: 'verified',
  project: {
    name: 'Example',
    canonical_domain: 'example.test',
  },
  product: {
    description: 'A product that solves a stated customer problem.',
  },
  audience: 'Teams with the stated problem.',
  business_model: 'Subscription',
  features: ['Documented feature'],
  limitations: ['A documented limitation'],
  conversion_goal: {
    action: 'Start a trial',
    destination: '/signup',
  },
  verified_facts: [{ fact: 'The product has a documented feature.', source: 'Product documentation' }],
  pricing_source: 'https://example.test/pricing',
  supported_markets: [{ country: 'DE', locale: 'de-DE' }],
  competitors: [{ name: 'Known competitor', domain: 'competitor.example', source: 'SERP capture' }],
  claims: { allowed: ['Documented feature'], prohibited_or_unverified: ['Unverified guarantee'] },
};

describe('Project Truth Profile', () => {
  it('accepts the canonical machine-readable contract', () => {
    expect(parseProjectTruthProfile(profile)).toMatchObject({ project: profile.project });
    expect(projectTruthProfileSchema.safeParse(profile).success).toBe(true);
    expect(assertVerifiedProjectTruthProfile(profile).status).toBe('verified');
  });

  it('rejects missing product truth and unsupported market shape', () => {
    const result = projectTruthProfileSchema.safeParse({
      ...profile,
      product: { ...profile.product, description: '' },
      supported_markets: [{ country: 'de', locale: 'German' }],
    });

    expect(result.success).toBe(false);
  });

  it('accepts public truth sync only with stable project identity', () => {
    const syncProfile = {
      ...profile,
      project: {
        ...profile.project,
        project_id: 'example',
        brand_id: 'example',
      },
      truth_sync: {
        enabled: true,
        manifest_path: '.sageprime/project-truth/manifest.json',
        current_path: '.sageprime/project-truth/current.json',
      },
    };

    expect(projectTruthProfileSchema.safeParse(syncProfile).success).toBe(true);
    expect(
      projectTruthProfileSchema.safeParse({
        ...syncProfile,
        project: { ...profile.project },
      }).success,
    ).toBe(false);
  });

  it('blocks a draft profile at the research boundary', () => {
    expect(() => assertVerifiedProjectTruthProfile({ ...profile, status: 'draft' })).toThrow(/must be verified/);
    expect(() => assertProjectTruthProfile({})).toThrow(/Project Truth Profile is invalid/);
  });
});
