import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';

export const metadata: Metadata = createPageMetadata({
  path: '/citadel',
  title: 'Layer 7 DDoS Protection — Citadel by StealthRDP',
  description:
    'Protect websites and HTTP/HTTPS applications from Layer 7 DDoS attacks with Citadel by StealthRDP: adaptive challenges, rate limits, lockdown mode, visibility, and origin protection.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const challengeLevels = [
  { name: 'Off', text: 'No challenge. Use for paths that must never be interrupted.' },
  { name: 'Cookie', text: 'Light check that filters the simplest automated traffic.' },
  { name: 'JS', text: 'Browser check that stops clients without a real engine.' },
  { name: 'Interaction', text: 'Human-interaction check for suspicious sessions.' },
  { name: 'Auto', text: 'Citadel picks the challenge strength from live traffic behavior.' },
  { name: 'Lockdown', text: 'Allowlist-only mode for active attack windows.' },
] as const;

const escalation = [
  'Normal — legitimate traffic passes untouched.',
  'Suspicious — rate and behavior signals mark the session.',
  'Challenge — the session faces a Cookie, JS, or Interaction check.',
  'Stronger challenge — failing sessions are escalated, not yet blocked.',
  'Lockdown — allowlisted traffic only while the attack continues.',
  'Recovery — controls relax automatically when traffic normalizes.',
] as const;

const controlGroups = [
  {
    title: 'Rates and strikes',
    text: 'Rate limiting with presets, temporary bans, and a strike system that escalates repeat offenders instead of blocking on a single signal.',
  },
  {
    title: 'Lists that stay managed',
    text: 'Managed blocklists plus IP, CIDR, user-agent, and path allowlists, so exclusions are explicit and reviewable.',
  },
  {
    title: 'Profiles, not guesswork',
    text: 'Protection profiles such as Balanced and Strict set the posture per domain; challenge levels apply per path.',
  },
  {
    title: 'Lockdown allowlist mode',
    text: 'One switch narrows a domain to known-good traffic during an active attack, then recovery reopens it automatically.',
  },
] as const;

const visibility = [
  { title: 'Traffic', text: 'See what reaches each protected domain and subdomain.' },
  { title: 'Attacks', text: 'Follow challenge outcomes and escalation as they happen.' },
  { title: 'Bandwidth and quota', text: 'Track clean-bandwidth use against the plan allowance.' },
  { title: 'Origin health', text: 'Monitor the origin behind Citadel and get webhook or email alerts.' },
] as const;

const plans = [
  {
    name: 'Starter',
    price: '€0',
    domains: '2 protected domains',
    bandwidth: '10 GB / month',
    text: 'Start protecting smaller websites with the same core Layer 7 controls.',
    checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-starter',
    featured: false,
  },
  {
    name: 'Growth',
    price: '€49',
    domains: '5 protected domains',
    bandwidth: '50 GB / month',
    text: 'For growing websites and applications that need more protected domains and traffic allowance.',
    checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-business',
    featured: true,
  },
  {
    name: 'Scale',
    price: '€149',
    domains: '10 protected domains',
    bandwidth: '100 GB / month',
    text: 'The largest self-serve allowance for multi-site protection and higher traffic.',
    checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-enterprise',
    featured: false,
  },
] as const;

const protectionFeatures = [
  'Cookie, JS & Interaction challenges',
  'Custom challenge templates',
  'Custom error pages',
  'Lockdown mode',
  'Citadel portal access',
] as const;

export default function CitadelPage() {
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <div className="srv-page srv-page-citadel">
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <section className="sr-page-hero srv-citadel-hero">
        <div className="sr-container">
          <p className="sr-kicker">Layer 7 DDoS protection</p>
          <h1 className="sr-title">
            Stop HTTP floods <span>before they reach your origin.</span>
          </h1>
          <p className="sr-lede">
            Meet <strong>Citadel</strong> — StealthRDP's Layer 7 DDoS protection for
            websites and HTTP/HTTPS applications. It adds challenge modes, rate
            limits, lockdown controls, attack visibility, and origin-aware protection
            in front of your server.
          </p>
          <div className="srv-citadel-hero-proof">
            <span><strong>Citadel</strong> by StealthRDP</span>
            <span>Starter plan <strong>€0 / month</strong></span>
            <span>Protect up to <strong>10 domains</strong></span>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <a href="#citadel-plans">
                View protection plans
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://citadel.stealthrdp.com">Open Citadel portal</a>
            </Button>
          </div>
          <p className="sr-micro">
            Citadel protects Layer 7 HTTP/HTTPS traffic. It does not replace Layer 3/4
            network mitigation and does not protect non-HTTP protocols.
          </p>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-citadel-pricing" id="citadel-plans" aria-label="Citadel protection plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Citadel plans</p>
              <h2 className="sr-section-title">Same protection controls. Choose the allowance.</h2>
            </div>
            <p>
              Every current tier includes the core Citadel challenge, customization,
              lockdown, and portal features. Choose by protected domains and monthly
              bandwidth.
            </p>
          </div>

          <div className="srv-citadel-plans">
            {plans.map(plan => (
              <Card
                key={plan.name}
                className="srv-citadel-plan"
                data-featured={plan.featured ? 'true' : undefined}
              >
                <div className="srv-citadel-plan-head">
                  <div>
                    <span>{plan.featured ? 'Most popular' : 'Citadel'}</span>
                    <h3>{plan.name}</h3>
                  </div>
                  <div className="srv-citadel-price">
                    <strong>{plan.price}</strong>
                    <small>/ month</small>
                  </div>
                </div>

                <p className="srv-citadel-plan-copy">{plan.text}</p>

                <dl className="srv-citadel-allowances">
                  <div>
                    <dt>Domains</dt>
                    <dd>{plan.domains}</dd>
                  </div>
                  <div>
                    <dt>Bandwidth</dt>
                    <dd>{plan.bandwidth}</dd>
                  </div>
                </dl>

                <ul className="srv-citadel-feature-list">
                  {protectionFeatures.map(feature => <li key={feature}>{feature}</li>)}
                </ul>

                <Button asChild variant={plan.featured ? 'default' : 'outline'}>
                  <a href={plan.checkout}>
                    Choose {plan.name}
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </Button>
              </Card>
            ))}
          </div>

          <div className="srv3-section-action">
            <Button asChild variant="ghost">
              <a href="https://dash.stealthrdp.com/store/layer-7-ddos-protection">
                View all Layer 7 DDoS plans
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="sr-section" aria-label="Citadel architecture">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Architecture</p>
              <h2 className="sr-section-title">One path: edge, decision layer, origin</h2>
            </div>
            <p>Every request flows through the same three stages, in order.</p>
          </div>
          <ol className="srv-citadel-flow grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Cloudflare', text: 'Network edge and DNS layer. Absorbs what the edge is built for.' },
              { step: '02', title: 'Citadel decision layer', text: 'Application-aware checks: challenges, rates, lists, caching, and escalation.' },
              { step: '03', title: 'Cache, then origin', text: 'Per-domain caching absorbs repeats; clean requests reach the origin.' },
            ].map(item => (
              <Card key={item.step} className="srv-citadel-stage gap-2 p-8">
                <span className="text-micro font-bold text-body-dim tabular-nums">
                  {item.step}
                </span>
                <h3 className="text-heading-4 font-semibold text-body-text">{item.title}</h3>
                <p className="text-small text-body-muted">{item.text}</p>
              </Card>
            ))}
          </ol>
        </div>
      </section>

      <section className="sr-section sr-section-border" aria-label="Problems Citadel addresses">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Problem</p>
            <h2 className="sr-section-title">The edge stops floods. The app still feels the bots.</h2>
          </div>
          <div className="sr-prose-block">
            <p>
              HTTP floods, abusive scrapers, credential-stuffing waves, and
              application-layer pressure reach past network defenses because they
              look like ordinary web traffic. The origin pays for every one of
              those requests in CPU, database load, and bandwidth.
            </p>
            <p>
              Citadel exists for that gap: decisions made per request, per path,
              per session — before the origin spends anything.
            </p>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border" aria-label="Adaptive protection">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Adaptive protection</p>
              <h2 className="sr-section-title">Escalate with the attack. Recover without a ticket.</h2>
            </div>
            <p>Sessions move up and back down the ladder from observed behavior — nobody babysits a dashboard mid-attack.</p>
          </div>
          <ol className="srv-citadel-ladder grid list-none gap-0 p-0">
            {escalation.map((step, index) => (
              <li
                key={step}
                className="grid gap-3 border-t border-divider py-6 last:border-b sm:grid-cols-[auto_1fr] sm:items-start sm:gap-x-6"
              >
                <span className="text-micro font-bold text-body-dim tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-body text-body-text">{step}</p>
              </li>
            ))}
          </ol>
          <div className="sr-section-head" style={{ marginTop: '48px' }}>
            <div>
              <p className="sr-kicker">Challenge levels</p>
              <h2 className="sr-section-title">Pick the strength per path</h2>
            </div>
          </div>
          <ul className="srv-citadel-levels grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challengeLevels.map(level => (
              <Card key={level.name} className="srv-citadel-level gap-2 p-6">
                <h3 className="text-heading-4 font-semibold text-body-text">{level.name}</h3>
                <p className="text-small text-body-muted">{level.text}</p>
              </Card>
            ))}
          </ul>
        </div>
      </section>

      <section className="sr-section sr-section-border" aria-label="Citadel controls">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Controls</p>
              <h2 className="sr-section-title">Explicit rules instead of mystery blocks</h2>
            </div>
          </div>
          <div className="srv-citadel-controls grid gap-6 md:grid-cols-2">
            {controlGroups.map(group => (
              <Card key={group.title} className="srv-citadel-control gap-2 p-8">
                <h3 className="text-heading-4 font-semibold text-body-text">{group.title}</h3>
                <p className="text-small text-body-muted">{group.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border" aria-label="Citadel visibility">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Visibility</p>
              <h2 className="sr-section-title">See what was stopped and what it cost</h2>
            </div>
          </div>
          <div className="srv-citadel-visibility grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibility.map(item => (
              <Card key={item.title} className="srv-citadel-visibility-item gap-2 p-6">
                <h3 className="text-heading-4 font-semibold text-body-text">{item.title}</h3>
                <p className="text-small text-body-muted">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border" aria-label="Operational confidence">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Operations</p>
            <h2 className="sr-section-title">Protection that reports for duty</h2>
          </div>
          <div className="sr-prose-block">
            <p>
              Origin-health monitoring watches the server behind Citadel.
              Webhook and email alerts fire when protection escalates or the
              origin struggles. Automatic recovery relaxes controls when traffic
              normalizes — no manual stand-down.
            </p>
            <p>
              Teams get roles for shared operation, and provisioning runs through
              the existing WHMCS billing relationship.
            </p>
            <div className="sr-inline-links">
              <a href="https://citadel.stealthrdp.com/docs">
                Citadel docs
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <Link href="/status">
                VPS infrastructure status
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-section srv3-final-section">
        <div className="sr-container">
          <Card className="srv-site-final srv-citadel-final gap-8 rounded-lg p-8 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12 md:p-12">
            <div className="grid gap-2">
              <p className="sr-kicker">Layer 7 DDoS protection · Citadel</p>
              <h2 className="text-display-2 font-semibold text-body-text">
                Put Citadel in front of the origin.
              </h2>
              <p className="max-w-xl text-small text-body-muted">
                Start free or choose a larger allowance for more domains and traffic,
                then manage protection from the Citadel portal.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 md:min-w-48">
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/store/layer-7-ddos-protection">
                  Choose a protection plan
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="https://citadel.stealthrdp.com/docs">Read the docs</a>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
