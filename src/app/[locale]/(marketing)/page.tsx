import type { Metadata } from 'next';
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
import { SiAlpinelinux, SiFreebsd, SiRockylinux } from '@icons-pack/react-simple-icons';

import { Section } from '@/components/launchui/section';
import { HomePricing } from '@/components/site/HomePricing';
import { VpsMotionShowcase } from '@/components/site/VpsMotionShowcase';
import { ChromaticTextReveal } from '@/components/motion/chromatic-text-reveal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';
import { testimonials } from '@/lib/stealth/content';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    path: '/',
    locale,
    title: 'StealthRDP — Windows & Linux VPS Hosting',
    description:
      'Deploy Windows or Linux VPS hosting with NVMe storage, full administrative access, USA and EU locations, and flexible billing.',
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
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
    title: 'Isolated virtual machines',
    text: 'Each server runs in its own VM with dedicated resources and full administrative access.',
    label: 'Isolation',
    icon: Cpu,
  },
  {
    title: 'USA + Europe infrastructure',
    text: 'Choose the location closest to the workload with dedicated IPv4 included.',
    label: 'Reach',
    icon: GlobeHemisphereWest,
  },
  {
    title: '24/7 monitoring',
    text: 'Production nodes are monitored continuously with public infrastructure status visibility.',
    label: 'Visibility',
    icon: ShieldCheck,
  },
];

