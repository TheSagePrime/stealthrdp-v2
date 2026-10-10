import type { BlogArticle } from '@/lib/stealth/articles';
import type { BillingCycle, Plan } from '@/lib/stealth/content';
import { citadelCopy } from '@/content/i18n/citadel';
import { faqPageCopy, faqsByLocale } from '@/content/i18n/faq';
import { linuxVpsCopy } from '@/content/i18n/linux-vps';
import { osCopy } from '@/content/i18n/os';
import { plansCopy } from '@/content/i18n/plans';
import { pricingCopy } from '@/content/i18n/pricing';
import { windowsVpsCopy } from '@/content/i18n/windows-vps';
import { rdpVpsGuide } from '@/content/rdp-vps';
import { blogArticles } from '@/lib/stealth/articles';
import { checkoutUrl } from '@/lib/stealth/checkout';
import { citadelPlans, citadelStoreUrl } from '@/lib/stealth/citadel-plans';
import { plans } from '@/lib/stealth/content';
import { htmlToMarkdown } from '@/lib/stealth/html-to-markdown';
import { formatEuro } from '@/lib/stealth/i18n';
import { linuxDistros, windowsVersions } from '@/lib/stealth/os-catalog';
import { getSeoConfig } from '@/libs/seo/config';

/* The Markdown copies served at /docs-md/<slug> for the "Copy Markdown" and "Open" buttons:
   guides (guide-<slug>), the English FAQ (faq), the RDP VPS page (rdp-vps) and the product pages
   (plans, windows-vps, linux-vps, citadel). English only.
   A guide written in Markdown is served from its own Markdown; an HTML guide is converted.
   The product pages are generated from the same data and English copy the live pages render: the
   plan catalogue (src/content/plans.json), the page copy in src/content/i18n/en and the shared
   constants in src/lib/stealth (citadel-plans.ts, os-catalog.ts). Live WHMCS stock is not read
   here, because these copies are static; the live pages show it. */

const guideCopySlugPrefix = 'guide-';

function guideMarkdownCopy(article: BlogArticle): string {
  const body = article.markdown ?? htmlToMarkdown(article.html);
  const sources = article.sources?.length
    ? [
        '## Sources',
        '',
        ...article.sources.map((source, index) => {
          const publisher = source.publisher ? ` (${source.publisher})` : '';
          return `${index + 1}. [${source.title}](${source.url})${publisher}`;
        }),
      ]
    : [];
  return `${[`# ${article.title}`, '', article.excerpt, '', body.trim(), '', ...sources].join('\n').trimEnd()}\n`;
}

