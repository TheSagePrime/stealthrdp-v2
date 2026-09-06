/* eslint-disable better-tailwindcss/no-unknown-classes, next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';

const modules = [
  {
    name: 'Identity',
    detail: 'Clerk identity, secure sessions, and organization boundaries.',
    route: '/sign-in',
  },
  {
    name: 'Data',
    detail: 'Drizzle models, PostgreSQL migrations, and typed queries.',
    route: '/api/health',
  },
  {
    name: 'Revenue',
    detail: 'Polar checkout, customer portal, and entitlement boundaries.',
    route: '/api/health',
  },
];

type IndexProps = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = createPageMetadata({
  path: '/',
  title: 'Sage Prime Product Foundation',
  description: 'An internal foundation for Sage Prime products.',
});

export default async function HomePage(props: IndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const jsonLd = buildPageJsonLd(getSeoConfig());
  return (
    <main className="foundation-shell">
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SP</span>
          <span>
            <strong>Sage Prime</strong>
            <small>Product foundation</small>
          </span>
        </div>
        <Link className="health-link" href="/api/health">
          Runtime health
          {' '}
          <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="intro-grid" aria-labelledby="page-title">
        <div className="hero">
          <p className="eyebrow">Internal product foundation</p>
          <h1 id="page-title">
            Make the next product feel like it belongs to us.
          </h1>
          <p className="lede">
            A small, tested base for products that need clear identity, durable
            data, billing, and a safe path to production.
          </p>
          <div className="actions">
            <a className="button primary" href="/sign-in">
              Inspect auth boundary
              {' '}
              <span aria-hidden="true">→</span>
            </a>
            <Link className="button secondary" href="/api/health">
              Check runtime
            </Link>
          </div>
        </div>

        <aside className="manifest" aria-labelledby="manifest-title">
          <div className="manifest-head">
            <span id="manifest-title">Foundation manifest</span>
            <span>v0.1.0</span>
          </div>
          <ol className="module-list">
            {modules.map((module, index) => (
              <li key={module.name}>
                <span className="module-index">
                  0
                  {index + 1}
                </span>
                <span className="module-copy">
                  <strong>{module.name}</strong>
                  <span>{module.detail}</span>
                </span>
                <a aria-label={`Open ${module.name} check`} href={module.route}>
                  ↗
                </a>
              </li>
            ))}
          </ol>
          <div className="manifest-foot">
            <span className="status-dot" aria-hidden="true" />
            Ready for a product-specific surface
          </div>
        </aside>
      </section>

      <section className="principles" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">The working rule</p>
          <h2 id="principles-title">Start from the product, not a template.</h2>
        </div>
        <div className="principle-list">
          <article>
            <span>01</span>
            <h3>Keep the boundary clear.</h3>
            <p>
              Authentication, product identity, and application data stay
              separate.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Build the smallest useful surface.</h3>
            <p>
              Every new product replaces this screen with its own language and
              workflow.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Prove the runtime path.</h3>
            <p>
              Health, tests, migrations, and deployment checks remain part of
              the foundation.
            </p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <span>Sage Prime · Internal use</span>
        <span>First-party foundation code with documented dependencies</span>
      </footer>
    </main>
  );
}
