/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { privacyCopy } from '@/content/i18n/privacy';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/privacy', {
    en: { ...privacyCopy.en.meta, ogImage },
    de: { ...privacyCopy.de.meta, ogImage },
    es: { ...privacyCopy.es.meta, ogImage },
  });
}

export default async function PrivacyPage() {
  const locale = await requirePageLocale('/privacy');
  const t = privacyCopy[locale];
  return (
    <div className="srv-page srv-page-legal sr-legal">
      <div className="sr-container sr-legal-grid">
        <nav className="sr-legal-toc" aria-label={t.tocLabel}>
          <p>{t.tocLabel}</p>
          <ol>
            {t.sections.map(({ id, title }) => (
              <li key={id}><a href={`#${id}`}>{title}</a></li>
            ))}
          </ol>
        </nav>

        <article className="sr-legal-article">
          <header className="sr-legal-header">
            <p className="sr-kicker">{t.kicker}</p>
            <h1>{t.title}</h1>
            <p className="sr-article-meta">{t.updated}</p>
            {t.binding && <p className="sr-article-meta">{t.binding}</p>}
          </header>

          <aside className="sr-legal-summary" aria-label={t.keyPointsLabel}>
            <p>{t.keyPointsLabel}</p>
            <ul>
              {t.keyPoints.map(point => <li key={point}>{point}</li>)}
            </ul>
          </aside>

          <div className="sr-richtext sr-legal-body">
            {t.sections.map(({ id, title, body }, index) => (
              <section key={id} id={id} aria-labelledby={`${id}-title`}>
                <h2 id={`${id}-title`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  {title}
                </h2>
                {body}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
