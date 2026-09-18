import { z } from 'zod';
import type { AuthenticatedPrincipal } from '@/features/security/principal';
import { readPolarConfig } from './polar';

const redirectSchema = z.object({
  url: z.string().url(),
});

const portalSchema = z.object({
  customer_portal_url: z.string().url(),
});

function isTrustedPolarUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && (url.hostname === 'polar.sh' || url.hostname.endsWith('.polar.sh'));
  } catch {
    return false;
  }
}

async function polarRequest(path: string, body: Record<string, unknown>): Promise<unknown> {
  const config = readPolarConfig();

  if (!config.enabled || !config.accessToken) {
    throw new Error('POLAR_DISABLED');
  }

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error(`POLAR_UPSTREAM_${response.status}`);
  }

  return response.json();
}

export function resolveAllowedPolarProduct(requestedProductId: string | null): string | null {
  const { allowedProductIds } = readPolarConfig();

  if (allowedProductIds.length === 0) {
    return null;
  }

  const candidate = requestedProductId ?? (allowedProductIds.length === 1 ? allowedProductIds[0] : null);
  return candidate && allowedProductIds.includes(candidate) ? candidate : null;
}

export async function createPolarCheckout(
  principal: AuthenticatedPrincipal,
  productId: string,
): Promise<string> {
  const config = readPolarConfig();

  if (!config.successUrl) {
    throw new Error('POLAR_SUCCESS_URL_REQUIRED');
  }

  const parsed = redirectSchema.parse(await polarRequest('/checkouts', {
    products: [productId],
    external_customer_id: principal.billingExternalId,
    success_url: config.successUrl,
    allow_discount_codes: false,
  }));

  if (!isTrustedPolarUrl(parsed.url)) {
    throw new Error('POLAR_UNTRUSTED_REDIRECT');
  }

  return parsed.url;
}

export async function createPolarPortal(
  principal: AuthenticatedPrincipal,
): Promise<string> {
  const config = readPolarConfig();

  const parsed = portalSchema.parse(await polarRequest('/customer-sessions', {
    external_customer_id: principal.billingExternalId,
    ...(config.portalReturnUrl ? { return_url: config.portalReturnUrl } : {}),
  }));

  if (!isTrustedPolarUrl(parsed.customer_portal_url)) {
    throw new Error('POLAR_UNTRUSTED_REDIRECT');
  }

  return parsed.customer_portal_url;
}
