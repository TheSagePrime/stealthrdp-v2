import { createMarkdownRenderer } from 'fumadocs-core/content/md';
import { remarkAdmonition } from 'fumadocs-core/mdx-plugins/remark-admonition';
import { remarkCodeTab } from 'fumadocs-core/mdx-plugins/remark-code-tab';
import { remarkGfm } from 'fumadocs-core/mdx-plugins/remark-gfm';

/* Guides can be written in Markdown (src/content/guides/<slug>.md) as well as HTML. Both produce
   the same article HTML, so the SEO scripts, the feeds, the search index and the article page read
   one format. The Markdown goes through the Fumadocs remark pipeline (GFM tables and lists, and the
   same callout and tab parsers as the Help Center), and the resulting HTML tree is serialised here.
   Raw HTML inside the Markdown is passed through unchanged (citations, <details>, <iframe>,
   <video>, <sup>).

   The rich blocks are written as the static markup the Help Center components render, with the
   same Fumadocs classes, so the page looks the same and the SEO HTML carries the same text:
   - ":::info / :::warn / :::tip" blocks: a Fumadocs Callout, with the Phosphor icon.
   - Code fences with title="...": a titled code block (the title is text in the HTML).
   - Consecutive fences with tab="...": a tabbed code block. Every panel is in the HTML; the page
     switches between them (CodeTabsListener).
   - "### 1. Title" runs: a Fumadocs step timeline. The number stays in the heading as visually
     hidden text, so the heading text, the TOC and the heading id are the same as in the HTML guide.
   - Shiki line notation ("// [!code ++]", "# [!code --]", "[!code highlight]"): removed from the
     code text and kept as data-marks, which the page turns into the line classes.

   Heading ids: a heading gets an explicit id with a trailing "[#custom-id]" ("## Title [#id]").
   Without one, the id is made by the article page from the heading text (TrustedArticleBody), the
   same as for HTML guides, so the two formats get identical ids.

   Links to other sites get target="_blank" rel="nofollow noopener noreferrer" (the rule of the HTML
   guides). Bare URLs in the text stay text.

   Code fence options other than title and tab are ignored. Each construct is listed with its
   syntax in CONTRIBUTING.md (recipe 1). */

type MdNode = {
  type: string;
  value?: string;
  url?: string;
  lang?: string | null;
  meta?: string | null;
  depth?: number;
  name?: string | null;
  attributes?: { type: string; name?: string; value?: unknown }[];
  children?: MdNode[];
  data?: Record<string, unknown>;
};
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

/* ---- Help Center look: Fumadocs classes and the Phosphor icons of DocMarkdown ---- */

/* The Phosphor "fill" icons the Help Center callouts use, at their default size (20). */
const CALLOUT_ICONS: Record<string, string> = {
  info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z"></path></svg>',
  warn: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path></svg>',
  error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>',
  idea: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true"><path d="M176,232a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,232Zm40-128a87.55,87.55,0,0,1-33.64,69.21A16.24,16.24,0,0,0,176,186v6a16,16,0,0,1-16,16H96a16,16,0,0,1-16-16v-6a16,16,0,0,0-6.23-12.66A87.59,87.59,0,0,1,40,104.49C39.74,56.83,78.26,17.14,125.88,16A88,88,0,0,1,216,104Zm-32.11-9.34a57.6,57.6,0,0,0-46.56-46.55,8,8,0,0,0-2.66,15.78c16.57,2.79,30.63,16.85,33.44,33.45A8,8,0,0,0,176,104a9,9,0,0,0,1.35-.11A8,8,0,0,0,183.89,94.66Z"></path></svg>',
};

/* Callout colour token, as the Help Center's Callout resolves it (warn is the "warning" colour). */
const CALLOUT_COLOR: Record<string, string> = { info: 'info', warn: 'warning', error: 'error', idea: 'idea' };

