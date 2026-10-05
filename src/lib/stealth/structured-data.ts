import type { Faq, Plan } from '@/lib/stealth/content';
import { checkoutUrl } from '@/lib/stealth/content';

/* schema.org data for AI assistants and search engines. Rendered only in production, through
   ProductionJsonLd, so the preview never publishes a second copy under its own domain. */

type Node = Record<string, unknown>;

const MONTHS: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

/** "Mar 13, 2025" -> "2025-03-13". ISO dates pass through; anything else is dropped. */
export function isoDate(value: string): string | undefined {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const match = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})$/.exec(value.trim());
  const month = match && MONTHS[match[1]!];
  return match && month ? `${match[3]}-${month}-${match[2]!.padStart(2, '0')}` : undefined;
}

const provider = (siteUrl: string): Node => ({ '@type': 'Organization', 'name': 'StealthRDP', 'url': siteUrl });

function offer(plan: Plan): Node {
  return {
    '@type': 'Offer',
    'price': plan.pricing.monthly.amount,
    'priceCurrency': 'EUR',
    'availability': plan.source.availability === 'out-of-stock'
      ? 'https://schema.org/OutOfStock'
      : 'https://schema.org/InStock',
    'url': checkoutUrl(plan, 'monthly'),
    'description': 'Monthly billing',
  };
}

function aggregateOffer(plans: Plan[]): Node {
  const prices = plans.map(plan => plan.pricing.monthly.amount);
  return {
    '@type': 'AggregateOffer',
    'priceCurrency': 'EUR',
    'lowPrice': Math.min(...prices),
    'highPrice': Math.max(...prices),
    'offerCount': plans.length,
  };
}

export function homeJsonLd(
  siteUrl: string,
  plans: Plan[],
  words: { name: string; serviceType: string; description: string } = {
    name: 'StealthRDP VPS hosting',
    serviceType: 'Windows and Linux VPS hosting',
    description: 'Windows and Linux VPS and RDP hosting with USA and EU regions.',
  },
  plansPath = '/plans',
): Node[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'StealthRDP',
      'url': siteUrl,
      'publisher': provider(siteUrl),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': words.name,
      'serviceType': words.serviceType,
      'description': words.description,
      'url': `${siteUrl}${plansPath}`,
      'areaServed': ['US', 'EU'],
      'provider': provider(siteUrl),
      'offers': aggregateOffer(plans),
    },
  ];
}

/** A Windows or Linux VPS page: the service with its live price range, the breadcrumb and the questions the page shows. */
export function osPageJsonLd(input: {
  siteUrl: string;
  path: string;
  name: string;
  description: string;
  plans: Plan[];
  questions: ReadonlyArray<readonly [string, string]>;
  /* German and Spanish pages: the breadcrumb's first step in that language and its home URL. */
  home?: { name: string; path: string };
}): Node[] {
  const url = `${input.siteUrl}${input.path}`;
  const home = input.home ?? { name: 'Home', path: '' };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': input.name,
      'serviceType': input.name,
      'description': input.description,
      'url': url,
      'areaServed': ['US', 'EU'],
      'provider': provider(input.siteUrl),
      'offers': aggregateOffer(input.plans),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': home.name, 'item': `${input.siteUrl}${home.path}` },
        { '@type': 'ListItem', 'position': 2, 'name': input.name, 'item': url },
      ],
    },
    faqJsonLd(input.questions.map(([question, answer]) => ({ question, answer }))),
  ];
}

export function plansJsonLd(
  siteUrl: string,
  plans: Plan[],
  words: { listName: string; describe: (plan: Plan) => string } = {
    listName: 'StealthRDP VPS plans',
    describe: plan => `${plan.specs.cpu}, ${plan.specs.ram} RAM, ${plan.specs.storage}, ${plan.location} region`,
  },
): Node {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': words.listName,
    'itemListElement': plans.map((plan, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Service',
        'name': plan.name,
        'serviceType': 'VPS hosting',
        'description': words.describe(plan),
        'provider': provider(siteUrl),
        'offers': offer(plan),
      },
    })),
  };
}

export function faqJsonLd(faqs: Pick<Faq, 'question' | 'answer'>[]): Node {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': { '@type': 'Answer', 'text': item.answer },
    })),
  };
}

export function techArticleJsonLd(input: {
  siteUrl: string;
  path: string;
  title: string;
  description: string;
  date: string;
  section: { name: string; path: string };
}): Node[] {
  const url = `${input.siteUrl}${input.path}`;
  const modified = isoDate(input.date);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': input.title,
      'description': input.description,
      'url': url,
      'mainEntityOfPage': url,
      'inLanguage': 'en',
      ...(modified ? { dateModified: modified } : {}),
      'author': provider(input.siteUrl),
      'publisher': provider(input.siteUrl),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': input.siteUrl },
        { '@type': 'ListItem', 'position': 2, 'name': input.section.name, 'item': `${input.siteUrl}${input.section.path}` },
        { '@type': 'ListItem', 'position': 3, 'name': input.title, 'item': url },
      ],
    },
  ];
}

type CitadelPlan = { name: string; price: number; domains: string; bandwidth: string; checkout: string };

/** Citadel as a service with one monthly offer per plan, from the same data the page shows. */
export function citadelJsonLd(siteUrl: string, plans: CitadelPlan[]): Node {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': 'Citadel Layer 7 DDoS protection',
    'serviceType': 'DDoS protection',
    'description': 'Layer 7 protection for HTTP/HTTPS applications: browser challenges, rate limits, allowlists, lockdown mode, caching and request logs.',
    'url': `${siteUrl}/citadel`,
    'provider': provider(siteUrl),
    'offers': plans.map(plan => ({
      '@type': 'Offer',
      'name': `Citadel ${plan.name}`,
      'price': plan.price,
      'priceCurrency': 'EUR',
      'url': plan.checkout,
      'description': `${plan.domains}, ${plan.bandwidth} clean bandwidth, monthly billing`,
    })),
  };
}

/** The about page, describing the company: logo, social profiles and the 24/7 support contact. */
export function aboutJsonLd(
  siteUrl: string,
  brand: { logoUrl?: string; socialProfiles?: string[] } = {},
  words: { pageName: string; description: string; crumb: string; path: string; home: { name: string; path: string } } = {
    pageName: 'About StealthRDP',
    description: 'Windows and Linux VPS hosting from data centers in Phoenix, Arizona and Amsterdam, Netherlands, and Citadel Layer 7 DDoS protection.',
    crumb: 'About',
    path: '/about',
    home: { name: 'Home', path: '' },
  },
): Node[] {
  const url = `${siteUrl}${words.path}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': words.pageName,
      'url': url,
      'mainEntity': {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        'name': 'StealthRDP',
        'url': siteUrl,
        ...(brand.logoUrl ? { logo: brand.logoUrl } : {}),
        ...(brand.socialProfiles?.length ? { sameAs: brand.socialProfiles } : {}),
        'description': words.description,
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'customer support',
          'email': 'support@stealthrdp.com',
          'hoursAvailable': {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'opens': '00:00',
            'closes': '23:59',
          },
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': words.home.name, 'item': `${siteUrl}${words.home.path}` },
        { '@type': 'ListItem', 'position': 2, 'name': words.crumb, 'item': url },
      ],
    },
  ];
}
