import { createPolarPortal } from '@/features/billing/polar-api';
import { readPolarConfig } from '@/features/billing/polar';
import { getAuthenticatedPrincipal } from '@/features/security/principal';
import { consumeRateLimit } from '@/features/security/rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const config = readPolarConfig();

  if (!config.enabled || !config.accessToken) {
    return Response.json({ error: 'POLAR_DISABLED' }, { status: 404 });
  }

  const principal = await getAuthenticatedPrincipal();
  if (!principal) {
    return Response.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const rateLimit = consumeRateLimit(`polar:portal:${principal.billingExternalId}`, { limit: 6 });
  if (!rateLimit.allowed) {
    return Response.json(
      { error: 'RATE_LIMITED' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  try {
    const portalUrl = await createPolarPortal(principal);
    return Response.redirect(portalUrl, 303);
  } catch {
    return Response.json({ error: 'POLAR_PORTAL_UNAVAILABLE' }, { status: 502 });
  }
}
