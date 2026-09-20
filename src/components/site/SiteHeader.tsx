/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const links = [
  ['Plans', '/plans'],
  ['Windows VPS', '/windows-vps'],
  ['Linux VPS', '/linux-vps'],
  ['Status', '/status'],
  ['Docs', '/docs'],
  ['Blog', '/blog'],
  ['FAQ', '/faq'],
] as const;

export function SiteHeader() {
  return (
    <header className="sr-header">
      <div className="sr-container sr-header-inner">
        <Link className="sr-logo" href="/" aria-label="StealthRDP home">
          <img src="https://cdn.stealthrdp.com/images/new/6.png" alt="StealthRDP" width="700" height="170" />
        </Link>
        <nav className="sr-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="sr-header-action">
          <Button asChild size="sm">
            <a href="https://dash.stealthrdp.com/index.php?rp=/login">Client Area</a>
          </Button>
        </div>
      </div>
    </header>
  );
}