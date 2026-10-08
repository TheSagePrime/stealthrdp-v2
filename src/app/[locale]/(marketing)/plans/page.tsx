/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { OsFaq } from '@/components/site/os/OsSections';
import { OsSession } from '@/components/site/os/OsSession';
import extras from '@/components/site/plans/PlansExtras.module.css';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { plansCopy } from '@/content/i18n/plans';
import { pricingCopy } from '@/content/i18n/pricing';
import { localeHref } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { getPlans } from '@/lib/stealth/live-plans';
import { plansJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';

/* The words of this page are in src/content/i18n/<language>/plans.tsx. */

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/plans', {
    en: { ...plansCopy.en.meta, ogImage },
    de: { ...plansCopy.de.meta, ogImage },
    es: { ...plansCopy.es.meta, ogImage },
  });
}

/* Token utilities for the card link rows, replacing the bespoke .sr-inline-links hook. */
const cardLinkClass = 'inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover';

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 15 minutes. */
export const revalidate = 900;

export default async function PlansPage() {
  const locale = await requirePageLocale('/plans');
  const t = plansCopy[locale];
  const plans = await getPlans();
  const lowest = Math.min(...plans.map(plan => plan.pricing.monthly.amount));
  const inStock = plans.reduce((sum, plan) => sum + (plan.source.stock ?? 0), 0);

  return (
    <div className="srv-page srv-page-plans">
      <ProductionJsonLd data={plansJsonLd(getSeoConfig().siteUrl, plans, t.jsonLd)} />
      <section className="sr-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">{t.kicker}</p>
            <h1 className="sr-title">{t.title}</h1>
            <p className="sr-lede">
              {t.lede}
            </p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <a href="#plan-grid">
                  {t.compareButton}
                  <ArrowRight size={16} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps">
                  {t.buildButton}
                </a>
              </Button>
            </div>
            <div className="srv-citadel-v2-facts">
              <span>
                <strong>{plans.length}</strong>
                {' '}
                {t.facts.plans}
              </span>
              <span>
                <strong>{t.facts.start(lowest)}</strong>
                {' '}
                {t.facts.startText}
              </span>
              <span>
                <strong>{inStock}</strong>
                {' '}
                {t.facts.stock}
              </span>
            </div>
          </div>
          <OsSession kind="plans" locale={locale} />
        </div>
      </section>

      <section className="sr-section" id="plan-grid">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">{t.grid.kicker}</p>
              <h2 className="sr-section-title">{t.grid.title}</h2>
            </div>
          </div>
          <PricingExplorer plans={plans} showComparison locale={locale} />
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">{t.os.kicker}</p>
              <h2 className="sr-section-title">{t.os.title}</h2>
            </div>
          </div>

          <div className="
            srv-plan-os-flow grid gap-4
            lg:grid-cols-2
          "
          >
            <Card
              id="windows-vps"
              className="srv-plan-os-option srv-plan-os-windows"
            >
              <CardHeader>
                <span className="srv-plan-os-mark" aria-hidden="true">
                  <Image src="/brand/windows.png" alt="" width={34} height={34} />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">{t.os.windows.badge}</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>{t.os.windows.title}</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  {t.os.windows.text}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="
                  rounded-md border-l-2 border-primary bg-surface-2 px-4 py-3
                  text-small text-body-muted
                "
                >
                  {t.os.windows.licensing}
                </p>
              </CardContent>
              <CardFooter className="mt-auto flex-wrap gap-x-6 gap-y-2">
                <Link href={localeHref('/windows-vps', locale)} className={cardLinkClass}>
                  {t.os.windows.guide}
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link href={`${localeHref('/plans', locale)}#plan-grid`} className={cardLinkClass}>
                  {t.os.windows.compare}
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>

            <Card
              id="linux-vps"
              className="srv-plan-os-option srv-plan-os-linux"
            >
              <CardHeader>
                <span className="srv-plan-os-mark srv-plan-os-mark-linux" aria-hidden="true">
                  <Image src="/brand/linux.svg" alt="" width={34} height={40} />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">{t.os.linux.badge}</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>{t.os.linux.title}</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  {t.os.linux.text}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex-wrap gap-x-6 gap-y-2">
                <Link href={localeHref('/linux-vps', locale)} className={cardLinkClass}>
                  {t.os.linux.guide}
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <Link href={`${localeHref('/plans', locale)}#plan-grid`} className={cardLinkClass}>
                  {t.os.linux.compare}
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">{t.included.kicker}</p>
              <h2 className="sr-section-title">{t.included.title}</h2>
            </div>
            <p>{t.included.text}</p>
          </div>
          <div className="
            srv-plan-included grid gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
          >
            {t.included.items.map(({ title, text }) => (
              <Card key={title} className="srv-plan-included-item">
                <CardHeader>
                  <CardTitle className="text-heading-4 text-body-text">
                    <h3>{title}</h3>
                  </CardTitle>
                  <CardDescription className="text-small text-body-muted">
                    {text}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <OsFaq
        kind="plans"
        title={t.faqTitle}
        questions={t.questions(pricingCopy[locale].money(lowest))}
        other={{ ...t.other, href: localeHref(t.other.href, locale) }}
        locale={locale}
      />

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-byo-panel srv-site-final">
          <div>
            <p className="sr-kicker">{t.build.kicker}</p>
            <h2>{t.build.title}</h2>
            <p>{t.build.text}</p>
          </div>
          <ul className={extras.configurator} aria-hidden="true">
            {([50, 70, 40, 100] as const).map((fill, index) => [t.build.labels[index], fill] as const).map(([label, fill]) => (
              <li key={label}>
                <span>{label}</span>
                <i className={extras.track}>
                  <b style={{ width: `${fill}%` }} />
                </i>
              </li>
            ))}
          </ul>
          <Button asChild size="lg">
            <a href="https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps">
              {t.build.button}
              <ArrowRight size={16} />
            </a>
          </Button>
        </div>
      </section>

    </div>
  );
}
