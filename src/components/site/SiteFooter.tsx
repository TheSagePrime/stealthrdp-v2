/* eslint-disable @next/next/no-img-element */
import { SiDiscord, SiInstagram, SiTelegram, SiX } from '@icons-pack/react-simple-icons';
import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

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
      ['Docs', '/docs'],
      ['Blog', '/blog'],
      ['Minecraft VPS guide', '/vps-hosting-minecraft'],
      ['FAQ', '/faq'],
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
      <div className="sr-container">
        <div className="srv3-footer-top">
          <div className="srv3-footer-brand">
            <Link className="srv3-logo" href="/" aria-label="StealthRDP home">
              <img
                src="https://cdn.stealthrdp.com/images/new/6.png"
                alt="StealthRDP"
                width="700"
                height="170"
                loading="lazy"
              />
            </Link>
            <p>
              Windows and Linux VPS infrastructure with USA and EU regions,
              NVMe storage and full administrative access.
            </p>
            <ul className="srv3-socials">
              {socials.map(([label, href, Mark]) => (
                <li key={label}>
                  <Button asChild variant="outline" size="sm">
                    <a href={href} target="_blank" rel="noreferrer">
                      <Mark size={16} aria-hidden="true" />
                      {label}
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="srv3-footer-links">
            {columns.map(column => (
              <div key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map(([label, href]) => (
                    <li key={href}>
                      {href.startsWith('http') ? (
                        <a href={href}>
                          {label}
                          <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                      ) : (
                        <Link href={href}>{label}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mt-12" />

        <div className="srv3-footer-bottom">
          <span>© 2026 StealthRDP. All rights reserved.</span>
          <span>Billing and account management are handled in the StealthRDP client area.</span>
          <span>Tux artwork by Larry Ewing, CC BY-SA 3.0.</span>
        </div>
      </div>
    </footer>
  );
}
