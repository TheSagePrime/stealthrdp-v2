import type { Metadata, MetadataRoute } from 'next';
import type { TranslatedLocale } from '../../config/i18n';
import type { SeoConfig } from '../../config/seo';
import type { ArticlePublication } from '../../libs/seo/articles';
import type { ResolvedSiteUrl } from '../../libs/seo/site-url';
import type { BlogArticle, DocArticle } from './articles';
import type { TranslationSection, TranslationSource } from './translation-sources';
import { publishedTranslations } from '../../config/i18n';
import { resourcePagesCopy, resourcesCopy } from '../../content/i18n/resources';
import { articlePathFor, buildArticleJsonLd, createArticleMetadata } from '../../libs/seo/articles';
import { getSeoConfig } from '../../libs/seo/config';
import { hreflangAlternates } from '../../libs/seo/locale';
import { createPageMetadata } from '../../libs/seo/metadata';
import { canonicalUrlForPath } from '../../libs/seo/normalize';
import { docPublicSlug } from './articles';
import { guideMarkdownToHtml } from './guide-markdown';
import { isNoindexDocPath } from './routes';
import { rewriteTranslatedLinks } from './translation-links';
import { checkPublishManifest, readTranslationSources } from './translation-sources';

/* The published German and Spanish Help Center articles, Citadel docs and blog posts, ready to
   render. Every translation file is read and checked at build time (translation-sources.ts), and
   every blog translation is converted to HTML, so a broken file fails the build before its publish
   date. Only the translations in src/content/i18n/published-routes.json are returned: an unpublished
   one has no page, sidebar entry, search entry, sitemap entry or Markdown copy.

   Links in the Markdown go through rewriteTranslatedLinks(): a /de or /es link to a page that is not
   published in that language points to the English page. */

const ogImage = 'https://www.stealthrdp.com/assets/og-cover.png';

type Published = { locale: TranslatedLocale; route: string; path: string; publishAt: string; file: string };
export type TranslatedDoc = DocArticle & Published & { section: Exclude<TranslationSection, 'blog'> };
export type TranslatedGuide = BlogArticle & Published;

const sources = readTranslationSources();
checkPublishManifest(sources, publishedTranslations);

const isPublished = (source: TranslationSource) => publishedTranslations.sources[source.path] === source.file;
const published = (source: Published): Published => ({
  locale: source.locale,
  route: source.route,
  path: source.path,
  publishAt: source.publishAt,
  file: source.file,
});

const docs: TranslatedDoc[] = sources
  .filter(source => source.kind === 'docs' && isPublished(source))
  .map(source => ({
    relatedSlugs: [],
    ...source.meta,
    ...published(source),
    slug: source.slug,
    section: source.section as TranslatedDoc['section'],
    content: rewriteTranslatedLinks(source.body),
  } as unknown as TranslatedDoc));

const guides: TranslatedGuide[] = [];
for (const source of sources.filter(item => item.kind === 'guides')) {
  const markdown = rewriteTranslatedLinks(source.body);
  // Converted even before the publish date, so a Markdown error shows up in the writer's pull request.
  const html = await guideMarkdownToHtml(markdown);
  if (isPublished(source)) {
    guides.push({ ...source.meta, ...published(source), slug: source.slug, html, markdown, source: source.file } as unknown as TranslatedGuide);
  }
}

export function translatedDocs(locale: TranslatedLocale, section: TranslatedDoc['section']): TranslatedDoc[] {
  return docs.filter(doc => doc.locale === locale && doc.section === section);
}

export function translatedGuides(locale: TranslatedLocale): TranslatedGuide[] {
  return guides.filter(guide => guide.locale === locale);
}

/* A published translation by its English URL, e.g. ('de', '/docs/windows-licensing'). */
export function findTranslatedDoc(locale: TranslatedLocale, route: string): TranslatedDoc | undefined {
  return docs.find(doc => doc.locale === locale && doc.route === route);
}

export function findTranslatedGuide(locale: TranslatedLocale, route: string): TranslatedGuide | undefined {
  return guides.find(guide => guide.locale === locale && guide.route === route);
}

/* Every published translation, for the sitemap, the search and the resources page. */
export type TranslationEntry = Published & { kind: 'doc' | 'guide'; section: TranslationSection; title: string; description: string; indexable: boolean };

export function publishedTranslationEntries(locale?: TranslatedLocale): TranslationEntry[] {
  return [
    ...docs.map(doc => ({ ...published(doc), kind: 'doc' as const, section: doc.section, title: doc.title, description: doc.summary, indexable: !isNoindexDocPath(doc.route) })),
    ...guides.map(guide => ({ ...published(guide), kind: 'guide' as const, section: 'blog' as const, title: guide.title, description: guide.excerpt, indexable: true })),
  ].filter(entry => !locale || entry.locale === locale);
}

/* Sitemap entries of the translated pages, with every language version as hreflang. Noindex policy
   pages stay out, as their English originals do. The English blog posts that have a translation get
   their entry again with the same lastmod and the hreflang alternates (the article registry's entry
   has none); the Help Center and Citadel entries already carry them. */
