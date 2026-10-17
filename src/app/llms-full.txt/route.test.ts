import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { blogArticles } from '@/lib/stealth/articles';
import { findGuideCopy } from '@/lib/stealth/markdown-copies';
import { resourceEntries } from '@/lib/stealth/resource-index';
import { getSeoConfig } from '@/libs/seo/config';
import { GET } from './route';

describe('llms-full.txt', () => {
  const savedVercelEnv = process.env.VERCEL_ENV;

  beforeEach(() => {
    process.env.VERCEL_ENV = 'production';
  });

  afterEach(() => {
    if (savedVercelEnv === undefined) {
      delete process.env.VERCEL_ENV;
    } else {
      process.env.VERCEL_ENV = savedVercelEnv;
    }
  });

  it('is served only in production', async () => {
    process.env.VERCEL_ENV = 'preview';

    expect(GET().status).toBe(404);
  });

  it('has Markdown content type', () => {
    expect(GET().headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
  });

  it('has one section per indexable entry, in resource order', async () => {
    const { siteUrl } = getSeoConfig();
    const text = await GET().text();
    const entries = resourceEntries().filter(entry => entry.indexable);
    const urlLines = text.match(/^URL: .*$/gm) ?? [];

    expect(urlLines).toHaveLength(entries.length);
    expect(urlLines).toEqual(entries.map(entry => `URL: ${siteUrl}${entry.href}`));

    for (const entry of entries) {
      expect(text).toContain(`# ${entry.title}\n\nURL: ${siteUrl}${entry.href}\n`);
    }
  });

  it('keeps the Markdown headings of a guide', async () => {
    const text = await GET().text();
    const guide = blogArticles[0];
    if (!guide) {
      throw new Error('No guides to check');
    }
    const guideHeading = findGuideCopy(`guide-${guide.slug}`)?.split('\n').find(line => line.startsWith('## '));

    expect(guideHeading).toBeDefined();
    expect(text).toContain(`# ${guide.title}\n\nURL: `);
    expect(text).toContain(`\n${guideHeading}\n`);
  });
});
