import type * as PageTree from 'fumadocs-core/page-tree';
import type { SiteLocale } from '@/config/i18n';
import type { HelpCollection } from '@/lib/stealth/help-center';
import { faqPageCopy, faqsByLocale } from '@/content/i18n/faq';
import { resourcesCopy } from '@/content/i18n/resources';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { articlePath, blogArticles, citadelDocsArticles, helpDocsArticles } from '@/lib/stealth/articles';
import { faqCategoryId } from '@/lib/stealth/faq-topics';
import {
  articlesForCollection,
  citadelArticleHref,
  citadelCollections,
  helpArticleHref,
  helpCollections,
} from '@/lib/stealth/help-center';
import { localeHref } from '@/lib/stealth/i18n';

/* The sidebar of every resource page: Help Center, Citadel docs, guides and common questions.
   Each is a root folder, so Fumadocs shows them as tabs in the sidebar switcher and each keeps
   its own page list. Help Center and Citadel groups follow the curated collections in
   help-center.ts; guides are grouped by category; questions link to their topics on /faq. */

type Page = { name: string; url: string };

const page = ({ name, url }: Page): PageTree.Item => ({ type: 'page', name, url });

function groups(entries: { group: string; page: Page }[]): PageTree.Node[] {
  const byGroup = new Map<string, Page[]>();
  for (const entry of entries) {
    byGroup.set(entry.group, [...(byGroup.get(entry.group) ?? []), entry.page]);
  }
  return Array.from(byGroup, ([name, pages]) => [
    { type: 'separator' as const, name },
    ...pages.map(page),
  ]).flat();
}

function collections(
  list: HelpCollection[],
  articles: typeof helpDocsArticles,
  href: (article: (typeof helpDocsArticles)[number]) => string,
): PageTree.Node[] {
  return groups(list.flatMap(collection => articlesForCollection(collection, articles).map(article => ({
    group: collection.title.replace(/^Citadel:\s*/, ''),
    page: { name: article.title, url: href(article) },
  }))));
}

function root(name: string, description: string, overview: Page, children: PageTree.Node[]): PageTree.Folder {
  return { type: 'folder', name, description, root: true, children: [page(overview), ...children] };
}

export function docsTree(locale: SiteLocale = 'en'): PageTree.Root {
  const t = resourcesCopy[locale];
  const faq = faqPageCopy[locale];
  const faqUrl = localeHref('/faq', locale);
  const faqCategories = Array.from(new Set(faqsByLocale[locale].map(item => item.category)));

  return {
    name: t.tabs.resources,
    children: [
      root(t.tabs.help, 'StealthRDP servers', { name: 'Overview', url: '/docs' }, collections(helpCollections, helpDocsArticles, helpArticleHref)),
      root(t.tabs.citadel, 'Layer 7 DDoS protection', { name: 'Overview', url: '/citadel/docs' }, collections(citadelCollections, citadelDocsArticles, citadelArticleHref)),
      root(t.tabs.guides, 'VPS use cases and operations', { name: 'All guides', url: '/blog' }, groups([
        { group: 'Remote Desktop', page: { name: rdpVpsGuide.h1, url: '/rdp-vps' } },
        ...blogArticles.map(article => ({ group: article.category, page: { name: article.title, url: articlePath(article) } })),
      ])),
      root(t.tabs.faq, faq.topicsLabel, { name: faq.title, url: faqUrl }, faqCategories.map(category => page({
        name: category,
        url: `${faqUrl}#${faqCategoryId(category)}`,
      }))),
    ],
  };
}
