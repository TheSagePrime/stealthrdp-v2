/* eslint-disable @next/next/no-img-element */
import { ExternalLink, Instagram, MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';

const socialLinks = [
  { label: 'X', href: 'https://x.com/stealthrdp', icon: ExternalLink },
  { label: 'Instagram', href: 'https://www.instagram.com/stealth_rdp', icon: Instagram },
  { label: 'Discord', href: 'https://discord.gg/9JJFs4DDyF', icon: MessageCircle },
  { label: 'Telegram', href: 'https://t.me/StealthRDP', icon: Send },
] as const;

export function SiteFooter() {
  return (
    <footer className="sr-footer">
      <div className="sr-container">
        <div className="sr-footer-grid">
          <div className="sr-footer-brand">
            <Link className="sr-logo" href="/" aria-label="StealthRDP home">
              <img src="https://cdn.stealthrdp.com/images/new/6.png" alt="StealthRDP" width="700" height="170" />
            </Link>
            <p>Windows and Linux VPS infrastructure with USA and EU locations, full administrative access, and direct WHMCS checkout.</p>
            <div className="sr-social-links" aria-label="StealthRDP social links">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h2>Products</h2>
            <ul>
              <li><Link href="/plans">RDP plans</Link></li>
              <li><Link href="/windows-vps">Windows VPS hosting</Link></li>
              <li><Link href="/linux-vps">Linux VPS hosting</Link></li>
              <li><a href="https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps">Build Your Own VPS</a></li>
              <li><a href="https://dash.stealthrdp.com/index.php?rp=/store">Order server</a></li>
            </ul>
          </div>
          <div>
            <h2>Resources</h2>
            <ul>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/blog">Tutorials</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/status">Server status</Link></li>
            </ul>
          </div>
          <div>
            <h2>Company</h2>
            <ul>
              <li><Link href="/about">About us</Link></li>
              <li><a href="https://dash.stealthrdp.com/submitticket.php">Contact support</a></li>
              <li><Link href="/privacy">Privacy policy</Link></li>
              <li><Link href="/docs/use-of-service">Terms of service</Link></li>
              <li><Link href="/docs/windows-licensing">Windows licensing</Link></li>
            </ul>
          </div>
        </div>
        <div className="sr-footer-bottom">
          <span>© 2026 StealthRDP. All rights reserved.</span>
          <span>Public website · Billing and client services continue through dash.stealthrdp.com</span>
        </div>
      </div>
    </footer>
  );
}
