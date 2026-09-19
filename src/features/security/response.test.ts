import { describe, expect, it } from 'vitest';
import { sensitiveJson, sensitiveRedirect } from './response';

describe('sensitive responses', () => {
  it('marks JSON responses private and no-store', async () => {
    const response = sensitiveJson({ ok: true }, { status: 200 });

    expect(response.headers.get('cache-control')).toBe('no-store, private');
    expect(response.headers.get('pragma')).toBe('no-cache');
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it('marks redirects private and no-store', () => {
    const response = sensitiveRedirect('https://polar.sh/example');

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('https://polar.sh/example');
    expect(response.headers.get('cache-control')).toBe('no-store, private');
    expect(response.headers.get('pragma')).toBe('no-cache');
  });
});
