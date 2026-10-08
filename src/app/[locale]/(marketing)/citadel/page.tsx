/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { CitadelControls } from '@/components/site/citadel/CitadelControls';
import { CitadelGate } from '@/components/site/citadel/CitadelGate';
import { CitadelIncident } from '@/components/site/citadel/CitadelIncident';
import { CitadelIncluded } from '@/components/site/citadel/CitadelIncluded';
import { CitadelPortal } from '@/components/site/citadel/CitadelPortal';
import { CitadelSetup } from '@/components/site/citadel/CitadelSetup';
import { CitadelThreats } from '@/components/site/citadel/CitadelThreats';
import iconStyles from '@/components/site/IconArtwork.module.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { citadelCopy } from '@/content/i18n/citadel';
import { portalDocHref, portalSectionIds } from '@/lib/stealth/citadel-portal';
import { fill, localeHref } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { linkLabel } from '@/lib/stealth/link-label';
import { citadelJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { buildPageJsonLd } from '@/libs/seo/schema';

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/citadel', {
    en: { ...citadelCopy.en.meta, ogImage },
    de: { ...citadelCopy.de.meta, ogImage },
    es: { ...citadelCopy.es.meta, ogImage },
  });
}

/* Plan names, prices (EUR per month) and WHMCS store links. The words are in the page copy. */
const plans = [
  { name: 'Starter', price: 0, checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-starter', featured: false },
  { name: 'Growth', price: 49, checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-business', featured: true },
  { name: 'Scale', price: 149, checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-enterprise', featured: false },
] as const;

export default async function CitadelPage() {
  const locale = await requirePageLocale('/citadel');
  const t = citadelCopy[locale];
  const jsonLd = buildPageJsonLd(getSeoConfig());
  const planCards = plans.map((plan, index) => ({ ...plan, ...t.plans[index]! }));
  const guide = '/citadel/docs/getting-started';
  const portalLinks = portalSectionIds.map((id, index) => ({
    href: localeHref(portalDocHref(id), locale),
    label: linkLabel(fill(t.portal.guide, { name: t.portal.sections[index]?.name ?? '' }), portalDocHref(id), locale),
  }));

  return (
    <div className="srv-page srv-page-citadel srv-citadel-v2">
      <ProductionJsonLd
        data={citadelJsonLd(
          getSeoConfig().siteUrl,
          planCards.map(({ name, price, domains, bandwidth, checkout }) => ({ name, price, domains, bandwidth, checkout })),
          {
            ...t.jsonLd,
            offer: plan => fill(t.jsonLd.offer, { domains: plan.domains, bandwidth: plan.bandwidth }),
            path: localeHref('/citadel', locale),
          },
        )}
      />
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <section className="srv-citadel-v2-hero">
        <div className="sr-container srv-citadel-v2-hero-grid">
          <div className="srv-citadel-v2-copy">
            <Badge variant="outline" className="srv-citadel-v2-eyebrow">
              <Image className={iconStyles.artwork} src="/images/fluent-color/shield-checkmark.svg" width={16} height={16} alt="" />
              {t.hero.badge}
            </Badge>
            <h1>
              {t.hero.title}
              {' '}
              <span>{t.hero.titleSpan}</span>
            </h1>
            <p>{t.hero.text}</p>
            <div className="srv-citadel-v2-actions">
              <Button asChild size="lg">
                <a href="#citadel-plans">
                  {t.hero.choose}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={localeHref(guide, locale)}>{linkLabel(t.hero.guide, guide, locale)}</Link>
              </Button>
            </div>
            <div className="srv-citadel-v2-facts">
              {t.hero.facts.map(([value, label]) => (
                <span key={label}>
                  <strong>{value}</strong>
                  {' '}
                  {label}
                </span>
              ))}
            </div>
          </div>

          <CitadelGate copy={t.gate} />
        </div>
      </section>

      <section className="srv-citadel-v2-section" aria-labelledby="citadel-setup-title">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">{t.setupSection.kicker}</p>
              <h2 id="citadel-setup-title">{t.setupSection.title}</h2>
            </div>
            <p>{t.setupSection.text}</p>
          </div>

          <CitadelSetup copy={t.setup} locale={locale} />
        </div>
      </section>

      <section className="srv-citadel-v2-section srv-citadel-v2-section-muted" aria-labelledby="citadel-incident-title">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">{t.incidentSection.kicker}</p>
              <h2 id="citadel-incident-title">{t.incidentSection.title}</h2>
            </div>
            <p>{t.incidentSection.text}</p>
          </div>

          <CitadelIncident copy={t.incident} />
        </div>
      </section>

      <section className="srv-citadel-v2-section">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">{t.threatsSection.kicker}</p>
              <h2>{t.threatsSection.title}</h2>
            </div>
            <p>{t.threatsSection.text}</p>
          </div>

          <CitadelThreats copy={t.threats} />
        </div>
      </section>

      <section className="srv-citadel-v2-section srv-citadel-v2-section-muted">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">{t.controlsSection.kicker}</p>
              <h2>{t.controlsSection.title}</h2>
            </div>
            <p>{t.controlsSection.text}</p>
          </div>

          <CitadelControls copy={t.controls} />
        </div>
      </section>

      <section className="srv-citadel-v2-section" aria-labelledby="citadel-portal-title">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">{t.portalSection.kicker}</p>
              <h2 id="citadel-portal-title">{t.portalSection.title}</h2>
            </div>
            <p>{t.portalSection.text}</p>
          </div>

          <CitadelPortal copy={t.portal} links={portalLinks} />
        </div>
      </section>

      <section className="srv-citadel-v2-section srv-citadel-v2-section-muted" id="citadel-plans">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">{t.plansSection.kicker}</p>
              <h2>{t.plansSection.title}</h2>
            </div>
            <p>{t.plansSection.text}</p>
          </div>

          <div className="srv-citadel-v2-plans">
            {planCards.map(plan => (
              <Card key={plan.name} className="srv-citadel-v2-plan" data-featured={plan.featured}>
                <CardHeader>
                  <div>
                    <Badge variant="outline">{plan.featured ? t.plansSection.mostPopular : 'Citadel'}</Badge>
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <div className="srv-citadel-v2-price">
                    <strong>{plan.priceLabel}</strong>
                    <span>{t.plansSection.perMonth}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{plan.text}</p>
                  <dl>
                    <div>
                      <dt>{t.plansSection.domains}</dt>
                      <dd>{plan.domains}</dd>
                    </div>
                    <div>
                      <dt>{t.plansSection.bandwidth}</dt>
                      <dd>{plan.bandwidth}</dd>
                    </div>
                    <div>
                      <dt>{t.plansSection.challengeModes}</dt>
                      <dd>{t.plansSection.challengeModesValue}</dd>
                    </div>
                    <div>
                      <dt>{t.plansSection.attackMode}</dt>
                      <dd>{t.plansSection.attackModeValue}</dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter>
                  <Button asChild variant={plan.featured ? 'default' : 'outline'}>
                    <a href={plan.checkout} aria-label={fill(t.plansSection.orderAria, { plan: plan.name })}>
                      {t.plansSection.order}
                      <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <CitadelIncluded copy={t.included} />
        </div>
      </section>

      <section className="srv-citadel-v2-final">
        <div className="sr-container">
          <Card className="srv-citadel-v2-final-card">
            <div>
              <Badge variant="outline">
                <Image className={iconStyles.artwork} src="/images/fluent-color/shield-checkmark.svg" width={16} height={16} alt="" />
                {' '}
                Citadel
              </Badge>
              <h2>{t.final.title}</h2>
              <p>{t.final.text}</p>
            </div>
            <div>
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/store/layer-7-ddos-protection">
                  {t.final.plans}
                  {' '}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={localeHref('/status', locale)}>{linkLabel(t.final.status, '/status', locale)}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
