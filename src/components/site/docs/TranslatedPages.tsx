import type { CardSection } from '@/components/site/docs/DocsCollections';
import type { TranslatedLocale } from '@/config/i18n';
import type { DocArticle } from '@/lib/stealth/articles';
import type { HelpCollection } from '@/lib/stealth/help-center';
import type { TranslatedDoc, TranslatedGuide } from '@/lib/stealth/translations';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import Image from 'next/image';
import { ArticlePublicationMeta, ArticleSources } from '@/components/seo/Article';
import { ProductionJsonLd } from '@/components/seo/ProductionJsonLd';
import { DocMarkdown, docToc } from '@/components/site/docs/DocMarkdown';
import { cardSectionsToc, DocsCardSections } from '@/components/site/docs/DocsCollections';
import { FluentIcon } from '@/components/site/docs/DocsIcon';
import { DocsArticleMeta, DocsMeta, DocsPageActions, DocsRelated, DocsSupport } from '@/components/site/docs/DocsParts';
import { headingToc, TrustedArticleBody } from '@/components/site/TrustedArticleBody';
import { resolveSeoSite } from '@/config/seo';
import { faqsByLocale } from '@/content/i18n/faq';
import { groupCopy, resourcePagesCopy, resourcesCopy } from '@/content/i18n/resources';
import { citadelDocsArticles, helpDocsArticles } from '@/lib/stealth/articles';
import {
  articlesForCollection,
  citadelArticleHref,
  citadelCollectionForArticle,
  citadelCollections,
  helpArticleHref,
  helpCollectionForArticle,
  helpCollectionId,
  helpCollections,
} from '@/lib/stealth/help-center';
import { fill, localeHref } from '@/lib/stealth/i18n';
import { linkLabel } from '@/lib/stealth/link-label';
import { techArticleJsonLd } from '@/lib/stealth/structured-data';
import {
  markdownCopyPath,
  publishedTranslationEntries,
  translatedDocs,
  translatedGuideJsonLd,
  translatedGuidePublication,
  translatedGuides,
} from '@/lib/stealth/translations';
import { buildArticleIndexJsonLd } from '@/libs/seo/articles';
import { getSeoConfig } from '@/libs/seo/config';
import { serializeJsonLd } from '@/libs/seo/json-ld';

/* German and Spanish Help Center articles, Citadel docs and blog posts, and the index pages of
   their sections, in the same docs shell as the English pages. The words come from the translation
   files (src/lib/stealth/translations.ts) and src/content/i18n/resources.ts. Links to other pages
   stay in the language when that page is published in it, and go to the English page otherwise. */

const dateLocales: Record<TranslatedLocale, string> = { de: 'de-DE', es: 'es-ES' };
const support = {
  ticket: 'https://dash.stealthrdp.com/submitticket.php',
  whatsapp: 'https://wa.me/447441426993',
};

