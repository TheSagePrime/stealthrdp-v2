import type { ResourceHeading } from '@/components/site/ResourceToc';

function headingText(value: string): string {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
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

export function articleHeadings(html: string): ResourceHeading[] {
  const seen = new Map<string, number>();
  const headings: ResourceHeading[] = [];

  for (const match of html.matchAll(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi)) {
    const level = Number(match[1]) as 2 | 3;
    const attrs = match[2] ?? '';
    const body = match[3] ?? '';
    const text = headingText(body);
    if (!text) continue;

    const existing = attrs.match(/\bid=["']([^"']+)["']/i)?.[1];
    const base = existing || slugify(text) || 'section';
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    headings.push({ id, text, level });
  }

  return headings;
}

function withHeadingIds(html: string): string {
  const headings = articleHeadings(html);
  let index = 0;

  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level, attrs, body) => {
    const heading = headings[index++];
    if (!heading) return full;
    const cleanAttrs = String(attrs).replace(/\s+id=["'][^"']+["']/i, '');
    return `<h${level}${cleanAttrs} id="${heading.id}">${body}</h${level}>`;
  });
}

export function TrustedArticleBody({ html }: { html: string }) {
  return (
    <div
      className="sr-richtext"
      dangerouslySetInnerHTML={{ __html: withHeadingIds(html) }}
    />
  );
}
