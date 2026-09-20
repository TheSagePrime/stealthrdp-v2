import type { Metadata } from 'next';
import Link from 'next/link';
import { createPageMetadata } from '@/libs/seo/metadata';
import { docPublicSlug, docsArticles } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'StealthRDP Documentation',
  description: 'StealthRDP documentation for Windows, Linux, server management, VPNs, web panels, account questions, and service policies.',
});

export default function DocsPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">Documentation</p><h1 className="sr-title">Find the task. <span>Fix the server.</span></h1><p className="sr-lede">The verified StealthRDP documentation snapshot is migrated into V2 as native public pages.</p></div></section>
      <section className="sr-section"><div className="sr-container sr-card-grid">
        {docsArticles.map(article => (
          <article className="sr-content-card" key={article.slug}>
            <Link href={`/docs/${docPublicSlug(article)}`}>
              <small>{article.category}</small>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
            </Link>
          </article>
        ))}
      </div></section>
    </>
  );
}