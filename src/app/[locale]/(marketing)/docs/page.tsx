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
import { createPageMetadata } from '@/libs/seo/metadata';
import { docPublicSlug, docsArticles } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/docs',
  title: 'Documentation — StealthRDP',
  description: 'Read verified StealthRDP guides for Windows, Linux, networking, panels, server management, and account questions. Browse the documentation collections.',
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
                    <h2>{category}</h2>
                    <div>
                      <Badge variant="outline">{articles.length} guides</Badge>
                    </div>
                  </div>

                  <div className="sr-doc-grid">
                    {articles.map((article) => {
                      const href = `/docs/${docPublicSlug(article)}`;

                      return (
                        <Card key={article.slug}>
                          <CardHeader>
                            <Badge variant="outline" className="w-fit text-body-muted">
                              {article.category}
                            </Badge>
                            <CardTitle className="text-heading-4 text-body-text">
                              <Link
                                href={href}
                                className="inline-flex min-h-11 items-center transition-colors hover:text-primary"
                              >
                                <h3>{article.title}</h3>
                              </Link>
                            </CardTitle>
                            <CardDescription className="text-small text-body-muted">
                              {article.summary}
                            </CardDescription>
                          </CardHeader>

                          <CardFooter className="mt-auto">
                            <Link
                              href={href}
                              className="
                                inline-flex min-h-11 items-center gap-2 text-small
                                font-semibold text-primary transition-colors
                                hover:text-accent-hover
                              "
                            >
                              Read guide
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
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Still need a hand?</p>
            <h2 className="sr-section-title">Take the question to support.</h2>
          </div>
          <div className="sr-prose-block">
            <p>
              Account, billing, and server-specific requests are handled in the
              client portal. For quick questions, message us on WhatsApp or email —
              support answers around the clock. Common questions are answered on the{' '}
              <Link href="/faq">FAQ page</Link>.
            </p>
            <div className="sr-inline-links">
              <a href="https://dash.stealthrdp.com/submitticket.php">Contact support</a>
              <a href="https://wa.me/447441426993">WhatsApp: +44 7441 426993</a>
              <a href="mailto:support@stealthrdp.com">support@stealthrdp.com</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
