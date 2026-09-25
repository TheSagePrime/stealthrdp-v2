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
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/linux-vps',
  title: 'Linux VPS Hosting | Ubuntu, Debian, CentOS | StealthRDP',
  description: 'Compare cheap Linux VPS plans with Ubuntu, Debian, or CentOS, Root access, and USA or EU regions. Check live catalog prices, then continue to checkout.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const distros = [
  { name: 'Ubuntu', text: 'Fits many websites, panels, and development stacks.' },
  { name: 'Debian', text: 'Use when the stack asks for Debian.' },
  { name: 'CentOS', text: 'Use when the stack asks for CentOS.' },
  { name: 'AlmaLinux', text: 'Use when the stack asks for AlmaLinux.' },
  { name: 'Rocky Linux', text: 'Use when the stack asks for Rocky Linux.' },
  { name: 'Fedora', text: 'Use when the stack asks for Fedora.' },
  { name: 'Alpine Linux', text: 'Use when the stack asks for Alpine Linux.' },
  { name: 'FreeBSD', text: 'Use when the stack asks for FreeBSD.' },
  { name: 'openSUSE', text: 'Use when the stack asks for openSUSE.' },
  { name: 'CloudLinux', text: 'Use when the stack asks for CloudLinux.' },
  { name: 'Arch Linux', text: 'Use when the stack asks for Arch Linux.' },
  { name: 'Oracle Linux', text: 'Use when the stack asks for Oracle Linux.' },
];

/* Nominative brand marks for distribution families the table below lists. */
const osBrands = [
  { src: '/brand/ubuntu.svg', alt: 'Ubuntu logo', width: 28, height: 28, className: 'h-7 w-auto' },
  { src: '/brand/debian.svg', alt: 'Debian logo', width: 23, height: 28, className: 'h-7 w-auto' },
  { src: '/brand/centos.svg', alt: 'CentOS logo', width: 28, height: 28, className: 'h-7 w-auto' },
  { src: '/brand/almalinux.svg', alt: 'AlmaLinux logo', width: 29, height: 28, className: 'h-7 w-auto' },
  { src: '/brand/fedora.svg', alt: 'Fedora logo', width: 28, height: 28, className: 'h-7 w-auto' },
  // Tux is a portrait mark with less ink than the flat distro badges, so it needs one
  // step more height to carry the same optical weight next to them.
  { src: '/brand/linux.svg', alt: 'Linux logo (Tux)', width: 28, height: 32, className: 'h-8 w-auto' },
];

const resourceFit = [
  { icon: Cpu, number: '01', title: 'Concurrent work', text: 'Compare CPU against the application, services, workers, and expected load.' },
  { icon: MemoryStick, number: '02', title: 'Active services', text: 'Size memory for the OS plus web server, app processes, databases, panels, and jobs.' },
  { icon: HardDrive, number: '03', title: 'Files and data', text: 'Compare NVMe storage, bandwidth, region, and billing cycle on the current catalog.' },
];

const questions = [
  ['Can I order a cheap Linux VPS?', 'You can compare current Linux plan prices on the catalog, including Bronze at €9.50/month. Confirm the current price. StealthRDP does not claim to be the cheapest host.'],
  ['Which Linux distributions can I run?', 'AlmaLinux, Alpine Linux, CentOS, Debian, Fedora, FreeBSD, Rocky Linux, Ubuntu, openSUSE, CloudLinux, Arch Linux, and Oracle Linux are listed in the current public options.'],
  ['Can I run Ubuntu?', 'Yes. Ubuntu is listed. Confirm the exact image and version during checkout.'],
  ['Do plans include Root?', 'Yes. VPS plans include full Root access.'],
  ['Are USA and EU Linux plans available?', 'Both appear in the public catalog. Confirm the region and current availability at checkout.'],
  ['When is it activated?', 'Standard installations are typically activated within 5 minutes. Most services are activated within 5–10 minutes after payment confirmation.'],
  ['How do I get credentials?', 'Credentials are sent by email after payment confirmation.'],
] as const;

