import type { BlogArticle } from '@/lib/stealth/articles';
import { faqPageCopy, faqsByLocale } from '@/content/i18n/faq';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { blogArticles } from '@/lib/stealth/articles';
import { htmlToMarkdown } from '@/lib/stealth/html-to-markdown';

/* The Markdown copies served at /docs-md/<slug> for the "Copy Markdown" and "Open" buttons:
   guides (guide-<slug>), the English FAQ (faq) and the RDP VPS page (rdp-vps). English only.
   A guide written in Markdown is served from its own Markdown; an HTML guide is converted. */

const guideCopySlugPrefix = 'guide-';

function guideMarkdownCopy(article: BlogArticle): string {
  const body = article.markdown ?? htmlToMarkdown(article.html);
  const sources = article.sources?.length
    ? [
        '## Sources',
        '',
        ...article.sources.map((source, index) => {
          const publisher = source.publisher ? ` (${source.publisher})` : '';
          return `${index + 1}. [${source.title}](${source.url})${publisher}`;
        }),
      ]
    : [];
  return `${[`# ${article.title}`, '', article.excerpt, '', body.trim(), '', ...sources].join('\n').trimEnd()}\n`;
}

function faqMarkdownCopy(): string {
  const { title, description } = faqPageCopy.en;
  const lines = [`# ${title}`, '', description, ''];
  let category = '';
  for (const faq of faqsByLocale.en) {
    if (faq.category !== category) {
      category = faq.category;
      lines.push(`## ${category}`, '');
    }
    lines.push(`### ${faq.question}`, '', faq.answer, '');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

function rdpVpsMarkdownCopy(): string {
  return [`# ${rdpVpsGuide.h1}`, '', rdpVpsGuide.description, '', htmlToMarkdown(rdpVpsGuide.html).trim(), ''].join('\n');
}

/* Every slug the copies route serves. Help Center and Citadel articles keep their own slugs. */
export function guideCopySlugs(): string[] {
  return [...blogArticles.map(article => `${guideCopySlugPrefix}${article.slug}`), 'faq', 'rdp-vps'];
}

export function findGuideCopy(slug: string): string | undefined {
  if (slug === 'faq') {
    return faqMarkdownCopy();
  }
  if (slug === 'rdp-vps') {
    return rdpVpsMarkdownCopy();
  }
  if (slug.startsWith(guideCopySlugPrefix)) {
    const article = blogArticles.find(item => item.slug === slug.slice(guideCopySlugPrefix.length));
    return article ? guideMarkdownCopy(article) : undefined;
  }
  return undefined;
}
