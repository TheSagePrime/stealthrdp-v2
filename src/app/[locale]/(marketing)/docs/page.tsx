import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { createPageMetadata } from '@/libs/seo/metadata';
import { docPublicSlug, docsArticles } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Documentation — StealthRDP',
  description: 'Read verified StealthRDP guides for Windows, Linux, networking, panels, server management, and account questions. Browse the documentation collections.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function DocsPageRoute() {
  const categories = Array.from(new Set(docsArticles.map(article => article.category)));

  return (
    <DocsPage>
      <DocsTitle>StealthRDP documentation</DocsTitle>
      <DocsDescription>Clear, verified answers for setting up, connecting to, and managing your server.</DocsDescription>
      <DocsBody>
        <div className="sr-docs-overview">
          {categories.map(category => {
            const articles = docsArticles.filter(article => article.category === category);
            return (
              <section className="sr-docs-collection" key={category}>
                <div className="sr-docs-collection-heading">
                  <h2>{category}</h2>
                  <span>{articles.length} {articles.length === 1 ? 'guide' : 'guides'}</span>
                </div>
                <ul>
                  {articles.map(article => (
                    <li key={article.slug}>
                      <Link href={`/docs/${docPublicSlug(article)}`}>
                        <span>{article.title}</span>
                        <small>{article.summary}</small>
                        <ArrowRight aria-hidden="true" size={16} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </DocsBody>
    </DocsPage>
  );
}
