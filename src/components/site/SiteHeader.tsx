/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const links = [
  ['Plans', '/plans'],
  ['Windows VPS', '/windows-vps'],
  ['Linux VPS', '/linux-vps'],
  ['Docs', '/docs'],
  ['Status', '/status'],
] as const;

export function SiteHeader() {
  return (
    <header className="v3-header">
      <div className="sr-container v3-header-inner">
        <Link className="v3-logo" href="/" aria-label="StealthRDP home">
          <img src="https://cdn.stealthrdp.com/images/new/6.png" alt="StealthRDP" width="700" height="170" />
        </Link>

        <nav className="v3-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="v3-header-actions">
          <a className="v3-support-link" href="https://dash.stealthrdp.com/submitticket.php">
            Support <ArrowUpRight />
          </a>
          <Button asChild size="sm">
            <a href="https://dash.stealthrdp.com/index.php?rp=/login">Client Area</a>
          </Button>
        </div>

        <details className="v3-mobile-nav">
          <summary aria-label="Open navigation"><Menu /></summary>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            <Link href="/faq">FAQ</Link>
            <Link href="/about">About</Link>
            <a href="https://dash.stealthrdp.com/index.php?rp=/login">Client Area</a>
            <a href="https://dash.stealthrdp.com/submitticket.php">Support</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
