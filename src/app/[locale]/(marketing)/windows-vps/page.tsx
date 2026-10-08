/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { OsFaq, OsJourney, OsRegions, OsResources, OsSupport, WindowsVersions } from '@/components/site/os/OsSections';
import { OsSession } from '@/components/site/os/OsSession';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { homeCrumb } from '@/content/i18n/home-crumb';
import { windowsVpsCopy } from '@/content/i18n/windows-vps';
import { localeHref } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { getPlans } from '@/lib/stealth/live-plans';
import { osPageJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';

/* The words of this page are in src/content/i18n/<language>/windows-vps.tsx. */

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/windows-vps', {
    en: { ...windowsVpsCopy.en.meta, ogImage: 'https://www.stealthrdp.com/assets/og-cover.png' },
    de: { ...windowsVpsCopy.de.meta, ogImage: 'https://www.stealthrdp.com/assets/og-cover.png' },
    es: { ...windowsVpsCopy.es.meta, ogImage: 'https://www.stealthrdp.com/assets/og-cover.png' },
  });
}

const windowsVersions = ['2019', '2022', '2025'];

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 15 minutes. */
export const revalidate = 900;

export default async function WindowsVpsPage() {
  const locale = await requirePageLocale('/windows-vps');
  const t = windowsVpsCopy[locale];
  const plans = await getPlans();

  return (
    <div className="srv-page srv-page-os srv-page-windows">
      <ProductionJsonLd
        data={osPageJsonLd({
          siteUrl: getSeoConfig().siteUrl,
          path: localeHref('/windows-vps', locale),
          name: t.jsonLd.name,
          description: t.jsonLd.description,
          plans,
          questions: t.questions,
          home: homeCrumb(locale),
        })}
      />
      <section className="sr-page-hero sr-os-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">{t.kicker}</p>
            <h1 className="sr-title">
              {t.title[0]}
              {' '}
              <span>{t.title[1]}</span>
            </h1>
            <p className="sr-lede">
              {t.lede}
            </p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <Link href="#windows-plans">
                  {t.compareButton}
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"><Link href="#windows-versions">{t.versionsButton}</Link></Button>
            </div>
          </div>
          <OsSession kind="windows" locale={locale} />
        </div>
      </section>

      <section className="sr-section srv-os-pricing-section" id="windows-plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">{t.pricing.kicker}</p>
              <h2 className="sr-section-title">{t.pricing.title}</h2>
            </div>
          </div>
          <PricingExplorer plans={plans} locale={locale} />
        </div>
      </section>

      <OsJourney kind="windows" locale={locale} />

      <WindowsVersions versions={windowsVersions} locale={locale} />

      <OsResources plans={plans} kind="windows" locale={locale}>
        {t.resources}
      </OsResources>

      <OsRegions plans={plans} kind="windows" locale={locale} />

      <OsSupport kind="windows" locale={locale} />

      <OsFaq
        kind="windows"
        title={t.faqTitle}
        questions={t.questions}
        other={t.other}
        locale={locale}
      />

      <section className="sr-section">
        <div className="
          sr-container sr-cta sr-cta-premium srv-site-final srv-os-final
        "
        >
          <div>
            <p className="sr-kicker">{t.cta.kicker}</p>
            <h2>{t.cta.title}</h2>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <Link href={t.cta.compareHref}>
                {t.cta.compare}
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"><a href={t.cta.checkoutHref}>{t.cta.checkout}</a></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
