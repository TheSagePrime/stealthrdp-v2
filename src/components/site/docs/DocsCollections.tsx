/* eslint-disable react-refresh/only-export-components */
import type { TOCItemType } from 'fumadocs-core/toc';
import type { DocsLink } from '@/components/site/docs/DocsParts';
import type { HelpCollection } from '@/lib/stealth/help-center';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { articlesForCollection, helpCollectionId } from '@/lib/stealth/help-center';

/* The index pages of the docs shell (Help Center, Citadel docs, guides): one section per group,
   each page as a Fumadocs card, and the groups in the table of contents. */

export type CardSection = { id: string; title: string; description?: string; items: DocsLink[] };

export function cardSectionsToc(sections: CardSection[]): TOCItemType[] {
  return sections.map(section => ({ title: section.title, url: `#${section.id}`, depth: 2 }));
}

export function DocsCardSections({ sections }: { sections: CardSection[] }) {
  return sections.map(section => (
    <section key={section.id} aria-labelledby={section.id}>
      <h2 id={section.id}>{section.title}</h2>
      {section.description ? <p>{section.description}</p> : null}
      <Cards>
        {section.items.map(item => (
          <Card key={item.href} href={item.href} title={item.title} description={item.description} />
        ))}
      </Cards>
    </section>
  ));
}

type Article = Parameters<typeof articlesForCollection>[1][number];

/* Help Center and Citadel collections as card sections. */
export function collectionSections(
  collections: HelpCollection[],
  articles: Article[],
  href: (article: Article) => string,
): CardSection[] {
  return collections
    .map(collection => ({
      id: helpCollectionId(collection.title),
      title: collection.title.replace(/^Citadel:\s*/, ''),
      description: collection.description,
      items: articlesForCollection(collection, articles).map(article => ({
        href: href(article),
        title: article.title,
        description: article.summary,
      })),
    }))
    .filter(section => section.items.length > 0);
}
