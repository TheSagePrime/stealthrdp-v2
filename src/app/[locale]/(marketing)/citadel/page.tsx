import type { Metadata } from 'next';
import {
  ArrowRight,
  BellRinging,
  Browser,
  Cloud,
  Database,
  Fingerprint,
  Funnel,
  Gauge,
  Lock,
  Pulse,
  ShieldCheck,
  Stack,
  Target,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CitadelTelemetryPreview } from '@/components/site/CitadelTelemetryPreview';
import { CitadelMotionScene } from '@/components/site/CitadelMotionScene';
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

const plans = [
  {
    name: 'Starter',
    price: '€0',
    domains: '2 domains',
    bandwidth: '10 GB / month',
    text: 'For smaller websites that want the same core request controls.',
    checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-starter',
    featured: false,
  },
  {
    name: 'Growth',
    price: '€49',
    domains: '5 domains',
    bandwidth: '50 GB / month',
    text: 'For production sites that need more protected domains and traffic.',
    checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-business',
    featured: true,
  },
  {
    name: 'Scale',
    price: '€149',
    domains: '10 domains',
    bandwidth: '100 GB / month',
    text: 'For multi-site deployments and larger clean-traffic allowances.',
    checkout: 'https://dash.stealthrdp.com/store/layer-7-ddos-protection/citadel-enterprise',
    featured: false,
  },
] as const;

const threats = [
  {
    icon: Pulse,
    title: 'HTTP floods',
    text: 'High request volume that looks valid enough to make the application and database do real work.',
    response: 'Rate signals → challenge → strike / temporary ban',
  },
  {
    icon: Fingerprint,
    title: 'Credential stuffing',
    text: 'Repeated authentication attempts that target expensive login paths instead of the whole site.',
    response: 'Path policy → session signals → stronger challenge',
  },
  {
    icon: Browser,
    title: 'Headless automation',
    text: 'Bots and scrapers that can pass simple network checks but do not behave like a normal browser session.',
    response: 'JS / Interaction challenge → escalation',
  },
  {
    icon: Gauge,
    title: 'Burst abuse',
    text: 'Short spikes that should not permanently block a customer, but still need an immediate response.',
    response: 'Preset limit → strike → timed recovery',
  },
] as const;

const controls = [
  {
    icon: Target,
    title: 'Challenge levels and path bypasses',
    text: 'Choose a domain challenge level, then bypass specific API and webhook paths that cannot complete browser challenges.',
  },
  {
    icon: Funnel,
    title: 'Rate limits and strikes',
    text: 'Escalate repeat offenders with thresholds, temporary bans and strike history instead of one blunt rule.',
  },
  {
    icon: Lock,
    title: 'Explicit allowlists',
    text: 'Allow by path, IP, CIDR or user agent. Lockdown narrows a domain to known-good traffic during an attack.',
  },
  {
    icon: Database,
    title: 'Cache before origin',
    text: 'Per-domain caching can absorb repeated clean requests before your application pays the compute cost.',
  },
  {
    icon: BellRinging,
    title: 'Operational alerts',
    text: 'Origin-health monitoring plus webhook and email notifications keep the protection loop visible.',
  },
  {
    icon: Stack,
    title: 'Profiles that stay understandable',
    text: 'Balanced and Strict give each domain a known posture while route rules handle the exceptions.',
  },
] as const;

