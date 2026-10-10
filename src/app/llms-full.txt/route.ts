import { articlePath, blogArticles, docPublicSlug, docsArticles } from '@/lib/stealth/articles';
import { findGuideCopy } from '@/lib/stealth/markdown-copies';
import { resourceEntries } from '@/lib/stealth/resource-index';
import { getSeoConfig } from '@/libs/seo/config';
import { isProductionDeployEnv, resolveDeployEnv } from '@/libs/seo/env';

export const dynamic = 'force-static';

/* llms-full.txt: the full Markdown of every indexable guide, help article, Citadel doc and common
   question, in the same order as resourceEntries(). Each section is the Markdown that the matching
   /docs-md copy serves: articles use the same body as src/app/docs-md/[slug]/route.ts, guides and
   the RDP VPS page use findGuideCopy() from markdown-copies.ts, and questions use their question and
   answer. The "# Title" line of each copy is replaced by one section title, so it is not repeated.
   Production only, like llms.txt. */

/* The body of a guide copy, without its leading "# Title" line. */
function guideBody(slug: string): string {
  return (findGuideCopy(slug) ?? '').replace(/^# [^\n]*\n+/, '').trim();
}

/* Markdown body of each page that has a /docs-md copy, keyed by its public href. */
function markdownBodies(): Map<string, string> {
  const bodies = new Map<string, string>([['/rdp-vps', guideBody('rdp-vps')]]);
  for (const article of blogArticles) {
    bodies.set(articlePath(article), guideBody(`guide-${article.slug}`));
  }
  for (const article of docsArticles) {
    const slug = docPublicSlug(article);
    const href = article.slug.startsWith('citadel-')
      ? `/citadel/docs/${slug.replace(/^citadel-/, '')}`
      : `/docs/${slug}`;
    bodies.set(href, `${article.summary}\n\n${article.content.trim()}`);
  }
  return bodies;
}

export function GET() {
  if (!isProductionDeployEnv(resolveDeployEnv())) {
    return new Response('Not found', { status: 404 });
  }

  const { siteUrl } = getSeoConfig();
  const bodies = markdownBodies();
  const body = resourceEntries()
    .filter(entry => entry.indexable)
    .map((entry) => {
      const markdown = entry.kind === 'Question'
        ? entry.description
        : bodies.get(entry.href) || entry.text || entry.description;
      return [
        `# ${entry.title}`,
        '',
        `URL: ${siteUrl}${entry.href}`,
        '',
        markdown.trim(),
      ].join('\n');
    })
    .join('\n\n---\n\n');

  return new Response(`${body}\n`, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
