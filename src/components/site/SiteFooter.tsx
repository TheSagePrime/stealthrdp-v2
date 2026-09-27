/* eslint-disable @next/next/no-img-element */
import { SiDiscord, SiInstagram, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const columns = [
  {
    title: 'Products',
    links: [
      ['All VPS plans', '/plans'],
      ['Windows VPS', '/windows-vps'],
      ['Linux VPS', '/linux-vps'],
      ['Build your own VPS', 'https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps'],
      ['Citadel protection', '/citadel'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Resources home', '/resources'],
      ['Guides', '/blog'],
      ['Help Center', '/docs'],
      ['Common questions', '/faq'],
      ['Server status', '/status'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Support', 'https://dash.stealthrdp.com/submitticket.php'],
      ['WhatsApp support', 'https://wa.me/447441426993'],
      ['Privacy', '/privacy'],
      ['Use of service', '/docs/use-of-service'],
      ['Windows licensing', '/docs/windows-licensing'],
    ],
  },
] as const;

/* Same four profiles the brand schema declares in src/config/seo.ts. Official marks from Simple Icons. */
const socials = [
  ['Discord', 'https://discord.gg/9JJFs4DDyF', SiDiscord],
  ['Telegram', 'https://t.me/StealthRDP', SiTelegram],
  ['X', 'https://x.com/stealthrdp', SiX],
  ['Instagram', 'https://www.instagram.com/stealth_rdp', SiInstagram],
] as const;

export function SiteFooter() {
  return (
    <footer className="srv3-footer">
      <div className="sr-container srv3-footer-shell">
        <div className="srv3-footer-main">
          <div className="srv3-footer-brand">
            <Link className="srv3-logo srv3-footer-logo" href="/" aria-label="StealthRDP home">
              <img
                src="https://cdn.stealthrdp.com/images/new/6.png"
                alt="StealthRDP"
                width="700"
                height="170"
                loading="lazy"
              />
            </Link>

            <p className="srv3-footer-description">
              Windows and Linux VPS infrastructure with USA and EU regions,
              NVMe storage and full administrative access.
            </p>

            <div className="srv3-footer-proof" aria-label="StealthRDP service highlights">
              <span><strong>USA + EU</strong> regions</span>
              <span><strong>24/7</strong> support</span>
            </div>

            <ul className="srv3-socials" aria-label="StealthRDP social links">
              {socials.map(([label, href, Mark]) => (
                <li key={label}>
                  <Button asChild variant="outline" size="icon-sm">
                    <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                      <Mark size={16} aria-hidden="true" />
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <nav className="srv3-footer-links" aria-label="Footer navigation">
            {columns.map(column => (
              <div className="srv3-footer-column" key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map(([label, href]) => (
                    <li key={href}>
                      {href.startsWith('http') ? (
                        <a href={href}>
                          <span>{label}</span>
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      ) : (
                        <Link href={href}>{label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="srv3-footer-bottom">
          <div className="srv3-footer-bottom-main">
            <span className="srv3-footer-copyright">© 2026 StealthRDP. All rights reserved.</span>
            <div className="srv3-footer-legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/docs/use-of-service">Use of service</Link>
              <Link href="/docs/windows-licensing">Windows licensing</Link>
            </div>
          </div>
          <div className="srv3-footer-bottom-note">
            <span>Billing and account management are handled in the StealthRDP client area.</span>
            <span className="srv3-footer-credit">Tux artwork by Larry Ewing, CC BY-SA 3.0.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
