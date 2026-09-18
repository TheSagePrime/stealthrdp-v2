import { Webhooks } from '@polar-sh/nextjs';
import { syncPolarEntitlement } from '@/features/billing/entitlements';
import { readPolarConfig } from '@/features/billing/polar';
import { withPolarWebhookReplayGuard } from '@/features/billing/webhook-replay';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const config = readPolarConfig();

function disabled() {
  return Response.json({ error: 'POLAR_DISABLED' }, { status: 404 });
}

function createWebhookHandler() {
  if (!config.webhookSecret) {
    return disabled;
  }

  return Webhooks({
    webhookSecret: config.webhookSecret,
    onPayload: async (payload) => {
      await withPolarWebhookReplayGuard(payload, async () => {
        await syncPolarEntitlement(payload);
      });
    },
  });
}

export const POST = createWebhookHandler();
