/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const columns = [
  {
    title: 'Products',
    links: [
      ['All VPS plans', '/plans'],
      ['Windows VPS', '/windows-vps'],
      ['Linux VPS', '/linux-vps'],
      ['Build your own VPS', 'https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps'],
    ],
  },
  {
    title: 'Resources',
    links: [
      ['Documentation', '/docs'],
      ['Tutorials', '/blog'],
      ['FAQ', '/faq'],
      ['Server status', '/status'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Support', 'https://dash.stealthrdp.com/submitticket.php'],
      ['Privacy', '/privacy'],
      ['Terms of service', '/docs/use-of-service'],
    ],
  },
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
              />
            </Link>
            <p>
              Windows and Linux VPS infrastructure with USA and EU regions,
              NVMe storage and full administrative access.
            </p>
            <div className="srv3-socials">
              <a href="https://discord.gg/9JJFs4DDyF" target="_blank" rel="noreferrer">
                Discord
              </a>
              <a href="https://t.me/StealthRDP" target="_blank" rel="noreferrer">
                Telegram
              </a>
            </div>
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
                          <ArrowUpRight aria-hidden="true" />
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

        <div className="srv3-footer-bottom">
          <span>© 2026 StealthRDP. All rights reserved.</span>
          <span>Billing and account management are handled in the StealthRDP client area.</span>
        </div>
      </div>
    </footer>
  );
}
