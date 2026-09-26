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
import Link from 'next/link';

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
import { Separator } from '@/components/ui/separator';
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
  'Windows Server',
  'Ubuntu',
  'Debian',
  'Rocky Linux',
  'AlmaLinux',
  'CentOS',
  'Fedora',
  'Alpine Linux',
  'FreeBSD',
];

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

      <Section className="py-14 sm:py-18 lg:py-20">
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

      <Section className="border-y border-border bg-card/35 py-7 sm:py-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Works with your OS
          </span>
          <Separator orientation="vertical" className="hidden h-6 sm:block" />
          <div className="flex min-w-max gap-2">
            {operatingSystems.map(name => (
              <Badge key={name} variant="outline" className="px-3 py-1.5">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-8 sm:py-10">
        <Card className="mx-auto max-w-7xl gap-0 overflow-hidden py-0">
          <CardContent className="grid grid-cols-2 p-0 lg:grid-cols-4">
            {[
              ['10,000+', 'orders'],
              ['USA + EU', 'locations'],
              ['60-second', 'setup'],
              ['24/7', 'support'],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`p-5 sm:p-6 ${index % 2 === 1 ? 'border-l border-border' : ''} ${index > 1 ? 'border-t border-border lg:border-t-0' : ''} ${index > 0 ? 'lg:border-l lg:border-border' : ''}`}
              >
                <strong className="block text-lg font-semibold tracking-tight">{value}</strong>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section id="plans" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-9 sm:gap-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr] lg:items-end">
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

      <Section className="border-y border-border bg-card/30 py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div className="grid max-w-4xl gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Core infrastructure
              </p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Infrastructure that doesn&apos;t flinch.
              </h2>
            </div>
            <div className="flex flex-col gap-4 lg:items-end">
              <p className="max-w-lg text-base leading-7 text-muted-foreground">
                Speed, isolation, network reach, and visibility without turning the page into a
                wall of feature claims.
              </p>
              <Button asChild variant="outline">
                <Link href="/status">
                  View server status
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {infrastructure.map(({ title, text, label, icon: Icon }, index) => (
              <Card key={title} className="gap-5 p-7">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid size-10 place-items-center rounded-md border border-border bg-muted/30 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline">{String(index + 1).padStart(2, '0')} · {label}</Badge>
                  </div>
                  <CardTitle className="mt-3 text-xl tracking-tight">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 text-sm leading-7 text-muted-foreground">
                  {text}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="flex flex-col justify-between gap-8 rounded-xl border border-border bg-card p-8">
            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                StealthRDP products
              </p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Run the workload. Protect the origin.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                The hosting product runs the machine. Citadel adds application-layer protection
                when the origin needs another defensive layer.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/plans">Compare VPS plans</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/citadel">Explore Citadel</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="gap-5 p-7">
              <CardHeader className="p-0">
                <Badge variant="outline" className="w-fit">Hosting</Badge>
                <CardTitle className="mt-4 text-2xl tracking-tight">Windows and Linux VPS</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm leading-7 text-muted-foreground">
                USA and EU regions, NVMe storage, dedicated IPv4, full administrative access,
                and flexible billing terms.
              </CardContent>
              <CardFooter className="mt-auto p-0">
                <Button asChild variant="ghost">
                  <Link href="/plans">
                    View hosting
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="gap-5 p-7">
              <CardHeader className="p-0">
                <Badge variant="outline" className="w-fit">Protection</Badge>
                <CardTitle className="mt-4 text-2xl tracking-tight">Citadel L7 HTTP/HTTPS protection</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm leading-7 text-muted-foreground">
                Adaptive challenges, rate limits, allowlists, temporary bans, automatic
                escalation, origin health, and incident visibility.
              </CardContent>
              <CardFooter className="mt-auto p-0">
                <Button asChild variant="ghost">
                  <Link href="/citadel">
                    View Citadel
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-card/30 py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div className="grid gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Customer proof
              </p>
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Verified customer testimonials.
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-muted-foreground lg:justify-self-end">
              Selected first-party feedback and third-party reviews from customers who have used
              StealthRDP.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((item, index) => (
              <Card
                key={item.id ?? item._id ?? index}
                className={`gap-5 p-6 ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <CardHeader className="p-0">
                  <Badge variant="outline" className="w-fit text-muted-foreground">
                    {reviewSource(item)}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <blockquote className="text-sm leading-7 text-foreground">
                    {item.quote}
                  </blockquote>
                </CardContent>
                <CardFooter className="mt-auto items-end justify-between gap-4 p-0">
                  <div className="grid gap-1">
                    <strong className="text-sm font-semibold">{item.authorName}</strong>
                    <span className="text-xs text-muted-foreground">
                      {item.authorCompany || item.publishedOn || 'StealthRDP customer'}
                    </span>
                  </div>
                  {item.sourceUrl ? (
                    <Button asChild size="icon" variant="outline">
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View source for review by ${item.authorName}`}
                      >
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-16 sm:py-20">
        <Card className="mx-auto max-w-7xl gap-8 p-8 sm:p-10 lg:grid lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-4">
            <Badge variant="outline" className="w-fit">Backed by 10,000+ orders</Badge>
            <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Ready to stop wasting time on server management?
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Deploy a high-performance VPS in the next 60 seconds and focus on the work that
              actually matters.
            </p>
            <p className="text-sm text-muted-foreground">
              Starting from €4.59/month · 7-day money-back guarantee · Cancel anytime
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg">
              <a href="#plans">
                Choose your server
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://dash.stealthrdp.com/submitticket.php">
                <Headset className="size-4" aria-hidden="true" />
                Ask a pre-sales question
              </a>
            </Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
