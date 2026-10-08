/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { SiAlpinelinux, SiFreebsd, SiRockylinux } from '@icons-pack/react-simple-icons';
import {
  ArrowRight,
  ArrowUpRight,
  Headset,
  Lightning,
} from '@phosphor-icons/react/dist/ssr';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/launchui/section';

import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { HomeHero } from '@/components/site/HomeHero';
import { HomePricing } from '@/components/site/HomePricing';
import iconStyles from '@/components/site/IconArtwork.module.css';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { homeCopy } from '@/content/i18n/home';
import { testimonials } from '@/lib/stealth/content';
import { asSiteLocale, localeHref } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { getPlans } from '@/lib/stealth/live-plans';
import { homeJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { buildPageJsonLd } from '@/libs/seo/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';
  return localizedPageMetadata('/', {
    en: { ...homeCopy.en.meta, ogImage },
    de: { ...homeCopy.de.meta, ogImage },
    es: { ...homeCopy.es.meta, ogImage },
  });
}

const operatingSystems = [
  { name: 'Windows Server', logo: '/brand/windows.svg' },
  { name: 'Ubuntu', logo: '/brand/ubuntu.svg' },
  { name: 'Debian', logo: '/brand/debian.svg' },
  { name: 'Rocky Linux', icon: SiRockylinux },
  { name: 'AlmaLinux', logo: '/brand/almalinux.svg' },
  { name: 'CentOS', logo: '/brand/centos.svg' },
  { name: 'Fedora', logo: '/brand/fedora.svg' },
  { name: 'Alpine Linux', icon: SiAlpinelinux },
  { name: 'FreeBSD', icon: SiFreebsd },
] as const;

/* Icons of the four infrastructure cards; their words are in the copy files. */
const infrastructureIcons = ['database', 'person-key', 'location-ripple', 'data-trending'];

function reviewSource(item: (typeof testimonials)[number]) {
  if (item.sourceLabel?.includes('Discord') || item.sourceType === 'community review') {
    return 'Discord review';
  }
  if (!item.sourceUrl) {
    return 'Customer testimonial';
  }
  return item.sourceUrl.includes('trustpilot.com') ? 'Trustpilot' : 'Third-party review';
}

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 15 minutes. */
export const revalidate = 900;

