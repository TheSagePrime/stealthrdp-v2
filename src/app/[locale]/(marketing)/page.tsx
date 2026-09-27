import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="outline">Windows & Linux VPS · Instant setup</Badge>

            <div className="grid gap-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-none tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Your server.
                <span className="block text-primary">Live in 60 seconds.</span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                High-performance remote desktop and VPS infrastructure without the complexity.
                Enterprise hardware, full administrative access, and a 99.9% uptime SLA.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span>Starting from <strong className="text-foreground">€4.59/month</strong></span>
              <span>7-day money-back</span>
              <span>No hidden fees</span>
              <span>Cancel anytime</span>
            </div>

            <div className="grid w-full max-w-2xl grid-cols-3 overflow-hidden rounded-xl border border-border bg-card">
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

          <Card className="gap-0 overflow-hidden py-0 shadow-sm">
            <CardHeader className="border-b border-border bg-muted/30 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Lightning className="size-4 text-primary" weight="fill" />
                  stealth deploy
                </div>
                <Badge variant="outline">60s setup</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 px-5 py-5">
              <pre className="max-w-full overflow-x-auto rounded-md border border-border bg-muted/30 p-4 font-mono text-sm leading-6">
                <code>$ stealth deploy --plan bronze-usa --region us-east</code>
              </pre>

              <div className="grid gap-3 text-sm">
                {[
                  'Reserving dedicated vCPU',
                  'Provisioning NVMe storage',
                  'Installing Windows Server 2022',
                  'Provisioning isolated VM',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="size-4 text-primary" weight="fill" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle className="size-4 text-status-ok" weight="fill" />
                  Windows Server 2022 ready in 60s
                </div>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-4 gap-0 border-t border-border p-0">
              {[
                ['2', 'vCPU'],
                ['4 GB', 'RAM'],
                ['60 GB', 'NVMe'],
                ['250', 'Mbps'],
              ].map(([value, label], index) => (
                <div
                  key={label}
                  className={`p-4 text-center ${index > 0 ? 'border-l border-border' : ''}`}
                >
                  <strong className="block text-sm font-semibold">{value}</strong>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </CardFooter>
          </Card>
        </div>
      </Section>

      <section className="srv-os-band border-y border-border bg-card/35" aria-label="Supported operating systems">
        <div className="srv-home-wide srv-os-band-inner">
          <div className="srv-os-band-label">
            <span>Works with your OS</span>
          </div>

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
                Choose a workload
              </p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Plans priced for the work.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-muted-foreground lg:justify-self-end">
              Match the workload, operating system, location, and billing cycle without leaving
              the homepage. Availability comes directly from the current plan data.
            </p>
          </div>

          <HomePricing />
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
                  <Icon aria-hidden="true" />
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
            <h2>Run the workload. Protect the origin.</h2>
            <p>
              Hosting and protection are two parts of the same stack. Start with the machine,
              add Citadel when the origin needs another defensive layer.
            </p>
            <div className="srv-products-actions">
              <Button asChild>
                <Link href="/plans">Compare VPS plans</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/citadel">
                  Explore Citadel
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="srv-product-flow" aria-label="StealthRDP product stack">
            <Link href="/plans" className="srv-product-node">
              <span className="srv-product-node-icon">
                <HardDrive aria-hidden="true" />
              </span>
              <span className="srv-product-node-kicker">Hosting</span>
              <strong>Windows &amp; Linux VPS</strong>
              <small>USA + EU · NVMe · Dedicated IPv4 · Admin access</small>
              <span className="srv-product-node-link">
                View hosting
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>

            <div className="srv-product-connector" aria-hidden="true">
              <span />
              <em>add protection</em>
              <span />
            </div>

            <Link href="/citadel" className="srv-product-node srv-product-node-protection">
              <span className="srv-product-node-icon">
                <ShieldCheck aria-hidden="true" />
              </span>
              <span className="srv-product-node-kicker">Protection</span>
              <strong>Citadel L7 HTTP/HTTPS</strong>
              <small>Challenges · Rate limits · Allowlists · Origin health</small>
              <span className="srv-product-node-link">
                View Citadel
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
              <span className="srv-review-source">{reviewSource(testimonials[0])}</span>
            </div>
          </div>

          <div className="srv-review-stream-wrap">
            <div className="srv-review-stream-heading">
              <p>Independent and first-party feedback</p>
              <span>Hover to pause</span>
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
                    {testimonials.slice(1, 6).map((item, index) => (
                      <article
                        key={`${clone ? 'clone-' : ''}${item.id ?? item._id ?? index}`}
                        className="srv-review-chip"
                      >
                        <div className="srv-review-chip-top">
                          <Badge variant="outline">{reviewSource(item)}</Badge>
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
            <h2>Ready to stop wasting time on server management?</h2>
            <p>
              Deploy in about 60 seconds, choose Windows or Linux, and focus on the work that matters.
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
              <Headset className="size-4" aria-hidden="true" />
              Ask a pre-sales question
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
