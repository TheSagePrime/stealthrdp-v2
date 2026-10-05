/* eslint-disable better-tailwindcss/no-unknown-classes */
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

/* /windows-vps in English. */

const page = {
  meta: {
    title: 'Windows VPS Server Hosting | USA and EU | StealthRDP',
    description: 'Windows VPS servers with Windows Server 2019, 2022 or 2025, full Administrator access, NVMe storage and Remote Desktop. USA and EU regions.',
  },
  jsonLd: {
    name: 'Windows VPS hosting',
    description: 'Windows VPS hosting with full Administrator access, Windows Server 2019, 2022 and 2025, NVMe storage, and USA or EU regions.',
  },
  kicker: 'Windows VPS hosting',
  title: ['Windows VPS server hosting for work that', 'belongs on Windows.'] as [string, string],
  lede: 'Use remote Windows access for familiar software, administration, and business workflows, in a USA or EU region. Compare the resources below, then choose the Windows Server version at checkout.',
  compareButton: 'Compare Windows VPS plans',
  versionsButton: 'Windows versions',
  pricing: { kicker: 'Current VPS catalog', title: 'Choose your resource level' },
  resources: (
    <>
      <p>
        A Windows VPS gives you a remote Windows environment for software, testing, administration, and business
        workflows. It can also suit users who need access to a Windows desktop or server without keeping the machine on site.
      </p>
      <p>Start with the software and users. A plan that fits one application may not fit several concurrent sessions or a larger installation.</p>
      <p>
        You reach the server with Remote Desktop. If remote desktop access is the main reason you need a server, the
        {' '}
        <Link href="/rdp-vps">RDP VPS guide</Link>
        {' '}
        explains what to check, and the
        {' '}
        <Link href="/docs/how-do-i-log-into-windows">Remote Desktop login guide</Link>
        {' '}
        shows how to connect from each device.
      </p>
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
    </>
  ),
  faqTitle: 'Windows VPS questions',
  questions: [
    ['What is a Windows VPS server?', 'A Windows VPS server is a virtual private server that runs Windows Server. It has its own CPU, RAM and NVMe storage allocation, and you manage it with full Administrator access.'],
    ['Can I connect to my Windows VPS with Remote Desktop?', 'Yes. You connect to a Windows VPS with Remote Desktop (RDP), from Windows, macOS, Linux, Android or iOS. The Help Center explains how to log in with each client.'],
    ['Do you offer Windows VPS hosting in the USA and Europe?', 'Yes. Windows VPS plans are available in the USA (Phoenix, Arizona) and the EU (Amsterdam, Netherlands). Choose the region that is closest to you or to the people and services the server works with.'],
    ['Can I use familiar Windows software?', 'A Windows VPS provides a Windows environment for compatible software. Check each application’s system requirements before ordering.'],
    ['Do Windows VPS plans include Administrator access?', 'Yes. The FAQ states that VPS plans include full Administrator access.'],
    ['Which Windows versions are listed?', 'Windows Server 2019, 2022, and 2025.'],
    ['Is a Microsoft Windows licence included?', 'No. Any Microsoft licensing required for the intended use remains the customer’s responsibility. Windows Server Evaluation may be provided for evaluation/testing purposes and is Evaluation software, not a permanently licensed Windows installation. Customers may use their own eligible Microsoft licences where permitted by Microsoft’s applicable licensing terms. Customers are responsible for determining whether their licence is valid for their intended hosted deployment.'],
    ['When will my Windows VPS be activated?', 'Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes.'],
    ['How will I receive my credentials?', 'StealthRDP sends service credentials by email after payment confirmation.'],
    ['How do I choose CPU, RAM, and storage?', 'Use your software requirements, user count, processing needs, and data size. Then use the plan comparison to compare the available configurations.'],
    ['Where can I get support?', 'Support is available 24/7 through WhatsApp, the client-area ticketing system, and support email.'],
    ['Can I run any workload?', 'No. Use must remain lawful and must follow the Use of Service terms.'],
  ] as [string, string][],
  other: {
    title: 'Need Linux instead?',
    text: 'For websites, applications, databases, or development stacks, see Linux VPS hosting.',
    href: '/linux-vps',
    label: 'Linux VPS hosting',
  },
  cta: {
    kicker: 'Windows VPS plans',
    title: 'Compare Windows VPS plans',
    compare: 'Compare plans',
    compareHref: '/plans#windows-vps',
    checkout: 'Continue to checkout',
    checkoutHref: '/plans',
  },
};

export type WindowsVpsCopy = typeof page;

export default page;
