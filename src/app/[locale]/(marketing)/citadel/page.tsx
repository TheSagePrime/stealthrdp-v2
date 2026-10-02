/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { CitadelControls } from '@/components/site/citadel/CitadelControls';
import { CitadelGate } from '@/components/site/citadel/CitadelGate';
import { CitadelIncident } from '@/components/site/citadel/CitadelIncident';
import { CitadelIncluded } from '@/components/site/citadel/CitadelIncluded';
import { CitadelPortal } from '@/components/site/citadel/CitadelPortal';
import { CitadelSetup } from '@/components/site/citadel/CitadelSetup';
import { CitadelThreats } from '@/components/site/citadel/CitadelThreats';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { citadelJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';

export const metadata: Metadata = createPageMetadata({
  path: '/citadel',
  title: 'Layer 7 DDoS Protection — Citadel by StealthRDP',
  description:
    'Layer 7 DDoS protection for websites and HTTP/HTTPS apps: adaptive challenges, rate limits, lockdown mode and origin protection. Starter plan from €0.',
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

export default function CitadelPage() {
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <div className="srv-page srv-page-citadel srv-citadel-v2">
      <ProductionJsonLd
        data={citadelJsonLd(
          getSeoConfig().siteUrl,
          plans.map(plan => ({ ...plan, price: Number(plan.price.replace(/[^\d.]/g, '')) })),
        )}
      />
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
            <h1>
              Make every request
              {' '}
              <span>earn its way to the origin.</span>
            </h1>
            <p>
              Citadel sits in front of HTTP/HTTPS applications and decides what should
              pass, be challenged, slowed, cached, escalated or blocked — before your
              origin spends CPU, database work and bandwidth.
            </p>
            <div className="srv-citadel-v2-actions">
              <Button asChild size="lg">
                <a href="#citadel-plans">
                  Choose protection
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/citadel/docs/getting-started">Read Citadel setup guide</Link>
              </Button>
            </div>
            <div className="srv-citadel-v2-facts">
              <span>
                <strong>€0</strong>
                {' '}
                starter tier
              </span>
              <span>
                <strong>6</strong>
                {' '}
                challenge modes
              </span>
              <span>
                <strong>Per-path</strong>
                {' '}
                policy
              </span>
            </div>
          </div>

          <CitadelGate />
        </div>
      </section>

      <section className="srv-citadel-v2-section" aria-labelledby="citadel-setup-title">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">How it connects</p>
              <h2 id="citadel-setup-title">Point one A record. Citadel protects the site.</h2>
            </div>
            <p>
              Cloudflare stays your DNS and edge. Citadel is the reverse proxy behind it that
              decides which requests reach your origin.
            </p>
          </div>

          <CitadelSetup />
        </div>
      </section>

      <section className="srv-citadel-v2-section srv-citadel-v2-section-muted" aria-labelledby="citadel-incident-title">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">Attack timeline</p>
              <h2 id="citadel-incident-title">The edge takes the flood. The origin barely notices.</h2>
            </div>
            <p>
              A 17-minute HTTP flood, drawn with the Edge, Proxy and Blocked series
              that Citadel Analytics uses. Move across the chart to read each moment.
            </p>
          </div>

          <CitadelIncident />
        </div>
      </section>

      <section className="srv-citadel-v2-section">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">Why Layer 7 is different</p>
              <h2>Attack traffic can look normal until you inspect what it is doing.</h2>
            </div>
            <p>
              A Layer 7 DDoS attack floods a website with HTTP requests that look like
              real visitors: page loads, logins, searches and API calls. Bandwidth filters
              alone do not stop it. That is why Citadel focuses on requests, paths and
              sessions instead of pretending every DDoS problem is just a bandwidth problem.
            </p>
          </div>

          <CitadelThreats />
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

          <CitadelControls />
        </div>
      </section>

      <section className="srv-citadel-v2-section" aria-labelledby="citadel-portal-title">
        <div className="sr-container">
          <div className="srv-citadel-v2-heading">
            <div>
              <p className="sr-kicker">Citadel portal</p>
              <h2 id="citadel-portal-title">Run your protection yourself, from one portal.</h2>
            </div>
            <p>
              Every setting on this page is self-serve. Billing, invoices and tickets stay in
              the StealthRDP client area.
            </p>
          </div>

          <CitadelPortal />
        </div>
      </section>

      <section className="srv-citadel-v2-section srv-citadel-v2-section-muted" id="citadel-plans">
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
                  <div className="srv-citadel-v2-price">
                    <strong>{plan.price}</strong>
                    <span>/mo</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{plan.text}</p>
                  <dl>
                    <div>
                      <dt>Protected domains</dt>
                      <dd>{plan.domains}</dd>
                    </div>
                    <div>
                      <dt>Clean bandwidth</dt>
                      <dd>{plan.bandwidth}</dd>
                    </div>
                    <div>
                      <dt>Challenge modes</dt>
                      <dd>Cookie · JS · Interaction · Auto</dd>
                    </div>
                    <div>
                      <dt>Attack mode</dt>
                      <dd>Lockdown + allowlists</dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter>
                  <Button asChild variant={plan.featured ? 'default' : 'outline'}>
                    <a href={plan.checkout} aria-label={`Order Now: Citadel ${plan.name}`}>
                      Order Now
                      <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <CitadelIncluded />
        </div>
      </section>

      <section className="srv-citadel-v2-final">
        <div className="sr-container">
          <Card className="srv-citadel-v2-final-card">
            <div>
              <Badge variant="outline">
                <ShieldCheck size={13} weight="fill" />
                {' '}
                Citadel
              </Badge>
              <h2>Protect the origin without turning the website into a CAPTCHA wall.</h2>
              <p>Start with the free tier, then tune protection by domain and path as traffic changes.</p>
            </div>
            <div>
              <Button asChild size="lg">
                <a href="https://dash.stealthrdp.com/store/layer-7-ddos-protection">
                  View protection plans
                  {' '}
                  <ArrowRight size={16} aria-hidden="true" />
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
