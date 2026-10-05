/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { SiAlpinelinux, SiFreebsd, SiRockylinux } from '@icons-pack/react-simple-icons';
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  GlobeHemisphereWest,
  HardDrive,
  Headset,
  Lightning,
  ShieldCheck,
} from '@phosphor-icons/react/dist/ssr';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import { Section } from '@/components/launchui/section';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { HomeHero } from '@/components/site/HomeHero';
import { HomePricing } from '@/components/site/HomePricing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { testimonials } from '@/lib/stealth/content';
import { asSiteLocale } from '@/lib/stealth/i18n';
import { localizedPageMetadata, requirePageLocale } from '@/lib/stealth/i18n-server';
import { getPlans } from '@/lib/stealth/live-plans';
import { homeJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { buildPageJsonLd } from '@/libs/seo/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return localizedPageMetadata('/', {
    en: {
      title: 'StealthRDP — Windows RDP & Linux VPS Hosting',
      description:
        'Deploy Windows or Linux VPS hosting with NVMe storage, full administrative access, USA and EU locations, and flexible billing.',
      ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
    },
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

const useCases = [
  {
    title: 'Remote desktop',
    text: 'When a VPS works well as a remote workstation, what affects responsiveness, and how to size it.',
    href: '/blog/vps-for-remote-desktop.html',
  },
  {
    title: 'Web hosting',
    text: 'When to move beyond shared hosting and how to size a VPS for the complete web stack.',
    href: '/blog/vps-for-web-hosting.html',
  },
  {
    title: 'Automation & bots',
    text: 'How to choose resources for scripts, workers, webhook services, bots, and persistent automation.',
    href: '/blog/vps-for-automation-bots.html',
  },
  {
    title: 'Trading',
    text: 'What a VPS can improve for trading software, what it cannot, and why endpoint location matters.',
    href: '/blog/vps-for-trading.html',
  },
  {
    title: 'Backups & storage',
    text: 'How to evaluate a VPS as an offsite backup target, including retention, transfer, and restore planning.',
    href: '/blog/vps-for-backups-storage.html',
  },
] as const;

const infrastructure = [
  {
    title: 'NVMe SSD storage',
    text: 'Fast disk I/O for applications, databases, automation, and active desktop workloads.',
    label: 'Performance',
    icon: HardDrive,
  },
  {
    title: 'Full administrative access',
    text: 'Each server runs in its own virtual machine with full Administrator access on Windows or root on Linux.',
    label: 'Control',
    icon: Cpu,
  },
  {
    title: 'USA + Europe infrastructure',
    text: 'Choose the location closest to the workload with dedicated IPv4 included.',
    label: 'Reach',
    icon: GlobeHemisphereWest,
  },
  {
    title: 'Measured uptime, in public',
    text: 'Every monitored service shows its measured uptime on the status page, and support answers 24/7.',
    label: 'Visibility',
    icon: ShieldCheck,
  },
];

function reviewSource(item: (typeof testimonials)[number]) {
  if (item.sourceLabel?.includes('Discord') || item.sourceType === 'community review') {
    return 'Discord review';
  }
  if (!item.sourceUrl) {
    return 'Customer testimonial';
  }
  return item.sourceUrl.includes('trustpilot.com') ? 'Trustpilot' : 'Third-party review';
}

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 6 hours. */
export const revalidate = 21600;

export default async function HomePage({ params }: Props) {
  await requirePageLocale('/');
  const { locale } = await params;
  setRequestLocale(asSiteLocale(locale));
  const plans = await getPlans();
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <>
      <ProductionJsonLd data={homeJsonLd(getSeoConfig().siteUrl, plans)} />
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <HomeHero from={Math.min(...plans.map(plan => plan.pricing.monthly.amount))} />

      <section className="srv-os-band border-y border-border bg-card/35" aria-label="Supported operating systems">
        <div className="srv-home-wide srv-os-band-inner">
          <div className="srv-os-marquee">
            <span className="sr-visually-hidden">
              Windows Server, Ubuntu, Debian, Rocky Linux, AlmaLinux, CentOS, Fedora, Alpine Linux, and FreeBSD
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
                Choose your server
              </p>
              <h2 className="
                text-3xl/tight font-semibold tracking-tight
                sm:text-5xl
              "
              >
                Choose the resources your workload needs.
              </h2>
            </div>
            <p className="
              max-w-xl text-base/7 text-muted-foreground
              lg:justify-self-end
            "
            >
              Choose a region and billing cycle, then compare the current CPU, RAM, storage,
              bandwidth, operating-system support, and availability.
            </p>
          </div>

          <HomePricing plans={plans} />
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
              <p className="srv-kicker">VPS use cases</p>
              <h2>What can you run on a VPS?</h2>
            </div>
            <p>
              Practical guides for remote desktop, web hosting, automation, trading and backups, with
              sizing and setup advice for each workload.
              {' '}
              <Link href="/blog" className="srv-inline-link">
                Browse all VPS guides
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>

          <ul className="srv-guide-grid">
            {useCases.map(item => (
              <li key={item.href}>
                <Link href={item.href} className="srv-guide-card">
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                  <span aria-hidden="true">
                    Read the guide
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
              <p className="srv-kicker">Core infrastructure</p>
              <h2>Infrastructure that doesn&apos;t flinch.</h2>
            </div>
            <p>
              Speed, control, reach and visibility on every server, with a status page where you can
              check the uptime yourself.
              {' '}
              <Link href="/status" className="srv-inline-link">
                View server status
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          </div>

          <ul className="srv-why-grid">
            {infrastructure.map(({ title, text, label, icon: Icon }) => (
              <li key={title} className="srv-why-card">
                <span className="srv-why-icon">
                  <Icon aria-hidden="true" weight="fill" />
                </span>
                <span className="srv-why-label">{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
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
              StealthRDP products
            </p>
            <h2>Choose the product your workload needs.</h2>
            <p>
              Deploy a Windows or Linux VPS for compute, or route an existing HTTP/HTTPS
              application through Citadel for Layer 7 protection. They are separate products
              and can be used independently.
            </p>
            <div className="srv-products-actions">
              <Button asChild>
                <Link href="/plans">Compare VPS plans</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/citadel">
                  Explore DDoS protection
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="srv-product-flow" aria-label="StealthRDP products">
            <Link href="/plans" className="srv-product-node" data-tone="hosting">
              <span className="srv-product-node-icon">
                <HardDrive aria-hidden="true" weight="fill" />
              </span>
              <span className="srv-product-node-kicker">Hosting</span>
              <strong>Windows &amp; Linux VPS</strong>
              <small>USA + EU · NVMe · Dedicated IPv4 · Admin access</small>
              <span className="srv-product-node-link">
                View hosting
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>

            <Link
              href="/citadel"
              className="srv-product-node srv-product-node-protection"
              data-tone="protection"
            >
              <span className="srv-product-node-icon">
                <ShieldCheck aria-hidden="true" weight="fill" />
              </span>
              <span className="srv-product-node-kicker">Layer 7 DDoS protection</span>
              <strong>Citadel by StealthRDP</strong>
              <small>HTTP/HTTPS challenges · Rate limits · Lockdown · Origin health</small>
              <span className="srv-product-node-link">
                View protection
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
                  Customer proof
                </p>
                <h2>What customers say.</h2>
              </div>
              <Badge variant="outline">Featured review</Badge>
            </div>

            <blockquote>
              “
              {testimonials[0]?.quote}
              ”
            </blockquote>

            <div className="srv-review-featured-author">
              <div>
                <strong>{testimonials[0]?.authorName}</strong>
                <span>{testimonials[0]?.authorCompany || 'StealthRDP customer'}</span>
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
                      {`View on ${reviewSource(testimonials[0])}`}
                    </a>
                  )
                : (
                    <span
                      className="srv-review-source"
                      data-source={reviewSource(testimonials[0]!).toLowerCase().replaceAll(' ', '-')}
                    >
                      {reviewSource(testimonials[0]!)}
                    </span>
                  )}
            </div>
          </div>

          <div className="srv-review-stream-wrap">
            <div className="srv-review-stream-heading">
              <p>Independent and first-party feedback</p>
              <span className="srv-review-desktop-hint">Hover to pause</span>
              <span className="srv-review-mobile-hint">Swipe to browse →</span>
            </div>

            <div className="srv-review-marquee" aria-label="More customer testimonials">
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
                            {reviewSource(item)}
                          </Badge>
                          {item.sourceUrl
                            ? (
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  tabIndex={clone ? -1 : undefined}
                                  aria-label={clone ? undefined : `View source for review by ${item.authorName}`}
                                >
                                  <ArrowUpRight aria-hidden="true" />
                                </a>
                              )
                            : null}
                        </div>
                        <blockquote>{item.quote}</blockquote>
                        <div className="srv-review-chip-author">
                          <strong>{item.authorName}</strong>
                          <span>{item.publishedOn || item.authorCompany || 'StealthRDP customer'}</span>
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
              12,000+ VPS deployed
            </span>
            <h2>Ready to deploy your next VPS?</h2>
            <p>
              Choose your region, resources, and operating system, then get your server online in about 60 seconds.
            </p>
          </div>

          <div className="srv-final-trust">
            <span>
              <strong>€4.59</strong>
              <small>starting price</small>
            </span>
            <span>
              <strong>60 sec</strong>
              <small>typical setup</small>
            </span>
            <span>
              <strong>24/7</strong>
              <small>support</small>
            </span>
          </div>

          <div className="srv-final-actions">
            <Button asChild size="lg">
              <a href="#plans">
                Choose your server
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <a className="srv-final-sales" href="https://dash.stealthrdp.com/submitticket.php">
              <Headset className="size-4" weight="fill" aria-hidden="true" />
              Ask a pre-sales question
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
