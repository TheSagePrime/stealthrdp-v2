import { describe, expect, it } from 'vitest';
import { plansCopy } from '@/content/i18n/plans';
import { docPublicSlug, docsArticles } from '@/lib/stealth/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { generateStaticParams, GET } from './route';

const productSlugs = ['plans', 'windows-vps', 'linux-vps', 'citadel'];

function request(slug: string) {
  return GET(new Request(`https://www.stealthrdp.com/docs-md/${slug}`), { params: Promise.resolve({ slug }) });
}

describe('/docs-md product pages', () => {
  it('registers the four product slugs for static generation', () => {
    const slugs = generateStaticParams().map(param => param.slug);

    for (const slug of productSlugs) {
      expect(slugs).toContain(slug);
    }
  });

  it('does not collide with a Help Center or Citadel article slug', () => {
    const articleSlugs = docsArticles.map(article => docPublicSlug(article));

    for (const slug of productSlugs) {
      expect(articleSlugs).not.toContain(slug);
    }
  });

  it('serves the plans copy as Markdown, not indexed, with the cache headers of the other copies', async () => {
    const response = await request('plans');

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, s-maxage=3600');
    expect(await response.text()).toContain(`# ${plansCopy.en.meta.title}`);
  });

  it.each(productSlugs)('serves %s as Markdown with its page title', async (slug) => {
    const response = await request(slug);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body.startsWith('# ')).toBe(true);
    expect(body).toContain(`${getSeoConfig().siteUrl}/${slug}`);
  });

  it('returns 404 for an unknown slug', async () => {
    const response = await request('not-a-page');

    expect(response.status).toBe(404);
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex');
  });
});
