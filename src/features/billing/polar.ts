import { validateEvent } from '@polar-sh/sdk/webhooks';
import { z } from 'zod';

const polarEnvironmentSchema = z.object({
  POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
  POLAR_SERVER: z.enum(['sandbox', 'production']).default('production'),
  POLAR_SUCCESS_URL: z.string().url().optional(),
  POLAR_WEBHOOK_SECRET: z.string().min(1).optional(),
});

export type PolarConfig = {
  enabled: boolean;
  accessToken: string | undefined;
  server: 'sandbox' | 'production';
  successUrl: string | undefined;
  webhookSecret: string | undefined;
  apiBaseUrl: string;
};

export type PolarWebhookVerification =
  | { verified: true; payload: unknown }
  | { verified: false; reason: 'disabled' | 'invalid' };

export function readPolarConfig(environment: Record<string, string | undefined> = process.env): PolarConfig {
  const result = polarEnvironmentSchema.safeParse(environment);

  if (!result.success) {
    throw new Error(`Invalid Polar configuration: ${result.error.issues.map((issue) => issue.message).join('; ')}`);
  }

  const server = result.data.POLAR_SERVER;

  return {
    enabled: Boolean(result.data.POLAR_ACCESS_TOKEN),
    accessToken: result.data.POLAR_ACCESS_TOKEN,
    server,
    successUrl: result.data.POLAR_SUCCESS_URL,
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
