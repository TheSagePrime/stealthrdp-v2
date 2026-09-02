type PolarWebhookPayload = Record<string, unknown>;
export type EntitlementSync = (payload: PolarWebhookPayload) => Promise<void> | void;

const entitlementEventTypes = new Set([
  'customer.state_changed',
  'subscription.active',
  'subscription.canceled',
  'subscription.revoked',
  'subscription.updated',
]);

function isPolarWebhookPayload(payload: unknown): payload is PolarWebhookPayload {
  return typeof payload === 'object' && payload !== null;
}

export async function syncPolarEntitlement(payload: unknown, sync: EntitlementSync = async () => {}): Promise<boolean> {
  if (!isPolarWebhookPayload(payload) || typeof payload.type !== 'string') {
    return false;
  }

  if (!entitlementEventTypes.has(payload.type)) {
    return false;
  }

  await sync(payload);
  return true;
}
