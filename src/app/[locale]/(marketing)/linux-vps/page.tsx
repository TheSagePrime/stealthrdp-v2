import type { Metadata } from 'next';
import {
  ArrowRight,
  Boxes,
  Cpu,
  HardDrive,
  KeyRound,
  MapPin,
  MemoryStick,
  Server,
  Terminal,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/linux-vps',
  title: 'Linux VPS Hosting | Ubuntu, Debian, CentOS | StealthRDP',
  description: 'Compare cheap Linux VPS plans with Ubuntu, Debian, or CentOS, Root access, and USA or EU regions. Check live catalog prices, then continue to checkout.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const distros = [
  { name: 'Ubuntu', versions: '18.04 LTS · 20.04 LTS · 22.04 LTS · 24.04 LTS · 26.04 LTS', text: 'Fits many websites, panels, and development stacks.' },
  { name: 'Debian', versions: '10 · 11 · 12 · 13', text: 'Use when the stack asks for Debian.' },
  { name: 'CentOS', versions: '7 · Stream 8 · Stream 9', text: 'Use when the stack asks for CentOS.' },
  { name: 'AlmaLinux', versions: '8 · 9 · 10', text: 'Use when the stack asks for AlmaLinux.' },
  { name: 'Rocky Linux', versions: '8 · 9 · 10', text: 'Use when the stack asks for Rocky Linux.' },
  { name: 'Fedora', versions: '37 · 38 · 39 · 40 · 41 · 42 · 43 · 44', text: 'Use when the stack asks for Fedora.' },
  { name: 'Alpine Linux', versions: '3.15 · 3.19 · 3.23', text: 'Use when the stack asks for Alpine Linux.' },
  { name: 'FreeBSD', versions: '13.2 · 13.3 · 14.0 · 14.1 · 14.2 · 14.3 · 15.0', text: 'Use when the stack asks for FreeBSD.' },
  { name: 'openSUSE', versions: 'Leap 15', text: 'Use when the stack asks for openSUSE Leap 15.' },
  { name: 'CloudLinux', versions: '9', text: 'Use when the stack asks for CloudLinux 9.' },
  { name: 'Arch Linux', versions: 'Latest', text: 'Use when the stack asks for Arch Linux.' },
  { name: 'Oracle Linux', versions: '8 · 9', text: 'Use when the stack asks for Oracle Linux.' },
];

const resourceFit = [
  { icon: Cpu, number: '01', title: 'Concurrent work', text: 'Compare CPU against the application, services, workers, and expected load.' },
  { icon: MemoryStick, number: '02', title: 'Active services', text: 'Size memory for the OS plus web server, app processes, databases, panels, and jobs.' },
  { icon: HardDrive, number: '03', title: 'Files and data', text: 'Compare NVMe storage, bandwidth, region, and billing cycle on the current catalog.' },
];

