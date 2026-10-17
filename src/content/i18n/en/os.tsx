import Link from 'next/link';

/* Words of the shared VPS page sections (src/components/site/os) and the hero illustration. */

const os = {
  session: {
    computer: 'Your computer',
    signedInAs: 'Signed in as',
    regionNote: 'Region chosen per plan',
    facts: ['Live in about 60 seconds', 'Dedicated IPv4', 'Unlimited bandwidth'],
    windows: { client: 'Remote Desktop', session: 'RDP session' },
    linux: { client: 'SSH client', session: 'SSH session' },
    linuxImage: 'Linux',
  },
  journey: {
    kicker: 'From order to sign-in',
    title: {
      windows: 'Four steps from checkout to your Windows desktop',
      linux: 'Four steps from checkout to a root shell',
    },
    intro: 'Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes.',
    pick: {
      title: 'Pick a plan and region',
      text: 'Compare CPU, RAM, storage, bandwidth and price above, in a USA or EU region.',
    },
    windowsOs: { title: 'Choose Windows Server at checkout', text: 'Checkout offers the operating-system selector: Windows Server 2019, 2022 or 2025.' },
    linuxOs: { title: 'Choose a distribution at checkout', text: 'Checkout offers the operating-system selector with the listed Linux images.' },
    credentials: {
      title: 'Receive your credentials',
      text: 'StealthRDP sends them by email after payment confirmation.',
      time: 'Typically within 60 seconds',
    },
    windowsConnect: {
      title: 'Connect with Remote Desktop',
      text: 'Enter the server IP from the email and sign in as Administrator.',
      linkLabel: 'How do I log into Windows?',
    },
    linuxConnect: { title: 'Sign in as root', text: 'Connect to the server IP from the email with the root credentials.' },
  },
  versions: {
    kicker: 'Environment',
    title: 'Choose the Windows version your software needs',
    intro: 'The Services & Plans FAQ lists these Windows options. Pick one in checkout when your software asks for it.',
    product: 'Windows Server',
    selected: 'Selected at checkout',
    licensing: (
      <>
        <strong>Windows licensing.</strong>
        {' '}
        StealthRDP provides the infrastructure only. Microsoft Windows licensing is not included and is not supplied by
        StealthRDP. Customers are responsible for their own licensing compliance.
        {' '}
        <Link href="/docs/windows-licensing">Read the Windows licensing page</Link>
        .
      </>
    ),
  },
  distros: {
    kicker: 'Environment',
    title: 'Linux distributions you can run',
    intro: 'Choose the operating-system family your stack needs, then confirm the exact image and version during checkout.',
    directAdmin: 'How to install DirectAdmin in a Linux server',
  },
  resources: {
    kicker: 'Resource fit',
    title: 'Size the machine to the stack',
    intro: 'Count what runs at the same time. Each dot below is a plan in the current catalogue.',
    items: {
      cpu: {
        label: 'CPU',
        unit: 'vCPU',
        carries: 'Concurrent work',
        text: {
          windows: 'Match active processing and concurrent tasks.',
          linux: 'Compare CPU against the application, services, workers and expected load.',
        },
      },
      ram: {
        label: 'RAM',
        unit: 'GB',
        carries: 'Active services',
        text: {
          windows: 'Allow for Windows, applications and users running at the same time.',
          linux: 'Size memory for the OS plus web server, app processes, databases, panels and jobs.',
        },
      },
      storage: {
        label: 'Storage',
        unit: 'GB',
        carries: 'Files and data',
        text: {
          windows: 'Include the operating system, installed software, files and future additions.',
          linux: 'Include the operating system, packages, databases, files and future additions.',
        },
      },
    },
    scaleLabel: (label: string, min: number, max: number, unit: string, count: number) =>
      `${label} from ${min} to ${max} ${unit} across ${count} plans`,
  },
  regions: {
    kicker: 'Regions',
    title: 'USA or EU',
    intro: 'Choose the region that fits your users, latency and operating requirements. Figures come from the live catalogue.',
    names: { USA: 'USA', EU: 'EU' },
    plans: 'Plans',
    from: 'From',
    perMonth: '/mo',
    stock: 'Servers in stock',
    view: (region: string) => `View ${region} plans`,
  },
  support: {
    kicker: 'Support and limits',
    title: 'Help when you need it, and the rules that apply',
    heading: 'Support',
    whatsapp: 'WhatsApp support',
    tickets: 'Client-area ticket system',
    email: 'Support email',
    faqLink: 'Support details in the FAQ',
    responsibilities: 'Your responsibilities',
    access: { windows: 'Full Windows Administrator access', linux: 'Full root access' },
    accessRest: 'gives you control of the server and the software you install. You are responsible for regular backups of important data.',
    lawful: 'Use must be lawful. The terms prohibit abuse, scanning, hacking, spam, botnets and similar misuse.',
    terms: 'Use of Service terms',
    guides: 'Guides',
    windowsGuides: [
      { href: '/docs/how-do-i-log-into-windows', label: 'How do I log into Windows?' },
      { href: '/docs/how-to-re-activate-and-extend-your-180-day-windows-trial', label: 'Extend the 180-day Windows trial' },
      { href: '/docs/step-by-step-guide-to-fix-win-rm-and-install-net-framework', label: 'Fix WinRM and install .NET Framework' },
      { href: '/docs/how-to-rebuild-a-server', label: 'How to rebuild a server' },
    ],
    linuxGuides: [
      { href: '/docs/how-to-install-direct-admin-in-a-linux-server', label: 'Install DirectAdmin' },
      { href: '/docs/install-cyber-panel-with-open-lite-speed-in-linux', label: 'Install CyberPanel with OpenLiteSpeed' },
      { href: '/docs/how-to-setup-your-vpn-on-linux-server-using-outline', label: 'Set up an Outline VPN server' },
      { href: '/docs/how-to-rebuild-a-server', label: 'How to rebuild a server' },
    ],
    allHelp: 'All help articles',
  },
  faq: {
    kicker: 'Common questions',
    intro: 'Quick answers for software, access, activation and support.',
    other: 'Choose another environment',
  },
};

export type OsCopy = typeof os;

export default os;
