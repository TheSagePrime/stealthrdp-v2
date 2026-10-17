/* The about page in English, including the hero illustration (AboutMap) and its JSON-LD. */

const about = {
  meta: {
    title: 'About Us — StealthRDP',
    description: 'StealthRDP runs Windows and Linux VPS from Phoenix, Arizona and Amsterdam, Netherlands, with 12,000+ VPS deployed and 24/7 support.',
  },
  jsonLd: {
    pageName: 'About StealthRDP',
    description: 'Windows and Linux VPS hosting from data centers in Phoenix, Arizona and Amsterdam, Netherlands, and Citadel Layer 7 DDoS protection.',
    crumb: 'About',
  },
  hero: {
    kicker: 'About StealthRDP',
    title: 'Built for people who need servers that',
    titleSpan: 'just work.',
    lede: 'StealthRDP runs Windows and Linux VPS from data centers in Phoenix, Arizona and Amsterdam, Netherlands. Choose a plan, pay, and most servers are live within 60 seconds, with full Administrator or root access.',
    compare: 'Compare VPS plans',
    status: 'View server status',
  },
  map: {
    from: (price: number) => `From €${price.toFixed(2)}/mo`,
    noPlans: 'Plans listed per region',
    usa: 'USA region',
    eu: 'EU region',
    citadelNote: 'Layer 7 DDoS shield',
    linuxNote: 'Ubuntu, Debian +3',
    clientArea: 'Client area',
    clientAreaNote: 'Billing and tickets',
    livePlans: (count: number) => `${count} live plans`,
  },
  proofLabel: 'StealthRDP in numbers',
  proof: [
    { value: '12,000+', label: 'VPS deployed' },
    { value: '2', label: 'data centers, USA and EU' },
    { value: '60 sec', label: 'typical setup' },
    { value: '24/7', label: 'support' },
  ],
  products: {
    kicker: 'What we do',
    title: 'Two products, one support team.',
    text: 'A VPS for the work you run, and Citadel for the websites you need to keep online. They are separate products: Citadel does not need a StealthRDP VPS.',
    vps: {
      title: 'Windows and Linux VPS',
      text: (from: number) => `Windows Server 2019, 2022 and 2025, or Linux such as Ubuntu, Debian and AlmaLinux. NVMe storage, a dedicated IPv4 address and weekly backups on every plan. From €${from.toFixed(2)}/month.`,
      link: 'Compare VPS plans',
    },
    citadel: {
      title: 'Citadel DDoS protection',
      text: 'Layer 7 protection for HTTP and HTTPS sites and applications. Starter €0, Growth €49 and Scale €149 per month.',
      link: 'Explore Citadel',
    },
  },
  standards: {
    kicker: 'How we run it',
    title: 'The same standard on every server.',
    text: 'Whichever plan or operating system you choose, every StealthRDP VPS comes with these.',
    /* Same order as the icons in the page: setup, control, network, storage, backups, uptime. */
    items: [
      { label: 'Setup', title: 'Live in about 60 seconds', text: 'Most servers are live within 60 seconds of payment confirmation. At busy times it can take a few minutes.' },
      { label: 'Control', title: 'Administrator or root access', text: 'Full Administrator access on Windows and full root access on Linux, from the first login.' },
      { label: 'Network', title: 'A dedicated IPv4 address', text: 'Every server has its own IPv4 address. Need a new one? Support changes it for €5.' },
      { label: 'Storage', title: 'NVMe on every plan', text: 'NVMe storage on every plan, in the USA and in Europe.' },
      { label: 'Backups', title: 'Weekly backups', text: 'Every server is backed up once a week.' },
      { label: 'Uptime', title: 'Measured uptime, in public', text: 'The status page shows 30- and 90-day uptime and incidents for each monitored service.' },
    ],
  },
  regions: {
    kicker: 'Where your server runs',
    title: 'Two data centers, one in each region.',
    text: 'Each plan shows its region. Pick the one closest to your users and the services you connect to.',
    label: (region: 'USA' | 'EU') => `${region} plans`,
    from: (price: number) => `From €${price.toFixed(2)}/month`,
    usa: { city: 'Phoenix, Arizona', text: 'The data center for USA plans. Choose it for users and services in North America.' },
    eu: { city: 'Amsterdam, Netherlands', text: 'The data center for EU plans. Choose it for users and services in Europe.' },
  },
  reviews: {
    kicker: 'Customer reviews',
    title: 'What customers say on Trustpilot.',
    text: 'Unedited reviews from our customers, each linked to its source.',
    viewOn: 'View on Trustpilot',
  },
  final: {
    kicker: 'Questions about our infrastructure?',
    title: 'Talk to our team.',
    text: 'Support is available 24/7 on WhatsApp, through client-area tickets and at support@stealthrdp.com. Billing, invoices and tickets live in your client area.',
    talk: 'Talk to our team',
    whatsapp: 'Message WhatsApp support',
  },
};

export type AboutCopy = typeof about;

export default about;
