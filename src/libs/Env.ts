import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const Env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1).optional(),
    BETTER_STACK_INGESTING_URL: z.string().url().optional(),
    BETTER_STACK_SOURCE_TOKEN: z.string().min(1).optional(),
    LOGGING_LEVEL: z.enum(['error', 'info', 'debug', 'warning', 'trace', 'fatal']).default('info'),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_SENTRY_ENABLED: z.enum(['true', 'false']).default('false'),
    NEXT_PUBLIC_SENTRY_REPLAY_ENABLED: z.enum(['true', 'false']).default('false'),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_STACK_INGESTING_URL: process.env.BETTER_STACK_INGESTING_URL,
    BETTER_STACK_SOURCE_TOKEN: process.env.BETTER_STACK_SOURCE_TOKEN,
    LOGGING_LEVEL: process.env.LOGGING_LEVEL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SENTRY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
    NEXT_PUBLIC_SENTRY_REPLAY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_REPLAY_ENABLED,
    NODE_ENV: process.env.NODE_ENV,
  },
});
