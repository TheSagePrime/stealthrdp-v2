import { Checkout } from '@polar-sh/nextjs';
import { readPolarConfig } from '@/features/billing/polar';

export const dynamic = 'force-dynamic';

const config = readPolarConfig();

function disabled() {
  return Response.json({ error: 'POLAR_DISABLED' }, { status: 404 });
}

function createCheckoutHandler() {
  if (!config.enabled || !config.accessToken || !config.successUrl) {
    return disabled;
  }

  return Checkout({
    accessToken: config.accessToken,
    server: config.server,
    successUrl: config.successUrl,
  });
}

export const GET = createCheckoutHandler();
