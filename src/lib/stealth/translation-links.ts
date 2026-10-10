import { I18nConfig, isRouteLocalized, isSiteLocale } from '../../config/i18n';

/* Links inside German and Spanish Markdown. Writers prefix every internal link with the language
   (`/de/docs/...`, `/es/blog/....html`), as the writer guide asks, whether or not that page is
   published in the language yet. At render time a prefixed link whose page is not published in that
   language goes to the English page instead, so a translation never links to a 404. Unprefixed links
   (the "English version is binding" notice on policy pages) and external links stay as written.
   Relative imports only: the SEO scripts may load this module outside Next.js. */

const LOCALE_PREFIX = /^\/([a-z]{2})(?=\/|$|[?#])/;

/* The link target to render for `href` found in translated content. */
export function publishedHref(href: string): string {
  const match = LOCALE_PREFIX.exec(href);
  const locale = match?.[1];
  if (!locale || !isSiteLocale(locale) || locale === I18nConfig.defaultLocale) {
    return href;
  }
  const rest = href.slice(locale.length + 1);
  const suffixAt = rest.search(/[?#]/);
  const pathPart = suffixAt === -1 ? rest : rest.slice(0, suffixAt);
  const suffix = suffixAt === -1 ? '' : rest.slice(suffixAt);
  const logical = pathPart.replace(/\/+$/, '') || '/';
  if (isRouteLocalized(logical, locale)) {
    return href;
  }
  return `${logical}${suffix}`;
}

/* Rewrites one line of Markdown outside code: inline links and images `[text](/de/x "title")`,
   reference definitions `[id]: /de/x`, autolinks `</de/x>` and raw HTML `href="/de/x"`. Inline code
   spans are left alone. */
function rewriteLine(line: string): string {
  const reference = /^(\s{0,3}\[[^\]]+\]:\s*<?)(\/[^\s>]*)/.exec(line);
  if (reference) {
    return `${reference[1]}${publishedHref(reference[2]!)}${line.slice(reference[0].length)}`;
  }
  return line
    .split(/(`+[^`]*`+)/)
    .map((part, index) => index % 2 === 1
      ? part
      : part
          .replace(/(\]\(\s*<?)(\/[^\s)>]*)/g, (_, open: string, href: string) => `${open}${publishedHref(href)}`)
          .replace(/(\bhref\s*=\s*["'])(\/[^"']*)/gi, (_, open: string, href: string) => `${open}${publishedHref(href)}`)
          .replace(/<(\/[a-z]{2}\/[^\s>]*)>/g, (_, href: string) => `<${publishedHref(href)}>`))
    .join('');
}

/* Every internal link of a translated Markdown body, resolved with publishedHref(). Code fences
   (``` and ~~~) are left exactly as written. */
export function rewriteTranslatedLinks(markdown: string): string {
  let fence: string | null = null;
  return markdown
    .split('\n')
    .map((line) => {
      const marker = /^\s*(`{3,}|~{3,})/.exec(line)?.[1];
      if (marker && (!fence || (marker[0] === fence[0] && marker.length >= fence.length))) {
        fence = fence ? null : marker;
        return line;
      }
      return fence ? line : rewriteLine(line);
    })
    .join('\n');
}