const questions = [
  ['Can I order a cheap Linux VPS?', 'You can compare current Linux plan prices on the catalog, including Bronze at €9.50/month. Confirm the current price. StealthRDP does not claim to be the cheapest host.'],
  ['Which Linux distributions can I run?', 'AlmaLinux, Alpine Linux, CentOS, Debian, Fedora, FreeBSD, Rocky Linux, Ubuntu, openSUSE, CloudLinux, Arch Linux, and Oracle Linux are listed in the current public options.'],
  ['Can I run Ubuntu?', 'Yes. Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, and 26.04 LTS are listed.'],
  ['Do plans include Root?', 'Yes. VPS plans include full Root access.'],
  ['Are USA and EU Linux plans available?', 'Both appear in the public catalog. Confirm the region and current availability at checkout.'],
  ['When is it activated?', 'Standard installations are typically activated within 5 minutes. Most services are activated within 5–10 minutes after payment confirmation.'],
  ['How do I get credentials?', 'Credentials are sent by email after payment confirmation.'],
] as const;

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
              <Button asChild size="lg"><Link href="#linux-plans">Compare Linux VPS plans <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="#linux-distros">Linux distributions</Link></Button>
            </div>
          </div>
          <div className="sr-os-terminal" aria-label="Linux VPS deployment summary">
            <div className="sr-os-terminal-head"><Terminal /><span>Linux VPS</span></div>
            <code>$ stealth deploy --os linux --region eu</code>
            <div><span>access</span><strong>Root</strong></div>
            <div><span>images</span><strong>Ubuntu · Debian · Rocky · more</strong></div>
            <div><span>storage</span><strong>NVMe</strong></div>
            <p><Zap /> Confirm the exact image and version during checkout.</p>
          </div>
        </div>
      </section>

      <section className="sr-section" id="linux-plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Current VPS catalog</p><h2 className="sr-section-title">Choose your resource level</h2></div>
            <p>Compare the current displayed monthly price, CPU, RAM, NVMe storage, bandwidth, and region. Windows and Linux use this shared VPS catalog.</p>
          </div>
          <PricingExplorer guided={false} />
          <div className="sr-cta-inline">
            <div><span className="sr-location-code">Next step</span><h3>Choose the plan first. Select Windows or Linux in checkout.</h3><p>The existing checkout provides the operating-system selector before payment.</p></div>
            <Button asChild><a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">Configure this VPS <ArrowRight /></a></Button>
          </div>
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
              <Link href="/plans#linux-vps">Linux VPS catalog <ArrowRight /></Link>
              <Link href="/plans#comparison">Plan comparison <ArrowRight /></Link>
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
          <div className="sr-distro-grid">
            {distros.map(distro => (
              <article key={distro.name}>
                <Boxes />
                <h3>{distro.name}</h3>
                <strong>{distro.versions}</strong>
                <p>{distro.text}</p>
              </article>
            ))}
          </div>
          <div className="sr-section-link">
            <Link href="/docs/how-to-install-direct-admin-in-a-linux-server">How to install DirectAdmin in a Linux server <ArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-copy-grid">
          <div><p className="sr-kicker">Control</p><h2 className="sr-section-title">Root access</h2></div>
          <div className="sr-prose-block">
            <p>VPS plans include full Root access. You administer the server, keep backups of important data, and stay inside the published Use of Service terms.</p>
            <div className="sr-inline-links"><Link href="/docs/use-of-service">Use of Service terms <ArrowRight /></Link></div>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Resource fit</p><h2 className="sr-section-title">Size the machine to the stack</h2></div>
            <p>Count what runs at the same time: OS, web server, application, database, jobs, and files.</p>
          </div>
          <div className="sr-resource-grid">
            {resourceFit.map(({ icon: Icon, number, title, text }) => (
              <article key={number}><span>{number}</span><Icon /><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Regions</p><h2 className="sr-section-title">USA or EU</h2></div>
            <p>Choose the region that matches your users, your own location, and your latency needs.</p>
          </div>
          <div className="sr-location-grid">
            <article><div className="sr-location-mark"><MapPin /></div><div><span className="sr-location-code">USA</span><h3>United States</h3><p>USA Linux plans appear in the public catalog. Compare the current resource and availability details before checkout.</p></div><Link href="/plans">View plans <ArrowRight /></Link></article>
            <article><div className="sr-location-mark"><MapPin /></div><div><span className="sr-location-code">EU</span><h3>Europe</h3><p>EU Linux plans also appear in the public catalog. Confirm the current region and configuration in checkout.</p></div><Link href="/plans">View plans <ArrowRight /></Link></article>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container sr-order-grid">
          <article><Zap /><span className="sr-location-code">After payment</span><h3>Provisioning</h3><p>Standard Linux installations are typically activated within 5 minutes. Most services are activated within 5–10 minutes after payment confirmation.</p></article>
          <article><KeyRound /><span className="sr-location-code">Credentials</span><h3>Delivered by email</h3><p>Credentials arrive by email after payment confirmation.</p></article>
          <article><Server /><span className="sr-location-code">Support and limits</span><h3>Operate within the published terms</h3><p>Support is available through the client-area ticketing system and support email. Unlawful use, scanning, hacking, spam, and botnets are prohibited.</p></article>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Order steps</p><h2 className="sr-section-title">Order a Linux VPS</h2></div>
            <p>Move from your requirements to checkout without guessing at the resource level.</p>
          </div>
          <div className="sr-step-grid">
            <article><span>01</span><h3>Write down the image and services</h3><p>Start with the Linux image you need and the services you will run.</p></article>
            <article><span>02</span><h3>Compare the catalog</h3><p>Compare CPU, RAM, disk, region, bandwidth, and the current price.</p></article>
            <article><span>03</span><h3>Continue to checkout</h3><p>Select Linux and confirm the exact image and version there.</p></article>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border">
        <div className="sr-container">
          <div className="sr-section-head">
            <div><p className="sr-kicker">Common questions</p><h2 className="sr-section-title">Linux VPS questions</h2></div>
            <p>Quick answers for price, Ubuntu, access, regions, activation, and credentials.</p>
          </div>
          <div className="sr-qa-grid">
            {questions.map(([question, answer]) => (
              <article key={question}><h3>{question}</h3><p>{answer}</p></article>
            ))}
          </div>
          <div className="sr-cta-inline">
            <div><span className="sr-location-code">Choose another environment</span><h3>Need Windows instead?</h3><p>For familiar Windows software and remote Windows desktop or server access, see Windows VPS hosting.</p></div>
            <Button asChild variant="outline"><Link href="/windows-vps">Windows VPS hosting <ArrowRight /></Link></Button>
          </div>
        </div>
      </section>

      <section className="sr-section">
        <div className="sr-container sr-cta sr-cta-premium">
          <div><p className="sr-kicker">Linux VPS plans</p><h2>Compare Linux VPS plans</h2><p>Check the current plan, region, and displayed price, then confirm Linux and the exact image in checkout.</p></div>
          <div className="sr-actions">
            <Button asChild size="lg"><Link href="/plans#linux-vps">Compare plans <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline"><a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">Continue to checkout</a></Button>
          </div>
        </div>
      </section>
    </>
  );
}
