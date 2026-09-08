import { resolveSeoSite } from '@/config/seo';
import { renderArticleRss } from '@/libs/seo/article-rss';
import { getSeoConfig } from '@/libs/seo/config';

export const dynamic = 'force-static';

export function GET() {
  const config = getSeoConfig();
  const site = resolveSeoSite(config);
  return new Response(renderArticleRss(config, site), {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
