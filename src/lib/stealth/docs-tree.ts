import type * as PageTree from 'fumadocs-core/page-tree';
import type { FluentIconName } from '@/components/site/docs/DocsIcon';
import type { SiteLocale } from '@/config/i18n';
import type { HelpCollection } from '@/lib/stealth/help-center';
import { createElement } from 'react';
import { FluentIcon, WindowsMark } from '@/components/site/docs/DocsIcon';
import { faqPageCopy } from '@/content/i18n/faq';
import { groupCopy, resourcePagesCopy, resourcesCopy } from '@/content/i18n/resources';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { articlePath, blogArticles, citadelDocsArticles, helpDocsArticles } from '@/lib/stealth/articles';
import {
  articlesForCollection,
  citadelArticleHref,
  citadelCollections,
  helpArticleHref,
  helpCollections,
} from '@/lib/stealth/help-center';
import { localeHref } from '@/lib/stealth/i18n';
import { translatedDocs, translatedGuides } from '@/lib/stealth/translations';

/* The sidebar of every resource page: Help Center, Citadel docs, guides and common questions.
   Each is a root folder, so Fumadocs shows them as tabs in the sidebar switcher and each keeps
   its own page list. Help Center and Citadel groups follow the curated collections in
   help-center.ts; guides are grouped by category; common questions is a single link to /faq.

   Every folder carries a stable `$id`. Fumadocs matches a switcher tab to its root folder by
   `$id` (see collectTabs in fumadocs-ui/contexts/tree): without one, every root folder has
   `undefined` as its id and matches the first tab, so the switcher repeats the first section's
   name, description and icon. Ids must be unique across all page trees, so they start with the
   locale, as Fumadocs does for its own generated ids.

   German and Spanish: a section with published translations lists only those, under translated
   group names, and links within the language. A section with none keeps the English pages. */

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

/* One collapsible folder per group. Fumadocs opens the folder that holds the current page.
   `scope` is the id of the root folder the groups belong to. `label` names a group in the page's
   language; the id and the icon keep the English group name. */
function groups(scope: string, entries: { group: string; page: Page }[], label: (group: string) => string = group => group): PageTree.Node[] {
  const byGroup = new Map<string, Page[]>();
  for (const entry of entries) {
    byGroup.set(entry.group, [...(byGroup.get(entry.group) ?? []), entry.page]);
  }
  return Array.from(byGroup, ([name, pages]): PageTree.Folder => ({
    $id: `${scope}/${name}`,
    type: 'folder',
    name: label(name),
    icon: iconFor(name),
    children: pages.map(item => page(item)),
  }));
}

/* The sidebar label is the short sidebarTitle when the article has one, otherwise its title. */
const sidebarName = (article: { title: string; sidebarTitle?: string }) => article.sidebarTitle ?? article.title;

function collections(
  scope: string,
  list: HelpCollection[],
  articles: typeof helpDocsArticles,
  href: (article: (typeof helpDocsArticles)[number]) => string,
  label?: (group: string) => string,
): PageTree.Node[] {
  return groups(scope, list.flatMap(collection => articlesForCollection(collection, articles).map(article => ({
    group: label ? collection.title : collection.title.replace(/^Citadel:\s*/, ''),
    page: { name: sidebarName(article), url: href(article) },
  }))), label);
}

function root(
  $id: string,
  name: string,
  description: string,
  overview: Page,
  children: PageTree.Node[],
): PageTree.Folder {
  return { $id, type: 'folder', name, description, root: true, children: [page(overview, 'notebook'), ...children] };
}

export function docsTree(locale: SiteLocale = 'en'): PageTree.Root {
  const t = resourcesCopy[locale];
  const faq = faqPageCopy[locale];
  const faqUrl = localeHref('/faq', locale);
  const rootId = (key: string) => `${locale}:docs:${key}`;

  const english = {
    help: () => root(rootId('help'), t.tabs.help, 'StealthRDP servers', { name: 'Overview', url: '/docs' }, collections(rootId('help'), helpCollections, helpDocsArticles, helpArticleHref)),
    citadel: () => root(rootId('citadel'), t.tabs.citadel, 'Layer 7 DDoS protection', { name: 'Overview', url: '/citadel/docs' }, collections(rootId('citadel'), citadelCollections, citadelDocsArticles, citadelArticleHref)),
    guides: () => root(rootId('guides'), t.tabs.guides, 'VPS use cases and operations', { name: 'All articles', url: '/blog' }, groups(rootId('guides'), [
      { group: 'Remote Desktop', page: { name: rdpVpsGuide.h1, url: '/rdp-vps' } },
      ...blogArticles.map(article => ({ group: article.category, page: { name: sidebarName(article), url: articlePath(article) } })),
    ])),
  };
  const faqRoot = root(rootId('faq'), t.tabs.faq, faq.topicsLabel, { name: faq.title, url: faqUrl }, []);
  if (locale === 'en') {
    return { $id: `${locale}:docs`, name: t.tabs.resources, children: [english.help(), english.citadel(), english.guides(), faqRoot] };
  }

  const copy = resourcePagesCopy[locale];
  const label = (group: string) => groupCopy(locale, group).title;
  const translatedRoot = (section: 'help' | 'citadel') => {
    const docs = translatedDocs(locale, section);
    if (docs.length === 0) {
      return english[section]();
    }
    const list = section === 'help' ? helpCollections : citadelCollections;
    return root(rootId(section), t.tabs[section], copy.treeDescriptions[section], { name: copy.overview, url: localeHref(section === 'help' ? '/docs' : '/citadel/docs', locale) }, collections(rootId(section), list, docs, doc => (doc as (typeof docs)[number]).path, label));
  };
  const guides = translatedGuides(locale);
  const guidesRoot = guides.length === 0
    ? english.guides()
    : root(rootId('guides'), t.tabs.guides, copy.treeDescriptions.guides, { name: copy.allArticles, url: localeHref('/blog', locale) }, groups(
        rootId('guides'),
        guides.map(guide => ({ group: guide.category, page: { name: sidebarName(guide), url: guide.path } })),
        label,
      ));

  return {
    $id: `${locale}:docs`,
    name: t.tabs.resources,
    children: [translatedRoot('help'), translatedRoot('citadel'), guidesRoot, faqRoot],
  };
}
