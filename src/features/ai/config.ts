import { z } from 'zod';

const aiEnvironmentSchema = z
  .object({
    AI_ENABLED: z.enum(['true', 'false']).default('false'),
    OPENAI_API_KEY: z.string().min(1).optional(),
    OPENAI_BASE_URL: z.string().url().optional(),
    OPENAI_MODEL: z.string().min(1).default('gpt-4o-mini'),
  })
  .superRefine((environment, context) => {
    if (environment.AI_ENABLED === 'true' && !environment.OPENAI_API_KEY) {
      context.addIssue({
        code: 'custom',
        message: 'OPENAI_API_KEY is required when AI_ENABLED=true',
        path: ['OPENAI_API_KEY'],
      });
    }
  });

export type AIConfig =
  | { enabled: false }
  | {
      enabled: true;
      apiKey: string;
      baseUrl: string | undefined;
      model: string;
    };

export function readAIConfig(environment: Record<string, string | undefined> = process.env): AIConfig {
  const result = aiEnvironmentSchema.safeParse(environment);

  if (!result.success) {
    throw new Error(`Invalid AI configuration: ${result.error.issues.map((issue) => issue.message).join('; ')}`);
  }

  if (result.data.AI_ENABLED !== 'true') {
    return { enabled: false };
  }

  if (!result.data.OPENAI_API_KEY) {
    throw new Error('Invalid AI configuration: OPENAI_API_KEY is required when AI_ENABLED=true');
  }

  return {
    enabled: true,
    apiKey: result.data.OPENAI_API_KEY,
    baseUrl: result.data.OPENAI_BASE_URL,
    model: result.data.OPENAI_MODEL,
  };
}
