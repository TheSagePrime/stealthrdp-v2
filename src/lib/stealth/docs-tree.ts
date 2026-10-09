import type * as PageTree from 'fumadocs-core/page-tree';
import type { FluentIconName } from '@/components/site/docs/DocsIcon';
import type { SiteLocale } from '@/config/i18n';
import type { HelpCollection } from '@/lib/stealth/help-center';
import { createElement } from 'react';
import { FluentIcon, WindowsMark } from '@/components/site/docs/DocsIcon';
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

/* Sidebar icons by group name, from the site's Fluent Color artwork (the same artwork the
   topic tiles and the footer use) and the real Windows mark. FAQ topics are matched in English,
   German and Spanish. */
const icons: [RegExp, FluentIconName | 'windows'][] = [
  [/getting started|start here/i, 'cloud'],
  [/windows/i, 'windows'],
  [/network|vpn|domain/i, 'globe'],
  [/hosting|panel/i, 'database'],
  [/protection|security/i, 'shield-checkmark'],
  [/traffic/i, 'data-trending'],
  [/remote desktop/i, 'laptop'],
  [/management/i, 'settings'],
  [/use case/i, 'gauge'],
  [/account|konto|cuenta/i, 'person-key'],
  [/billing|pricing|abrechnung|factur|precio/i, 'receipt'],
  [/plan|tarif|servic|leistung/i, 'board'],
  [/support|soporte/i, 'headset'],
];

function icon(name: FluentIconName | 'windows') {
  return name === 'windows' ? createElement(WindowsMark) : createElement(FluentIcon, { name });
}

function iconFor(group: string) {
  return icon(icons.find(([pattern]) => pattern.test(group))?.[1] ?? 'notebook');
}

const page = ({ name, url }: Page, glyph?: FluentIconName): PageTree.Item => ({
  type: 'page',
  name,
  url,
  icon: glyph ? icon(glyph) : undefined,
});

/* One collapsible folder per group. Fumadocs opens the folder that holds the current page. */
function groups(entries: { group: string; page: Page }[]): PageTree.Node[] {
  const byGroup = new Map<string, Page[]>();
  for (const entry of entries) {
    byGroup.set(entry.group, [...(byGroup.get(entry.group) ?? []), entry.page]);
  }
  return Array.from(byGroup, ([name, pages]): PageTree.Folder => ({
    type: 'folder',
    name,
    icon: iconFor(name),
    children: pages.map(item => page(item)),
  }));
}

/* The sidebar label is the short sidebarTitle when the article has one, otherwise its title. */
const sidebarName = (article: { title: string; sidebarTitle?: string }) => article.sidebarTitle ?? article.title;

function collections(
  list: HelpCollection[],
  articles: typeof helpDocsArticles,
  href: (article: (typeof helpDocsArticles)[number]) => string,
): PageTree.Node[] {
  return groups(list.flatMap(collection => articlesForCollection(collection, articles).map(article => ({
    group: collection.title.replace(/^Citadel:\s*/, ''),
    page: { name: sidebarName(article), url: href(article) },
  }))));
}

function root(name: string, description: string, overview: Page, children: PageTree.Node[]): PageTree.Folder {
  return { type: 'folder', name, description, root: true, children: [page(overview, 'notebook'), ...children] };
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
        ...blogArticles.map(article => ({ group: article.category, page: { name: sidebarName(article), url: articlePath(article) } })),
      ])),
      root(t.tabs.faq, faq.topicsLabel, { name: faq.title, url: faqUrl }, faqCategories.map(category => ({
        ...page({ name: category, url: `${faqUrl}#${faqCategoryId(category)}` }),
        icon: iconFor(category),
      }))),
    ],
  };
}
