/* eslint-disable better-tailwindcss/no-unknown-classes, next/no-html-link-for-pages */
import type { Metadata } from 'next';
import { ArrowRight, Cpu, HardDrive, Info, MapPin, Memory as MemoryStick, Scales as Scale } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { OSHeroVisual } from '@/components/site/OSHeroVisual';
import { PricingExplorer } from '@/components/site/PricingExplorer';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pill } from '@/components/ui/pill';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createPageMetadata } from '@/libs/seo/metadata';

export const metadata: Metadata = createPageMetadata({
  path: '/windows-vps',
  title: 'Windows VPS Hosting | Compare USA and EU Plans | StealthRDP',
  description: 'Compare Windows VPS hosting plans with full Administrator access, multiple OS versions, and flexible resources. Choose USA or EU regions and deploy fast.',
  ogImage: 'https://www.stealthrdp.com/assets/og-cover.png',
});

const windowsVersions = [
  { name: 'Windows Server 2019', version: '2019', text: 'Use when the software or workflow asks for Windows Server 2019.' },
  { name: 'Windows Server 2022', version: '2022', text: 'Use when the software or workflow asks for Windows Server 2022.' },
  { name: 'Windows Server 2025', version: '2025', text: 'Use when the software or workflow asks for Windows Server 2025.' },
];

/* Nominative brand marks for the operating system this page lists. */
const osBrands = [
  { src: '/brand/windows.svg', alt: 'Windows logo', label: 'Windows Server', width: 28, height: 28 },
];

const resourceFit = [
  { icon: Cpu, number: '01', title: 'Concurrent work', text: 'Match active processing and concurrent tasks.' },
  { icon: MemoryStick, number: '02', title: 'Active services', text: 'Allow for Windows, applications, and users running at the same time.' },
  { icon: HardDrive, number: '03', title: 'Files and data', text: 'Include the operating system, installed software, files, and future additions.' },
];

const questions = [
  ['Can I use familiar Windows software?', 'A Windows VPS provides a Windows environment for compatible software. Check each application’s system requirements before ordering.'],
  ['Do Windows VPS plans include Administrator access?', 'Yes. The FAQ states that VPS plans include full Administrator access.'],
  ['Which Windows versions are listed?', 'Windows Server 2019, 2022, and 2025.'],
  ['Is a Microsoft Windows licence included?', 'No. Any Microsoft licensing required for the intended use remains the customer’s responsibility. Windows Server Evaluation may be provided for evaluation/testing purposes and is Evaluation software, not a permanently licensed Windows installation. Customers may use their own eligible Microsoft licences where permitted by Microsoft’s applicable licensing terms. Customers are responsible for determining whether their licence is valid for their intended hosted deployment.'],
  ['When will my Windows VPS be activated?', 'Standard installations are typically activated within 5 minutes. Most services are activated within 5–10 minutes after payment confirmation.'],
  ['How will I receive my credentials?', 'StealthRDP sends service credentials by email after payment confirmation.'],
  ['How do I choose CPU, RAM, and storage?', 'Use your software requirements, user count, processing needs, and data size. Then use the plan comparison to compare the available configurations.'],
  ['Where can I get support?', 'Use WhatsApp support, the client-area ticketing system, or support email. The FAQ provides the current support details.'],
  ['Can I run any workload?', 'No. Use must remain lawful and must follow the Use of Service terms.'],
] as const;

/* Token utilities for the card link rows, replacing the bespoke .sr-location-grid hook. */
const cardLinkClass = 'inline-flex min-h-11 items-center gap-2 text-small font-semibold text-primary transition-colors hover:text-accent-hover';

