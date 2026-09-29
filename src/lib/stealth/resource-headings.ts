export type ResourceHeading = {
  title: string;
  url: string;
  depth: number;
};

function cleanText(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, '\'')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_\x60]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugHeading(value: string): string {
  return cleanText(value)
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/[\s-]+/g, '-') || 'section';
}

function nextId(value: string, seen: Map<string, number>): string {
  const base = slugHeading(value);
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

export function getMarkdownHeadings(content: string): ResourceHeading[] {
  const seen = new Map<string, number>();
  return Array.from(content.matchAll(/^ {0,3}(#{2,3})[ \t]+(\S.*)$/gm), ([, hashes = '', raw = '']) => {
    const title = cleanText(raw);
    return { title, url: `#${nextId(title, seen)}`, depth: hashes.length };
  });
}

export function getHtmlHeadings(html: string): ResourceHeading[] {
  const seen = new Map<string, number>();
  return Array.from(html.matchAll(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi), ([, level = '', attrs = '', inner = '']) => {
    const title = cleanText(inner);
    const id = attrs.match(/\bid=["']([^"']+)["']/i)?.[1] ?? nextId(title, seen);
    return { title, url: `#${id}`, depth: Number(level) };
  });
}

export function addMissingHtmlHeadingIds(html: string): string {
  const seenIds = new Set<string>();
  for (const match of html.matchAll(/<h[23]\b([^>]*)>/gi)) {
    const id = (match[1] ?? '').match(/\bid=["']([^"']+)["']/i)?.[1];
    if (id) {
      seenIds.add(id);
    }
  }

  const seenSlugs = new Map<string, number>();
  return html.replace(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi, (heading, level: string, attrs: string, inner: string) => {
    if (/\bid=["'][^"']+["']/i.test(attrs)) {
      return heading;
    }
    let id = nextId(inner, seenSlugs);
    while (seenIds.has(id)) {
      id = nextId(inner, seenSlugs);
    }
    seenIds.add(id);
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}
