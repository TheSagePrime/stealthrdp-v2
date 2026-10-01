import type { ReactElement, ReactNode } from 'react';
import type { ArticlePublication, ArticleSource } from '@/libs/seo/articles';
import { describe, expect, it } from 'vitest';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { defaultSeoConfig } from '@/config/seo';
import { ArticleCitation, ArticleIndex, ArticlePublicationMeta, ArticleSources } from './Article';

type TestProps = { children?: ReactNode; [key: string]: unknown };
type TestElement = ReactElement<TestProps>;

const articles: ArticlePublication[] = [
  {
    slug: 'older',
    status: 'published',
    title: 'Older article',
    h1: 'Older article',
    description: 'Older article description.',
    datePublished: '2025-01-01',
    author: { name: 'Editorial team' },
  },
  {
    slug: 'newer',
    status: 'published',
    title: 'Newer article',
    h1: 'Newer article',
    description: 'Newer article description.',
    datePublished: '2026-01-01',
    author: { name: 'Editorial team' },
  },
];
const newer = articles[1]!;

const config = {
  ...defaultSeoConfig,
  projectName: 'Example',
  articles: { ...defaultSeoConfig.articles, publications: articles },
};

function asElement(value: unknown): TestElement {
  return value as TestElement;
}

function elementChildren(element: TestElement): TestElement[] {
  const children = element.props.children;
  return (Array.isArray(children) ? children : [children])
    .filter((child): child is TestElement => Boolean(child) && typeof child === 'object')
    .map(asElement);
}

/**
 * Reads the vendored UI slots of one index card.
 * Structure: ol > li > Card > CardHeader [Badge + time, CardTitle > a > h3, CardDescription]
 *                           > CardFooter > a
 */
function cardSlots(card: TestElement) {
  const container = elementChildren(card)[0]!;

  expect(container.type).toBe(Card);

  const [header, footer] = elementChildren(container);

  expect(header!.type).toBe(CardHeader);
  expect(footer!.type).toBe(CardFooter);

  const headerChildren = elementChildren(header!);
  const meta = elementChildren(headerChildren[0]!);
  const title = headerChildren.find(child => child.type === CardTitle)!;
  const link = elementChildren(title)[0]!;

  return {
    order: meta[0]!.props.children,
    dateTime: meta[1]!.props.dateTime,
    heading: elementChildren(link)[0]!.props.children,
    href: link.props.href,
    description: headerChildren.find(child => child.type === CardDescription)!.props.children,
    cta: elementChildren(footer!)[0]!.props.children,
  };
}

describe('article components', () => {
  it('renders the native disclosure contract with clickable source titles', () => {
    const sources: ArticleSource[] = [
      { title: 'First source', url: 'https://source.example/one' },
      { title: 'Second source', url: 'https://source.example/two' },
    ];
    const disclosure = asElement(ArticleSources({ sources }));
    const children = elementChildren(disclosure);
    const list = children[1]!;
    const sourceItems = elementChildren(list);

    expect(disclosure.type).toBe('details');
    expect(disclosure.props.open).toBeUndefined();
    expect(children[0]!.type).toBe('summary');
    expect(children[0]!.props.children).toBe('Sources & references');
    expect(sourceItems).toHaveLength(2);
    expect(sourceItems[0]!.props.id).toBe('source-1');
    expect(elementChildren(sourceItems[0]!)[0]!.props.children).toBe('First source');
    expect(elementChildren(sourceItems[0]!)[0]!.props.href).toBe('https://source.example/one');
  });

  it('renders citation markers as source anchors', () => {
    const citation = asElement(ArticleCitation({ source: 2 }));

    expect(citation.type).toBe('a');
    expect(citation.props.href).toBe('#source-2');
    expect(citation.props.children).toEqual(['[', 2, ']']);
  });

  it('uses the publication record for visible date output', () => {
    const meta = asElement(ArticlePublicationMeta({ article: newer }));
    const time = elementChildren(meta)[1]!;

    expect(time.type).toBe('time');
    expect(time.props.dateTime).toBe('2026-01-01');
    expect(time.props.children).toBe('January 1, 2026');
  });

  it('sorts ArticleIndex cards newest first', () => {
    const index = asElement(ArticleIndex({ articles, config }));
    const list = elementChildren(index)[1]!;
    const cards = elementChildren(list).map(cardSlots);

    expect(cards).toHaveLength(2);
    expect(cards[0]!.heading).toBe('Newer article');
    expect(cards[1]!.heading).toBe('Older article');
    expect(cards.map(card => card.order)).toEqual(['01', '02']);
    expect(cards[0]!.dateTime).toBe('2026-01-01');
    expect(cards[1]!.dateTime).toBe('2025-01-01');
    expect(cards[0]!.description).toBe('Newer article description.');
    expect(String(cards[0]!.href)).toContain('/blog/newer');
    expect(String(cards[1]!.href)).toContain('/blog/older');
    expect(cards[0]!.cta).toBe('Read article →');
  });
});
