import type { Metadata } from 'next';
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  HardDrive,
  Info,
  MapPin,
} from '@phosphor-icons/react/dist/ssr';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

import CTA from '@/components/launchui/cta';
import Hero from '@/components/launchui/hero';
import Items from '@/components/launchui/items';
import { Section } from '@/components/launchui/section';
import Stats from '@/components/launchui/stats';
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

const stats = [
  {
    label: 'served',
    value: '10,000+',
    description: 'orders',
  },
  {
    label: 'typical setup',
    value: '60s',
    description: 'average deploy',
  },
  {
    label: 'service target',
    value: '99.9%',
    description: 'uptime SLA',
  },
];

const infrastructure = [
  {
    title: 'NVMe storage',
    description: 'Fast disk I/O for applications, databases, and active desktop workloads.',
    icon: <HardDrive className="size-5" weight="regular" />,
  },
  {
    title: 'Isolated virtual machines',
    description: 'Dedicated resources with full administrative access to your own VPS.',
    icon: <Cpu className="size-5" weight="regular" />,
  },
  {
    title: 'USA + Europe',
    description: 'Choose the region closest to the workload, with dedicated IPv4 included.',
    icon: <MapPin className="size-5" weight="regular" />,
  },
  {
    title: '24/7 monitoring',
    description: 'Production infrastructure is monitored continuously with a public status page.',
    icon: <Info className="size-5" weight="regular" />,
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

      <Hero
        className="pb-12 sm:pb-16"
        badge={(
          <Badge variant="outline" className="px-3 py-1.5">
            Windows & Linux VPS · USA + Europe
          </Badge>
        )}
        title={(
          <>
            Your server.
            <span className="block text-primary">Live in 60 seconds.</span>
          </>
        )}
        description="High-performance VPS infrastructure without the usual complexity. Choose the resources, region, and billing term — then deploy."
        buttons={[
          {
            href: '#plans',
            text: 'Choose your server',
            variant: 'default',
            iconRight: <ArrowRight className="size-4" aria-hidden="true" />,
          },
          {
            href: 'https://dash.stealthrdp.com/submitticket.php',
            text: 'Talk to sales',
            variant: 'outline',
          },
        ]}
        meta={(
          <span>
            From <strong className="font-semibold text-foreground">€4.59/mo</strong>
            {' · '}Dedicated IPv4 · NVMe storage · 250 Mbps
          </span>
        )}
      />

      <Stats
        className="border-y border-border bg-card/40 py-10 sm:py-12"
        items={stats}
      />

      <Section id="plans" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 sm:gap-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              VPS plans
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Pick the resources. We keep the rest simple.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Only plans that are available right now are shown here. Switch region or billing
              without leaving the page, then choose Windows or Linux during checkout.
            </p>
          </div>
          <HomePricing />
        </div>
      </Section>

      <Items
        className="border-y border-border bg-card/30"
        title="The infrastructure essentials, already included."
        description="No feature maze. The things most VPS buyers actually care about are standard across the range."
        items={infrastructure}
      />

      <Section className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex max-w-3xl flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              StealthRDP products
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Run the workload. Protect the origin.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              VPS hosting for the machine itself, and Citadel when the application layer needs another line of defence.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Card className="gap-5 p-8 sm:p-8">
              <CardHeader className="p-0">
                <Badge variant="outline" className="w-fit">Hosting</Badge>
                <CardTitle className="mt-4 text-2xl tracking-tight">
                  Windows and Linux VPS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm leading-6 text-muted-foreground">
                USA and EU regions, NVMe storage, dedicated IPv4, full administrative access,
                and flexible billing.
              </CardContent>
              <CardFooter className="mt-auto p-0 pt-2">
                <Button asChild variant="outline">
                  <Link href="/plans">
                    Compare VPS plans
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="gap-5 p-8 sm:p-8">
              <CardHeader className="p-0">
                <Badge variant="outline" className="w-fit">Protection</Badge>
                <CardTitle className="mt-4 text-2xl tracking-tight">
                  Citadel L7 HTTP/HTTPS protection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm leading-6 text-muted-foreground">
                Application-layer controls between Cloudflare and the origin, including
                challenges, rate limits, allowlists, and automatic escalation.
              </CardContent>
              <CardFooter className="mt-auto p-0 pt-2">
                <Button asChild variant="outline">
                  <Link href="/citadel">
                    Understand Citadel
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
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Customer proof
            </p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              What customers say
            </h2>
            <p className="text-base leading-7 text-muted-foreground">
              Selected customer feedback and independent review sources.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((item, index) => (
              <Card key={item.id ?? item._id ?? index} className="gap-5 p-6">
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

      <CTA
        className="py-16 sm:py-20"
        title="Ready to deploy your server?"
        description="Choose an available VPS, select your operating system during checkout, and get the service online."
        buttons={[
          {
            href: '#plans',
            text: 'Choose your server',
            variant: 'default',
            iconRight: <ArrowRight className="size-4" aria-hidden="true" />,
          },
          {
            href: 'https://dash.stealthrdp.com/submitticket.php',
            text: 'Talk to sales',
            variant: 'outline',
          },
        ]}
      />
    </>
  );
}