export function translationSitemapEntries(config: SeoConfig, site: ResolvedSiteUrl): MetadataRoute.Sitemap {
  const languages = (route: string) => Object.fromEntries(
    Object.entries(hreflangAlternates(route, config)).map(([lang, path]) => [lang, canonicalUrlForPath(path, site, config)]),
  );
  const entries = publishedTranslationEntries().filter(entry => entry.indexable);
  const englishPosts = [...new Set(entries.filter(entry => entry.kind === 'guide').map(entry => entry.route))].flatMap((route) => {
    const publication = config.articles.publications.find(item => articlePathFor(item, config) === route);
    return publication
      ? [{ url: canonicalUrlForPath(route, site, config), lastModified: publication.dateModified ?? publication.datePublished, alternates: { languages: languages(route) } }]
      : [];
  });
  return [
    ...englishPosts,
    ...entries.map(entry => ({ url: canonicalUrlForPath(entry.path, site, config), lastModified: entry.publishAt, alternates: { languages: languages(entry.route) } })),
  ];
}

/* The blog-post record of the SEO engine (src/libs/seo/articles.ts) for a translated post. `path`
   is the English URL for createArticleMetadata(), which adds the language prefix itself, and the
   translated URL for the JSON-LD. The publication date is the day the translation went live. */
export function translatedGuidePublication(guide: TranslatedGuide, path: string = guide.route): ArticlePublication {
  return {
    slug: guide.slug,
    status: 'published',
    path,
    title: guide.title,
    h1: guide.title,
    description: guide.excerpt,
    datePublished: guide.publishAt,
    author: { name: guide.author || 'StealthRDP Team', type: 'Organization' },
    locale: guide.locale,
    indexPolicy: 'index, follow',
    image: guide.image ?? ogImage,
    sources: guide.sources,
  };
}

/* Title and description from the translation's front matter, canonical = the translated URL,
   hreflang = every language the page is published in (src/config/i18n.ts). */
export function translatedDocMetadata(doc: TranslatedDoc): Metadata {
  const suffix = doc.section === 'help' ? 'StealthRDP' : resourcesCopy[doc.locale].tabs.citadel;
  return createPageMetadata({ path: doc.route, locale: doc.locale, title: `${doc.title} — ${suffix}`, description: doc.summary, ogImage });
}

export function translatedGuideMetadata(guide: TranslatedGuide, config: SeoConfig = getSeoConfig()): Metadata {
  return createArticleMetadata(translatedGuidePublication(guide), config);
}

/* German and Spanish metadata of an index page, for localizedPageMetadata(). */
export function translatedIndexMetadata(key: 'help' | 'citadel' | 'blog' | 'resources') {
  const entry = (locale: TranslatedLocale) => ({
    title: resourcePagesCopy[locale].index[key].metaTitle,
    description: resourcePagesCopy[locale].index[key].metaDescription,
    ogImage,
  });
  return { de: entry('de'), es: entry('es') };
}

/* BlogPosting (inLanguage = the translation's language) and a breadcrumb in that language. */
export function translatedGuideJsonLd(guide: TranslatedGuide, config: SeoConfig, site: ResolvedSiteUrl): Record<string, unknown> {
  const jsonLd = buildArticleJsonLd(translatedGuidePublication(guide, guide.path), config, site);
  const crumbs = [
    { name: resourcePagesCopy[guide.locale].home, path: `/${guide.locale}` },
    { name: 'Blog', path: `/${guide.locale}/blog` },
    { name: guide.title, path: guide.path },
  ];
  const graph = (jsonLd['@graph'] as Record<string, unknown>[]).map(node => node['@type'] === 'BreadcrumbList'
    ? {
        ...node,
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': crumb.name,
          'item': canonicalUrlForPath(crumb.path, site, config),
        })),
      }
    : node);
  return { ...jsonLd, '@graph': graph };
}

/* Markdown copies of the translations, served at /docs-md/<locale>/<slug> like the English copies
   at /docs-md/<slug>: docs keep their slug, blog posts are guide-<slug>. */
function guideMarkdown(guide: TranslatedGuide): string {
  const t = resourcePagesCopy[guide.locale];
  const sources = guide.sources?.length
    ? [`## ${t.sources}`, '', ...guide.sources.map((source, index) => `${index + 1}. [${source.title}](${source.url})${source.publisher ? ` (${source.publisher})` : ''}`)]
    : [];
  return `${[`# ${guide.title}`, '', guide.excerpt, '', (guide.markdown ?? '').trim(), '', ...sources].join('\n').trimEnd()}\n`;
}

export function translatedMarkdownCopies(): { locale: TranslatedLocale; slug: string; markdown: () => string }[] {
  return [
    ...docs.map(doc => ({ locale: doc.locale, slug: docPublicSlug(doc), markdown: () => `# ${doc.title}\n\n${doc.summary}\n\n${doc.content.trim()}\n` })),
    ...guides.map(guide => ({ locale: guide.locale, slug: `guide-${guide.slug}`, markdown: () => guideMarkdown(guide) })),
  ];
}

export function markdownCopyPath(article: TranslatedDoc | TranslatedGuide): string {
  return 'html' in article ? `/docs-md/${article.locale}/guide-${article.slug}` : `/docs-md/${article.locale}/${docPublicSlug(article)}`;
}
