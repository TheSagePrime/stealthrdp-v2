import { Webhooks } from '@polar-sh/nextjs';
import { syncPolarEntitlement } from '@/features/billing/entitlements';
import { readPolarConfig } from '@/features/billing/polar';
import { withPolarWebhookReplayGuard } from '@/features/billing/webhook-replay';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const config = readPolarConfig();
const MAX_WEBHOOK_BYTES = 1_048_576;

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

async function readBodyWithLimit(request: Request): Promise<Uint8Array | null> {
  if (!request.body) {
    return new Uint8Array();
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    size += value.byteLength;
    if (size > MAX_WEBHOOK_BYTES) {
      await reader.cancel();
      return null;
    }

    chunks.push(value);
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return body;
}

const webhookHandler = createWebhookHandler();

export async function POST(request: Request) {
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) {
    return Response.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  }

  const body = await readBodyWithLimit(request);
  if (!body) {
    return Response.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
  }

  const verifiedRequest = new Request(request.url, {
    method: 'POST',
    headers: request.headers,
    body: body.byteLength ? body : undefined,
  });

  return webhookHandler(verifiedRequest);
}