function reviewSource(item: (typeof testimonials)[number]) {
  if (item.sourceLabel?.includes('Discord') || item.sourceType === 'community review') return 'Discord';
  if (!item.sourceUrl) return 'Customer testimonial';
  return item.sourceUrl.includes('trustpilot.com') ? 'Trustpilot' : 'Third-party review';
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <>
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <Section className="srv-home-hero py-14 sm:py-18 lg:py-20">
        <div className="srv-home-hero-layout mx-auto max-w-7xl">
          <div className="srv-home-hero-copy flex flex-col items-start gap-6">
            <Badge variant="outline" className="srv-home-hero-badge">Windows & Linux VPS · Instant setup</Badge>

            <div className="srv-home-hero-message grid gap-5">
              <h1 className="srv-home-hero-title max-w-4xl text-5xl font-semibold leading-none tracking-tight text-balance sm:text-6xl lg:text-7xl">
                <span className="srv-home-title-mobile">
                  Windows &amp; Linux VPS.
                  <strong>Live in 60 seconds.</strong>
                </span>
                <span className="srv-home-title-desktop">
                  <span className="block">
                    <ChromaticTextReveal
                      className="srv-home-chromatic-title"
                      prefix="Your"
                      words={['server.', 'Windows VPS.', 'Linux VPS.']}
                      colors={[
                        'var(--primary)',
                        'color-mix(in srgb, var(--primary) 66%, white)',
                        'var(--primary)',
                      ]}
                      foregroundColor="var(--foreground)"
                      duration={1.8}
                      pauseDuration={2.1}
                      startOnView={false}
                      once={false}
                      animateInitial={false}
                    />
                  </span>
                  <span className="block text-primary">Live in 60 seconds.</span>
                </span>
              </h1>
              <p className="srv-home-hero-lede max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                High-performance remote desktop and VPS infrastructure without the complexity.
                Enterprise hardware, full administrative access, and a 99.9% uptime SLA.
              </p>
            </div>

            <div className="srv-home-hero-actions flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="#plans">
                  Choose your server
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://dash.stealthrdp.com/submitticket.php">Ask a pre-sales question</a>
              </Button>
            </div>

            <div className="srv-home-hero-meta flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span>Starting from <strong className="text-foreground">€4.59/month</strong></span>
              <span>7-day money-back</span>
              <span>No hidden fees</span>
              <span>Cancel anytime</span>
            </div>

            <div className="srv-home-hero-proof grid w-full max-w-2xl grid-cols-3 overflow-hidden rounded-xl border border-border bg-card">
              <div className="p-4 sm:p-5">
                <strong className="block text-2xl font-semibold tracking-tight">10,000+</strong>
                <span className="text-xs text-muted-foreground">Orders</span>
              </div>
              <div className="border-x border-border p-4 sm:p-5">
                <strong className="block text-2xl font-semibold tracking-tight">60s</strong>
                <span className="text-xs text-muted-foreground">Average deploy</span>
              </div>
              <div className="p-4 sm:p-5">
                <strong className="block text-2xl font-semibold tracking-tight">99.9%</strong>
                <span className="text-xs text-muted-foreground">Uptime SLA</span>
              </div>
            </div>
          </div>

          <div className="srv-vps-showcase-stage">
            <VpsMotionShowcase />
          </div>
        </div>
      </Section>

      <section className="srv-os-band border-y border-border bg-card/35" aria-label="Supported operating systems">
        <div className="srv-home-wide srv-os-band-inner">
          <div className="srv-os-marquee">
            <span className="sr-visually-hidden">
              Windows Server, Ubuntu, Debian, Rocky Linux, AlmaLinux, CentOS, Fedora, Alpine Linux, and FreeBSD
            </span>
            <div className="srv-os-marquee-track" aria-hidden="true">
              {[false, true].map(clone => (
                <div className="srv-os-marquee-copy" data-clone={clone ? 'true' : 'false'} key={String(clone)}>
                  {operatingSystems.map(item => {
                    const Icon = 'icon' in item ? item.icon : null;
                    return (
                      <div className="srv-os-logo" key={`${clone ? 'clone-' : ''}${item.name}`}>
                        {'logo' in item ? (
                          <Image src={item.logo} alt="" width={26} height={26} />
                        ) : Icon ? (
                          <Icon aria-hidden="true" />
                        ) : null}
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

      <Section id="plans" className="srv-home-plans py-12 sm:py-14 lg:py-16">
        <div className="srv-home-wide flex flex-col gap-7 sm:gap-8">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.65fr)] lg:items-end">
            <div className="grid max-w-4xl gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Choose your server
              </p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Choose the resources your workload needs.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              Choose a region and billing cycle, then compare the current CPU, RAM, storage,
              bandwidth, operating-system support, and availability.
            </p>
          </div>

          <HomePricing />
        </div>
      </Section>

      <Section className="srv-home-usecases border-y border-border bg-card/20 py-10 sm:py-12 lg:py-14">
        <div className="srv-home-wide srv-usecase-layout">
          <div className="srv-usecase-intro">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              VPS use cases
            </p>
            <h2>What can you run on a VPS?</h2>
            <p>
              Explore practical guides for remote desktop, web hosting, automation, trading,
              backups, and more — with sizing and setup considerations for each workload.
            </p>
            <Link href="/blog" className="srv-inline-link">
              Browse all VPS guides
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ol className="srv-usecase-rail">
            {useCases.map((item, index) => (
              <li key={item.href}>
                <Link href={item.href} className="srv-usecase-row">
                  <span className="srv-usecase-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="srv-usecase-copy">
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </span>
                  <span className="srv-usecase-arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="srv-home-infra border-y border-border bg-card/30 py-10 sm:py-12 lg:py-14">
        <div className="srv-home-wide srv-infra-layout">
          <div className="srv-infra-intro">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Core infrastructure
            </p>
            <h2>Infrastructure that doesn&apos;t flinch.</h2>
            <p>
              Speed, isolation, network reach, and visibility without turning the page into a
              wall of feature claims.
            </p>
            <Link href="/status" className="srv-inline-link">
              View server status
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ol className="srv-infra-rail">
            {infrastructure.map(({ title, text, label, icon: Icon }, index) => (
              <li key={title} className="srv-infra-item">
                <span className="srv-infra-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="srv-infra-icon">
                  <Icon aria-hidden="true" weight="fill" />
                </span>
                <div className="srv-infra-copy">
                  <div className="srv-infra-title-row">
                    <h3>{title}</h3>
                    <span>{label}</span>
                  </div>
                  <p>{text}</p>
                </div>
                <span className="srv-infra-line" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section className="srv-home-products py-10 sm:py-12 lg:py-14">
        <div className="srv-home-products-story srv-home-wide">
          <div className="srv-products-copy">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
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

            <Link href="/citadel" className="srv-product-node srv-product-node-protection" data-tone="protection">
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

      <Section className="srv-home-reviews border-y border-border bg-card/30 py-10 sm:py-12 lg:py-14">
        <div className="srv-home-wide srv-review-layout">
          <div className="srv-review-featured">
            <div className="srv-review-featured-head">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Customer proof
                </p>
                <h2>What customers say.</h2>
              </div>
              <Badge variant="outline">Featured review</Badge>
            </div>

            <blockquote>
              “{testimonials[0]?.quote}”
            </blockquote>

            <div className="srv-review-featured-author">
              <div>
                <strong>{testimonials[0]?.authorName}</strong>
                <span>{testimonials[0]?.authorCompany || 'StealthRDP customer'}</span>
              </div>
              <span
                className="srv-review-source"
                data-source={reviewSource(testimonials[0]!).toLowerCase().replaceAll(' ', '-')}
              >
                {reviewSource(testimonials[0]!)}
              </span>
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
                          {item.sourceUrl ? (
                            <a
                              href={item.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              tabIndex={clone ? -1 : undefined}
                              aria-label={clone ? undefined : `View source for review by ${item.authorName}`}
                            >
                              <ArrowUpRight aria-hidden="true" />
                            </a>
                          ) : null}
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

      <Section className="srv-home-final-section py-8 sm:py-10 lg:py-12">
        <div className="srv-home-final-banner srv-home-wide">
          <div className="srv-final-copy">
            <span className="srv-final-eyebrow">
              <Lightning weight="fill" aria-hidden="true" />
              Backed by 10,000+ orders
            </span>
            <h2>Ready to deploy your next VPS?</h2>
            <p>
              Choose your region, resources, and operating system, then get your server online in about 60 seconds.
            </p>
          </div>

          <div className="srv-final-trust">
            <span><strong>€4.59</strong><small>starting price</small></span>
            <span><strong>7 days</strong><small>money-back</small></span>
            <span><strong>24/7</strong><small>support</small></span>
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
