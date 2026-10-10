/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { AboutMap } from '@/components/site/about/AboutMap';
import iconStyles from '@/components/site/IconArtwork.module.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { aboutCopy } from '@/content/i18n/about';
import { homeCrumb } from '@/content/i18n/home-crumb';
import { testimonials } from '@/lib/stealth/content';
import { localeHref } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { linkLabel } from '@/lib/stealth/link-label';
import { getPlans } from '@/lib/stealth/live-plans';
import { aboutJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/about', {
    en: { ...aboutCopy.en.meta, ogImage },
    de: { ...aboutCopy.de.meta, ogImage },
    es: { ...aboutCopy.es.meta, ogImage },
  });
}

/* Fluent Color icons for the standards in the page copy, in the same order. */
const standardIcons = ['clock-alarm', 'person-key', 'globe', 'database', 'lock-shield', 'data-trending'];

const regions = ['USA', 'EU'] as const;

/* Country flags for the region cards. */
const regionFlags = { USA: '/images/flags/us-circle.svg', EU: '/images/flags/nl-circle.svg' } as const;

/* Three real Trustpilot reviews, each linked to its source. */
const quotes = testimonials.filter(item => item.sourceUrl?.includes('trustpilot.com')).slice(0, 3);

export const revalidate = 900;

export default async function AboutPage() {
  const locale = await requirePageLocale('/about');
  const t = aboutCopy[locale];
  const plans = await getPlans();
  const seo = getSeoConfig();
  const from = (region: 'USA' | 'EU') => {
    const prices = plans.filter(plan => plan.location === region).map(plan => plan.pricing.monthly.amount);
    return prices.length ? t.regions.from(Math.min(...prices)) : null;
  };
  const vpsFrom = Math.min(...plans.map(plan => plan.pricing.monthly.amount));

  return (
    <div className="srv-page srv-page-about">
      <ProductionJsonLd
        data={aboutJsonLd(seo.siteUrl, seo.brand, { ...t.jsonLd, path: localeHref('/about', locale), home: homeCrumb(locale) })}
      />

      <section className="sr-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">{t.hero.kicker}</p>
            <h1 className="sr-title">
              {t.hero.title}
              {' '}
              <span>{t.hero.titleSpan}</span>
            </h1>
            <p className="sr-lede">{t.hero.lede}</p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <Link href={localeHref('/plans', locale)}>
                  {linkLabel(t.hero.compare, '/plans', locale)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={localeHref('/status', locale)}>{linkLabel(t.hero.status, '/status', locale)}</Link>
              </Button>
            </div>
          </div>
          <AboutMap plans={plans} words={t.map} />
        </div>
      </section>

      <section className="sr-section srv-about-proof" aria-label={t.proofLabel}>
        <div className="sr-container">
          <Card className="srv-about-stats-strip">
            <CardContent>
              <dl>
                {t.proof.map(({ value, label }) => (
                  <div key={label}>
                    <dt>{value}</dt>
                    <dd>{label}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">{t.products.kicker}</p>
              <h2>{t.products.title}</h2>
            </div>
            <p>{t.products.text}</p>
          </div>

          <ul className="srv-guide-grid srv-about-products">
            <li>
              <Link
                href={localeHref('/plans', locale)}
                className="srv-guide-card"
              >
                <strong>{t.products.vps.title}</strong>
                <small>
                  {t.products.vps.text(vpsFrom)}
                </small>
                <span>
                  {linkLabel(t.products.vps.link, '/plans', locale)}
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            </li>
            <li>
              <Link
                href={localeHref('/citadel', locale)}
                className="srv-guide-card"
              >
                <strong>{t.products.citadel.title}</strong>
                <small>
                  {t.products.citadel.text}
                </small>
                <span>
                  {linkLabel(t.products.citadel.link, '/citadel', locale)}
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">{t.standards.kicker}</p>
              <h2>{t.standards.title}</h2>
            </div>
            <p>{t.standards.text}</p>
          </div>

          <ul className="srv-why-grid" data-columns="3">
            {t.standards.items.map(({ label, title, text }, index) => {
              const icon = standardIcons[index] ?? 'settings';
              return (
                <li key={title} className="srv-why-card">
                  <span className="srv-why-icon">
                    <Image className={iconStyles.artwork} src={`/images/fluent-color/${icon}.svg`} width={40} height={40} alt="" />
                  </span>
                  <span className="srv-why-label">{label}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">{t.regions.kicker}</p>
              <h2>{t.regions.title}</h2>
            </div>
            <p>{t.regions.text}</p>
          </div>

          <ul className="srv-why-grid" data-columns="2">
            {regions.map((region) => {
              const { city, text } = region === 'USA' ? t.regions.usa : t.regions.eu;
              return (
                <li key={city} className="srv-why-card">
                  <span className="srv-why-icon">
                    <Image className={iconStyles.artwork} src={regionFlags[region]} width={40} height={40} alt="" />
                  </span>
                  <span className="srv-why-label">{t.regions.label(region)}</span>
                  <h3>{city}</h3>
                  <p>{text}</p>
                  {from(region) && <p className="srv-about-price">{from(region)}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {quotes.length > 0 && (
        <section className="sr-section sr-section-border">
          <div className="sr-container srv-section-stack">
            <div className="srv-section-head">
              <div>
                <p className="srv-kicker">{t.reviews.kicker}</p>
                <h2>{t.reviews.title}</h2>
              </div>
              <p>{t.reviews.text}</p>
            </div>

            <ul className="srv-about-reviews">
              {quotes.map(item => (
                <li key={item.sourceUrl}>
                  <figure>
                    <blockquote lang={locale === 'en' ? undefined : 'en'}>{`“${item.quote}”`}</blockquote>
                    <figcaption>
                      <span>{`${item.authorName}${item.publishedOn ? ` · ${item.publishedOn}` : ''}`}</span>
                      <a href={item.sourceUrl} rel="noopener noreferrer" target="_blank">{t.reviews.viewOn}</a>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="sr-section">
        <div className="sr-container sr-cta sr-cta-premium srv-site-final">
          <div>
            <p className="sr-kicker">{t.final.kicker}</p>
            <h2>{t.final.title}</h2>
            <p>{t.final.text}</p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                {t.final.talk}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://wa.me/447441426993">{t.final.whatsapp}</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
