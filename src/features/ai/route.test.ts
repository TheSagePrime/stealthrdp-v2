import { describe, expect, it } from 'vitest';
import { POST } from '@/app/api/ai/example/route';

describe('AI example route', () => {
  it('returns not found while AI is disabled', async () => {
    const original = process.env.AI_ENABLED;
    delete process.env.AI_ENABLED;

    try {
      const response = await POST(
        new Request('http://localhost/api/ai/example', {
          method: 'POST',
          body: JSON.stringify({ prompt: 'hello' }),
          headers: { 'content-type': 'application/json' },
        }),
      );

      expect(response.status).toBe(404);
      await expect(response.json()).resolves.toEqual({ error: 'AI_DISABLED' });
    } finally {
      if (original === undefined) {
        delete process.env.AI_ENABLED;
      } else {
        process.env.AI_ENABLED = original;
      }
    }
  });
});