export default function WindowsVpsPage() {
  return (
    <div className="srv-page srv-page-os srv-page-windows">
      <section className="sr-page-hero sr-os-page-hero">
        <div className="sr-container sr-os-hero-grid">
          <div>
            <p className="sr-kicker">Windows VPS hosting</p>
            <h1 className="sr-title">
              Windows VPS hosting for work that
              <span>belongs on Windows.</span>
            </h1>
            <p className="sr-lede">
              Use remote Windows access for familiar software, administration, and business workflows.
              Choose your operating system, compare the resources, and order the configuration that fits the job.
            </p>
            <p className="sr-micro">
              StealthRDP sells Windows VPS plans in USA and EU regions. Compare the live catalog, then continue to the existing checkout.
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
          <OSHeroVisual
            kind="windows"
            title="Windows VPS deployment showcase"
            items={windowsVersions.map(item => `Server ${item.version}`)}
            access="Admin included"
          />
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
          <PricingExplorer />
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Next step</p>
            <h2 className="sr-section-title">Choose the plan first. Select Windows or Linux in checkout.</h2>
          </div>
          <div className="sr-prose-block">
            <p>The buyer chooses the resource plan and region on this page. The existing checkout then provides the operating-system selector before payment.</p>
            <div className="sr-actions">
              <Button asChild size="lg">
                <a href="/plans">
                  Configure this VPS
                  <ArrowRight size={16} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Windows VPS guide</p>
            <h2 className="sr-section-title">Keep your Windows workflow in reach</h2>
          </div>
          <div className="sr-prose-block">
            <p>A Windows VPS gives you a remote Windows environment for software, testing, administration, and business workflows. It can also suit users who need access to a Windows desktop or server without keeping the machine on site.</p>
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
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border" id="windows-versions">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Environment</p>
              <h2 className="sr-section-title">Choose the Windows version your software needs</h2>
            </div>
            <p>
              The Services & Plans FAQ lists these Windows options.
              Confirm the operating-system option during ordering.
            </p>
          </div>
          <ul
            className="srv-os-brand-cloud"
            aria-label="Operating system listed on this page"
          >
            {osBrands.map(brand => (
              <li key={brand.src} className="srv-os-brand-tile">
                <span className="srv-os-brand-mark">
                  <img
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.width}
                    height={brand.height}
                  />
                </span>
                <span>{brand.label}</span>
              </li>
            ))}
          </ul>
          <Table className="srv-os-table">
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>What it is for</TableHead>
                <TableHead>Availability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {windowsVersions.map(item => (
                <TableRow key={item.version}>
                  <TableHead scope="row">{item.name}</TableHead>
                  <TableCell>{item.text}</TableCell>
                  <TableCell>
                    <Pill state="neutral" icon={<Info size={16} aria-hidden="true" />}>
                      Confirm during ordering
                    </Pill>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="sr-inline-links">
            <Link href="/docs/how-do-i-log-into-windows">
              How do I log into Windows?
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="sr-disclosure">
            <Scale size={16} aria-hidden="true" />
            <p>
              <strong>Windows licensing:</strong>
              {' '}
              StealthRDP provides the infrastructure only.
              Microsoft Windows licensing is not included and is not supplied by StealthRDP.
              Customers are responsible for their own licensing compliance.
              {' '}
              <Link
                href="/docs/windows-licensing"
                className="underline underline-offset-4"
              >
                Read the Windows licensing page.
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="
        sr-section sr-section-border srv-os-environment-section
      "
      >
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Control</p>
            <h2 className="sr-section-title">Administrator access for hands-on control</h2>
          </div>
          <div className="sr-prose-block">
            <p>VPS plans include full Windows Administrator access. That gives you control over the Windows environment and the software you install. You are responsible for regular backups of important data.</p>
            <p>
              For the remote sign-in process, see
              <Link href="/docs/how-do-i-log-into-windows">How do I log into Windows?</Link>
              {' '}
              StealthRDP sends service credentials by email after payment confirmation.
            </p>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Resource fit</p>
              <h2 className="sr-section-title">Size the machine to the stack</h2>
            </div>
            <p>Count what runs at the same time: Windows, applications, users, files, and future additions.</p>
          </div>
          <ol className="srv-os-feature-rail grid list-none gap-0 p-0">
            {resourceFit.map(({ icon: Icon, number, title, text }) => (
              <li
                key={number}
                className="srv-os-feature-row"
              >
                <div className="flex items-center gap-3">
                  <span className="
                    text-micro font-bold text-body-dim tabular-nums
                  "
                  >
                    {number}
                  </span>
                  <span className="srv-os-feature-icon">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                </div>
                <div className="grid gap-1.5">
                  <h3 className="text-heading-4 font-semibold text-body-text">{title}</h3>
                  <p className="text-small text-body-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-resource-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Regions</p>
              <h2 className="sr-section-title">
                USA or EU
              </h2>
            </div>
            <p>Choose the region that fits your users, latency, and operating requirements.</p>
          </div>
          <div className="
            srv-os-region-split grid gap-4
            md:grid-cols-2
          "
          >
            <Card className="srv-os-region-panel" data-region="usa">
              <CardHeader>
                <span className="srv-os-region-icon">
                  <MapPin aria-hidden="true" className="size-5" />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">USA</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>USA</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  StealthRDP lists Windows VPS options for USA regions. Compare the region and resources in the catalog.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="/plans" className={cardLinkClass}>
                  View plans
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
            <Card className="srv-os-region-panel" data-region="eu">
              <CardHeader>
                <span className="srv-os-region-icon">
                  <MapPin aria-hidden="true" className="size-5" />
                </span>
                <Badge variant="outline" className="w-fit text-body-muted">EU</Badge>
                <CardTitle className="text-heading-4 text-body-text">
                  <h3>EU</h3>
                </CardTitle>
                <CardDescription className="text-small text-body-muted">
                  EU Windows VPS options also appear in the public catalog. Confirm the region and current configuration in checkout.
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="/plans" className={cardLinkClass}>
                  View plans
                  {' '}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-region-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Before you order</p>
            <h2 className="sr-section-title">After payment</h2>
          </div>
          <div className="sr-prose-block">
            <p>Standard Windows and Linux installations are typically activated within 5 minutes. Most services are activated within 5–10 minutes after payment confirmation. StealthRDP sends your service credentials by email after payment confirmation.</p>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Support and limits</p>
            <h2 className="sr-section-title">Support and limits</h2>
          </div>
          <div className="sr-prose-block">
            <p>
              Support is available through WhatsApp, the client-area ticketing system, and support email. Review the
              <Link href="/faq">FAQ</Link>
              {' '}
              for support information, the
              <Link href="/docs/use-of-service">Use of Service terms</Link>
              , and the
              <Link href="/docs/windows-licensing">Windows licensing</Link>
              {' '}
              page before you order.
            </p>
            <ul>
              <li><a href="https://wa.me/447441426993">WhatsApp support</a></li>
              <li>Use the client-area ticket system for service support.</li>
              <li>Follow the published Use of Service terms.</li>
              <li>The terms require lawful use. They prohibit abuse, scanning, hacking, spam, botnets, and similar misuse.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-story-section">
        <div className="sr-container sr-copy-grid">
          <div>
            <p className="sr-kicker">Order steps</p>
            <h2 className="sr-section-title">Order your Windows VPS</h2>
          </div>
          <div className="sr-prose-block">
            <p>Use these steps to move from workload requirements to a selected plan.</p>
            <ol>
              <li>Open the Windows VPS catalog.</li>
              <li>Check the Windows version and required software.</li>
              <li>Compare CPU, RAM, NVMe storage, bandwidth, and region.</li>
              <li>Review the live order details and price, then confirm the purchase through StealthRDP.</li>
            </ol>
            <div className="sr-inline-links">
              <Link href="/plans#windows-vps">
                Compare Windows VPS plans
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-section sr-section-border srv-os-faq-section">
        <div className="sr-container">
          <div className="sr-section-head">
            <div>
              <p className="sr-kicker">Common questions</p>
              <h2 className="sr-section-title">
                Windows VPS questions
              </h2>
            </div>
            <p>Quick answers for software, access, activation, and support.</p>
          </div>
          <Accordion>
            {questions.map(([question, answer]) => (
              <AccordionItem key={question} title={question}>
                <p>{answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="sr-cta-inline srv-os-switcher">
            <div>
              <span className="sr-location-code">Choose another environment</span>
              <h3>Need Linux instead?</h3>
              <p>For websites, applications, databases, or development stacks, see Linux VPS hosting.</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/linux-vps">
                Linux VPS hosting
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

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
