import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const Env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    BETTER_STACK_INGESTING_URL: z.string().url().optional(),
    BETTER_STACK_SOURCE_TOKEN: z.string().min(1).optional(),
    LOGGING_LEVEL: z.enum(['error', 'info', 'debug', 'warning', 'trace', 'fatal']).default('info'),
    POLAR_ACCESS_TOKEN: z.string().min(1).optional(),
    POLAR_PRODUCT_IDS: z.string().optional(),
    POLAR_SERVER: z.enum(['sandbox', 'production']).default('production'),
    POLAR_SUCCESS_URL: z.string().url().optional(),
    POLAR_PORTAL_RETURN_URL: z.string().url().optional(),
    POLAR_WEBHOOK_SECRET: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_SENTRY_ENABLED: z.enum(['true', 'false']).default('false'),
    NEXT_PUBLIC_SENTRY_REPLAY_ENABLED: z.enum(['true', 'false']).default('false'),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_STACK_INGESTING_URL: process.env.BETTER_STACK_INGESTING_URL,
    BETTER_STACK_SOURCE_TOKEN: process.env.BETTER_STACK_SOURCE_TOKEN,
    LOGGING_LEVEL: process.env.LOGGING_LEVEL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SENTRY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
    NEXT_PUBLIC_SENTRY_REPLAY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_REPLAY_ENABLED,
    POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN,
    POLAR_PRODUCT_IDS: process.env.POLAR_PRODUCT_IDS,
    POLAR_SERVER: process.env.POLAR_SERVER,
    POLAR_SUCCESS_URL: process.env.POLAR_SUCCESS_URL,
    POLAR_PORTAL_RETURN_URL: process.env.POLAR_PORTAL_RETURN_URL,
    POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  },
});
