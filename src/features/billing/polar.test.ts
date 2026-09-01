import { describe, expect, it } from 'vitest';
import { syncPolarEntitlement } from './entitlements';
import { readPolarConfig, verifyPolarWebhook } from './polar';

describe('Polar integration boundary', () => {
  it('is disabled when no access token exists', () => {
    expect(readPolarConfig({})).toMatchObject({
      enabled: false,
      server: 'production',
      apiBaseUrl: 'https://api.polar.sh/v1',
    });
  });

  it('does not verify webhooks without a secret', () => {
    expect(verifyPolarWebhook('{}', {})).toEqual({ verified: false, reason: 'disabled' });
  });

  it('rejects a webhook with invalid signing data', () => {
    expect(verifyPolarWebhook('{}', {}, 'test-secret')).toEqual({ verified: false, reason: 'invalid' });
  });

  it('passes supported events to the entitlement sync boundary', async () => {
    const received: Record<string, unknown>[] = [];
    const synced = await syncPolarEntitlement(
      { type: 'subscription.active', data: { external_customer_id: 'user-1' } },
      (payload) => {
        received.push(payload);
      },
    );

    expect(synced).toBe(true);
    expect(received).toHaveLength(1);
  });
});
