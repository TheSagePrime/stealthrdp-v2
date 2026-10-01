/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight, Cpu, HardDrive, MapPin, Memory as MemoryStick } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { OSHeroVisual } from '@/components/site/OSHeroVisual';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPlans } from '@/lib/stealth/live-plans';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/linux-vps',
  title: 'Linux VPS Hosting | Ubuntu, Debian, CentOS | StealthRDP',
  description: 'Compare cheap Linux VPS plans with Ubuntu, Debian, or CentOS, Root access, and USA or EU regions. Check live catalog prices, then continue to checkout.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

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

/* Nominative brand marks for distribution families the table below lists. */
const osBrands = [
  { src: '/brand/ubuntu.svg', alt: 'Ubuntu logo', label: 'Ubuntu', width: 28, height: 28 },
  { src: '/brand/debian.svg', alt: 'Debian logo', label: 'Debian', width: 23, height: 28 },
  { src: '/brand/centos.svg', alt: 'CentOS logo', label: 'CentOS', width: 28, height: 28 },
  { src: '/brand/almalinux.svg', alt: 'AlmaLinux logo', label: 'AlmaLinux', width: 29, height: 28 },
  { src: '/brand/fedora.svg', alt: 'Fedora logo', label: 'Fedora', width: 28, height: 28 },
  { src: '/brand/linux.svg', alt: 'Linux logo (Tux)', label: 'Linux', width: 28, height: 32 },
];

const resourceFit = [
  { icon: Cpu, number: '01', title: 'Concurrent work', text: 'Compare CPU against the application, services, workers, and expected load.' },
  { icon: MemoryStick, number: '02', title: 'Active services', text: 'Size memory for the OS plus web server, app processes, databases, panels, and jobs.' },
  { icon: HardDrive, number: '03', title: 'Files and data', text: 'Compare NVMe storage, bandwidth, region, and billing cycle on the live catalog.' },
];

const questions = [
  ['Can I order a cheap Linux VPS?', 'You can compare current Linux plan prices on the catalog, including Bronze at €9.50/month on the live plans page. Confirm the live price. We do not claim to be the cheapest host.'],
  ['Which Linux distributions can I run?', 'AlmaLinux 8, 9, and 10; Alpine Linux 3.15, 3.19, and 3.23; CentOS 7, Stream 8, and Stream 9; Debian 10, 11, 12, and 13; Fedora 37 through 44; FreeBSD 13.2 through 15.0; Rocky Linux 8, 9, and 10; Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, and 26.04 LTS; openSUSE Leap 15; CloudLinux 9; Arch Linux Latest; and Oracle Linux 8 and 9.'],
  ['Can I run Ubuntu?', 'Yes. Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, and 26.04 LTS.'],
  ['Do plans include Root?', 'Yes. The FAQ states that VPS plans include full Root access.'],
  ['Are USA and EU Linux plans available?', 'Yes. Both appear in the public catalog. Confirm the region at checkout.'],
  ['When is it activated?', 'Typically within 5 minutes for standard installs. Most services within 5–10 minutes after payment confirmation.'],
  ['How do I get credentials?', 'By email after payment confirmation.'],
] as const;

const orderSteps = [
  { number: '01', title: 'Write down the listed Linux image', text: 'Write down the listed Linux image you need, plus the services you will run.' },
  { number: '02', title: 'Open the Linux VPS catalog', text: 'Open the Linux VPS catalog.' },
  { number: '03', title: 'Compare CPU, RAM, disk, region, and price', text: 'Compare CPU, RAM, disk, region, and the price on the page.' },
  { number: '04', title: 'Continue to checkout', text: 'Continue to checkout. Select Linux there.' },
];

/* Token utilities for the card link rows, replacing the bespoke .sr-location-grid hook. */
const cardLinkClass = 'inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover';

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 6 hours. */
export const revalidate = 21600;

