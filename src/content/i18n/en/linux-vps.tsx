/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { Plan } from '../../../lib/stealth/content';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

/* /linux-vps in English. Live figures come from the plan catalogue at render time. */

type LinuxFacts = {
  /* Price of the first Bronze plan, formatted for this language. */
  bronzePrice: string;
  bronze: Plan[];
  /* The lowest-priced plan in the catalogue and its formatted price. */
  cheapest: { name: string; price: string };
};

const page = {
  meta: {
    title: 'Linux VPS Server Hosting | Ubuntu, Debian | StealthRDP',
    description: 'Linux VPS servers with full Root access, NVMe storage and Ubuntu, Debian, AlmaLinux or another listed distro. USA and EU regions.',
  },
  jsonLd: {
    name: 'Linux VPS hosting',
    description: 'Linux VPS hosting with full Root access, a wide choice of distributions, NVMe storage, and USA or EU regions.',
  },
  kicker: 'Linux VPS hosting',
  title: ['Linux VPS server hosting with Root access and a distro', 'you can confirm.'] as [string, string],
  lede: 'You need a Linux server you can administer as root, in a USA or EU region. That can be Ubuntu, Debian, CentOS, or another listed image, at a price you can verify before you pay.',
  compareButton: 'Compare Linux VPS plans',
  distrosButton: 'Linux distributions',
  latest: 'Latest',
  pricing: { kicker: 'Current VPS catalog', title: 'Choose your resource level' },
  resources: ({ bronzePrice, bronze }: LinuxFacts) => (
    <>
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
    </>
  ),
  faqTitle: 'Linux VPS questions',
  questions: ({ bronzePrice }: LinuxFacts): [string, string][] => [
    ['What does a Linux VPS server cost?', `Plans start with Bronze at ${bronzePrice}/month on the live plans page. Confirm the live price and region at checkout.`],
    ['Which Linux distributions can I run?', 'AlmaLinux 8, 9, and 10; Alpine Linux 3.15, 3.19, and 3.23; CentOS 7, Stream 8, and Stream 9; Debian 10, 11, 12, and 13; Fedora 37 through 44; FreeBSD 13.2 through 15.0; Rocky Linux 8, 9, and 10; Ubuntu 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, and 26.04 LTS; openSUSE Leap 15; CloudLinux 9; Arch Linux Latest; and Oracle Linux 8 and 9.'],
    ['Can I get an Ubuntu VPS?', 'Yes. Choose Ubuntu as the operating system at checkout: 18.04 LTS, 20.04 LTS, 22.04 LTS, 24.04 LTS, or 26.04 LTS. You get the VPS with Ubuntu installed and full Root access.'],
    ['Debian or Ubuntu server: which should I choose?', 'Both run most server software well. Ubuntu LTS is common in tutorials and control-panel guides. Debian stable changes less between releases. If your software documents one of them, choose that one.'],
    ['Do plans include Root?', 'Yes. The FAQ states that VPS plans include full Root access.'],
    ['Are USA and EU Linux plans available?', 'Yes. USA plans run in Phoenix, Arizona and EU plans in Amsterdam, Netherlands. Both appear in the public catalog; confirm the region at checkout.'],
    ['When is it activated?', 'Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes.'],
    ['How do I get credentials?', 'By email after payment confirmation.'],
  ],
  other: {
    title: 'Need Windows instead?',
    text: 'For familiar Windows software and remote Windows desktop or server access, see Windows VPS hosting.',
    href: '/windows-vps',
    label: 'Windows VPS hosting',
  },
  cta: {
    kicker: 'Linux VPS plans',
    title: 'Compare Linux VPS plans',
    text: 'Check the current plan, region, and displayed price, then confirm Linux and the exact image in checkout.',
    compare: 'Compare Linux VPS plans',
    compareHref: '/plans#linux-vps',
    checkout: 'Continue to checkout',
    checkoutHref: '/plans',
  },
};

export type LinuxVpsCopy = typeof page;

export default page;