export default function CitadelPage() {
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <div className="srv-page srv-page-citadel srv-citadel-v2">
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <section className="srv-citadel-v2-hero">
        <div className="sr-container srv-citadel-v2-hero-grid">
          <div className="srv-citadel-v2-copy">
            <Badge variant="outline" className="srv-citadel-v2-eyebrow">
              <ShieldCheck size={14} weight="fill" aria-hidden="true" />
              Citadel · Layer 7 DDoS protection
            </Badge>
            <h1>Make every request <span>earn its way to the origin.</span></h1>
            <p>
              Citadel sits in front of HTTP/HTTPS applications and decides what should
              pass, be challenged, slowed, cached, escalated or blocked — before your
              origin spends CPU, database work and bandwidth.
            </p>
            <div className="srv-citadel-v2-actions">
              <Button asChild size="lg">
                <a href="#citadel-plans">Choose protection <ArrowRight size={16} aria-hidden="true" /></a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/citadel/docs/getting-started">Read Citadel setup guide</Link>
              </Button>
            </div>
            <div className="srv-citadel-v2-facts">
              <span><strong>€0</strong> starter tier</span>
              <span><strong>6</strong> challenge modes</span>
              <span><strong>Per-path</strong> policy</span>
            </div>
          </div>

          <CitadelMotionScene />
        </div>
      </section>

      <section className="srv-citadel-v2-band">
        <div className="sr-container">
          <Alert tone="info" className="srv-citadel-v2-scope">
            <div>
              <AlertTitle>Citadel protects the application layer.</AlertTitle>
              <AlertDescription>
                It is designed for Layer 7 HTTP/HTTPS traffic. Protected hostnames need
                proxied Cloudflare DNS records; network-layer mitigation remains a separate edge task.
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </section>

      <section className="srv-citadel-v2-section">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">Request path</p>
              <h2>Three layers. One reason: keep expensive traffic away from the origin.</h2>
            </div>
            <p>
              The architecture is easier to understand as a decision pipeline than a
              wall of security features.
            </p>
          </div>

          <div className="srv-citadel-v2-layers">
            {[
              {
                icon: Cloud,
                step: '01',
                title: 'Edge',
                tag: 'Cloudflare orange cloud',
                text: 'A proxied Cloudflare DNS record forwards protected web traffic to Citadel. DNS-only records bypass this protection.',
              },
              {
                icon: ShieldCheck,
                step: '02',
                title: 'Citadel decision layer',
                tag: 'Application aware',
                text: 'Path, session, rate, lists and behavior signals decide whether a request passes or escalates.',
              },
              {
                icon: Database,
                step: '03',
                title: 'Cache + origin',
                tag: 'Protected compute',
                text: 'Cache absorbs eligible repeats. Requests that survive policy reach the application behind Citadel.',
              },
            ].map(item => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="srv-citadel-v2-layer">
                  <CardHeader>
                    <span className="srv-citadel-v2-layer-icon"><Icon size={20} weight="duotone" /></span>
                    <span className="srv-citadel-v2-layer-step">{item.step}</span>
                    <Badge variant="outline">{item.tag}</Badge>
                  </CardHeader>
                  <CardContent>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="srv-citadel-v2-section srv-citadel-v2-section-muted">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">Why Layer 7 is different</p>
              <h2>Attack traffic can look normal until you inspect what it is doing.</h2>
            </div>
            <p>
              That is why Citadel focuses on requests, paths and sessions instead of
              pretending every DDoS problem is just a bandwidth problem.
            </p>
          </div>

          <div className="srv-citadel-v2-threats">
            {threats.map(item => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="srv-citadel-v2-threat">
                  <CardHeader>
                    <span><Icon size={19} weight="duotone" /></span>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{item.text}</p>
                    <small>{item.response}</small>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="srv-citadel-v2-section">
        <div className="sr-container">
          <CitadelTelemetryPreview />
        </div>
      </section>

      <section className="srv-citadel-v2-section srv-citadel-v2-section-muted">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">Control surface</p>
              <h2>Strong defaults, explicit exceptions, visible outcomes.</h2>
            </div>
            <p>
              Citadel is designed so an operator can understand why traffic changed
              state without guessing what an invisible black box decided.
            </p>
          </div>

          <div className="srv-citadel-v2-controls">
            {controls.map(item => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="srv-citadel-v2-control">
                  <CardHeader>
                    <span><Icon size={19} weight="duotone" /></span>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p>{item.text}</p></CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="srv-citadel-v2-section" id="citadel-plans">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">Plans</p>
              <h2>Same protection model. Choose the domain and bandwidth allowance.</h2>
            </div>
            <p>
              Start free, then scale the allowance when the number of protected
              properties or clean traffic grows.
            </p>
          </div>

          <div className="srv-citadel-v2-plans">
            {plans.map(plan => (
              <Card key={plan.name} className="srv-citadel-v2-plan" data-featured={plan.featured}>
                <CardHeader>
                  <div>
                    <Badge variant="outline">{plan.featured ? 'Most popular' : 'Citadel'}</Badge>
                    <CardTitle>{plan.name}</CardTitle>
                  </div>
                  <div className="srv-citadel-v2-price"><strong>{plan.price}</strong><span>/mo</span></div>
                </CardHeader>
                <CardContent>
                  <p>{plan.text}</p>
                  <dl>
                    <div><dt>Protected domains</dt><dd>{plan.domains}</dd></div>
                    <div><dt>Clean bandwidth</dt><dd>{plan.bandwidth}</dd></div>
                    <div><dt>Challenge modes</dt><dd>Cookie · JS · Interaction · Auto</dd></div>
                    <div><dt>Attack mode</dt><dd>Lockdown + allowlists</dd></div>
                  </dl>
                </CardContent>
                <CardFooter>
                  <Button asChild variant={plan.featured ? 'default' : 'outline'}>
                    <a href={plan.checkout}>Choose {plan.name} <ArrowRight size={15} aria-hidden="true" /></a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-citadel-v2-final">
        <div className="sr-container">
          <Card className="srv-citadel-v2-final-card">
            <div>
              <Badge variant="outline"><ShieldCheck size={13} weight="fill" /> Citadel</Badge>
              <h2>Protect the origin without turning the website into a CAPTCHA wall.</h2>
              <p>Start with the free tier, then tune protection by domain and path as traffic changes.</p>
            </div>
            <div>
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/store/layer-7-ddos-protection">
                  View protection plans <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/status">See infrastructure status</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