function calloutOpen(type: string, title: string | undefined): string {
  const kind = type in CALLOUT_ICONS ? type : 'info';
  const open = '<div class="my-4 flex gap-2 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground shadow-md"';
  const color = `--callout-color: var(--color-fd-${CALLOUT_COLOR[kind]}, var(--color-fd-muted))`;
  const heading = title ? `<p class="font-medium my-0!">${escapeText(title)}</p>` : '';
  return `${open} style="${color}"><div role="none" class="w-0.5 bg-(--callout-color)/50 rounded-sm"></div>${CALLOUT_ICONS[kind]}`
    + `<div class="flex flex-col gap-2 min-w-0 flex-1">${heading}<div class="text-fd-muted-foreground prose-no-margin empty:hidden">`;
}

const CALLOUT_END = '</div></div></div>';

const TAB_LIST = 'flex flex-row px-2 overflow-x-auto text-fd-muted-foreground';
const TAB_TRIGGER = 'relative group inline-flex text-sm font-medium text-nowrap items-center transition-colors gap-2 px-2 py-1.5 hover:text-fd-accent-foreground data-[state=active]:text-fd-primary [&_svg]:size-3.5';
const TAB_UNDERLINE = 'absolute inset-x-2 bottom-0 h-px group-data-[state=active]:bg-fd-primary';

/* ---- Shiki line notation ---- */

const NOTATION = '\\+\\+|--|highlight|hl|focus';
const COMMENT = '(?:\\/\\/|--|[#;%])';
const LINE_NOTATION = new RegExp(`^\\s*${COMMENT}\\s*\\[!code\\s+(${NOTATION})\\]\\s*$`);
const END_NOTATION = new RegExp(`\\s*${COMMENT}\\s*\\[!code\\s+(${NOTATION})\\]\\s*$`);
const NOTATION_KIND: Record<string, string> = { '++': 'add', '--': 'remove', 'highlight': 'highlight', 'hl': 'highlight', 'focus': 'focus' };

/* A marker on a line of its own applies to the next line (the line is removed); a marker at the end
   of a line applies to that line. The result is the code text and "line:kind" marks, 1-based. */
function applyNotation(value: string): { text: string; marks: string[] } {
  const lines: string[] = [];
  const marks: string[] = [];
  let pending: string[] = [];
  for (const line of value.split('\n')) {
    const alone = LINE_NOTATION.exec(line);
    if (alone) {
      pending.push(NOTATION_KIND[alone[1] ?? ''] ?? 'highlight');
      continue;
    }
    let text = line;
    const kinds = pending;
    pending = [];
    const end = END_NOTATION.exec(line);
    if (end) {
      text = line.slice(0, end.index);
      kinds.push(NOTATION_KIND[end[1] ?? ''] ?? 'highlight');
    }
    lines.push(text);
    for (const kind of kinds) {
      marks.push(`${lines.length}:${kind}`);
    }
  }
  return { text: lines.join('\n'), marks };
}

/* ---- Markdown tree: the Fumadocs plugins produce callouts and tabs as JSX nodes; they become
   static HTML here, as raw nodes between the markers of each block. ---- */

const html = (value: string): MdNode => ({ type: 'html', value });

function isJsx(node: MdNode, name: string): boolean {
  return node.type === 'mdxJsxFlowElement' && node.name === name;
}

function attributeValue(node: MdNode, name: string): string | undefined {
  const attribute = node.attributes?.find(item => item.type === 'mdxJsxAttribute' && item.name === name);
  return typeof attribute?.value === 'string' ? attribute.value : undefined;
}

function plainText(node: MdNode): string {
  return node.value ?? (node.children ?? []).map(plainText).join('');
}

/* The title in a fence meta string: title="..." or title='...'. */
function fenceTitle(meta: string | null | undefined): string | undefined {
  const match = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)')/.exec(meta ?? '');
  return match ? (match[1] ?? match[2]) : undefined;
}

/* One code block as static HTML. A block with no title, notation or tab is written exactly as the
   default renderer writes it, so the HTML of a plain guide does not change. */
function codeBlock(node: MdNode, inTab: boolean): MdNode {
  const { text, marks } = applyNotation(node.value ?? '');
  const title = fenceTitle(node.meta);
  const language = node.lang ? ` class="language-${escapeAttribute(node.lang)}"` : '';
  const attrs = [
    marks.length > 0 ? ` data-marks="${marks.join(' ')}"` : '',
    inTab ? ' data-in-tab' : '',
  ].join('');
  const caption = title === undefined ? '' : `<p data-code-title>${escapeText(title)}</p>`;
  const body = text ? `${text}\n` : '';
  return html(`${caption}<pre${attrs}><code${language}>${escapeText(body)}</code></pre>`);
}