export default async function LinuxVpsPage() {
  const plans = await getPlans();

  return (
    <div className="srv-page srv-page-os srv-page-linux">
      <section className="sr-page-hero sr-os-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">Linux VPS hosting</p>
            <h1 className="sr-title">
              Linux VPS hosting with Root access and a distro
              {' '}
              <span>you can confirm.</span>
            </h1>
            <p className="sr-lede">
              You need a Linux server you can administer as root. That can be Ubuntu, Debian, CentOS, or another listed image. You also need a price you can verify before you pay.
            </p>
            <p className="sr-lede">
              StealthRDP sells Linux VPS plans in USA and EU regions. Compare the live catalog, then continue to the existing checkout.
            </p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <Link href="#linux-plans">
                  Compare Linux VPS plans
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"><Link href="#linux-distros">Linux distributions</Link></Button>
            </div>
          </div>
          <OSHeroVisual
            kind="linux"
            title="Linux VPS deployment showcase"
            items={['Ubuntu', 'Debian', 'CentOS']}
            access="Root included"
          />
        </div>
      </section>

      <section className="sr-section srv-os-pricing-section" id="linux-plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Current VPS catalog</p>
              <h2 className="sr-section-title">
                Choose your resource level
              </h2>
            </div>
          </div>
          <PricingExplorer plans={plans} />
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Next step</p>
            <h2 className="sr-section-title">
              Choose the plan first. Select Windows or Linux in checkout.
            </h2>
          </div>
          <div className="sr-prose-block">
            <p>
              The buyer chooses the resource plan and region on this page. The existing checkout then provides the operating-system selector before payment.
            </p>
            <div className="sr-actions">
              <Button asChild>
                <Link href="/plans">
                  Configure this VPS
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Linux VPS guide</p>
            <h2 className="sr-section-title">
              If you searched for cheap Linux VPS
            </h2>
          </div>
          <div className="sr-prose-block">
            <p>
              If you searched for cheap Linux VPS: “Cheap” here means see the current catalog, including Bronze at €9.50/month on the live plans page. It does not mean we are the cheapest provider on the internet. We do not claim that.
            </p>
            <p>
              Bronze USA lists 2 Core, 4 GB RAM, 60 GB NVMe, and Unlimited bandwidth.
              Bronze EU lists 2 Core, 4 GB RAM, 40 GB NVMe, and Unlimited bandwidth.
              Confirm the live row before you order. Prices and stock can change.
            </p>
            <div className="sr-inline-links">
              <Link href="/plans#linux-vps">
                Linux VPS catalog
                <ArrowRight size={16} />
              </Link>
              <Link href="/plans#comparison">
                Plan comparison
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border" id="linux-distros">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Environment</p>
              <h2 className="sr-section-title">
                Linux distributions you can run
              </h2>
            </div>
            <p>Choose the operating-system family your stack needs, then confirm the exact image and version during checkout.</p>
          </div>
          <ul
            className="srv-os-brand-cloud"
            aria-label="Linux distributions listed on this page"
          >
            {osBrands.map(brand => (
              <li key={brand.src} className="srv-os-brand-tile">
                <span className="srv-os-brand-mark">
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.width}
                    height={brand.height}
                  />
                </span>
                <span>{brand.label}</span>
              </li>
            ))}
          </ul>
          <Table className="srv-os-table">
            <TableHeader>
              <TableRow>
                <TableHead>Distribution</TableHead>
                <TableHead>Versions</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distros.map(distro => (
                <TableRow key={distro.name}>
                  <TableHead scope="row">{distro.name}</TableHead>
                  <TableCell>{distro.versions}</TableCell>
                  <TableCell>{distro.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="sr-section-link">
            <Link href="/docs/how-to-install-direct-admin-in-a-linux-server">
              How to install DirectAdmin in a Linux server
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="
        sr-section sr-section-border srv-os-environment-section
      "
      >
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Control</p>
            <h2 className="sr-section-title">
              Root access
            </h2>
          </div>
          <div className="sr-prose-block">
            <p>
              VPS plans include full Root access. You administer the server. You keep backups. You stay inside the
              {' '}
              <Link href="/docs/use-of-service">Use of Service terms</Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Resource fit</p>
              <h2 className="sr-section-title">
                Size the machine to the stack
              </h2>
            </div>
            <p>Count what runs at the same time: OS, web server, app, database, jobs, files.</p>
          </div>
          <ol className="srv-os-feature-rail grid list-none gap-0 p-0">
            {resourceFit.map(({ icon: Icon, number, title, text }) => (
              <li
                key={number}
                className="srv-os-feature-row"
              >
                <div className="flex items-center gap-3">
                  <span className="
                    text-micro font-bold text-body-dim tabular-nums
                  "
                  >
                    {number}
                  </span>
                  <span className="srv-os-feature-icon">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                </div>
                <div className="grid gap-1.5">
                  <h3 className="text-heading-4 font-semibold text-body-text">{title}</h3>
                  <p className="text-small text-body-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-resource-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Regions</p>
              <h2 className="sr-section-title">
                USA or EU
              </h2>
            </div>
          </div>
          <div className="
            srv-os-region-split grid gap-4
            md:grid-cols-2
          "
          >
            <Card className="srv-os-region-panel" data-region="usa">
              <CardHeader>
                <span className="srv-os-region-icon">
                  <MapPin aria-hidden="true" className="size-5" />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">USA</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>USA</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  Choose the region that matches your users and your own location. USA Linux plans appear in the public catalog.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="/plans" className={cardLinkClass}>
                  View plans
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
            <Card className="srv-os-region-panel" data-region="eu">
              <CardHeader>
                <span className="srv-os-region-icon">
                  <MapPin aria-hidden="true" className="size-5" />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">EU</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>EU</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  EU Linux plans also appear in the public catalog. Confirm the region and current configuration in checkout.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="/plans" className={cardLinkClass}>
                  View plans
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-region-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Before you order</p>
            <h2 className="sr-section-title">
              After payment
            </h2>
          </div>
          <div className="sr-prose-block">
            <p>Standard Linux installations are typically activated within 5 minutes. Most services are activated within 5–10 minutes after payment confirmation. Credentials arrive by email after payment confirmation.</p>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Support and limits</p>
            <h2 className="sr-section-title">
              Support and limits
            </h2>
          </div>
          <div className="sr-prose-block">
            <p>
              Support is available through
              {' '}
              <a href="https://wa.me/447441426993">WhatsApp</a>
              , the client-area ticket system, and support email. See the
              {' '}
              <Link href="/faq">FAQ</Link>
              .
            </p>
            <ul>
              <li><a href="https://wa.me/447441426993">WhatsApp support</a></li>
              <li>Use the client-area ticket system for service support.</li>
              <li>Follow the published Use of Service terms.</li>
              <li>Unlawful use, scanning, hacking, spam, and botnets are prohibited.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-order-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Order steps</p>
              <h2 className="sr-section-title">
                Order a Linux VPS
              </h2>
            </div>
            <p>Move from your requirements to checkout.</p>
          </div>
          <ol className="srv-os-order-rail grid list-none gap-0 p-0">
            {orderSteps.map(({ number, title, text }) => (
              <li
                key={number}
                className="
                  grid gap-3 border-t border-divider py-6
                  last:border-b
                  sm:grid-cols-[auto_1fr] sm:items-start sm:gap-x-6
                "
              >
                <span className="
                  text-micro font-bold text-body-dim tabular-nums
                "
                >
                  {number}
                </span>
                <div className="grid gap-1.5">
                  <h3 className="text-heading-4 font-semibold text-body-text">{title}</h3>
                  <p className="text-small text-body-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="sr-section-link">
            <Link href="/plans#linux-vps">
              Compare Linux VPS plans
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-faq-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Common questions</p>
              <h2 className="sr-section-title">
                Linux VPS questions
              </h2>
            </div>
            <p>Quick answers for price, Ubuntu, access, regions, and activation.</p>
          </div>
          <Accordion>
            {questions.map(([question, answer]) => (
              <AccordionItem key={question} title={question}>
                <p>{answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="sr-cta-inline srv-os-switcher">
            <div>
              <span className="sr-location-code">Choose another environment</span>
              <h3>Need Windows instead?</h3>
              <p>For familiar Windows software and remote Windows desktop or server access, see Windows VPS hosting.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/windows-vps">
                Windows VPS hosting
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="
          sr-container sr-cta sr-cta-premium srv-site-final srv-os-final
        "
        >
          <div>
            <p className="sr-kicker">Linux VPS plans</p>
            <h2>Compare Linux VPS plans</h2>
            <p>Check the current plan, region, and displayed price, then confirm Linux and the exact image in checkout.</p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <Link href="/plans#linux-vps">
                Compare Linux VPS plans
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"><Link href="/plans">Continue to checkout</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
