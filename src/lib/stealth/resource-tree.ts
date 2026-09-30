import { articlePath, blogArticles, citadelDocsArticles, docPublicSlug, helpDocsArticles } from '@/lib/stealth/content';
import { articlesForCollection, citadelArticleHref, citadelCollections } from '@/lib/stealth/help-center';

type Entry = { category: string; title: string; url: string };

function folder(name: string, entries: Entry[]) {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const group = groups.get(entry.category) ?? [];
    group.push(entry);
    groups.set(entry.category, group);
  }

  return {
    type: 'folder' as const,
    name,
    children: Array.from(groups, ([category, pages]) => ({
      type: 'folder' as const,
      name: category,
      children: pages.map(page => ({
        type: 'page' as const,
        name: page.title,
        url: page.url,
      })),
    })),
  };
}

const guides = [
  {
    category: 'Remote Desktop',
    title: 'RDP VPS Hosting: How to Choose a Remote Desktop VPS',
    url: '/rdp-vps',
  },
  ...blogArticles.map(article => ({
    category: article.category,
    title: article.title,
    url: articlePath(article),
  })),
];

const docs = helpDocsArticles.map(article => ({
  category: article.category,
  title: article.title,
  url: `/docs/${docPublicSlug(article)}`,
}));

export const guidePageTree = {
  name: 'VPS Guides',
  children: [
    { type: 'page' as const, name: 'All guides', url: '/blog' },
    folder('Guides', guides),
  ],
};

export const productDocsPageTree = {
  name: 'Help Center',
  children: [
    { type: 'page' as const, name: 'Help Center home', url: '/docs' },
    folder('Product documentation', docs),
  ],
};

export const citadelPageTree = {
  name: 'Citadel Docs',
  children: [
    { type: 'page' as const, name: 'Citadel Docs home', url: '/citadel/docs' },
    ...citadelCollections
      .map(collection => ({
        type: 'folder' as const,
        name: collection.title.replace(/^Citadel:\s*/, ''),
        children: articlesForCollection(collection, citadelDocsArticles).map(article => ({
          type: 'page' as const,
          name: article.title,
          url: citadelArticleHref(article),
        })),
      }))
      .filter(group => group.children.length > 0),
  ],
};
