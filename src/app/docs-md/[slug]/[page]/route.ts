import { isSiteLocale } from '@/config/i18n';
import { translatedMarkdownCopies } from '@/lib/stealth/translations';

/* The Markdown copy of each published German and Spanish article, Citadel doc and blog post, at
   /docs-md/<locale>/<slug> (here `slug` is the language and `page` the article): docs keep their
   slug, blog posts are guide-<slug>, as in the English copies at /docs-md/<slug>. Not indexed,
   like the English copies. A translation that is not published has no copy. */

export const dynamic = 'force-static';
export const dynamicParams = false;

const headers = { 'X-Robots-Tag': 'noindex' };

export function generateStaticParams() {
  return translatedMarkdownCopies().map(copy => ({ slug: copy.locale, page: copy.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string; page: string }> }) {
  const { slug: locale, page } = await params;
  const copy = isSiteLocale(locale)
    ? translatedMarkdownCopies().find(item => item.locale === locale && item.slug === page)
    : undefined;
  if (!copy) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...headers },
    });
  }

  return new Response(copy.markdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      ...headers,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