const orderSteps = [
  { number: '01', title: 'Write down the image and services', text: 'Start with the Linux image you need and the services you will run.' },
  { number: '02', title: 'Compare the catalog', text: 'Compare CPU, RAM, disk, region, bandwidth, and the current price.' },
  { number: '03', title: 'Continue to checkout', text: 'Select Linux and confirm the exact image and version there.' },
];

/* Token utilities for the card link rows, replacing the bespoke .sr-location-grid hook. */
const cardLinkClass = 'inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover';

export default function LinuxVpsPage() {
  return (
    <>
      <section className="sr-page-hero sr-os-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">Linux VPS hosting</p>
            <h1 className="sr-title">Linux VPS hosting with Root access and a distro <span>you can confirm.</span></h1>
            <p className="sr-lede">
              Run websites, applications, databases, automation, development environments,
              VPN workloads, and general-purpose Linux infrastructure on a supported image.
            </p>
            <div className="sr-actions">
              <Button asChild size="lg"><Link href="#linux-plans">Compare Linux VPS plans <ArrowRight size={16} /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="#linux-distros">Linux distributions</Link></Button>
            </div>
          </div>
          <OSHeroVisual
            kind="linux"
            title="Choose the Linux image that fits your stack"
            items={distros.map(item => item.name)}
            access="Root access"
          />
        </div>
      </section>

      <section className="sr-section" id="linux-plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Current VPS catalog</p><h2 className="sr-section-title">Choose your resource level</h2></div>
            <p>Compare the current displayed monthly price, CPU, RAM, NVMe storage, bandwidth, and region. Windows and Linux use this shared VPS catalog.</p>
          </div>
          <PricingExplorer guided={false} />
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-copy-grid">
          <div><p className="sr-kicker">Linux VPS guide</p><h2 className="sr-section-title">If you searched for cheap Linux VPS</h2></div>
          <div className="sr-prose-block">
            <p>
              “Cheap” here means compare the current catalog, including Bronze at €9.50/month on the plans page.
              It does not mean StealthRDP is the cheapest provider on the internet, and we do not claim that.
            </p>
            <p>
              Bronze USA lists 2 Core, 4 GB RAM, 60 GB NVMe, and Unlimited bandwidth.
              Bronze EU lists 2 Core, 4 GB RAM, 40 GB NVMe, and Unlimited bandwidth.
              Confirm the current row before ordering because prices and stock can change.
            </p>
            <div className="sr-inline-links">
              <Link href="/plans#linux-vps">Linux VPS catalog <ArrowRight size={16} /></Link>
              <Link href="/plans#comparison">Plan comparison <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border" id="linux-distros">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Environment</p><h2 className="sr-section-title">Linux distributions you can run</h2></div>
            <p>Choose the operating-system family your stack needs, then confirm the exact image and version during checkout.</p>
          </div>
          <ul
            className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-4"
            aria-label="Linux distributions listed on this page"
          >
            {osBrands.map(brand => (
              <li key={brand.src}>
                <img
                  src={brand.src}
                  alt={brand.alt}
                  width={brand.width}
                  height={brand.height}
                  className={brand.className}
                />
              </li>
            ))}
          </ul>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Distribution</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distros.map(distro => (
                <TableRow key={distro.name}>
                  <TableHead scope="row">{distro.name}</TableHead>
                  <TableCell>{distro.text} Confirm the exact image and version during checkout.</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="sr-section-link">
            <Link href="/docs/how-to-install-direct-admin-in-a-linux-server">How to install DirectAdmin in a Linux server <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-copy-grid">
          <div><p className="sr-kicker">Control</p><h2 className="sr-section-title">Root access</h2></div>
          <div className="sr-prose-block">
            <p>VPS plans include full Root access. You administer the server, keep backups of important data, and stay inside the published Use of Service terms.</p>
            <div className="sr-inline-links"><Link href="/docs/use-of-service">Use of Service terms <ArrowRight size={16} /></Link></div>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Resource fit</p><h2 className="sr-section-title">Size the machine to the stack</h2></div>
            <p>Count what runs at the same time: OS, web server, application, database, jobs, and files.</p>
          </div>
          <ol className="grid list-none gap-0 p-0">
            {resourceFit.map(({ icon: Icon, number, title, text }) => (
              <li
                key={number}
                className="
                  grid gap-3 border-t border-divider py-6 last:border-b
                  sm:grid-cols-[auto_1fr] sm:items-start sm:gap-x-6
                "
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-micro font-bold text-body-dim tabular-nums">
                    {number}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-md border border-border-soft bg-surface-2 text-primary">
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

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Regions</p><h2 className="sr-section-title">USA or EU</h2></div>
            <p>Choose the region that matches your users, your own location, and your latency needs.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <span className="grid size-11 place-items-center rounded-md border border-divider bg-surface-1 text-primary">
                  <MapPin aria-hidden="true" className="size-5" />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">USA</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>United States</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  USA Linux plans appear in the public catalog. Compare the current resource and availability details before checkout.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="/plans" className={cardLinkClass}>
                  View plans <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <span className="grid size-11 place-items-center rounded-md border border-divider bg-surface-1 text-primary">
                  <MapPin aria-hidden="true" className="size-5" />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">EU</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>Europe</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  EU Linux plans also appear in the public catalog. Confirm the current region and configuration in checkout.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="/plans" className={cardLinkClass}>
                  View plans <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit text-body-muted">After payment</Badge>
              <CardTitle className="text-heading-4 text-body-text">
                <h3>Provisioning</h3>
              </CardTitle>
              <CardDescription className="text-small text-body-muted">
                Standard Linux installations are typically activated within 5 minutes. Most services are activated within 5–10 minutes after payment confirmation.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit text-body-muted">Credentials</Badge>
              <CardTitle className="text-heading-4 text-body-text">
                <h3>Delivered by email</h3>
              </CardTitle>
              <CardDescription className="text-small text-body-muted">
                Credentials arrive by email after payment confirmation.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Badge variant="outline" className="w-fit text-body-muted">Support and limits</Badge>
              <CardTitle className="text-heading-4 text-body-text">
                <h3>Operate within the published terms</h3>
              </CardTitle>
              <CardDescription className="text-small text-body-muted">
                Support is available through the client-area ticketing system and support email. Unlawful use, scanning, hacking, spam, and botnets are prohibited.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Order steps</p><h2 className="sr-section-title">Order a Linux VPS</h2></div>
            <p>Move from your requirements to checkout without guessing at the resource level.</p>
          </div>
          <ol className="grid list-none gap-0 p-0">
            {orderSteps.map(({ number, title, text }) => (
              <li
                key={number}
                className="
                  grid gap-3 border-t border-divider py-6 last:border-b
                  sm:grid-cols-[auto_1fr] sm:items-start sm:gap-x-6
                "
              >
                <span className="font-mono text-micro font-bold text-body-dim tabular-nums">
                  {number}
                </span>
                <div className="grid gap-1.5">
                  <h3 className="text-heading-4 font-semibold text-body-text">{title}</h3>
                  <p className="text-small text-body-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Common questions</p><h2 className="sr-section-title">Linux VPS questions</h2></div>
            <p>Quick answers for price, Ubuntu, access, regions, activation, and credentials.</p>
          </div>
          <Accordion>
            {questions.map(([question, answer]) => (
              <AccordionItem key={question} title={question}>
                <p>{answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="sr-cta-inline">
            <div><span className="sr-location-code">Choose another environment</span><h3>Need Windows instead?</h3><p>For familiar Windows software and remote Windows desktop or server access, see Windows VPS hosting.</p></div>
            <Button asChild variant="outline"><Link href="/windows-vps">Windows VPS hosting <ArrowRight size={16} /></Link></Button>
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-cta sr-cta-premium">
          <div><p className="sr-kicker">Linux VPS plans</p><h2>Compare Linux VPS plans</h2><p>Check the current plan, region, and displayed price, then confirm Linux and the exact image in checkout.</p></div>
          <div className="sr-actions">
            <Button asChild size="lg"><Link href="/plans#linux-vps">Compare plans <ArrowRight size={16} /></Link></Button>
            <Button asChild size="lg" variant="outline"><a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">Continue to checkout</a></Button>
          </div>
        </div>
      </section>
    </>
  );
}
