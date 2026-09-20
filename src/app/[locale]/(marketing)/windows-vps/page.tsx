import type { Metadata } from 'next';
import { Monitor, ShieldCheck, Terminal, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/windows-vps',
  title: 'Windows VPS Hosting — StealthRDP',
  description: 'Windows VPS infrastructure with administrative access, USA and EU regions, NVMe storage, and remote desktop connectivity.',
});

export default function WindowsVpsPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">Windows VPS hosting</p><h1 className="sr-title">A Windows server you can <span>actually control.</span></h1><p className="sr-lede">Deploy remote Windows infrastructure, connect over RDP, and manage the server through the existing StealthRDP client and server-control flow.</p><div className="sr-actions"><Button asChild size="lg"><a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">View Windows-capable plans</a></Button><Button asChild variant="outline" size="lg"><Link href="/docs/windows-licensing">Windows licensing</Link></Button></div></div></section>
      <section className="sr-section"><div className="sr-container"><div className="sr-feature-grid">
        <article className="sr-feature"><Monitor /><h3>Remote Desktop access</h3><p>Use standard RDP clients to connect to supported Windows Server installations.</p></article>
        <article className="sr-feature"><Terminal /><h3>Administrator control</h3><p>Operate software and server settings with the access level defined by your service.</p></article>
        <article className="sr-feature"><Zap /><h3>Fast provisioning path</h3><p>Choose a plan, complete checkout, and follow the normal provisioning workflow.</p></article>
        <article className="sr-feature"><ShieldCheck /><h3>Licensing made explicit</h3><p>StealthRDP provides infrastructure; Microsoft licensing remains the customer’s responsibility.</p></article>
      </div></div></section>
    </>
  );
}