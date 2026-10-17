/* Converts the HTML of a legacy guide, or of the RDP VPS page, to Markdown for "Copy Markdown" and
   /docs-md/... It covers the markup those pages use: headings, paragraphs, lists, links, code,
   tables, images, citation markers, embedded videos and details. Tables with merged cells keep their
   HTML, because Markdown cannot express them. Plain Node code: no React, no bundler. */

type Element = { type: 'element'; tag: string; attrs: Record<string, string>; children: Child[] };
type TextNode = { type: 'text'; value: string };
type Child = Element | TextNode;

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const SKIPPED_ELEMENTS = new Set(['script', 'style', 'template', 'head', 'noscript']);
const BLOCK_ELEMENTS = new Set([
  'address',
  'article',
  'aside',
  'audio',
  'blockquote',
  'body',
  'center',
  'dd',
  'details',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hr',
  'html',
  'iframe',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'summary',
  'table',
  'ul',
  'video',
]);
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: '\'',
  nbsp: ' ',
  mdash: '—',
  ndash: '–',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  copy: '©',
  reg: '®',
  trade: '™',
};

const NESTED_LIST = /^(?:[-*]|\d+\.) /;
const TAG = /<(\/?)([a-z][a-z0-9-]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'<>`=]+))?)*)\s*(\/?)>/iy;
const ATTRIBUTE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>`=]+)))?/g;

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1]?.toLowerCase() === 'x' ? Number.parseInt(entity.slice(2), 16) : Number.parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

function parseAttributes(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of source.matchAll(ATTRIBUTE)) {
    attrs[match[1]!.toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attrs;
}

/* A small, forgiving HTML parser for the markup of our guides. Comments, doctypes and script or
   style contents are dropped. Unclosed elements end with their parent. */
function parseHtml(html: string): Element {
  const root: Element = { type: 'element', tag: 'root', attrs: {}, children: [] };
  const stack: Element[] = [root];
  const current = () => stack[stack.length - 1]!;
  let text = '';
  let index = 0;

  const flushText = () => {
    if (text) {
      current().children.push({ type: 'text', value: decodeEntities(text) });
      text = '';
    }
  };

  while (index < html.length) {
    if (html[index] === '<') {
      if (html.startsWith('<!--', index)) {
        const end = html.indexOf('-->', index + 4);
        index = end < 0 ? html.length : end + 3;
        continue;
      }
      if (html[index + 1] === '!' || html[index + 1] === '?') {
        const end = html.indexOf('>', index);
        index = end < 0 ? html.length : end + 1;
        continue;
      }
      TAG.lastIndex = index;
      const match = TAG.exec(html);
      if (match) {
        flushText();
        index = TAG.lastIndex;
        const tag = match[2]!.toLowerCase();
        if (match[1] === '/') {
          for (let depth = stack.length - 1; depth > 0; depth--) {
            if (stack[depth]!.tag === tag) {
              stack.length = depth;
              break;
            }
          }
        } else if (SKIPPED_ELEMENTS.has(tag)) {
          const close = html.toLowerCase().indexOf(`</${tag}`, index);
          index = close < 0 ? html.length : (html.indexOf('>', close) + 1 || html.length);
        } else {
          const element: Element = { type: 'element', tag, attrs: parseAttributes(match[3] ?? ''), children: [] };
          current().children.push(element);
          if (!VOID_ELEMENTS.has(tag) && match[4] !== '/') {
            stack.push(element);
          }
        }
        continue;
      }
    }
    const next = html.indexOf('<', index + 1);
    const end = next < 0 ? html.length : next;
    text += html.slice(index, end);
    index = end;
  }
  flushText();
  return root;
}

function isElement(child: Child | undefined): child is Element {
  return child?.type === 'element';
}

function textContent(node: Child): string {
  if (node.type === 'text') {
    return node.value;
  }
  return node.children.map(textContent).join('');
}

function escapeMarkdown(value: string): string {
  return value.replace(/[\\`*_[\]<>]/g, '\\$&');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* Keeps the spaces outside a span, so "** text **" becomes " **text** ". */
function wrap(marker: string, content: string): string {
  const core = content.trim();
  if (!core) {
    return content;
  }
  const lead = /^\s*/.exec(content)?.[0] ?? '';
  const trail = /\s*$/.exec(content)?.[0] ?? '';
  return `${lead}${marker}${core}${marker}${trail}`;
}

function isCitation(element: Element): boolean {
  return (element.attrs.href ?? '').startsWith('#source-') || /\bseo-article-citation\b/.test(element.attrs.class ?? '');
}

