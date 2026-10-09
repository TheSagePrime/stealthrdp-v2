import { createMarkdownRenderer } from 'fumadocs-core/content/md';
import { remarkGfm } from 'fumadocs-core/mdx-plugins/remark-gfm';

/* Guides can be written in Markdown (src/content/guides/<slug>.md) as well as HTML. Both produce
   the same article HTML, so the SEO scripts, the feeds, the search index and the article page read
   one format. The Markdown goes through the Fumadocs remark pipeline (GFM tables and lists, the
   same parser as the Help Center), and the resulting HTML tree is serialised here. Raw HTML inside
   the Markdown is passed through unchanged (citations, <details>, <iframe>, <video>, <sup>).

   Heading ids: a heading gets an explicit id with a trailing "[#custom-id]" ("## Title [#id]").
   Without one, the id is made by the article page from the heading text (TrustedArticleBody), the
   same as for HTML guides, so the two formats get identical ids.

   Links to other sites get target="_blank" rel="nofollow noopener noreferrer" (the rule of the HTML
   guides). Bare URLs in the text stay text.

   Not supported in guide Markdown (the loader throws): ":::" callouts. Code fence meta such as
   title="..." or tab="..." is ignored. See CONTRIBUTING.md (recipe 1). */

type MdNode = { type: string; value?: string; url?: string; children?: MdNode[]; data?: Record<string, unknown> };
type Positioned = { position?: { start: { offset?: number }; end: { offset?: number } } };
type HastNode = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: HastNode[] };

const CUSTOM_HEADING_ID = /\s*\[#([A-Z][\w-]*)\]\s*$/i;

/* hast property names that differ from their HTML attribute names. */
const ATTRIBUTE_NAMES: Record<string, string> = {
  className: 'class',
  htmlFor: 'for',
  tabIndex: 'tabindex',
  colSpan: 'colspan',
  rowSpan: 'rowspan',
  frameBorder: 'frameborder',
  allowFullScreen: 'allowfullscreen',
  itemProp: 'itemprop',
};

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}

function attributeName(key: string): string {
  return ATTRIBUTE_NAMES[key] ?? key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function attributes(properties: Record<string, unknown> = {}): string {
  return Object.entries(properties)
    .map(([key, value]) => {
      if (value === undefined || value === null || value === false) {
        return '';
      }
      const name = attributeName(key);
      if (value === true) {
        return ` ${name}`;
      }
      const text = Array.isArray(value) ? value.join(' ') : String(value);
      return ` ${name}="${escapeAttribute(text)}"`;
    })
    .join('');
}

function serializeChildren(node: HastNode): string {
  return (node.children ?? []).map(serialize).join('');
}

function serialize(node: HastNode): string {
  switch (node.type) {
    case 'text':
      return escapeText(node.value ?? '');
    case 'raw':
      return node.value ?? '';
    case 'comment':
      return `<!--${node.value ?? ''}-->`;
    case 'element': {
      const tag = node.tagName ?? 'span';
      const open = `<${tag}${attributes(node.properties)}>`;
      return VOID_ELEMENTS.has(tag) ? open : `${open}${serializeChildren(node)}</${tag}>`;
    }
    default:
      return serializeChildren(node);
  }
}

/* A heading ends with "[#id]": the text is cut and the id is set on the heading. */
function setHeadingIds(node: MdNode) {
  if (node.type === 'heading') {
    const last = node.children?.at(-1);
    const match = last?.type === 'text' && last.value ? CUSTOM_HEADING_ID.exec(last.value) : null;
    if (last && match) {
      last.value = last.value?.slice(0, match.index);
      node.data = { ...node.data, hProperties: { id: match[1] } };
    }
  }
}

/* GFM turns a bare URL in the text ("see https://x.example") into a link. The guides keep bare URLs
   as text, so such a link goes back to its source text. Bracketed links ("[text](url)") and
   angle-bracket autolinks ("<https://x.example>") are real links and stay. */
function unlinkBareUrls(node: MdNode, source: string) {
  if (!node.children) {
    return;
  }
  node.children = node.children.map((child) => {
    if (child.type === 'link' && child.children) {
      const position = (child as Positioned).position;
      const start = position?.start.offset ?? -1;
      const first = source.charAt(start);
      if (position && start >= 0 && first !== '[' && first !== '<') {
        return { type: 'text', value: source.slice(start, position.end.offset ?? start) };
      }
    }
    unlinkBareUrls(child, source);
    return child;
  });
}

/* A link to another site opens in a new tab and is not followed by search engines, as every guide
   link has been since the HTML guides. Links to stealthrdp.com (and its subdomains) are plain. */
function setExternalLinkAttributes(node: MdNode) {
  if (node.type !== 'link' || !node.url || !/^https?:\/\//i.test(node.url)) {
    return;
  }
  const host = new URL(node.url).hostname;
  if (host === 'stealthrdp.com' || host.endsWith('.stealthrdp.com')) {
    return;
  }
  node.data = { ...node.data, hProperties: { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] } };
}

function remarkGuideLinks() {
  return (tree: MdNode, file: { value: unknown }) => {
    const source = String(file.value);
    const visit = (node: MdNode) => {
      setHeadingIds(node);
      setExternalLinkAttributes(node);
      node.children?.forEach(visit);
    };
    visit(tree);
    unlinkBareUrls(tree, source);
  };
}

/* The HTML is written out here, inside the Fumadocs processor. The React tree that Fumadocs builds
   afterwards is not used, so it is emptied (raw HTML nodes are not valid React input). */
const rendered = new Map<string, string>();

function rehypeGuideHtml() {
  return (tree: HastNode, file: { value: unknown }) => {
    rendered.set(String(file.value), serializeChildren(tree));
    tree.children = [];
  };
}

const renderer = createMarkdownRenderer({
  remarkPlugins: [[remarkGfm, { singleTilde: false }], remarkGuideLinks],
  rehypePlugins: [rehypeGuideHtml],
  remarkRehypeOptions: { allowDangerousHtml: true },
});

/* Callouts (":::info") and their Fumadocs components are not part of guide Markdown. A ":::" line
   would reach the page as plain text, so it fails the build instead. Code blocks are skipped. */
function rejectUnsupportedSyntax(markdown: string): void {
  let inFence = false;
  for (const [index, line] of markdown.split('\n').entries()) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence;
    } else if (!inFence && /^\s*:::/.test(line)) {
      throw new Error(`Guide Markdown line ${index + 1}: callouts (":::") are not supported in guides. Use a paragraph.`);
    }
  }
}

/* The article HTML for a guide written in Markdown (the body after the front matter). */
export async function guideMarkdownToHtml(markdown: string): Promise<string> {
  rejectUnsupportedSyntax(markdown);
  await renderer.MarkdownServer({ children: markdown });
  const html = rendered.get(markdown);
  rendered.delete(markdown);
  if (html === undefined) {
    throw new Error('Guide Markdown did not render');
  }
  return html;
}
