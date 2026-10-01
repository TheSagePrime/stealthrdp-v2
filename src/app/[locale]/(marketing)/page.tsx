/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { SiAlpinelinux, SiFreebsd, SiRockylinux } from '@icons-pack/react-simple-icons';
import { ArrowRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { HomeHero } from '@/components/site/HomeHero';
import { HomePricing } from '@/components/site/HomePricing';
import { testimonials } from '@/lib/stealth/content';
import { getPlans } from '@/lib/stealth/live-plans';
import { homeJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';
import { createPageMetadata } from '@/libs/seo/metadata';
import { buildPageJsonLd } from '@/libs/seo/schema';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    path: '/',
    locale,
    title: 'StealthRDP — Windows & Linux VPS Hosting',
    description:
      'Deploy Windows or Linux VPS hosting with NVMe storage, full administrative access, USA and EU locations, and flexible billing.',
    ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
  });
}

const operatingSystems = [
  { name: 'Windows Server', logo: '/brand/windows.svg' },
  { name: 'Ubuntu', logo: '/brand/ubuntu.svg' },
  { name: 'Debian', logo: '/brand/debian.svg' },
  { name: 'Rocky Linux', icon: SiRockylinux },
  { name: 'AlmaLinux', logo: '/brand/almalinux.svg' },
  { name: 'CentOS', logo: '/brand/centos.svg' },
  { name: 'Fedora', logo: '/brand/fedora.svg' },
  { name: 'Alpine Linux', icon: SiAlpinelinux },
  { name: 'FreeBSD', icon: SiFreebsd },
] as const;

const useCases = [
  {
    title: 'Remote desktop',
    text: 'When a VPS works well as a remote workstation, what affects responsiveness, and how to size it.',
    href: '/blog/vps-for-remote-desktop.html',
  },
  {
    title: 'Web hosting',
    text: 'When to move beyond shared hosting and how to size a VPS for the complete web stack.',
    href: '/blog/vps-for-web-hosting.html',
  },
  {
    title: 'Automation & bots',
    text: 'How to choose resources for scripts, workers, webhook services, bots, and persistent automation.',
    href: '/blog/vps-for-automation-bots.html',
  },
  {
    title: 'Trading',
    text: 'What a VPS can improve for trading software, what it cannot, and why endpoint location matters.',
    href: '/blog/vps-for-trading.html',
  },
  {
    title: 'Backups & storage',
    text: 'How to evaluate a VPS as an offsite backup target, including retention, transfer, and restore planning.',
    href: '/blog/vps-for-backups-storage.html',
  },
] as const;

function reviewSource(item: (typeof testimonials)[number]) {
  if (item.sourceLabel?.includes('Discord') || item.sourceType === 'community review') {
    return 'Discord';
  }
  if (!item.sourceUrl) {
    return 'Customer testimonial';
  }
  return item.sourceUrl.includes('trustpilot.com') ? 'Trustpilot' : 'Third-party review';
}

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 6 hours. */
export const revalidate = 21600;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const plans = await getPlans();
  const shortReviews = [...testimonials.slice(1)].sort((a, b) => b.quote.length - a.quote.length).slice(0, 3);
  const jsonLd = buildPageJsonLd(getSeoConfig());

  return (
    <>
      <ProductionJsonLd data={homeJsonLd(getSeoConfig().siteUrl, plans)} />
      {jsonLd.map(block => (
        <script
          key={String(block['@type'])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(block) }}
        />
      ))}

      <HomeHero plans={plans} />

      <section className="hm-os" aria-labelledby="hm-os-title">
        <div className="hm-wrap hm-os-inner">
          <h2 id="hm-os-title">Operating systems you can install at checkout</h2>
          <ul>
            {operatingSystems.map((item) => {
              const Icon = 'icon' in item ? item.icon : null;
              return (
                <li key={item.name}>
                  {'logo' in item
                    ? <Image src={item.logo} alt="" width={22} height={22} />
                    : Icon ? <Icon aria-hidden="true" size={22} /> : null}
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="hm-section" id="plans" aria-labelledby="hm-plans-title">
        <div className="hm-wrap">
          <header className="hm-head">
            <h2 id="hm-plans-title">Pick the resources. Prices and stock are live.</h2>
            <p>
              Entry plans for each region. Prices come from the billing system, and stock refreshes every six hours.
            </p>
          </header>
          <HomePricing plans={plans} />
        </div>
      </section>

      <section className="hm-section hm-section-rule" aria-labelledby="hm-use-title">
        <div className="hm-wrap hm-split">
          <header className="hm-head">
            <h2 id="hm-use-title">What people run on it</h2>
            <p>Practical guides for sizing a VPS to the job, with what it can and cannot do.</p>
            <Link href="/blog" className="hm-link">
              All VPS guides
              <ArrowRight aria-hidden="true" />
            </Link>
          </header>
          <ul className="hm-uses">
            {useCases.map(item => (
              <li key={item.href}>
                <Link href={item.href}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hm-section hm-section-rule" aria-labelledby="hm-products-title">
        <div className="hm-wrap">
          <header className="hm-head">
            <h2 id="hm-products-title">Two products. Use one or both.</h2>
          </header>
          <div className="hm-products">
            <Link href="/plans" className="hm-product">
              <span className="hm-product-tag">VPS hosting</span>
              <strong>Windows and Linux servers</strong>
              <span>Compute with administrator or root access, a dedicated IPv4 and USA or EU regions.</span>
              <span className="hm-link">
                Compare plans
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
            <Link href="/citadel" className="hm-product">
              <span className="hm-product-tag">Citadel</span>
              <strong>Layer 7 DDoS protection</strong>
              <span>Sits in front of an existing website or app and challenges, rate-limits or blocks bad HTTP traffic.</span>
              <span className="hm-link">
                How Citadel works
                <ArrowRight aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="hm-section hm-section-rule" aria-labelledby="hm-reviews-title">
        <div className="hm-wrap hm-split">
          <header className="hm-head">
            <h2 id="hm-reviews-title">What customers say</h2>
            <figure className="hm-quote">
              <blockquote>{testimonials[0]?.quote}</blockquote>
              <figcaption>
                <strong>{testimonials[0]?.authorName}</strong>
                {testimonials[0]?.authorCompany ? `, ${testimonials[0].authorCompany}` : ''}
              </figcaption>
            </figure>
          </header>
          <ul className="hm-reviews">
            {shortReviews.map(item => (
              <li key={item.id ?? item._id ?? item.quote}>
                <blockquote>{item.quote}</blockquote>
                <p>
                  <strong>{item.authorName}</strong>
                  {` · ${reviewSource(item)}`}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hm-cta" aria-labelledby="hm-cta-title">
        <div className="hm-wrap hm-cta-inner">
          <h2 id="hm-cta-title">Pick a plan. Connect in about a minute.</h2>
          <div className="hm-actions">
            <a className="hm-button hm-button-light" href="#plans">
              Compare plans
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="hm-button hm-button-ghost" href="https://dash.stealthrdp.com/submitticket.php">
              Ask a pre-sales question
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