function faqMarkdownCopy(): string {
  const { title, description } = faqPageCopy.en;
  const lines = [`# ${title}`, '', description, ''];
  let category = '';
  for (const faq of faqsByLocale.en) {
    if (faq.category !== category) {
      category = faq.category;
      lines.push(`## ${category}`, '');
    }
    lines.push(`### ${faq.question}`, '', faq.answer, '');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

function rdpVpsMarkdownCopy(): string {
  return [`# ${rdpVpsGuide.h1}`, '', rdpVpsGuide.description, '', htmlToMarkdown(rdpVpsGuide.html).trim(), ''].join('\n');
}

/* Product pages ------------------------------------------------------------ */

const en = pricingCopy.en;
const billingCycles: BillingCycle[] = ['monthly', 'quarterly', 'semiannual', 'annual', 'biannual'];

/* Months each billing cycle covers. Same values as PricingExplorer, which is a client component and
   cannot be imported here; they only decide when the per-month equivalent is shown. */
const cycleMonths: Record<BillingCycle, number> = {
  monthly: 1,
  quarterly: 3,
  semiannual: 6,
  annual: 12,
  biannual: 24,
};

const buildYourOwnUrl = 'https://dash.stealthrdp.com/index.php?rp=/store/build-your-own-rdp-vps';

/* Absolute URL of a page on the live site, for links in the copies. */
function pageUrl(path: string): string {
  return `${getSeoConfig().siteUrl.replace(/\/$/, '')}${path}`;
}

function cell(value: string): string {
  return value.replace(/\|/g, '\\|');
}

function table(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.map(cell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(row => `| ${row.map(cell).join(' | ')} |`),
  ].join('\n');
}

function numbered(items: string[]): string {
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function bullets(items: string[]): string {
  return items.map(item => `- ${item}`).join('\n');
}

function questionsAndAnswers(questions: ReadonlyArray<readonly [string, string]>): string {
  return questions.map(([question, answer]) => `### ${question}\n\n${answer}`).join('\n\n');
}

/* One plan's price in one billing cycle, worded as on the plan cards and the comparison table. */
function priceCell(plan: Plan, cycle: BillingCycle): string {
  const price = plan.pricing[cycle];
  const months = cycleMonths[cycle];
  const effective = months > 1 ? en.effective(price.amount / months) : '';
  const standard = price.referenceAmount ? ` (${en.standard} ${en.money(price.referenceAmount)})` : '';
  return `${en.money(price.amount)}${en.suffix(cycle, price.suffix)}${effective}${standard}`;
}

/* One table per region, with the columns of the comparison table and one price column per cycle. */
function regionPlansTable(region: Plan['location']): string {
  const inRegion = plans.filter(plan => plan.location === region);
  const popularName = inRegion.find(plan => plan.popular)?.name;
  return table(
    ['Plan', 'Description', en.specs.cpu, en.specs.ram, en.specs.storage, en.specs.bandwidth, ...billingCycles.map(cycle => en.priceHeader[cycle])],
    inRegion.map(plan => [
      plan.name === popularName
        ? `[${plan.name}](${checkoutUrl(plan, 'monthly', 'en')}) (${en.mostPopular})`
        : `[${plan.name}](${checkoutUrl(plan, 'monthly', 'en')})`,
      en.description(plan.description),
      en.spec(plan.specs.cpu),
      plan.specs.ram,
      plan.specs.storage,
      `${en.spec(plan.specs.bandwidth)} ${en.traffic}`,
      ...billingCycles.map(cycle => priceCell(plan, cycle)),
    ]),
  );
}

function plansByRegion(): string[] {
  return (['USA', 'EU'] as const).flatMap(region => [
    `### ${en.regionNames[region]} plans`,
    regionPlansTable(region),
  ]);
}

/* The journey from order to sign-in, as on the Windows and Linux pages. */
function journeyList(kind: 'windows' | 'linux'): string {
  const journey = osCopy.en.journey;
  const steps: { title: string; text: string; time?: string }[] = [
    journey.pick,
    kind === 'windows' ? journey.windowsOs : journey.linuxOs,
    journey.credentials,
    kind === 'windows' ? journey.windowsConnect : journey.linuxConnect,
  ];
  return numbered(steps.map(step => `**${step.title}**: ${step.text}${step.time ? ` (${step.time})` : ''}`));
}

/* Regions with the plan count and the lowest monthly price, as on the OS pages. Windows lists the
   plans that run Windows (not the Linux-only ones). */
function regionSummaryTable(kind: 'windows' | 'linux'): string {
  const eligible = kind === 'windows' ? plans.filter(plan => plan.source.os !== 'linux-only') : plans;
  const copy = osCopy.en.regions;
  const rows = (['USA', 'EU'] as const).map((region) => {
    const list = eligible.filter(plan => plan.location === region);
    const from = Math.min(...list.map(plan => plan.pricing.monthly.amount));
    return [copy.names[region], String(list.length), `${formatEuro(from, 'en')}${copy.perMonth}`];
  });
  return table(['Region', copy.plans, copy.from], rows);
}

/* The resource ranges across the catalogue, as the "Size the machine" section shows them. */
function resourceList(kind: 'windows' | 'linux'): string {
  const copy = osCopy.en.resources;
  const eligible = kind === 'windows' ? plans.filter(plan => plan.source.os !== 'linux-only') : plans;
  return bullets((['cpu', 'ram', 'storage'] as const).map((key) => {
    const item = copy.items[key];
    const values = [...new Set(eligible.map(plan => Number.parseFloat(plan.specs[key])))].sort((a, b) => a - b);
    const min = values[0] ?? 0;
    const max = values.at(-1) ?? 1;
    return `${item.carries}: ${item.text[kind]} ${copy.scaleLabel(item.label, min, max, item.unit, eligible.length)}.`;
  }));
}

function supportList(kind: 'windows' | 'linux'): string {
  const support = osCopy.en.support;
  return bullets([
    `${support.heading}: ${support.whatsapp}; ${support.tickets}; ${support.email}. [${support.faqLink}](${pageUrl('/faq')})`,
    `${kind === 'windows' ? support.access.windows : support.access.linux} ${support.accessRest}`,
    support.lawful,
  ]);
}

function guideLinks(kind: 'windows' | 'linux'): string {
  const guides = kind === 'windows' ? osCopy.en.support.windowsGuides : osCopy.en.support.linuxGuides;
  return bullets(guides.map(guide => `[${guide.label}](${pageUrl(guide.href)})`));
}

function plansPageCopy(): string {
  const t = plansCopy.en;
  const lowest = Math.min(...plans.map(plan => plan.pricing.monthly.amount));
  return [
    `# ${t.meta.title}`,
    t.meta.description,
    `Live page: ${pageUrl('/plans')}`,
    `## ${t.grid.title}`,
    t.lede,
    'Plan names link to checkout for the monthly billing cycle. Choose another billing cycle at checkout. Stock is not listed here; the live page shows it.',
    ...plansByRegion(),
    `## ${t.included.title}`,
    t.included.text,
    bullets(t.included.items.map(item => `**${item.title}**: ${item.text}`)),
    `## ${t.os.title}`,
    `### ${t.os.windows.title}`,
    t.os.windows.text,
    `[${t.os.windows.guide}](${pageUrl('/windows-vps')})`,
    `### ${t.os.linux.title}`,
    t.os.linux.text,
    `[${t.os.linux.guide}](${pageUrl('/linux-vps')})`,
    `## ${t.faqTitle}`,
    questionsAndAnswers(t.questions(en.money(lowest))),
    `## ${t.build.title}`,
    t.build.text,
    `[${t.build.button}](${buildYourOwnUrl})`,
  ].join('\n\n');
}

function windowsVpsPageCopy(): string {
  const t = windowsVpsCopy.en;
  return [
    `# ${t.meta.title}`,
    t.meta.description,
    `Live page: ${pageUrl('/windows-vps')}`,
    `## ${t.pricing.title}`,
    t.lede,
    ...plansByRegion(),
    `## ${osCopy.en.journey.title.windows}`,
    osCopy.en.journey.intro,
    journeyList('windows'),
    `## ${osCopy.en.versions.title}`,
    osCopy.en.versions.intro,
    bullets(windowsVersions.map(version => `${osCopy.en.versions.product} ${version}`)),
    `## ${osCopy.en.resources.title}`,
    osCopy.en.resources.intro,
    resourceList('windows'),
    `## ${osCopy.en.regions.title}`,
    osCopy.en.regions.intro,
    regionSummaryTable('windows'),
    `## ${osCopy.en.support.title}`,
    supportList('windows'),
    `### ${osCopy.en.support.guides}`,
    guideLinks('windows'),
    `## ${t.faqTitle}`,
    questionsAndAnswers(t.questions),
    `## ${t.other.title}`,
    `${t.other.text} [${t.other.label}](${pageUrl(t.other.href)})`,
  ].join('\n\n');
}

function linuxVpsPageCopy(): string {
  const t = linuxVpsCopy.en;
  const bronze = plans.filter(plan => plan.name.startsWith('Bronze '));
  const cheapest = [...plans].sort((a, b) => a.pricing.monthly.amount - b.pricing.monthly.amount)[0];
  const facts = {
    bronze,
    cheapest: { name: cheapest?.name ?? 'Bronze', price: en.money(cheapest?.pricing.monthly.amount ?? 9.5) },
  };
  return [
    `# ${t.meta.title}`,
    t.meta.description,
    `Live page: ${pageUrl('/linux-vps')}`,
    `## ${t.pricing.title}`,
    t.lede,
    ...plansByRegion(),
    `## ${osCopy.en.journey.title.linux}`,
    osCopy.en.journey.intro,
    journeyList('linux'),
    `## ${osCopy.en.distros.title}`,
    osCopy.en.distros.intro,
    table(
      ['Distribution', 'Versions', 'Notes'],
      linuxDistros.map(distro => [distro.name, distro.versions.replace('Latest', t.latest), distro.text]),
    ),
    `## ${osCopy.en.resources.title}`,
    osCopy.en.resources.intro,
    resourceList('linux'),
    `## ${osCopy.en.regions.title}`,
    osCopy.en.regions.intro,
    regionSummaryTable('linux'),
    `## ${osCopy.en.support.title}`,
    supportList('linux'),
    `### ${osCopy.en.support.guides}`,
    guideLinks('linux'),
    `## ${t.faqTitle}`,
    questionsAndAnswers(t.questions(facts)),
    `## ${t.other.title}`,
    `${t.other.text} [${t.other.label}](${pageUrl(t.other.href)})`,
  ].join('\n\n');
}

function citadelPageCopy(): string {
  const t = citadelCopy.en;
  return [
    `# ${t.meta.title}`,
    t.meta.description,
    `Live page: ${pageUrl('/citadel')}`,
    `${t.hero.title} ${t.hero.titleSpan}`,
    t.hero.text,
    bullets(t.hero.facts.map(([value, label]) => `${value} ${label}`)),
    `## ${t.setupSection.title}`,
    t.setupSection.text,
    numbered(t.setup.steps.map(step => `**${step.title}**: ${step.text}`)),
    `## ${t.threatsSection.title}`,
    t.threatsSection.text,
    `## ${t.controlsSection.title}`,
    t.controlsSection.text,
    `## ${t.portalSection.title}`,
    t.portalSection.text,
    `## ${t.plansSection.title}`,
    t.plansSection.text,
    table(
      ['Plan', 'Price', t.plansSection.domains, t.plansSection.bandwidth, t.plansSection.challengeModes, t.plansSection.attackMode, 'Summary', 'Order'],
      citadelPlans.map((plan, index) => {
        const copy = t.plans[index]!;
        return [
          plan.featured ? `${plan.name} (${t.plansSection.mostPopular})` : plan.name,
          `${copy.priceLabel}${t.plansSection.perMonth}`,
          copy.domains,
          copy.bandwidth,
          t.plansSection.challengeModesValue,
          t.plansSection.attackModeValue,
          copy.text,
          `[${t.plansSection.order}](${plan.checkout})`,
        ];
      }),
    ),
    `## ${t.included.title}`,
    bullets(t.included.items),
    `## ${t.final.title}`,
    t.final.text,
    `[${t.final.plans}](${citadelStoreUrl})`,
    `[${t.final.status}](${pageUrl('/status')})`,
  ].join('\n\n');
}

const pageCopies = new Map<string, () => string>([
  ['plans', plansPageCopy],
  ['windows-vps', windowsVpsPageCopy],
  ['linux-vps', linuxVpsPageCopy],
  ['citadel', citadelPageCopy],
]);

/* Every slug the copies route serves. Help Center and Citadel articles keep their own slugs. */
export function guideCopySlugs(): string[] {
  return [...blogArticles.map(article => `${guideCopySlugPrefix}${article.slug}`), 'faq', 'rdp-vps'];
}

/* The product-page copies: /docs-md/plans, /docs-md/windows-vps, /docs-md/linux-vps, /docs-md/citadel. */
export function pageCopySlugs(): string[] {
  return [...pageCopies.keys()];
}

export function findPageCopy(slug: string): string | undefined {
  return pageCopies.get(slug)?.();
}

export function findGuideCopy(slug: string): string | undefined {
  if (slug === 'faq') {
    return faqMarkdownCopy();
  }
  if (slug === 'rdp-vps') {
    return rdpVpsMarkdownCopy();
  }
  if (slug.startsWith(guideCopySlugPrefix)) {
    const article = blogArticles.find(item => item.slug === slug.slice(guideCopySlugPrefix.length));
    return article ? guideMarkdownCopy(article) : undefined;
  }
  return undefined;
}