export default async function HomePage({ params }: Props) {
  await requirePageLocale('/');
  const { locale } = await params;
  setRequestLocale(asSiteLocale(locale));
  const lang = asSiteLocale(locale);
  const t = homeCopy[lang];
  /* Reviews are quoted as written, in English. */
  const quoteLang = lang === 'en' ? undefined : 'en';
  const plans = await getPlans();
  const lowest = Math.min(...plans.map(plan => plan.pricing.monthly.amount));
  /* Review badges keep the English source key for styling (data-source); the label is translated. */
  const sourceLabel = (item: (typeof testimonials)[number]) => t.reviews.sources[reviewSource(item)] ?? reviewSource(item);
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <>
      <ProductionJsonLd data={homeJsonLd(getSeoConfig().siteUrl, plans, t.jsonLd, localeHref('/plans', lang))} />
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <HomeHero from={lowest} locale={lang} />

      <section className="srv-os-band border-y border-border bg-card/35" aria-label={t.osBand.aria}>
        <div className="srv-home-wide srv-os-band-inner">
          <div className="srv-os-marquee">
            <span className="sr-visually-hidden">
              {t.osBand.list}
            </span>
            <div className="srv-os-marquee-track" aria-hidden="true">
              {[false, true].map(clone => (
                <div className="srv-os-marquee-copy" data-clone={clone ? 'true' : 'false'} key={String(clone)}>
                  {operatingSystems.map((item) => {
                    const Icon = 'icon' in item ? item.icon : null;
                    return (
                      <div className="srv-os-logo" key={`${clone ? 'clone-' : ''}${item.name}`}>
                        {'logo' in item
                          ? (
                              <Image src={item.logo} alt="" width={26} height={26} />
                            )
                          : Icon
                            ? (
                                <Icon aria-hidden="true" />
                              )
                            : null}
                        <span>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section
        id="plans"
        className="
          srv-home-plans py-12
          sm:py-14
          lg:py-16
        "
      >
        <div className="
          srv-home-wide flex flex-col gap-7
          sm:gap-8
        "
        >
          <div className="
            grid gap-5
            lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.65fr)] lg:items-end
          "
          >
            <div className="grid max-w-4xl gap-4">
              <p className="
                text-xs font-semibold tracking-widest text-primary uppercase
              "
              >
                {t.plans.kicker}
              </p>
              <h2 className="
                text-3xl/tight font-semibold tracking-tight
                sm:text-5xl
              "
              >
                {t.plans.title}
              </h2>
            </div>
            <p className="
              max-w-xl text-base/7 text-muted-foreground
              lg:justify-self-end
            "
            >
              {t.plans.text}
            </p>
          </div>

          <HomePricing plans={plans} locale={lang} />
        </div>
      </Section>

      <Section className="
        srv-home-usecases border-y border-border bg-card/20 py-12
        sm:py-14
        lg:py-16
      "
      >
        <div className="srv-home-wide srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">{t.useCases.kicker}</p>
              <h2>{t.useCases.title}</h2>
            </div>
            <p>
              {t.useCases.text}
              {' '}
              <Link href={localeHref('/blog', lang)} className="srv-inline-link">
                {t.useCases.browse}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>

          <ul className="srv-guide-grid">
            {t.useCases.items.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="srv-guide-card">
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                  <span aria-hidden="true">
                    {t.useCases.read}
                    <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="
        srv-home-infra border-y border-border bg-card/30 py-12
        sm:py-14
        lg:py-16
      "
      >
        <div className="srv-home-wide srv-section-stack">
          <div className="srv-section-head">
            <div>
              <p className="srv-kicker">{t.infra.kicker}</p>
              <h2>{t.infra.title}</h2>
            </div>
            <p>
              {t.infra.text}
              {' '}
              <Link
                href={localeHref('/status', lang)}
                className="srv-inline-link"
              >
                {t.infra.statusLink}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>

          <ul className="srv-why-grid">
            {t.infra.items.map(({ title, text, label }, index) => {
              const icon = infrastructureIcons[index] ?? 'shield-checkmark';
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
      </Section>

      <Section className="
        srv-home-products py-10
        sm:py-12
        lg:py-14
      "
      >
        <div className="srv-home-products-story srv-home-wide">
          <div className="srv-products-copy">
            <p className="
              text-xs font-semibold tracking-widest text-primary uppercase
            "
            >
              {t.products.kicker}
            </p>
            <h2>{t.products.title}</h2>
            <p>
              {t.products.text}
            </p>
            <div className="srv-products-actions">
              <Button asChild>
                <Link href={localeHref('/plans', lang)}>{t.products.compare}</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={localeHref('/citadel', lang)}>
                  {t.products.explore}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="srv-product-flow" aria-label={t.products.flowAria}>
            <Link href={localeHref('/plans', lang)} className="srv-product-node" data-tone="hosting">
              <span className="srv-product-node-icon">
                <Image className={iconStyles.artwork} src="/images/fluent-color/cloud.svg" width={40} height={40} alt="" />
              </span>
              <span className="srv-product-node-kicker">{t.products.hosting.kicker}</span>
              <strong>{t.products.hosting.title}</strong>
              <small>{t.products.hosting.small}</small>
              <span className="srv-product-node-link">
                {t.products.hosting.link}
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>

            <Link
              href={localeHref('/citadel', lang)}
              className="srv-product-node srv-product-node-protection"
              data-tone="protection"
            >
              <span className="srv-product-node-icon">
                <Image className={iconStyles.artwork} src="/images/fluent-color/shield-checkmark.svg" width={40} height={40} alt="" />
              </span>
              <span className="srv-product-node-kicker">{t.products.protection.kicker}</span>
              <strong>{t.products.protection.title}</strong>
              <small>{t.products.protection.small}</small>
              <span className="srv-product-node-link">
                {t.products.protection.link}
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </Section>

      <Section className="
        srv-home-reviews border-y border-border bg-card/30 py-10
        sm:py-12
        lg:py-14
      "
      >
        <div className="srv-home-wide srv-review-layout">
          <div className="srv-review-featured">
            <div className="srv-review-featured-head">
              <div>
                <p className="
                  text-xs font-semibold tracking-widest text-primary uppercase
                "
                >
                  {t.reviews.kicker}
                </p>
                <h2>{t.reviews.title}</h2>
              </div>
              <Badge variant="outline">{t.reviews.featured}</Badge>
            </div>

            <blockquote lang={quoteLang}>
              “
              {testimonials[0]?.quote}
              ”
            </blockquote>

            <div className="srv-review-featured-author">
              <div>
                <strong>{testimonials[0]?.authorName}</strong>
                <span>{testimonials[0]?.authorCompany || t.reviews.customer}</span>
              </div>
              {testimonials[0]?.sourceUrl
                ? (
                    <a
                      className="srv-review-source"
                      href={testimonials[0].sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      data-source={reviewSource(testimonials[0]).toLowerCase().replaceAll(' ', '-')}
                    >
                      {t.reviews.viewOn(sourceLabel(testimonials[0]))}
                    </a>
                  )
                : (
                    <span
                      className="srv-review-source"
                      data-source={reviewSource(testimonials[0]!).toLowerCase().replaceAll(' ', '-')}
                    >
                      {sourceLabel(testimonials[0]!)}
                    </span>
                  )}
            </div>
          </div>

          <div className="srv-review-stream-wrap">
            <div className="srv-review-stream-heading">
              <p>{t.reviews.streamTitle}</p>
              <span className="srv-review-desktop-hint">{t.reviews.hover}</span>
              <span className="srv-review-mobile-hint">{t.reviews.swipe}</span>
            </div>

            <div className="srv-review-marquee" aria-label={t.reviews.marqueeAria}>
              <div className="srv-review-track">
                {[false, true].map(clone => (
                  <div
                    className="srv-review-set"
                    data-clone={clone ? 'true' : 'false'}
                    aria-hidden={clone || undefined}
                    key={String(clone)}
                  >
                    {testimonials.slice(1).map((item, index) => (
                      <article
                        key={`${clone ? 'clone-' : ''}${item.id ?? item._id ?? index}`}
                        className="srv-review-chip"
                      >
                        <div className="srv-review-chip-top">
                          <Badge
                            variant="outline"
                            className="srv-review-source-badge"
                            data-source={reviewSource(item).toLowerCase().replaceAll(' ', '-')}
                          >
                            {sourceLabel(item)}
                          </Badge>
                          {item.sourceUrl
                            ? (
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  tabIndex={clone ? -1 : undefined}
                                  aria-label={clone ? undefined : t.reviews.sourceAria(item.authorName)}
                                >
                                  <ArrowUpRight aria-hidden="true" />
                                </a>
                              )
                            : null}
                        </div>
                        <blockquote lang={quoteLang}>{item.quote}</blockquote>
                        <div className="srv-review-chip-author">
                          <strong>{item.authorName}</strong>
                          <span>{item.publishedOn || item.authorCompany || t.reviews.customer}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="
        srv-home-final-section py-8
        sm:py-10
        lg:py-12
      "
      >
        <div className="srv-home-final-banner srv-home-wide">
          <div className="srv-final-copy">
            <span className="srv-final-eyebrow">
              <Lightning weight="fill" aria-hidden="true" />
              {t.final.eyebrow}
            </span>
            <h2>{t.final.title}</h2>
            <p>
              {t.final.text}
            </p>
          </div>

          <div className="srv-final-trust">
            <span>
              <strong>{t.final.start(lowest)}</strong>
              <small>{t.final.startLabel}</small>
            </span>
            <span>
              <strong>{t.final.setup[0]}</strong>
              <small>{t.final.setup[1]}</small>
            </span>
            <span>
              <strong>{t.final.support[0]}</strong>
              <small>{t.final.support[1]}</small>
            </span>
          </div>

          <div className="srv-final-actions">
            <Button asChild size="lg">
              <a href="#plans">
                {t.final.choose}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <a className="srv-final-sales" href="https://dash.stealthrdp.com/submitticket.php">
              <Headset className="size-4" weight="fill" aria-hidden="true" />
              {t.final.presales}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
