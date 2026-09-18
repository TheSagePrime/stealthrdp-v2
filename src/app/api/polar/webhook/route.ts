import { Webhooks } from '@polar-sh/nextjs';
import { syncPolarEntitlement } from '@/features/billing/entitlements';
import { readPolarConfig } from '@/features/billing/polar';
import { withPolarWebhookReplayGuard } from '@/features/billing/webhook-replay';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const config = readPolarConfig();

function disabled(_request?: Request) {
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

const webhookHandler = createWebhookHandler();
const MAX_WEBHOOK_BYTES = 1_048_576;

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BYTES) {
    return Response.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  }

  return webhookHandler(request);
}
