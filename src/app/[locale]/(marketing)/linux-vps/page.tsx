/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { LinuxDistros, OsFaq, OsJourney, OsRegions, OsResources, OsSupport } from '@/components/site/os/OsSections';
import { OsSession } from '@/components/site/os/OsSession';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { homeCrumb } from '@/content/i18n/home-crumb';
import { linuxVpsCopy } from '@/content/i18n/linux-vps';
import { pricingCopy } from '@/content/i18n/pricing';
import { localeHref } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { getPlans } from '@/lib/stealth/live-plans';
import { osPageJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';

/* The words of this page are in src/content/i18n/<language>/linux-vps.tsx. */

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/linux-vps', {
    en: { ...linuxVpsCopy.en.meta, ogImage },
    de: { ...linuxVpsCopy.de.meta, ogImage },
    es: { ...linuxVpsCopy.es.meta, ogImage },
  });
}

const distros = [
  { name: 'Ubuntu', versions: '18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, 26.04 LTS', text: 'Fits many websites, panels, and development stacks.' },
  { name: 'Debian', versions: '10, 11, 12, 13', text: 'Use when the stack asks for Debian.' },
  { name: 'CentOS', versions: '7, Stream 8, Stream 9', text: 'Use when the stack asks for CentOS.' },
  { name: 'AlmaLinux', versions: '8, 9, 10', text: 'Use when the stack asks for AlmaLinux.' },
  { name: 'Rocky Linux', versions: '8, 9, 10', text: 'Use when the stack asks for Rocky Linux.' },
  { name: 'Fedora', versions: '37, 38, 39, 40, 41, 42, 43, 44', text: 'Use when the stack asks for Fedora.' },
  { name: 'Alpine Linux', versions: '3.15, 3.19, 3.23', text: 'Use when the stack asks for Alpine Linux.' },
  { name: 'FreeBSD', versions: '13.2, 13.3, 14.0, 14.1, 14.2, 14.3, 15.0', text: 'Use when the stack asks for FreeBSD.' },
  { name: 'openSUSE', versions: 'Leap 15', text: 'Use when the stack asks for openSUSE Leap 15.' },
  { name: 'CloudLinux', versions: '9', text: 'Use when the stack asks for CloudLinux 9.' },
  { name: 'Arch Linux', versions: 'Latest', text: 'Use when the stack asks for Arch Linux.' },
  { name: 'Oracle Linux', versions: '8, 9', text: 'Use when the stack asks for Oracle Linux.' },
];

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 6 hours. */
export const revalidate = 21600;

export default async function LinuxVpsPage() {
  const locale = await requirePageLocale('/linux-vps');
  const t = linuxVpsCopy[locale];
  const money = pricingCopy[locale].money;
  const plans = await getPlans();
  const bronze = plans.filter(plan => plan.name.startsWith('Bronze '));
  const cheapestPlan = [...plans].sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount)[0];
  const facts = {
    bronze,
    cheapest: { name: cheapestPlan?.name ?? 'Bronze', price: money(cheapestPlan?.pricing.monthly.amount ?? 9.5) },
  };
  const liveQuestions = t.questions(facts);
  const localDistros = distros.map(distro => ({ ...distro, versions: distro.versions.replace('Latest', t.latest) }));

  return (
    <div className="srv-page srv-page-os srv-page-linux">
      <ProductionJsonLd
        data={osPageJsonLd({
          siteUrl: getSeoConfig().siteUrl,
          path: localeHref('/linux-vps', locale),
          name: t.jsonLd.name,
          description: t.jsonLd.description,
          plans,
          questions: liveQuestions,
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
                <Link href="#linux-plans">
                  {t.compareButton}
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"><Link href="#linux-distros">{t.distrosButton}</Link></Button>
            </div>
          </div>
          <OsSession kind="linux" locale={locale} />
        </div>
      </section>

      <section className="sr-section srv-os-pricing-section" id="linux-plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">{t.pricing.kicker}</p>
              <h2 className="sr-section-title">
                {t.pricing.title}
              </h2>
            </div>
          </div>
          <PricingExplorer plans={plans} locale={locale} />
        </div>
      </section>

      <OsJourney kind="linux" locale={locale} />

      <LinuxDistros distros={localDistros} locale={locale} />

      <OsResources plans={plans} kind="linux" locale={locale}>
        {t.resources(facts)}
      </OsResources>

      <OsRegions plans={plans} kind="linux" locale={locale} />

      <OsSupport kind="linux" locale={locale} />

      <OsFaq
        kind="linux"
        title={t.faqTitle}
        questions={liveQuestions}
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
            <p>{t.cta.text}</p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <Link href={t.cta.compareHref}>
                {t.cta.compare}
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"><Link href={t.cta.checkoutHref}>{t.cta.checkout}</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