function linkTarget(href: string): string {
  return href.replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

function inlineNode(node: Child): string {
  if (node.type === 'text') {
    return escapeMarkdown(node.value.replace(/\s+/g, ' '));
  }
  switch (node.tag) {
    case 'br':
      return ' ';
    case 'a': {
      if (isCitation(node)) {
        return textContent(node).replace(/\s+/g, ' ').trim();
      }
      const label = inline(node.children).trim();
      const href = node.attrs.href ?? '';
      return href ? `[${label || linkTarget(href)}](${linkTarget(href)})` : label;
    }
    case 'strong':
    case 'b':
      return wrap('**', inline(node.children));
    case 'em':
    case 'i':
      return wrap('*', inline(node.children));
    case 'code': {
      const code = textContent(node).replace(/\s+/g, ' ').trim();
      if (!code) {
        return '';
      }
      const fence = code.includes('`') ? '``' : '`';
      return `${fence}${code}${fence}`;
    }
    case 'img':
      return `![${escapeMarkdown(node.attrs.alt ?? '')}](${linkTarget(node.attrs.src ?? '')})`;
    case 'iframe':
    case 'video':
      return node.attrs.src ? `[Video](${linkTarget(node.attrs.src)})` : '';
    default:
      return inline(node.children);
  }
}

function inline(children: Child[]): string {
  return children.map(inlineNode).join('').replace(/\s+/g, ' ');
}

function rawHtml(node: Child): string {
  if (node.type === 'text') {
    return escapeHtml(node.value);
  }
  const attrs = Object.entries(node.attrs).map(([name, value]) => ` ${name}="${escapeHtml(value)}"`).join('');
  if (VOID_ELEMENTS.has(node.tag)) {
    return `<${node.tag}${attrs}>`;
  }
  return `<${node.tag}${attrs}>${node.children.map(rawHtml).join('')}</${node.tag}>`;
}

function listItems(element: Element): string {
  const ordered = element.tag === 'ol';
  let number = 1;
  return element.children
    .filter((child): child is Element => isElement(child) && child.tag === 'li')
    .map((child) => {
      const marker = ordered ? `${number++}. ` : '- ';
      const padding = ' '.repeat(marker.length);
      /* A nested list follows its paragraph on the next line; other blocks are separated by a blank line. */
      const lines = blocks(child.children)
        .reduce((text, part, index) => (index === 0 ? part : `${text}${NESTED_LIST.test(part) ? '\n' : '\n\n'}${part}`), '')
        .split('\n');
      return lines
        .map((line, index) => (index === 0 ? `${marker}${line}` : line ? `${padding}${line}` : ''))
        .join('\n');
    })
    .join('\n');
}

function codeBlock(element: Element): string {
  const code = element.children.find((child): child is Element => isElement(child) && child.tag === 'code');
  const source = code ?? element;
  const language = /\blanguage-([\w-]+)/.exec(source.attrs.class ?? '')?.[1] ?? '';
  const body = textContent(source).replace(/\n$/, '');
  const fence = body.includes('```') ? '~~~~' : '```';
  return `${fence}${language}\n${body}\n${fence}`;
}

function tableBlock(element: Element): string {
  const rows: Element[] = [];
  const collect = (node: Element) => {
    for (const child of node.children) {
      if (isElement(child)) {
        if (child.tag === 'tr') {
          rows.push(child);
        } else {
          collect(child);
        }
      }
    }
  };
  collect(element);

  const merged = rows.some(row => row.children.some(cell => isElement(cell) && (
    Number(cell.attrs.colspan ?? 1) > 1 || Number(cell.attrs.rowspan ?? 1) > 1)));
  if (merged) {
    return rawHtml(element);
  }

  const cells = rows.map(row => row.children
    .filter((cell): cell is Element => isElement(cell) && (cell.tag === 'td' || cell.tag === 'th'))
    .map(cell => inline(cell.children).trim().replace(/\|/g, '\\|')));
  if (cells.length === 0 || cells[0]!.length === 0) {
    return '';
  }
  const width = Math.max(...cells.map(row => row.length));
  const line = (row: string[]) => `| ${Array.from({ length: width }, (_, index) => row[index] ?? '').join(' | ')} |`;
  return [line(cells[0]!), `| ${Array.from({ length: width }).fill('---').join(' | ')} |`, ...cells.slice(1).map(line)].join('\n');
}

function block(element: Element): string[] {
  switch (element.tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const level = Number(element.tag.slice(1));
      const text = inline(element.children).trim();
      return text ? [`${'#'.repeat(level)} ${text}`] : [];
    }
    case 'ul':
    case 'ol': {
      const list = listItems(element);
      return list ? [list] : [];
    }
    case 'blockquote': {
      const quoted = blocks(element.children).join('\n\n');
      return quoted ? [quoted.split('\n').map(line => (line ? `> ${line}` : '>')).join('\n')] : [];
    }
    case 'pre':
      return [codeBlock(element)];
    case 'table': {
      const table = tableBlock(element);
      return table ? [table] : [];
    }
    case 'hr':
      return ['---'];
    case 'details': {
      const summary = element.children.find(child => isElement(child) && child.tag === 'summary');
      const label = summary && isElement(summary) ? inline(summary.children).trim() : '';
      const rest = element.children.filter(child => child !== summary);
      return [...(label ? [`**${label}**`] : []), ...blocks(rest)];
    }
    case 'iframe':
    case 'video':
    case 'audio':
      return [inlineNode(element)].filter(Boolean);
    default:
      return blocks(element.children);
  }
}

/* Consecutive inline content forms one paragraph; each block element is converted on its own. */
function blocks(children: Child[]): string[] {
  const out: string[] = [];
  let run: Child[] = [];
  const flushRun = () => {
    const paragraph = inline(run).trim();
    if (paragraph) {
      out.push(paragraph);
    }
    run = [];
  };
  for (const child of children) {
    if (isElement(child) && BLOCK_ELEMENTS.has(child.tag)) {
      flushRun();
      out.push(...block(child));
    } else {
      run.push(child);
    }
  }
  flushRun();
  return out;
}

export function htmlToMarkdown(html: string): string {
  const markdown = blocks(parseHtml(html).children).join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
  return markdown ? `${markdown}\n` : '';
}
