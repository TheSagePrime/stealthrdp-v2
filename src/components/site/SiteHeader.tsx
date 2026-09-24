/* eslint-disable @next/next/no-img-element */
import { Headphones, List as Menu } from '@phosphor-icons/react/dist/ssr';
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
    <header className="srv3-header">
      <div className="srv3-announcement">
        <div className="sr-container">
          <span>Windows & Linux VPS · USA + Europe</span>
          <a href="https://dash.stealthrdp.com/submitticket.php">
            <Headphones size={16} aria-hidden="true" />
            24/7 support
          </a>
        </div>
      </div>

      <div className="sr-container srv3-header-row">
        <Link className="srv3-logo" href="/" aria-label="StealthRDP home">
          <img
            src="https://cdn.stealthrdp.com/images/new/6.png"
            alt="StealthRDP"
            width="700"
            height="170"
          />
        </Link>

        <nav className="srv3-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>

        <div className="srv3-header-actions">
          <a className="srv3-login" href="https://dash.stealthrdp.com/index.php?rp=/login">
            Client area
          </a>
          <Button asChild size="sm">
            <Link href="/plans">
              View plans
            </Link>
          </Button>
        </div>

        <details className="srv3-mobile-nav">
          <summary>
            <Menu size={16} aria-hidden="true" />
            <span>Menu</span>
          </summary>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={href}>{label}</Link>
            ))}
            <Link href="/blog">Blog</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">About</Link>
            <a href="https://dash.stealthrdp.com/index.php?rp=/login">Client area</a>
            <a href="https://dash.stealthrdp.com/submitticket.php">Support</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
