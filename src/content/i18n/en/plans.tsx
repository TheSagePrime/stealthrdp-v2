import type { Plan } from '../../../lib/stealth/content';
import Link from 'next/link';

/* /plans in English. */

const page = {
  meta: {
    title: 'VPS Hosting Plans | Windows and Linux | StealthRDP',
    description: 'Compare VPS hosting plans for Windows and Linux in the USA and EU: NVMe storage, full admin access and 24/7 support. Choose a plan and order online.',
  },
  jsonLd: {
    listName: 'StealthRDP VPS plans',
    describe: (plan: Plan) => `${plan.specs.cpu}, ${plan.specs.ram} RAM, ${plan.specs.storage}, ${plan.location} region`,
  },
  kicker: 'Windows and Linux VPS',
  title: 'Windows & Linux VPS Hosting Plans',
  lede: 'Compare Windows and Linux VPS hosting plans in one place. Choose a resource level, region, and billing cycle before the checkout.',
  compareButton: 'Compare Standard Plans',
  buildButton: 'Build Your Own VPS',
  facts: {
    plans: 'plans',
    start: (lowest: number) => `€${lowest.toFixed(2)}`,
    startText: '/mo to start',
    stock: 'servers in stock',
  },
  grid: { kicker: 'STANDARD PLANS', title: 'Choose your resource level' },
  os: {
    kicker: 'Operating systems',
    title: 'Pick the VPS environment that fits your work.',
    windows: {
      badge: 'Windows VPS',
      title: 'Windows VPS for graphical remote access.',
      text: 'Choose Windows when your workflow needs a graphical desktop or Microsoft-compatible software. Compare CPU, RAM, NVMe storage, bandwidth, region, and billing cycle above.',
      licensing: (
        <>
          <strong>Windows licensing:</strong>
          {' '}
          StealthRDP provides the infrastructure only.
          Microsoft Windows licensing is not included and is not supplied by StealthRDP.
          Customers using Windows are responsible for their own licensing compliance.
          {' '}
          <Link href="/docs/windows-licensing">Read the Windows licensing page.</Link>
        </>
      ),
      guide: 'Read the Windows VPS hosting guide',
      compare: 'Compare Windows VPS resources',
    },
    linux: {
      badge: 'Linux VPS',
      title: 'Linux VPS for server and open-source workloads.',
      text: 'Choose Linux for command-line administration, web hosting, open-source applications, automation, and server tooling. Compare the same resource levels before you continue to the checkout.',
      guide: 'Read the Linux VPS hosting guide',
      compare: 'Compare Linux VPS resources',
    },
  },
  included: {
    kicker: 'Included with every plan',
    title: 'The essentials are already covered.',
    text: 'Choose a plan by resource level. These service basics stay with every server.',
    items: [
      { title: 'Full admin access', text: 'Control your server from day one' },
      { title: 'NVMe SSD storage', text: 'Fast disk for everyday workloads' },
      { title: 'Isolated VMs', text: 'Separate virtual machines per server' },
      { title: 'Fast activation', text: 'Typically within 60 seconds of payment' },
      { title: '24/7 support', text: 'Help when you need it' },
    ],
  },
  faqTitle: 'VPS hosting plan questions',
  questions: (_lowest: string): [string, string][] => [
    ['Where are the VPS servers located?', 'In Phoenix, Arizona (USA) and Amsterdam, Netherlands (EU). Each plan row shows its region. Choose a USA VPS for users and services in North America, and an EU VPS for users and services in Europe.'],
    ['How do I buy a Windows VPS or a Linux VPS?', 'Choose a plan and billing cycle above, then continue to checkout. Select Windows or Linux and the exact version at checkout. Most servers are live within 60 seconds of payment confirmation.'],
    ['Which VPS hosting plan should I choose?', 'Start from your software, the number of users or sessions, and the data you store. Compare CPU, RAM and NVMe storage as separate limits. If no standard plan fits, build your own server in the configurator.'],
    ['Is support included?', 'Yes. Support is available 24/7 through WhatsApp, the client-area ticketing system, and support email.'],
    ['Can I change my IP address?', 'Yes. Every server has a dedicated IPv4 address. An IP change costs €5 per change; request it from support on WhatsApp, a client-area ticket or email.'],
  ],
  other: {
    title: 'Not sure which system?',
    text: 'Read the Windows VPS and Linux VPS guides before you choose.',
    href: '/windows-vps',
    label: 'Windows VPS hosting',
  },
  build: {
    kicker: 'For workloads between the lines',
    title: 'Build a server around your exact brief.',
    text: 'Choose your own CPU, RAM, storage, location, and billing cycle in the server configurator.',
    labels: ['CPU', 'RAM', 'Storage', 'Region'],
    button: 'Configure & Deploy',
  },
};

export type PlansCopy = typeof page;

export default page;
