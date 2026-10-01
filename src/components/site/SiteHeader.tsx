/* eslint-disable better-tailwindcss/no-unknown-classes */
'use client';

import { List as Menu } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppMark } from './WhatsAppMark';

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
          <Link href="/plans">VPS Plans</Link>
          <Link href="/citadel">DDoS Protection</Link>
          <Link href="/status">Server Status</Link>
          <Link href="/resources">Docs</Link>
          <Link href="/about">About</Link>
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
          <a className="srv3-login" href="https://dash.stealthrdp.com/index.php?rp=/login">
            Client Area
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
            <Link href="/plans" onClick={closeMobileNav}>VPS Plans</Link>
            <Link href="/citadel" onClick={closeMobileNav}>DDoS Protection</Link>
            <Link href="/resources" onClick={closeMobileNav}>Docs</Link>
            <a href="https://dash.stealthrdp.com/submitticket.php" onClick={closeMobileNav}>Support</a>
            <a href="https://dash.stealthrdp.com/index.php?rp=/login" onClick={closeMobileNav}>Client Area</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
