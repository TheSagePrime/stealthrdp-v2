import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ResourceNav } from '@/components/site/ResourceNav';
import { ResourceSearch, type ResourceSearchItem } from '@/components/site/ResourceSearch';
import { createPageMetadata } from '@/libs/seo/metadata';
import { docPublicSlug, docsArticles, faqs } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Help Center — StealthRDP',
  description: 'StealthRDP setup, troubleshooting, server management, networking, panels, policies, licensing, and common support guidance.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function DocsPage() {
  const categories = Array.from(new Set(docsArticles.map(article => article.category)));
  const searchItems: ResourceSearchItem[] = [
    ...docsArticles.map(article => ({
      title: article.title,
      href: `/docs/${docPublicSlug(article)}`,
      description: article.summary,
      kind: 'Help' as const,
    })),
    ...faqs.map(item => ({
      title: item.question,
      href: '/faq',
      description: item.answer,
      kind: 'Question' as const,
    })),
  ];

  return (
    <div className="srv-page srv-page-docs srv-knowledge-page">
      <section className="srv-resource-hero">
        <div className="sr-container">
          <p className="sr-kicker">Help Center</p>
          <h1>Find the task. <span>Fix the server.</span></h1>
          <p>
            Setup instructions, troubleshooting, networking, server management,
            panels, policies, and quick answers from one support system.
          </p>
          <ResourceSearch
            items={searchItems}
            placeholder="Search setup, troubleshooting, licensing, billing…"
          />
        </div>
      </section>

      <section className="sr-section srv-resource-body">
        <div className="sr-container srv-knowledge-doc-grid">
          <aside className="srv-help-sidebar">
            <ResourceNav active="help" />
            <div className="srv-help-collections" aria-label="Help Center collections">
              <span className="srv-resource-nav-label">Collections</span>
              {categories.map(category => (
                <a key={category} href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                  {category}
                </a>
              ))}
            </div>
          </aside>

          <main className="sr-library-groups srv-knowledge-main">
            {categories.map((category) => {
              const articles = docsArticles.filter(article => article.category === category);
              const id = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <section className="sr-library-group" id={id} key={category}>
                  <div className="sr-collection-head">
                    <h2>{category}</h2>
                    <Badge variant="outline">{articles.length} guides</Badge>
                  </div>

                  <div className="sr-doc-grid">
                    {articles.map((article) => {
                      const href = `/docs/${docPublicSlug(article)}`;

                      return (
                        <Card key={article.slug} className="srv-doc-entry">
                          <CardHeader>
                            <CardTitle className="text-heading-4 text-body-text">
                              <Link href={href}>
                                <h3>{article.title}</h3>
                              </Link>
                            </CardTitle>
                            <CardDescription className="text-small text-body-muted">
                              {article.summary}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter>
                            <Link href={href}>
                              Read help article
                              <ArrowRight aria-hidden="true" className="size-4" />
                            </Link>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </main>

          <aside className="srv-resource-aside">
            <span className="srv-resource-nav-label">Quick help</span>
            <Link href="/faq">Common questions</Link>
            <Link href="/docs/windows-licensing">Windows licensing</Link>
            <Link href="/docs/use-of-service">Use of service</Link>
            <Link href="/status">Service status</Link>
            <a href="https://dash.stealthrdp.com/submitticket.php">Contact support ↗</a>
          </aside>
        </div>
      </section>
    </div>
  );
}
