import { resourcePagesCopy, resourcesCopy } from '@/content/i18n/resources';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { articlePath, blogArticles, citadelDocsArticles, docPublicSlug, helpDocsArticles } from '@/lib/stealth/articles';
import { faqs } from '@/lib/stealth/content';
import { isNoindexDocPath } from '@/lib/stealth/routes';
import { translationLocales } from '@/lib/stealth/translation-sources';
import { translatedDocs, translatedGuides } from '@/lib/stealth/translations';

/* One text index of every resource page. It feeds the resource search (/search-index.json)
   and the llms.txt files, so both always match the published content. */

export type ResourceEntry = {
  title: string;
  href: string;
  kind: 'Guide' | 'Help' | 'Citadel' | 'Question';
  description: string;
  text: string;
  indexable: boolean;
};

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': '\'', '&apos;': '\'', '&nbsp;': ' ' };

/** Plain text that keeps paragraph, heading and list breaks, so the llms-full.txt output stays readable. */
function clean(text: string): string {
  return text
    .replace(/&(?:amp|lt|gt|quot|#39|apos|nbsp);/g, entity => ENTITIES[entity] ?? entity)
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function htmlToText(html: string): string {
  return clean(html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<h2[^>]*>/gi, '\n\n## ')
    .replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/(p|div|h[1-6]|ul|ol|table|tr|blockquote|pre)>|<br\s*\/?>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' '));
}

function markdownToText(markdown: string): string {
  return clean(markdown
    // Fence lines carry the language and title ("```bash title=..."), and callouts carry ":::info";
    // neither is reader text. The code and the callout text stay.
    .replace(/^```.*$/gm, '')
    .replace(/^:::.*$/gm, '')
    .replace(/^[=-]{3,}\s*$/gm, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, ''));
}

export function resourceEntries(): ResourceEntry[] {
  const docEntry = (kind: 'Help' | 'Citadel', href: string, article: (typeof helpDocsArticles)[number]) => ({
    title: article.title,
    href,
    kind,
    description: article.summary,
    text: markdownToText(article.content),
    indexable: !isNoindexDocPath(href),
  });

  return [
    {
      title: rdpVpsGuide.h1,
      href: '/rdp-vps',
      kind: 'Guide',
      description: rdpVpsGuide.description,
      text: htmlToText(rdpVpsGuide.html),
      indexable: true,
    },
    ...blogArticles.map(article => ({
      title: article.title,
      href: articlePath(article),
      kind: 'Guide' as const,
      description: article.excerpt,
      text: htmlToText(article.html),
      indexable: true,
    })),
    ...helpDocsArticles.map(article => docEntry('Help', `/docs/${docPublicSlug(article)}`, article)),
    ...citadelDocsArticles.map(article => docEntry(
      'Citadel',
      `/citadel/docs/${docPublicSlug(article).replace(/^citadel-/, '')}`,
      article,
    )),
    ...faqs.map(item => ({
      title: item.question,
      href: `/faq#faq-${item._id}`,
      kind: 'Question' as const,
      description: item.answer,
      text: '',
      indexable: true,
    })),
  ];
}

/* The published German and Spanish articles for the resource search, beside the English entries.
   Not in resourceEntries(): llms.txt and llms-full.txt stay English. */
export function translatedSearchEntries(): { title: string; href: string; description: string; text: string; breadcrumb: string }[] {
  return translationLocales.flatMap((locale) => {
    const tabs = resourcesCopy[locale].tabs;
    const language = resourcePagesCopy[locale].languageName;
    return [
      ...translatedGuides(locale).map(guide => ({
        title: guide.title,
        href: guide.path,
        description: guide.excerpt,
        text: htmlToText(guide.html),
        breadcrumb: `${tabs.guides} (${language})`,
      })),
      ...(['help', 'citadel'] as const).flatMap(section => translatedDocs(locale, section).map(doc => ({
        title: doc.title,
        href: doc.path,
        description: doc.summary,
        text: markdownToText(doc.content),
        breadcrumb: `${tabs[section]} (${language})`,
      }))),
    ];
  });
}
