/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { LinuxDistros, OsFaq, OsJourney, OsRegions, OsResources, OsSupport } from '@/components/site/os/OsSections';
import { OsSession } from '@/components/site/os/OsSession';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { requirePageLocale } from '@/lib/stealth/i18n-server';
import { getPlans } from '@/lib/stealth/live-plans';
import { osPageJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/linux-vps',
  title: 'Linux VPS Server Hosting | Ubuntu, Debian | StealthRDP',
  description: 'Linux VPS servers with full Root access, NVMe storage and Ubuntu, Debian, AlmaLinux or another listed distro. USA and EU regions.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const distros = [
  { name: 'Ubuntu', versions: '18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, 26.04 LTS', text: 'Fits many websites, panels, and development stacks.' },
  { name: 'Debian', versions: '10, 11, 12, 13', text: 'Use when the stack asks for Debian.' },
  { name: 'CentOS', versions: '7, Stream 8, Stream 9', text: 'Use when the stack asks for CentOS.' },
  { name: 'AlmaLinux', versions: '8, 9, 10', text: 'Use when the stack asks for AlmaLinux.' },
  { name: 'Rocky Linux', versions: '8, 9, 10', text: 'Use when the stack asks for Rocky Linux.' },
  { name: 'Fedora', versions: '37, 38, 39, 40, 41, 42, 43, 44', text: 'Use when the stack asks for Fedora.' },
  { name: 'Alpine Linux', versions: '3.15, 3.19, 3.23', text: 'Use when the stack asks for Alpine Linux.' },
  { name: 'FreeBSD', versions: '13.2, 13.3, 14.0, 14.1, 14.2, 14.3, 15.0', text: 'Use when the stack asks for FreeBSD.' },
  { name: 'openSUSE', versions: 'Leap 15', text: 'Use when the stack asks for openSUSE Leap 15.' },
  { name: 'CloudLinux', versions: '9', text: 'Use when the stack asks for CloudLinux 9.' },
  { name: 'Arch Linux', versions: 'Latest', text: 'Use when the stack asks for Arch Linux.' },
  { name: 'Oracle Linux', versions: '8, 9', text: 'Use when the stack asks for Oracle Linux.' },
];

const questions = [
  ['What does a Linux VPS server cost?', 'Plans start with Bronze at €9.50/month on the live plans page. Confirm the live price and region at checkout.'],
  ['Which Linux distributions can I run?', 'AlmaLinux 8, 9, and 10; Alpine Linux 3.15, 3.19, and 3.23; CentOS 7, Stream 8, and Stream 9; Debian 10, 11, 12, and 13; Fedora 37 through 44; FreeBSD 13.2 through 15.0; Rocky Linux 8, 9, and 10; Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, and 26.04 LTS; openSUSE Leap 15; CloudLinux 9; Arch Linux Latest; and Oracle Linux 8 and 9.'],
  ['Can I get an Ubuntu VPS?', 'Yes. Choose Ubuntu as the operating system at checkout: 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, or 26.04 LTS. You get the VPS with Ubuntu installed and full Root access.'],
  ['Debian or Ubuntu server: which should I choose?', 'Both run most server software well. Ubuntu LTS is common in tutorials and control-panel guides. Debian stable changes less between releases. If your software documents one of them, choose that one.'],
  ['Do plans include Root?', 'Yes. The FAQ states that VPS plans include full Root access.'],
  ['Are USA and EU Linux plans available?', 'Yes. USA plans run in Phoenix, Arizona and EU plans in Amsterdam, Netherlands. Both appear in the public catalog; confirm the region at checkout.'],
  ['When is it activated?', 'Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes.'],
  ['How do I get credentials?', 'By email after payment confirmation.'],
] as const;

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 6 hours. */
export const revalidate = 21600;

export default async function LinuxVpsPage() {
  await requirePageLocale('/linux-vps');
  const plans = await getPlans();
  const bronze = plans.filter(plan => plan.name.startsWith('Bronze '));
  const bronzePrice = `€${(bronze[0]?.pricing.monthly.amount ?? 9.5).toFixed(2)}`;
  const liveQuestions = questions.map(([question, answer]) => [question, answer.replace('€9.50', bronzePrice)] as const);

  return (
    <div className="srv-page srv-page-os srv-page-linux">
      <ProductionJsonLd
        data={osPageJsonLd({
          siteUrl: getSeoConfig().siteUrl,
          path: '/linux-vps',
          name: 'Linux VPS hosting',
          description: 'Linux VPS hosting with full Root access, a wide choice of distributions, NVMe storage, and USA or EU regions.',
          plans,
          questions: liveQuestions,
        })}
      />
      <section className="sr-page-hero sr-os-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">Linux VPS hosting</p>
            <h1 className="sr-title">
              Linux VPS server hosting with Root access and a distro
              {' '}
              <span>you can confirm.</span>
            </h1>
            <p className="sr-lede">
              You need a Linux server you can administer as root, in a USA or EU region. That can be Ubuntu, Debian, CentOS,
              or another listed image, at a price you can verify before you pay.
            </p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <Link href="#linux-plans">
                  Compare Linux VPS plans
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"><Link href="#linux-distros">Linux distributions</Link></Button>
            </div>
          </div>
          <OsSession kind="linux" />
        </div>
      </section>

      <section className="sr-section srv-os-pricing-section" id="linux-plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Current VPS catalog</p>
              <h2 className="sr-section-title">
                Choose your resource level
              </h2>
            </div>
          </div>
          <PricingExplorer plans={plans} />
        </div>
      </section>

      <OsJourney kind="linux" />

      <LinuxDistros distros={distros} />

      <OsResources plans={plans} kind="linux">
        <p>
          {`The current catalog starts with Bronze at ${bronzePrice}/month on the live plans page. Choose Ubuntu, Debian or another listed distribution at checkout.`}
        </p>
        <p>
          {bronze.map(plan => `${plan.name} lists ${plan.specs.cpu}, ${plan.specs.ram} RAM, ${plan.specs.storage}, and ${plan.specs.bandwidth} bandwidth.`).join(' ')}
          {' '}
          Confirm the live row before you order. Prices and stock can change.
        </p>
        <div className="sr-inline-links">
          <Link href="/plans#linux-vps">
            Linux VPS catalog
            <ArrowRight size={16} />
          </Link>
          <Link href="/plans#comparison">
            Plan comparison
            <ArrowRight size={16} />
          </Link>
        </div>
      </OsResources>

      <OsRegions plans={plans} kind="linux" />

      <OsSupport kind="linux" />

      <OsFaq
        kind="linux"
        title="Linux VPS questions"
        questions={liveQuestions}
        other={{
          title: 'Need Windows instead?',
          text: 'For familiar Windows software and remote Windows desktop or server access, see Windows VPS hosting.',
          href: '/windows-vps',
          label: 'Windows VPS hosting',
        }}
      />

      <section className="sr-section">
        <div className="
          sr-container sr-cta sr-cta-premium srv-site-final srv-os-final
        "
        >
          <div>
            <p className="sr-kicker">Linux VPS plans</p>
            <h2>Compare Linux VPS plans</h2>
            <p>Check the current plan, region, and displayed price, then confirm Linux and the exact image in checkout.</p>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <Link href="/plans#linux-vps">
                Compare Linux VPS plans
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"><Link href="/plans">Continue to checkout</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