/* A callout: the Fumadocs Callout markup around its children. */
function calloutNodes(node: MdNode): MdNode[] {
  const type = attributeValue(node, 'type') ?? 'info';
  return [html(calloutOpen(type, attributeValue(node, 'title'))), ...(node.children ?? []), html(CALLOUT_END)];
}

/* A tab group: the tab names in a tab list, then one panel per name. Panels after the first are
   hidden by the page (data-state), and stay in the HTML for search engines. */
function tabNodes(node: MdNode): MdNode[] {
  const panels = (node.children ?? []).filter(child => isJsx(child, 'CodeBlockTab'));
  const names = panels.map(panel => attributeValue(panel, 'value') ?? '');
  const buttons = names.map((name, index) => {
    const state = index === 0 ? 'active' : 'inactive';
    return `<button type="button" role="tab" data-code-tab-trigger="${index}" data-state="${state}" aria-selected="${index === 0}" class="${TAB_TRIGGER}">`
      + `<span class="${TAB_UNDERLINE}"></span>${escapeText(name)}</button>`;
  }).join('');
  const out: MdNode[] = [html(`<div class="my-4 bg-fd-card rounded-xl border" data-code-tabs><div role="tablist" class="${TAB_LIST}">${buttons}</div>`)];
  panels.forEach((panel, index) => {
    const state = index === 0 ? 'active' : 'inactive';
    out.push(html(`<div role="tabpanel" data-code-tab-panel="${index}" data-state="${state}" class="data-[state=inactive]:hidden">`));
    out.push(...(panel.children ?? []));
    out.push(html('</div>'));
  });
  out.push(html('</div>'));
  return out;
}

/* "### 1. Title" headings. The number is kept as visually hidden text: the step timeline shows the
   number (CSS counter), and the heading text, the TOC and the heading id stay "1. Title". */
const STEP = /^(\d+)\.\s(.+)$/;

function stepMatch(node: MdNode): RegExpExecArray | null {
  const first = node.children?.[0];
  return node.type === 'heading' && first?.type === 'text' && first.value ? STEP.exec(first.value) : null;
}

function numberedStep(heading: MdNode, match: RegExpExecArray): MdNode {
  const [first, ...rest] = heading.children ?? [];
  if (!first) {
    return heading;
  }
  return { ...heading, children: [html(`<span class="sr-only">${match[1]}. </span>`), { ...first, value: match[2] }, ...rest] };
}

/* A run of numbered headings at one level, from nodes[index]. Each numbered heading starts a step;
   the content after it belongs to that step until the next heading at the same level or above.
   A numbered heading at a higher level, or a plain heading at the same level, ends the run. */
function stepRun(nodes: MdNode[], index: number, depth: number): { steps: { heading: RegExpExecArray; nodes: MdNode[] }[]; next: number } {
  const steps: { heading: RegExpExecArray; nodes: MdNode[] }[] = [];
  let next = index;
  for (; next < nodes.length; next++) {
    const node = nodes[next];
    if (!node) {
      break;
    }
    if (node.type === 'heading' && (node.depth ?? 0) <= depth) {
      const match = (node.depth ?? 0) < depth ? null : stepMatch(node);
      if (!match) {
        break;
      }
      steps.push({ heading: match, nodes: [numberedStep(node, match)] });
      continue;
    }
    steps.at(-1)?.nodes.push(node);
  }
  return { steps, next };
}

function groupSteps(nodes: MdNode[]): MdNode[] {
  const out: MdNode[] = [];
  let index = 0;
  while (index < nodes.length) {
    const first = nodes[index];
    const firstMatch = first ? stepMatch(first) : null;
    if (!first || !firstMatch) {
      if (first) {
        out.push(first);
      }
      index++;
      continue;
    }
    const depth = first.depth ?? 0;
    const { steps, next } = stepRun(nodes, index, depth);
    /* A numbered "## N." heading makes a timeline only in a run of two or more that counts up from 1
       ("## 1.", "## 2."...). A single one stays a plain heading. */
    const countsUp = steps.every((step, position) => Number(step.heading[1]) === position + 1);
    if (depth === 2 && (steps.length < 2 || !countsUp)) {
      out.push(first);
      index++;
      continue;
    }
    out.push(html('<div class="fd-steps">'));
    for (const step of steps) {
      out.push(html('<div class="fd-step">'), ...step.nodes, html('</div>'));
    }
    out.push(html('</div>'));
    index = next;
  }
  return out;
}

