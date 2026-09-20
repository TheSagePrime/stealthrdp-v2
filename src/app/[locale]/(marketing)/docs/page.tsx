import type { Metadata } from 'next';
import { ArrowRight, BookOpen, FileText } from 'lucide-react';
import Link from 'next/link';
import { createPageMetadata } from '@/libs/seo/metadata';
import { docPublicSlug, docsArticles } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Documentation — StealthRDP',
  description: 'Read verified StealthRDP guides for Windows, Linux, networking, panels, server management, and account questions. Search the native documentation index.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

export default function DocsPage() {
  const categories = Array.from(new Set(docsArticles.map(article => article.category)));

  return (
    <>
      <section className="sr-page-hero">
        <div className="sr-container sr-page-hero-inner">
          <div>
            <p className="sr-kicker">Documentation</p>
            <h1 className="sr-title">Find the task. <span>Fix the server.</span></h1>
            <p className="sr-lede">
              The verified StealthRDP documentation snapshot, organized into focused
              collections while preserving every migrated guide.
            </p>
          </div>
          <div className="sr-page-hero-aside">
            <BookOpen />
            <strong>{docsArticles.length} documentation pages</strong>
            <span>{categories.length} collections</span>
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-library-layout">
          <aside className="sr-library-nav" aria-label="Documentation categories">
            <span className="sr-control-label">Collections</span>
            {categories.map(category => (
              <a key={category} href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                {category}
              </a>
            ))}
          </aside>

          <div className="sr-library-groups">
            {categories.map((category) => {
              const articles = docsArticles.filter(article => article.category === category);
              const id = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

              return (
                <section className="sr-library-group" id={id} key={category}>
                  <div className="sr-collection-head">
                    <div>
                      <p className="sr-kicker">{category}</p>
                      <h2>{category}</h2>
                    </div>
                    <span>{articles.length} guides</span>
                  </div>

                  <div className="sr-doc-grid">
                    {articles.map(article => (
                      <article className="sr-content-card" key={article.slug}>
                        <Link href={`/docs/${docPublicSlug(article)}`}>
                          <div className="sr-content-card-icon"><FileText /></div>
                          <small>{article.category}</small>
                          <h3>{article.title}</h3>
                          <p>{article.summary}</p>
                          <span className="sr-content-card-link">
                            Read guide
                            <ArrowRight />
                          </span>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
