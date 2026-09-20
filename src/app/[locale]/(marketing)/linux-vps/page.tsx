import type { Metadata } from 'next';
import { Boxes, Code2, Gauge, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/linux-vps',
  title: 'Linux VPS Hosting — StealthRDP',
  description: 'Linux VPS hosting with full root access, NVMe storage, multiple distributions, USA and EU locations, and direct checkout.',
});

export default function LinuxVpsPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">Linux VPS hosting</p><h1 className="sr-title">Root access. <span>Your stack.</span></h1><p className="sr-lede">Run websites, APIs, bots, monitoring, development environments, VPN workloads, and general-purpose Linux infrastructure on your preferred supported image.</p><div className="sr-actions"><Button asChild size="lg"><a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">Choose a Linux VPS</a></Button></div></div></section>
      <section className="sr-section"><div className="sr-container"><div className="sr-feature-grid">
        <article className="sr-feature"><Server /><h3>Full root access</h3><p>Install packages, configure services, and operate the server around your workload.</p></article>
        <article className="sr-feature"><Boxes /><h3>Broad distro selection</h3><p>Current public options include Ubuntu, Debian, AlmaLinux, Rocky Linux, Fedora, Alpine, FreeBSD, and more.</p></article>
        <article className="sr-feature"><Gauge /><h3>NVMe-backed plans</h3><p>Choose resource tiers based on CPU, memory, and storage requirements.</p></article>
        <article className="sr-feature"><Code2 /><h3>Built for builders</h3><p>A practical fit for development, automation, web hosting, services, and personal infrastructure.</p></article>
      </div></div></section>
    </>
  );
}