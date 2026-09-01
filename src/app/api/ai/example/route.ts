import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { readAIConfig } from '@/features/ai/config';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const config = readAIConfig();

  if (!config.enabled) {
    return Response.json({ error: 'AI_DISABLED' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { prompt?: unknown } | null;
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return Response.json({ error: 'PROMPT_REQUIRED' }, { status: 400 });
  }

  const openai = createOpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseUrl,
  });
  const result = await generateText({
    model: openai(config.model),
    prompt,
  });

  return Response.json({ text: result.text });
}