/* Converts the blocks of one parent, children first. */
function convertBlocks(parent: MdNode) {
  if (!parent.children) {
    return;
  }
  const inTab = isJsx(parent, 'CodeBlockTab');
  const tabs = isJsx(parent, 'CodeBlockTabs');
  for (const child of parent.children) {
    if (child.type !== 'code' && (!tabs || isJsx(child, 'CodeBlockTab'))) {
      convertBlocks(child);
    }
  }
  if (tabs) {
    /* The tab group is written by its parent (tabNodes); its tab list is not kept. */
    return;
  }
  const nodes = parent.children.flatMap((child): MdNode[] => {
    if (child.type === 'code') {
      return [codeBlock(child, inTab)];
    }
    if (isJsx(child, 'Callout')) {
      return calloutNodes(child);
    }
    if (isJsx(child, 'CodeBlockTabs')) {
      return tabNodes(child);
    }
    if (child.type === 'paragraph' && /^\s*:::/.test(plainText(child))) {
      throw new Error(`Guide Markdown: "${plainText(child).slice(0, 40)}" is not a complete callout (check the opening and closing ":::" lines)`);
    }
    if (child.type.startsWith('mdxJsx')) {
      throw new Error(`Guide Markdown: ${child.name ?? child.type} is not supported in guides`);
    }
    return [child];
  });
  parent.children = groupSteps(nodes);
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

function remarkGuideBlocks() {
  return (tree: MdNode) => {
    convertBlocks(tree);
  };
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

/* Callouts use the Help Center syntax: ":::info", ":::warn", ":::tip" (note, warning, danger also),
   an optional title in brackets, and ":::" to close. A tip is shown as an idea. */
const renderer = createMarkdownRenderer({
  remarkPlugins: [
    [remarkGfm, { singleTilde: false }],
    [remarkAdmonition, { typeMap: { info: 'info', note: 'info', tip: 'idea', warn: 'warn', warning: 'warn', danger: 'error' } }],
    remarkCodeTab,
    remarkGuideBlocks,
    remarkGuideLinks,
  ],
  rehypePlugins: [rehypeGuideHtml],
  remarkRehypeOptions: { allowDangerousHtml: true },
});

const FENCE = /^\s*(?:```|~~~)/;
const CALLOUT_OPEN = /^:::(?:info|note|tip|warn|warning|danger)(?:\[[^\]]*\])?$/;
const CALLOUT_CLOSE = /^:::$/;

function isCalloutMarker(line: string): boolean {
  const trimmed = line.trim();
  return CALLOUT_OPEN.test(trimmed) || CALLOUT_CLOSE.test(trimmed);
}

/* The callout plugin reads a callout only when its ":::" markers are paragraphs of their own, so a
   blank line goes before and after each marker. Lines inside code fences are left alone. A ":::"
   line that is not a callout marker fails the build: it would reach the page as plain text. */
function separateCallouts(markdown: string): string {
  const out: string[] = [];
  let inFence = false;
  for (const [index, line] of markdown.split('\n').entries()) {
    if (FENCE.test(line)) {
      inFence = !inFence;
    } else if (!inFence && /^\s*:::/.test(line)) {
      if (!isCalloutMarker(line)) {
        throw new Error(`Guide Markdown line ${index + 1}: unknown callout. Use ":::info", ":::warn" or ":::tip", and close it with ":::".`);
      }
      out.push('', line.trim(), '');
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

/* The article HTML for a guide written in Markdown (the body after the front matter). */
export async function guideMarkdownToHtml(markdown: string): Promise<string> {
  const source = separateCallouts(markdown);
  await renderer.MarkdownServer({ children: source });
  const output = rendered.get(source);
  rendered.delete(source);
  if (output === undefined) {
    throw new Error('Guide Markdown did not render');
  }
  return output;
}
