import { describe, expect, it } from 'vitest';
import pageContractJson from './contracts/workflows/page-research-package.schema.json';
import demandContractJson from './contracts/workflows/search-demand-map.schema.json';
import sourceJson from './contracts/workflows/source.json';
import {
  WORKFLOWS_SEO_CONTRACT_COMMIT,
  WORKFLOWS_SEO_CONTRACT_REPOSITORY,
  demandOpportunityBaseSchema,
  openSeoEvidenceRefSchema,
  pageResearchPackageBaseSchema,
  searchDemandMapSchema,
} from './research-artifacts';

type Parseable = {
  safeParse: (value: unknown) => { success: boolean };
};

type Shape = Record<string, Parseable>;

type CanonicalObjectSchema = {
  properties: Record<string, unknown>;
  required: string[];
};

type CanonicalContract = CanonicalObjectSchema & {
  $defs: {
    evidence_ref: CanonicalObjectSchema;
    decision_evidence_ref: {
      allOf: Array<{ required?: string[] }>;
    };
  };
};

const pageContract = pageContractJson as unknown as CanonicalContract;
const demandContract = demandContractJson as unknown as CanonicalContract;
const demandOpportunityContract = (
  demandContract.properties.opportunities as { items: CanonicalObjectSchema }
).items;

function sorted(values: string[]): string[] {
  return [...values].sort();
}

function requiredKeys(shape: Shape): string[] {
  return Object.entries(shape)
    .filter(([, schema]) => !schema.safeParse(undefined).success)
    .map(([key]) => key)
    .sort();
}

describe('canonical Workflows SEO contract parity', () => {
  it('records the exact canonical Workflows revision mirrored by Starter', () => {
    expect(sourceJson.repository).toBe(WORKFLOWS_SEO_CONTRACT_REPOSITORY);
    expect(sourceJson.commit).toBe(WORKFLOWS_SEO_CONTRACT_COMMIT);
  });

  it('keeps Page Research Package fields and base requirements aligned', () => {
    expect(sorted(Object.keys(pageResearchPackageBaseSchema.shape))).toEqual(
      sorted(Object.keys(pageContract.properties)),
    );
    expect(requiredKeys(pageResearchPackageBaseSchema.shape)).toEqual(sorted(pageContract.required));
  });

  it('keeps Search Demand Map fields and opportunity requirements aligned', () => {
    expect(sorted(Object.keys(searchDemandMapSchema.shape))).toEqual(
      sorted(Object.keys(demandContract.properties)),
    );
    expect(requiredKeys(searchDemandMapSchema.shape)).toEqual(sorted(demandContract.required));

    expect(sorted(Object.keys(demandOpportunityBaseSchema.shape))).toEqual(
      sorted(Object.keys(demandOpportunityContract.properties)),
    );
    expect(requiredKeys(demandOpportunityBaseSchema.shape)).toEqual(
      sorted(demandOpportunityContract.required),
    );
  });

  it('keeps decision-evidence fields and required provenance aligned', () => {
    const evidenceProperties = pageContract.$defs.evidence_ref.properties;
    const decisionRequired = pageContract.$defs.decision_evidence_ref.allOf.flatMap(
      entry => entry.required ?? [],
    );
    const expectedRequired = sorted([
      ...pageContract.$defs.evidence_ref.required,
      ...decisionRequired,
    ]);

    expect(sorted(Object.keys(openSeoEvidenceRefSchema.shape))).toEqual(sorted(Object.keys(evidenceProperties)));
    expect(requiredKeys(openSeoEvidenceRefSchema.shape)).toEqual(expectedRequired);
  });

  it('keeps canonical decision inputs on the stronger evidence reference', () => {
    const pageEvidence = pageContract.properties.serp_evidence as {
      items: { $ref: string };
    };
    const researchSources = demandContract.properties.research_sources as {
      items: { $ref: string };
    };
    const demandEvidence = demandOpportunityContract.properties.serp_evidence as {
      items: { $ref: string };
    };

    expect(pageEvidence.items.$ref).toBe('#/$defs/decision_evidence_ref');
    expect(researchSources.items.$ref).toBe('#/$defs/decision_evidence_ref');
    expect(demandEvidence.items.$ref).toBe('#/$defs/decision_evidence_ref');
  });
});
