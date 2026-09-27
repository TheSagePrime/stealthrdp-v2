/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';
import { List as Menu, WhatsappLogo } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const resourceLinks = [
  ['Resources home', '/resources'],
  ['Guides', '/blog'],
  ['Help Center', '/docs'],
  ['Citadel Docs', '/citadel/docs'],
  ['Common Questions', '/faq'],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState<'resources' | null>(null);
  const mobileNavRef = useRef<HTMLDetailsElement>(null);

  const closeMobileNav = () => {
    if (mobileNavRef.current) mobileNavRef.current.open = false;
  };

  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(null);
    }
  };

  const groupProps = (name: 'resources') => ({
    'data-open': open === name,
    onMouseEnter: () => setOpen(name),
    onMouseLeave: () => setOpen(null),
    /* Keyboard focus also drives the open state, so aria-expanded never lies. */
    onFocus: () => setOpen(name),
    onBlur: (event: React.FocusEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null);
    },
  });

  const buttonProps = (name: 'resources', menuId: string) => ({
    'aria-expanded': open === name,
    'aria-controls': menuId,
    onClick: () => setOpen(open === name ? null : name),
    onKeyDown: closeOnEscape,
  });

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

        <nav className="srv3-nav" aria-label="Main navigation" onKeyDown={closeOnEscape}>
          <Link href="/plans">VPS Plans</Link>
          <Link href="/citadel">DDoS Protection</Link>
          <Link href="/status">Server Status</Link>
          <div className="srv3-nav-group" {...groupProps('resources')}>
            <button type="button" className="srv3-nav-label" {...buttonProps('resources', 'nav-menu-resources')}>
              Resources
            </button>
            <ul className="srv3-nav-menu" id="nav-menu-resources" aria-label="Resources">
              {resourceLinks.map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
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
            <WhatsappLogo size={16} weight="fill" aria-hidden="true" />
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
          <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
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
            <Link href="/resources" onClick={closeMobileNav}>Resources</Link>
            <a href="https://dash.stealthrdp.com/submitticket.php" onClick={closeMobileNav}>Support</a>
            <a href="https://dash.stealthrdp.com/index.php?rp=/login" onClick={closeMobileNav}>Client Area</a>
          </nav>
        </details>
      </div>
    </header>
  );
}
