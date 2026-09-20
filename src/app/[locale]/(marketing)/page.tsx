/* eslint-disable better-tailwindcss/no-unknown-classes, next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';

const modules = [
  {
    name: 'Content',
    detail: 'Articles, guides, internal links, metadata, sitemap, RSS, and structured data.',
    route: '/rss.xml',
  },
  {
    name: 'Tools',
    detail: 'Public calculators, generators, checkers, converters, and other traffic-driving utilities.',
    route: '/api/health',
  },
  {
    name: 'Data',
    detail: 'Neon PostgreSQL, Drizzle, and PGlite are available when a site or tool needs persistence.',
    route: '/api/ready',
  },
];

type IndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IndexProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  return createPageMetadata({
    path: '/',
    title: t('meta_title'),
    description: t('meta_description'),
    locale,
  });
}

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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SP</span>
          <span>
            <strong>Sage Prime</strong>
            <small>Public web foundation</small>
          </span>
        </div>
        <Link className="health-link" href="/api/health">
          Runtime health <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="intro-grid" aria-labelledby="page-title">
        <div className="hero">
          <p className="eyebrow">Traffic-first public foundation</p>
          <h1 id="page-title">Build useful websites people can discover.</h1>
          <p className="lede">
            A tested base for public content, free tools, organic search growth,
            and optional promotion of commercial products without forcing SaaS
            accounts, tenants, or billing into every site.
          </p>
          <div className="actions">
            <Link className="button primary" href="/rss.xml">
              Inspect content feed <span aria-hidden="true">→</span>
            </Link>
            <Link className="button secondary" href="/api/health">
              Check runtime
            </Link>
          </div>
        </div>

        <aside className="manifest" aria-labelledby="manifest-title">
          <div className="manifest-head">
            <span id="manifest-title">Web foundation manifest</span>
            <span>v0.1.0</span>
          </div>
          <ol className="module-list">
            {modules.map((module, index) => (
              <li key={module.name}>
                <span className="module-index">0{index + 1}</span>
                <span className="module-copy">
                  <strong>{module.name}</strong>
                  <span>{module.detail}</span>
                </span>
                <a aria-label={`Open ${module.name} check`} href={module.route}>↗</a>
              </li>
            ))}
          </ol>
          <div className="manifest-foot">
            <span className="status-dot" aria-hidden="true" />
            Ready for a public site, content library, or free-tool property
          </div>
        </aside>
      </section>

      <section className="principles" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">The working rule</p>
          <h2 id="principles-title">Acquire attention before adding product complexity.</h2>
        </div>
        <div className="principle-list">
          <article>
            <span>01</span>
            <h3>Publish for discovery.</h3>
            <p>Content, metadata, internal linking, crawlability, and structured data are first-class.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Give visitors something useful.</h3>
            <p>Free tools should solve real problems and create repeatable search demand.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Monetization stays optional.</h3>
            <p>Promote a SaaS product, add another business model later, or keep the property purely traffic-focused.</p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <span>Sage Prime · Public web foundation</span>
        <span>SEO, content, tools, data capability, security, and deployment guardrails</span>
      </footer>
    </main>
  );
}
