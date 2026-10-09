import { highlightHast } from 'fumadocs-core/highlight';

/* Guide articles are authored HTML, so their <pre> blocks are coloured on the server here
   instead of by a client component. The Fumadocs Shiki highlighter returns a hast tree, which is
   written back as HTML inside the same <pre>. The copy frame (withCopyableCode) and its listener
   still read the block's text, so copying is unchanged. Blocks that fail to highlight keep their
   original markup. */

const THEMES = { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } as const;

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function decodeHtml(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, '\'')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function attributes(properties: Record<string, unknown> = {}): string {
  return Object.entries(properties)
    .map(([key, value]) => {
      const name = key === 'className' ? 'class' : key;
      if (value === undefined || value === null || value === false) {
        return '';
      }
      if (value === true) {
        return ` ${name}`;
      }
      const text = Array.isArray(value) ? value.join(' ') : String(value);
      return ` ${name}="${escapeHtml(text)}"`;
    })
    .join('');
}

function serialize(node: HastNode): string {
  if (node.type === 'text') {
    return escapeHtml(node.value ?? '');
  }
  const children = (node.children ?? []).map(serialize).join('');
  if (node.type === 'element' && node.tagName) {
    return `<${node.tagName}${attributes(node.properties)}>${children}</${node.tagName}>`;
  }
  return children;
}

async function highlightBlock(attrs: string, body: string, original: string): Promise<string> {
  const language = /language-([\w-]+)/.exec(body)?.[1];
  const code = decodeHtml(body.replace(/<[^>]+>/g, '')).replace(/\n$/, '');
  if (!code.trim()) {
    return original;
  }
  try {
    const root = (await highlightHast(code, { lang: language ?? 'text', fallbackLanguage: 'text', themes: THEMES })) as unknown as HastNode;
    const pre = root.children?.find(node => node.type === 'element' && node.tagName === 'pre');
    const codeElement = pre?.children?.find(node => node.type === 'element' && node.tagName === 'code');
    if (!pre || !codeElement) {
      return original;
    }
    const classes = [pre.properties?.className, language ? `language-${language}` : undefined]
      .flatMap(value => (Array.isArray(value) ? value : [value]))
      .filter(Boolean)
      .join(' ');
    const preProperties = { ...pre.properties, className: classes };
    const inner = (codeElement.children ?? []).map(serialize).join('');
    return `<pre${attrs}${attributes(preProperties)}>${inner}</pre>`;
  } catch {
    return original;
  }
}

/* Replaces the body of every <pre> in trusted guide HTML with Shiki markup. */
export async function highlightGuideCode(html: string): Promise<string> {
  const matches = [...html.matchAll(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/gi)];
  if (matches.length === 0) {
    return html;
  }

  let output = '';
  let cursor = 0;
  for (const match of matches) {
    const index = match.index ?? 0;
    output += html.slice(cursor, index);
    output += await highlightBlock(match[1] ?? '', match[2] ?? '', match[0]);
    cursor = index + match[0].length;
  }
  return output + html.slice(cursor);
}