function formatDay(day: string, locale: TranslatedLocale): string {
  return new Intl.DateTimeFormat(dateLocales[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`));
}

/* Help Center ------------------------------------------------------------------------------- */

const docSections = {
  help: { english: helpDocsArticles, href: helpArticleHref, collection: helpCollectionForArticle, related: 3 },
  citadel: { english: citadelDocsArticles, href: citadelArticleHref, collection: citadelCollectionForArticle, related: 4 },
} as const;

export function TranslatedDocPage({ doc }: { doc: TranslatedDoc }) {
  const { locale } = doc;
  const t = resourcePagesCopy[locale];
  const tabs = resourcesCopy[locale].tabs;
  const section = docSections[doc.section];
  const collection = section.collection(doc);
  const indexPath = localeHref(doc.section === 'help' ? '/docs' : '/citadel/docs', locale);
  /* Related articles: the translation where it is published, the English article otherwise. */
  const related = doc.relatedSlugs
    .map(slug => section.english.find(item => item.slug === slug))
    .filter((item): item is DocArticle => Boolean(item))
    .slice(0, section.related)
    .map((english) => {
      const route = section.href(english);
      const translation = translatedDocs(locale, doc.section).find(item => item.route === route);
      return translation
        ? { href: translation.path, title: translation.title, description: translation.summary }
        : { href: route, title: linkLabel(english.title, route, locale), description: english.summary };
    });

  return (
    <DocsPage toc={docToc(doc.content)}>
      <ProductionJsonLd
        data={techArticleJsonLd({
          siteUrl: getSeoConfig().siteUrl,
          path: doc.path,
          title: doc.title,
          description: doc.summary,
          date: doc.publishAt,
          section: { name: doc.section === 'help' ? tabs.help : tabs.citadel, path: indexPath },
          language: locale,
          home: { name: t.home, path: `/${locale}` },
        })}
      />
      <DocsTitle>{doc.title}</DocsTitle>
      <DocsDescription>{doc.summary}</DocsDescription>
      <DocsPageActions markdownPath={markdownCopyPath(doc)} pageUrl={new URL(doc.path, getSeoConfig().siteUrl).href} />
      <DocsArticleMeta
        updated={fill(t.updated, { date: formatDay(doc.publishAt, locale) })}
        section={collection ? groupCopy(locale, collection.title).title : undefined}
      />

      <DocsBody>
        {doc.illustration
          ? (
              <figure>
                <Image
                  src={doc.illustration.src}
                  alt={doc.illustration.alt}
                  width={doc.illustration.width}
                  height={doc.illustration.height}
                  sizes="(max-width: 760px) 100vw, 760px"
                />
                <figcaption>{doc.illustration.caption}</figcaption>
              </figure>
            )
          : null}
        <DocMarkdown content={doc.content} />
      </DocsBody>

      <DocsRelated heading={t.related.docs} items={related} />
      {doc.section === 'help'
        ? (
            <DocsSupport
              title={t.support.helpTitle}
              text={t.support.helpText}
              actions={[{ href: support.ticket, label: t.support.ticket }, { href: support.whatsapp, label: t.support.whatsapp }]}
            />
          )
        : (
            <DocsSupport title={t.support.citadelTitle} text={t.support.citadelText} actions={[{ href: support.ticket, label: t.support.ticket }]} />
          )}
    </DocsPage>
  );
}

/* Blog -------------------------------------------------------------------------------------- */

export function TranslatedGuidePage({ guide, plansLink = false }: { guide: TranslatedGuide; plansLink?: boolean }) {
  const { locale } = guide;
  const t = resourcePagesCopy[locale];
  const config = getSeoConfig();
  const publication = translatedGuidePublication(guide);
  const related = translatedGuides(locale)
    .filter(item => item.slug !== guide.slug && item.category === guide.category)
    .slice(0, 3);

  return (
    <DocsPage toc={headingToc(guide.html)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(translatedGuideJsonLd(guide, config, resolveSeoSite(config))) }}
      />
      <DocsTitle>{guide.title}</DocsTitle>
      <DocsDescription>{guide.excerpt}</DocsDescription>
      <DocsPageActions markdownPath={markdownCopyPath(guide)} pageUrl={new URL(guide.path, config.siteUrl).href} />
      <DocsMeta>
        <ArticlePublicationMeta article={publication} label={t.published} />
        {guide.readingTime ? <span>{fill(t.minRead, { minutes: guide.readingTime })}</span> : null}
      </DocsMeta>
      <DocsBody>
        <TrustedArticleBody html={guide.html} />
        <ArticleSources sources={guide.sources ?? []} summary={t.sources} accessed={t.accessed} />
      </DocsBody>
      <DocsRelated
        heading={t.related.guides}
        items={related.map(item => ({ href: item.path, title: item.title, description: item.excerpt }))}
      />
      {plansLink
        ? (
            <DocsSupport
              actions={[
                { href: localeHref('/plans', locale), label: t.support.plans },
                { href: support.ticket, label: t.support.ticket },
              ]}
            />
          )
        : null}
    </DocsPage>
  );
}

/* Index pages ------------------------------------------------------------------------------- */

function collectionCards(locale: TranslatedLocale, collections: HelpCollection[], docs: TranslatedDoc[]): CardSection[] {
  return collections
    .map(collection => ({
      id: helpCollectionId(collection.title),
      ...groupCopy(locale, collection.title),
      items: (articlesForCollection(collection, docs) as TranslatedDoc[]).map(doc => ({ href: doc.path, title: doc.title, description: doc.summary })),
    }))
    .filter(section => section.items.length > 0);
}

export function TranslatedDocsIndex({ locale, section }: { locale: TranslatedLocale; section: TranslatedDoc['section'] }) {
  const t = resourcePagesCopy[locale];
  const copy = t.index[section];
  const sections = collectionCards(locale, section === 'help' ? helpCollections : citadelCollections, translatedDocs(locale, section));
  return (
    <DocsPage toc={cardSectionsToc(sections)}>
      <DocsTitle>{copy.title}</DocsTitle>
      <DocsDescription>{copy.description}</DocsDescription>
      <DocsBody className="[&>section:first-child>h2]:mt-4">
        <DocsCardSections sections={sections} />
      </DocsBody>
      {section === 'help'
        ? (
            <DocsSupport
              title={t.support.helpTitle}
              text={t.support.helpText}
              actions={[{ href: support.ticket, label: t.support.ticket }, { href: support.whatsapp, label: t.support.whatsapp }]}
            />
          )
        : (
            <DocsSupport title={t.support.citadelTitle} text={t.support.citadelText} actions={[{ href: support.ticket, label: t.support.ticket }]} />
          )}
    </DocsPage>
  );
}

export function TranslatedBlogIndex({ locale }: { locale: TranslatedLocale }) {
  const t = resourcePagesCopy[locale];
  const config = getSeoConfig();
  const guides = translatedGuides(locale);
  const itemList = buildArticleIndexJsonLd({
    ...config,
    articles: {
      ...config.articles,
      feedTitle: t.index.blog.title,
      publications: guides.map(guide => translatedGuidePublication(guide, guide.path)),
    },
  });
  const sections = Array.from(new Set(guides.map(guide => guide.category))).map(category => ({
    id: helpCollectionId(category),
    title: groupCopy(locale, category).title,
    items: guides
      .filter(guide => guide.category === category)
      .map(guide => ({ href: guide.path, title: guide.title, description: guide.excerpt })),
  }));

  return (
    <DocsPage toc={cardSectionsToc(sections)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(itemList) }} />
      <DocsTitle>{t.index.blog.title}</DocsTitle>
      <DocsDescription>{t.index.blog.description}</DocsDescription>
      <DocsBody className="[&>section:first-child>h2]:mt-4">
        <DocsCardSections sections={sections} />
      </DocsBody>
    </DocsPage>
  );
}

export function TranslatedResourcesIndex({ locale }: { locale: TranslatedLocale }) {
  const t = resourcePagesCopy[locale];
  const tabs = resourcesCopy[locale].tabs;
  const entries = publishedTranslationEntries(locale);
  const count = (section: string) => entries.filter(entry => entry.section === section).length;
  const destinations = [
    { key: 'blog', title: tabs.guides, href: '/blog', count: `${count('blog')} ${t.articles}`, icon: 'book-open' },
    { key: 'help', title: tabs.help, href: '/docs', count: `${count('help')} ${t.articles}`, icon: 'chat' },
    { key: 'citadel', title: tabs.citadel, href: '/citadel/docs', count: `${count('citadel')} ${t.articles}`, icon: 'shield-checkmark' },
    { key: 'faq', title: tabs.faq, href: '/faq', count: `${faqsByLocale[locale].length} ${t.answers}`, icon: 'chat-bubbles-question' },
  ] as const;
  const latest = [...entries]
    .sort((a, b) => b.publishAt.localeCompare(a.publishAt) || a.path.localeCompare(b.path))
    .slice(0, 6);
  const sectionName = { help: tabs.help, citadel: tabs.citadel, blog: tabs.guides };

  return (
    <DocsPage toc={[{ title: t.latest, url: '#resources-latest', depth: 2 }]}>
      <DocsTitle>{t.index.resources.title}</DocsTitle>
      <DocsDescription>{t.index.resources.description}</DocsDescription>
      <DocsBody>
        <Cards>
          {destinations
            .filter(item => item.key === 'faq' || count(item.key) > 0)
            .map(item => (
              <Card key={item.href} href={localeHref(item.href, locale)} icon={<FluentIcon name={item.icon} size={20} />} title={item.title}>
                {t.cards[item.key]}
                <span className="mt-2 block text-xs font-medium text-fd-primary">{item.count}</span>
              </Card>
            ))}
        </Cards>

        <h2 id="resources-latest">{t.latest}</h2>
        <Cards>
          {latest.map(item => (
            <Card key={item.path} href={item.path} title={item.title} description={sectionName[item.section]} />
          ))}
        </Cards>
      </DocsBody>
      <DocsSupport
        title={t.support.helpTitle}
        text={t.support.helpText}
        actions={[{ href: support.ticket, label: t.support.ticket }, { href: support.whatsapp, label: t.support.whatsapp }]}
      />
    </DocsPage>
  );
}
