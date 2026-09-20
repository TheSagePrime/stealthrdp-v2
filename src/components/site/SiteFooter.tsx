/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

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
          </div>
          <div>
            <h2>Products</h2>
            <ul>
              <li><Link href="/plans">VPS plans</Link></li>
              <li><Link href="/windows-vps">Windows VPS</Link></li>
              <li><Link href="/linux-vps">Linux VPS</Link></li>
              <li><a href="https://dash.stealthrdp.com/index.php?rp=/store">Order server</a></li>
            </ul>
          </div>
          <div>
            <h2>Resources</h2>
            <ul>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/status">Server status</Link></li>
            </ul>
          </div>
          <div>
            <h2>Company</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><a href="https://dash.stealthrdp.com/submitticket.php">Support</a></li>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/docs/use-of-service">Terms</Link></li>
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