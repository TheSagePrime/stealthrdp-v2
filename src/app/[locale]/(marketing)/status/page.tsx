import type { Metadata } from 'next';
import { StatusGrid } from '@/components/site/StatusGrid';
import { createPageMetadata } from '@/libs/seo/metadata';
import { uptime } from '@/lib/stealth/content';

export const metadata: Metadata = createPageMetadata({
  path: '/status',
  title: 'Server Status — StealthRDP',
  description: 'Live StealthRDP service status, current availability, and 90-day uptime history for protected service components.',
});

export default function StatusPage() {
  const fallback = {
    stat: uptime.stat,
    checkedAt: null,
    monitors: uptime.monitors.map(monitor => ({
      label: monitor.label,
      region: monitor.region,
      status: monitor.status,
      uptimeRatio: monitor.uptimeRatio,
    })),
  };

  return (
    <>
      <section className="sr-page-hero">
        <div className="sr-container sr-page-hero-inner">
          <div>
            <p className="sr-kicker">Service status</p>
            <h1 className="sr-title">Infrastructure <span>at a glance.</span></h1>
            <p className="sr-lede">The page renders the last published safe snapshot immediately, then refreshes from StealthRDP’s public UptimeRobot status feed without exposing provider IDs or raw monitor targets.</p>
          </div>
          <div className="sr-page-hero-aside">
            <span className="sr-live-dot" aria-hidden="true" />
            <strong>Public health snapshot</strong>
            <span>Live refresh when available</span>
          </div>
        </div>
      </section>
      <section className="sr-section">
        <div className="sr-container">
          <StatusGrid fallback={fallback} />
        </div>
      </section>
    </>
  );
}
