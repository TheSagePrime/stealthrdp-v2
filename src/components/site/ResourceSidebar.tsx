import Link from 'next/link';

export function ResourceSidebar() {
  return (
    <nav className="srv-help-tree" aria-label="Resources">
      <div className="srv-help-tree-home">
        <Link href="/resources" data-active="true">
          <strong>Resources home</strong>
          <small>Everything you need to learn or get help</small>
        </Link>
      </div>

      <section className="srv-help-tree-group">
        <span className="srv-help-tree-heading">Learn</span>
        <ul>
          <li><Link href="/blog">Guides</Link></li>
          <li><Link href="/blog/vps-for-remote-desktop.html">Remote desktop</Link></li>
          <li><Link href="/blog/vps-for-web-hosting.html">Web hosting</Link></li>
          <li><Link href="/blog/vps-for-automation-bots.html">Automation &amp; bots</Link></li>
          <li><Link href="/blog/vps-for-trading.html">Trading infrastructure</Link></li>
          <li><Link href="/blog/vps-for-backups-storage.html">Backups &amp; storage</Link></li>
        </ul>
      </section>

      <section className="srv-help-tree-group">
        <span className="srv-help-tree-heading">Get help</span>
        <ul>
          <li><Link href="/docs">Help Center</Link></li>
          <li><Link href="/citadel/docs">Citadel Docs</Link></li>
          <li><Link href="/faq">Common questions</Link></li>
          <li><Link href="/status">Service status</Link></li>
        </ul>
      </section>

      <section className="srv-help-tree-group srv-help-tree-support">
        <span className="srv-help-tree-heading">Account</span>
        <ul>
          <li><a href="https://dash.stealthrdp.com/submitticket.php">Open support ticket ↗</a></li>
          <li><a href="https://dash.stealthrdp.com/clientarea.php">Client area ↗</a></li>
        </ul>
      </section>
    </nav>
  );
}
