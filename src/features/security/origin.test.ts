import { describe, expect, it } from 'vitest';
import { isSameOriginMutation } from './origin';

describe('isSameOriginMutation', () => {
  it('accepts a same-origin mutation', () => {
    const request = new Request('https://app.example/api/polar/portal', {
      method: 'POST',
      headers: { origin: 'https://app.example' },
    });

    expect(isSameOriginMutation(request)).toBe(true);
  });

  it('rejects cross-origin and missing-origin mutations', () => {
    const crossOrigin = new Request('https://app.example/api/polar/portal', {
      method: 'POST',
      headers: { origin: 'https://evil.example' },
    });
    const missingOrigin = new Request('https://app.example/api/polar/portal', {
      method: 'POST',
    });

    expect(isSameOriginMutation(crossOrigin)).toBe(false);
    expect(isSameOriginMutation(missingOrigin)).toBe(false);
  });
});
