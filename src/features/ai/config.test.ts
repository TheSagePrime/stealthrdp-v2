import { describe, expect, it } from 'vitest';
import { readAIConfig } from './config';

describe('AI configuration', () => {
  it('is disabled without an explicit enable flag', () => {
    expect(readAIConfig({})).toEqual({ enabled: false });
  });

  it('requires an API key when enabled', () => {
    expect(() => readAIConfig({ AI_ENABLED: 'true' })).toThrow('OPENAI_API_KEY');
  });
});
