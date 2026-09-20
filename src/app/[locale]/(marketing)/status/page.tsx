import type { Metadata } from 'next';
import { createPageMetadata } from '@/libs/seo/metadata';
import { uptime } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/status',
  title: 'Server Status — StealthRDP',
  description: 'Published StealthRDP service-status snapshot for USA, EU, website, control-panel, and infrastructure components.',
});

export default function StatusPage() {
  return (
    <>
      <section className="sr-page-hero"><div className="sr-container"><p className="sr-kicker">Service status</p><h1 className="sr-title">Infrastructure <span>at a glance.</span></h1><p className="sr-lede">This V2 build currently displays the published StealthRDP status snapshot migrated from the existing site. It is not presented as a live probe.</p></div></section>
      <section className="sr-section"><div className="sr-container"><div className="sr-status-grid">
        {uptime.monitors.map(monitor => (
          <article className="sr-status-card" key={monitor.label}>
            <div className="sr-status-line"><span className="sr-status-name">{monitor.label}</span><span className="sr-status-value">{monitor.status.toUpperCase()}</span></div>
            <p className="sr-muted">{monitor.region}</p>
            <div className="sr-status-line"><span className="sr-muted">Published uptime</span><b>{monitor.uptimeRatio}%</b></div>
          </article>
        ))}
      </div></div></section>
    </>
  );
}