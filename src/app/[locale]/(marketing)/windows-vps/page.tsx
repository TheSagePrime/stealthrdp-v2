/* eslint-disable better-tailwindcss/no-unknown-classes, next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { OsFaq, OsJourney, OsRegions, OsResources, OsSupport, WindowsVersions } from '@/components/site/os/OsSections';
import { OsSession } from '@/components/site/os/OsSession';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Button } from '@/components/ui/button';
import { getPlans } from '@/lib/stealth/live-plans';
import { osPageJsonLd } from '@/lib/stealth/structured-data';
import { getSeoConfig } from '@/libs/seo/config';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/windows-vps',
  title: 'Windows VPS Hosting | Compare USA and EU Plans | StealthRDP',
  description: 'Compare Windows VPS hosting plans with full Administrator access, multiple OS versions, and flexible resources. Choose USA or EU regions and deploy fast.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const windowsVersions = ['2019', '2022', '2025'];

const questions = [
  ['Can I use familiar Windows software?', 'A Windows VPS provides a Windows environment for compatible software. Check each application’s system requirements before ordering.'],
  ['Do Windows VPS plans include Administrator access?', 'Yes. The FAQ states that VPS plans include full Administrator access.'],
  ['Which Windows versions are listed?', 'Windows Server 2019, 2022, and 2025.'],
  ['Is a Microsoft Windows licence included?', 'No. Any Microsoft licensing required for the intended use remains the customer’s responsibility. Windows Server Evaluation may be provided for evaluation/testing purposes and is Evaluation software, not a permanently licensed Windows installation. Customers may use their own eligible Microsoft licences where permitted by Microsoft’s applicable licensing terms. Customers are responsible for determining whether their licence is valid for their intended hosted deployment.'],
  ['When will my Windows VPS be activated?', 'Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes.'],
  ['How will I receive my credentials?', 'StealthRDP sends service credentials by email after payment confirmation.'],
  ['How do I choose CPU, RAM, and storage?', 'Use your software requirements, user count, processing needs, and data size. Then use the plan comparison to compare the available configurations.'],
  ['Where can I get support?', 'Use WhatsApp support, the client-area ticketing system, or support email. The FAQ provides the current support details.'],
  ['Can I run any workload?', 'No. Use must remain lawful and must follow the Use of Service terms.'],
] as const;

/* Stock is read live from WHMCS; see src/lib/stealth/live-plans.ts. Must be a literal: 6 hours. */
export const revalidate = 21600;

export default async function WindowsVpsPage() {
  const plans = await getPlans();

  return (
    <div className="srv-page srv-page-os srv-page-windows">
      <ProductionJsonLd
        data={osPageJsonLd({
          siteUrl: getSeoConfig().siteUrl,
          path: '/windows-vps',
          name: 'Windows VPS hosting',
          description: 'Windows VPS hosting with full Administrator access, Windows Server 2019, 2022 and 2025, NVMe storage, and USA or EU regions.',
          plans,
          questions,
        })}
      />
      <section className="sr-page-hero sr-os-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">Windows VPS hosting</p>
            <h1 className="sr-title">
              Windows VPS hosting for work that
              {' '}
              <span>belongs on Windows.</span>
            </h1>
            <p className="sr-lede">
              Use remote Windows access for familiar software, administration, and business workflows,
              in a USA or EU region. Compare the resources below, then choose the Windows Server version at checkout.
            </p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <Link href="#windows-plans">
                  Compare Windows VPS plans
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline"><Link href="#windows-versions">Windows versions</Link></Button>
            </div>
          </div>
          <OsSession kind="windows" />
        </div>
      </section>

      <section className="sr-section srv-os-pricing-section" id="windows-plans">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Current VPS catalog</p>
              <h2 className="sr-section-title">Choose your resource level</h2>
            </div>
          </div>
          <PricingExplorer plans={plans} />
        </div>
      </section>

      <OsJourney kind="windows" />

      <WindowsVersions versions={windowsVersions} />

      <OsResources plans={plans} kind="windows">
        <p>
          A Windows VPS gives you a remote Windows environment for software, testing, administration, and business
          workflows. It can also suit users who need access to a Windows desktop or server without keeping the machine on site.
        </p>
        <p>Start with the software and users. A plan that fits one application may not fit several concurrent sessions or a larger installation.</p>
        <div className="sr-inline-links">
          <Link href="/plans#windows-vps">
            Windows VPS catalog
            <ArrowRight size={16} />
          </Link>
          <Link href="/plans#comparison">
            Plan comparison
            <ArrowRight size={16} />
          </Link>
        </div>
      </OsResources>

      <OsRegions plans={plans} kind="windows" />

      <OsSupport kind="windows" />

      <OsFaq
        kind="windows"
        title="Windows VPS questions"
        questions={questions}
        other={{
          title: 'Need Linux instead?',
          text: 'For websites, applications, databases, or development stacks, see Linux VPS hosting.',
          href: '/linux-vps',
          label: 'Linux VPS hosting',
        }}
      />

      <section className="sr-section">
        <div className="
          sr-container sr-cta sr-cta-premium srv-site-final srv-os-final
        "
        >
          <div>
            <p className="sr-kicker">Windows VPS plans</p>
            <h2>Compare Windows VPS plans</h2>
          </div>
          <div className="sr-actions">
            <Button asChild size="lg">
              <Link href="/plans#windows-vps">
                Compare plans
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline"><a href="/plans">Continue to checkout</a></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
