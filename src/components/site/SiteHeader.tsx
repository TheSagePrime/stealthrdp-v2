/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import { List as Menu } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppMark } from './WhatsAppMark';

const LOGIN_URL = 'https://dash.stealthrdp.com/index.php?rp=/login';

/* One list for the desktop bar and the mobile menu, so the two always match. */
const mainLinks = [
  ['VPS Plans', '/plans'],
  ['DDoS Protection', '/citadel'],
  ['Server Status', '/status'],
  ['Resources', '/resources'],
  ['About', '/about'],
] as const;

export function SiteHeader() {
  const mobileNavRef = useRef<HTMLDetailsElement>(null);

  const closeMobileNav = () => {
    if (mobileNavRef.current) {
      mobileNavRef.current.open = false;
    }
  };

  return (
    <header className="srv3-header">
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
          {mainLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>

        <div className="srv3-header-actions">
          <a
            className="srv3-whatsapp-link"
            href="https://wa.me/447441426993"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with StealthRDP support on WhatsApp"
          >
            <WhatsAppMark size={26} />
            <span>WhatsApp</span>
          </a>
          <a className="srv3-login" href={LOGIN_URL}>
            Log In
          </a>
          <Button asChild size="sm">
            <Link href="/plans">
              View plans
            </Link>
          </Button>
        </div>

        <a
          className="srv3-mobile-whatsapp"
          href="https://wa.me/447441426993"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with StealthRDP support on WhatsApp"
        >
          <WhatsAppMark size={38} />
          <span className="sr-visually-hidden">WhatsApp support</span>
        </a>

        <details ref={mobileNavRef} className="srv3-mobile-nav">
          <summary>
            <Menu size={16} aria-hidden="true" />
            <span>Menu</span>
          </summary>
          <nav aria-label="Mobile navigation">
            {mainLinks.map(([label, href]) => <Link key={href} href={href} onClick={closeMobileNav}>{label}</Link>)}
            <hr className="srv3-mobile-nav-divider" />
            <a href="https://dash.stealthrdp.com/submitticket.php" onClick={closeMobileNav}>Support</a>
            <a href={LOGIN_URL} onClick={closeMobileNav}>Log In</a>
            <div className="srv3-mobile-nav-cta">
              <Button asChild size="sm">
                <Link href="/plans" onClick={closeMobileNav}>View plans</Link>
              </Button>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
