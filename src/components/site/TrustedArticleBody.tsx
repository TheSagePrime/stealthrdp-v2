/* eslint-disable better-tailwindcss/no-unknown-classes, react-refresh/only-export-components */
import type { TOCItemType } from 'fumadocs-core/toc';
import { withCopyableCode } from '@/components/site/code/code-block-markup';
import { CodeCopyListener } from '@/components/site/code/CodeCopyListener';
import { highlightGuideCode } from '@/components/site/code/highlight-guide-code';
import { withClickToPlayVideos } from '@/components/site/video/video-embed-markup';
import { VideoPlayListener } from '@/components/site/video/VideoPlayListener';

type ResourceHeading = {
  id: string;
  text: string;
  level?: 2 | 3;
};

function headingText(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string): string {
  return headingText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function articleHeadings(html: string): ResourceHeading[] {
  const seen = new Map<string, number>();
  const headings: ResourceHeading[] = [];

  for (const match of html.matchAll(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi)) {
    const level = Number(match[1]) as 2 | 3;
    const attrs = match[2] ?? '';
    const body = match[3] ?? '';
    const text = headingText(body);
    if (!text) {
      continue;
    }

    const existing = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    const base = existing || slugify(text) || 'section';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    headings.push({ id, text, level });
  }

  return headings;
}

/* The headings as Fumadocs table-of-contents items. */
export function headingToc(html: string): TOCItemType[] {
  return articleHeadings(html).map(heading => ({ title: heading.text, url: `#${heading.id}`, depth: heading.level ?? 2 }));
}

function withHeadingIds(html: string): string {
  const headings = articleHeadings(html);
  let index = 0;

  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level, attrs, body) => {
    const heading = headings[index++];
    if (!heading) {
      return full;
    }
    const cleanAttrs = String(attrs).replace(/\s+id=["'][^"']+["']/i, '');
    return `<h${level}${cleanAttrs} id="${heading.id}">${body}</h${level}>`;
  });
}

// Article HTML is authored content. Add the small accessibility attribute it often
// lacks: a title on embedded frames. Code blocks get focus in withCopyableCode.
function withAccessibleEmbeds(html: string): string {
  return html
    .replace(/<iframe\b([^>]*)>/gi, (tag, attrs: string) =>
      /\btitle\s*=/i.test(attrs) ? tag : `<iframe title="Embedded video"${attrs}>`)
  ;
}

// Article images load when they near the viewport, so off-screen images from
// other hosts do not delay the page load.
function withLazyImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/gi, (tag, attrs: string) =>
    /\bloading\s*=/i.test(attrs) ? tag : `<img loading="lazy" decoding="async"${attrs}>`);
}

export async function TrustedArticleBody({ html }: { html: string }) {
  // Code is coloured on the server (Shiki, as in the Help Center), then framed for copying.
  const body = await highlightGuideCode(withClickToPlayVideos(withHeadingIds(html)));
  return (
    <>
      <div
        className="sr-guide-body"
        dangerouslySetInnerHTML={{ __html: withCopyableCode(withAccessibleEmbeds(withLazyImages(body))) }}
      />
      <CodeCopyListener />
      <VideoPlayListener />
    </>
  );
}
