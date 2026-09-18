import { describe, expect, it } from 'vitest';
import { tenantScope } from './tenant';

describe('tenantScope', () => {
  it('uses only the authenticated principal tenant ID', () => {
    expect(tenantScope({
      userId: 'user_123',
      orgId: 'org_456',
      tenantId: 'org_456',
      billingExternalId: 'org_456',
      canManageBilling: true,
    })).toEqual({ ownerId: 'org_456' });
  });
});
