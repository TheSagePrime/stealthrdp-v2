import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Gauge,
  Globe2,
  HardDrive,
  Network,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pill } from '@/components/ui/pill';
import { uptime } from '@/lib/stealth/content';

const highlights = [
  { value: '10,000+', label: 'orders delivered' },
  { value: '99.9%', label: 'uptime SLA' },
  { value: '60 sec', label: 'average deploy' },
  { value: 'USA + EU', label: 'server regions' },
];

const rail = [
  { icon: Zap, label: 'Instant deployment' },
  { icon: ShieldCheck, label: '99.9% uptime SLA' },
  { icon: HardDrive, label: 'NVMe storage' },
  { icon: Globe2, label: 'USA + EU regions' },
  { icon: Activity, label: '24/7 monitoring' },
];

const systems = [
  'Debian',
  'CentOS',
  'Rocky Linux',
  'Ubuntu',
  'Fedora',
  'FreeBSD',
  'Alpine Linux',
  'AlmaLinux',
  'Windows',
];

/**
 * The hero's status device. Relocated here from the feedback section so the
 * hero carries one purposeful operational object instead of a decorative
 * progress bar (review R1 + R2). Copy is unchanged.
 */
const statusRows = [
  { icon: Server, label: 'Compute node 01', state: 'online' },
  { icon: HardDrive, label: 'NVMe storage pool', state: 'healthy' },
  { icon: Network, label: 'Network edge', state: 'connected' },
];

const statusMeta = [
  { term: 'Virtualization', value: 'Isolated VMs' },
  { term: 'Regions', value: 'USA + EU' },
  { term: 'Access', value: 'Full admin' },
];

function stateLabel(status: string): string {
  if (status === 'up') return 'Operational';
  if (status === 'degraded') return 'Degraded';
  if (status === 'down') return 'Down';
  if (status === 'paused') return 'Paused';
  return 'Unknown';
}

function pillState(status: string): 'ok' | 'warn' | 'bad' | 'unknown' {
  if (status === 'up') return 'ok';
  if (status === 'degraded') return 'warn';
  if (status === 'down') return 'bad';
  return 'unknown';
}

/**
 * DESIGN.md section 9, position 1: one claim, one primary action, one secondary,
 * and a proof strip carrying real numbers plus the live status.
 */
export function HomeHero() {
  const monitors = uptime.monitors ?? [];
  const worst = monitors.find(monitor => monitor.status !== 'up')?.status ?? 'up';
  const live = monitors.length > 0 && uptime.stat === 'ok';

  return (
    <>
      <section className="sr-hero">
        <div className="sr-container sr-hero-grid">
          <div className="sr-hero-copy">
            <div className="sr-kicker-row">
              <span className="sr-live-dot" aria-hidden="true" />
              <p className="sr-kicker">Windows & Linux VPS · Instant setup</p>
            </div>

            <h1 className="sr-title">
              Your server.
              <span>Live in 60 seconds.</span>
            </h1>

            <p className="sr-lede">
              Serious VPS infrastructure without the usual hosting friction.
              Enterprise hardware, full admin access and a 99.9% uptime SLA —
              ready when your work is.
            </p>

            <div className="sr-actions">
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/index.php?rp=/store/standard-usa-rdp-vps">
                  Deploy a server
                  <ArrowRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="sr-button-inverse">
                <Link href="/plans">Explore plans</Link>
              </Button>
            </div>

            <p className="sr-micro">
              From €9.50/month · No hidden fees · Cancel anytime · 7-day money-back
            </p>

            <div className="sr-hero-proof" aria-label="StealthRDP highlights">
              {highlights.map(item => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sr-hero-stage" aria-label="StealthRDP infrastructure preview">
            <div className="sr-server-card">
              <div className="sr-server-card-head">
                <div>
                  <h2>Silver USA</h2>
                </div>
                <div className="sr-server-icon">
                  <Cpu aria-hidden="true" />
                </div>
              </div>

              <div className="sr-server-metrics">
                <div><span>vCPU</span><strong>2 cores</strong></div>
                <div><span>Memory</span><strong>8 GB</strong></div>
                <div><span>Storage</span><strong>80 GB NVMe</strong></div>
                <div><span>Traffic</span><strong>Unlimited</strong></div>
              </div>

              <div className="sr-activity-meta">
                <span>Windows / Linux</span>
                <span>USA region</span>
              </div>

              <div className="sr-status-device">
                <ol className="sr-provision-list">
                  {statusRows.map(({ icon: Icon, label, state }, index) => (
                    <li className="sr-provision-step" key={label}>
                      <span className="sr-provision-num">{`0${index + 1}`}</span>
                      <span className="sr-provision-icon">
                        <Icon aria-hidden="true" />
                      </span>
                      <div className="sr-provision-body">
                        <strong>{label}</strong>
                      </div>
                      <span className="sr-provision-state">
                        <CheckCircle2 aria-hidden="true" />
                        {state}
                      </span>
                    </li>
                  ))}
                </ol>

                <dl className="sr-provision-meta">
                  {statusMeta.map(item => (
                    <div key={item.term}>
                      <dt>{item.term}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="sr-stage-float">
              <Gauge aria-hidden="true" />
              <span>
                <strong>Fast setup</strong>
                <small>built to be ready in minutes</small>
              </span>
            </div>
            <div className="sr-stage-float">
              <Globe2 aria-hidden="true" />
              <span>
                <strong>USA + EU</strong>
                <small>choose your region</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-proof-rail" aria-label="Platform strengths">
        <div className="sr-container sr-proof-rail-inner">
          <Pill state={pillState(live ? worst : 'unknown')} icon={<CheckCircle2 aria-hidden="true" />}>
            {live ? stateLabel(worst) : stateLabel('unknown')}
          </Pill>
          {rail.map(({ icon: Icon, label }) => (
            <span key={label}>
              <Icon aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="sr-os-strip">
        <div className="sr-container sr-os-row">
          <span className="sr-os-label">Deploy your preferred OS</span>
          {systems.map(system => <span className="sr-os-pill" key={system}>{system}</span>)}
        </div>
      </section>
    </>
  );
}
