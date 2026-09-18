import 'server-only';
import { validateEvent } from '@polar-sh/sdk/webhooks';
import { z } from 'zod';

const polarEnvironmentSchema = z.object({
  POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
  POLAR_PRODUCT_IDS: z.string().optional(),
  POLAR_SERVER: z.enum(['sandbox', 'production']).default('production'),
  POLAR_SUCCESS_URL: z.string().url().optional(),
  POLAR_PORTAL_RETURN_URL: z.string().url().optional(),
  POLAR_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export type PolarConfig = {
  enabled: boolean;
  accessToken: string | undefined;
  allowedProductIds: string[];
  server: 'sandbox' | 'production';
  successUrl: string | undefined;
  portalReturnUrl: string | undefined;
  webhookSecret: string | undefined;
  apiBaseUrl: string;
};

export type PolarWebhookVerification =
  | { verified: true; payload: unknown }
  | { verified: false; reason: 'disabled' | 'invalid' };

function parseProductIds(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  const ids = value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

  const schema = z.array(z.string().uuid());
  const result = schema.safeParse(ids);

  if (!result.success) {
    throw new Error('POLAR_PRODUCT_IDS must be a comma-separated list of UUID product IDs');
  }

  return [...new Set(result.data)];
}

export function readPolarConfig(environment: Record<string, string | undefined> = process.env): PolarConfig {
  const result = polarEnvironmentSchema.safeParse(environment);

  if (!result.success) {
    throw new Error(`Invalid Polar configuration: ${result.error.issues.map(issue => issue.message).join('; ')}`);
  }

  const server = result.data.POLAR_SERVER;

  return {
    enabled: Boolean(result.data.POLAR_ACCESS_TOKEN),
    accessToken: result.data.POLAR_ACCESS_TOKEN,
    allowedProductIds: parseProductIds(result.data.POLAR_PRODUCT_IDS),
    server,
    successUrl: result.data.POLAR_SUCCESS_URL,
    portalReturnUrl: result.data.POLAR_PORTAL_RETURN_URL,
    webhookSecret: result.data.POLAR_WEBHOOK_SECRET,
    apiBaseUrl: server === 'sandbox' ? 'https://sandbox-api.polar.sh/v1' : 'https://api.polar.sh/v1',
  };
}

export function verifyPolarWebhook(
  rawBody: string,
  headers: Record<string, string>,
  webhookSecret = readPolarConfig().webhookSecret,
): PolarWebhookVerification {
  if (!webhookSecret) {
    return { verified: false, reason: 'disabled' };
  }

  try {
    return {
      verified: true,
      payload: validateEvent(rawBody, headers, webhookSecret),
    };
  } catch {
    return { verified: false, reason: 'invalid' };
  }
}
