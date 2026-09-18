import { createPolarPortal } from '@/features/billing/polar-api';
import { readPolarConfig } from '@/features/billing/polar';
import { getAuthenticatedPrincipal } from '@/features/security/principal';
import { isSameOriginMutation } from '@/features/security/origin';
import { consumeRateLimit } from '@/features/security/rate-limit';
import { sensitiveJson, sensitiveRedirect } from '@/features/security/response';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  const config = readPolarConfig();

  if (!config.enabled || !config.accessToken) {
    return sensitiveJson({ error: 'POLAR_DISABLED' }, { status: 404 });
  }

  const principal = await getAuthenticatedPrincipal();
  if (!principal) {
    return sensitiveJson({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!principal.canManageBilling) {
    return sensitiveJson({ error: 'FORBIDDEN' }, { status: 403 });
  }

  if (!isSameOriginMutation(request)) {
    return sensitiveJson({ error: 'FORBIDDEN_ORIGIN' }, { status: 403 });
  }

  const rateLimit = consumeRateLimit(`polar:portal:${principal.billingExternalId}`, { limit: 6 });
  if (!rateLimit.allowed) {
    return sensitiveJson(
      { error: 'RATE_LIMITED' },
      {
        status: 429,
        headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  try {
    const portalUrl = await createPolarPortal(principal);
    return sensitiveRedirect(portalUrl);
  } catch {
    return sensitiveJson({ error: 'POLAR_PORTAL_UNAVAILABLE' }, { status: 502 });
  }
}
