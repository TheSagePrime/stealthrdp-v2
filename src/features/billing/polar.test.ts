import { describe, expect, it } from 'vitest';
import { syncPolarEntitlement } from './entitlements';
import { readPolarConfig, verifyPolarWebhook } from './polar';
import { withPolarWebhookReplayGuard } from './webhook-replay';

describe('Polar integration boundary', () => {
  it('is disabled when no access token exists', () => {
    expect(readPolarConfig({})).toMatchObject({
      enabled: false,
      allowedProductIds: [],
      server: 'production',
      apiBaseUrl: 'https://api.polar.sh/v1',
    });
  });

  it('parses and deduplicates the product allowlist', () => {
    expect(
      readPolarConfig({
        POLAR_PRODUCT_IDS: '00000000-0000-4000-8000-000000000001,00000000-0000-4000-8000-000000000001',
      }).allowedProductIds,
    ).toEqual(['00000000-0000-4000-8000-000000000001']);
  });

  it('does not verify webhooks without a secret', () => {
    expect(verifyPolarWebhook('{}', {})).toEqual({ verified: false, reason: 'disabled' });
  });

  it('rejects a webhook with invalid signing data', () => {
    expect(verifyPolarWebhook('{}', {}, 'test-secret')).toEqual({ verified: false, reason: 'invalid' });
  });

  it('suppresses a duplicate webhook payload within the running process', async () => {
    const payload = { type: 'subscription.active', data: { id: 'replay-test-unique-1' } };
    let calls = 0;

    await expect(
      withPolarWebhookReplayGuard(payload, async () => {
        calls += 1;
      }),
    ).resolves.toBe(true);

    await expect(
      withPolarWebhookReplayGuard(payload, async () => {
        calls += 1;
      }),
    ).resolves.toBe(false);

    expect(calls).toBe(1);
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
