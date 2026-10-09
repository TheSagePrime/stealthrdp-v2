/* eslint-disable better-tailwindcss/no-unknown-classes */
import { highlightHast } from 'fumadocs-core/highlight';
import { rehypeCodeDefaultOptions, transformerIcon } from 'fumadocs-core/mdx-plugins/rehype-code';

/* Guide articles are authored HTML, so their <pre> blocks are coloured on the server here and
   wrapped in the same markup as a Help Center code block (Fumadocs CodeBlock): a title bar with an
   icon and a label, a copy button, and the Shiki tokens. The Fumadocs transformers (line notation
   such as `// [!code ++]`, and the file icons) run exactly as they do for Markdown articles.
   CodeCopyListener handles the copy button. Blocks that fail to highlight keep their text. */

const THEMES = { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } as const;

/* Guides only show a language label, so a block without a known icon gets the terminal glyph. */
const TERMINAL_ICON = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  d: 'M4 4a1 1 0 0 0-.707.293 1 1 0 0 0 0 1.414L8.586 11l-5.293 5.293a1 1 0 0 0 0 1.414 1 1 0 0 0 1.414 0l6-6a1 1 0 0 0 0-1.414L4.707 4.293A1 1 0 0 0 4 4Zm8 14a1 1 0 0 0-1 1 1 1 0 0 0 1 1h8a1 1 0 0 0 1-1 1 1 0 0 0-1-1Z',
};

const TRANSFORMERS = [
  ...(rehypeCodeDefaultOptions.transformers ?? []),
  transformerIcon({ extend: { default: TERMINAL_ICON } }),
];

const labels: Record<string, string> = {
  bash: 'Shell',
  sh: 'Shell',
  shell: 'Shell',
  powershell: 'PowerShell',
  ps: 'PowerShell',
  cmd: 'Command Prompt',
  bat: 'Command Prompt',
  apache: 'Apache config',
  htaccess: '.htaccess',
  nginx: 'Nginx config',
  text: 'Text',
};

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

/* Same icons as the Fumadocs CodeBlock (lucide), sized by the title bar. */
const COPY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-data-checked:hidden" aria-hidden="true"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>';
const CHECK_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden group-data-checked:block" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

/* One code block, framed as the Fumadocs CodeBlock frames a titled block. `inner` is the
   highlighted <code> content (or escaped plain text when highlighting failed). */
function frame(label: string, icon: string | undefined, styles: string, themeClasses: string[], inner: string): string {
  const classes = ['my-4', 'bg-fd-card', 'rounded-xl', 'shiki', 'relative', `
    border
  `, `shadow-sm`, `not-prose`, `overflow-hidden`, `text-sm`, ...themeClasses];
  const figureClasses = [...new Set(classes)].join(' ');
  const iconMarkup = icon ? `<div class="[&_svg]:size-3.5">${icon}</div>` : '';
  return `<figure dir="ltr" data-code class="${figureClasses}"${styles ? ` style="${escapeHtml(styles)}"` : ''} tabindex="-1">`
    + `<div class="flex text-fd-muted-foreground items-center gap-2 h-9.5 border-b px-4">${iconMarkup}`
    + `<figcaption class="flex-1 truncate">${escapeHtml(label)}</figcaption>`
    + '<div class="empty:hidden -me-2"><button type="button" data-copy-code aria-label="Copy code" aria-live="polite" class="group inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring p-1 [&_svg]:size-4 hover:text-fd-accent-foreground data-checked:text-fd-accent-foreground">'
    + `${COPY_ICON}${CHECK_ICON}</button></div></div>`
    + `<div role="region" tabindex="0" aria-label="${escapeHtml(label)} code" class="text-[0.8125rem] py-3.5 overflow-auto max-h-[600px] fd-scroll-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-fd-ring">`
    + `<pre class="min-w-full w-max *:flex *:flex-col"><code>${inner}</code></pre></div></figure>`;
}

function labelFor(language: string): string {
  return labels[language.toLowerCase()] ?? 'Command';
}

async function renderBlock(attrs: string, body: string, original: string): Promise<string> {
  const language = /language-([\w-]+)/.exec(`${attrs} ${body}`)?.[1] ?? 'text';
  const code = decodeHtml(body.replace(/<[^>]+>/g, '')).replace(/\n$/, '');
  if (!code.trim()) {
    return original;
  }
  const label = labelFor(language);
  try {
    const root = (await highlightHast(code, { lang: language, fallbackLanguage: 'text', themes: THEMES, defaultColor: false, transformers: TRANSFORMERS })) as unknown as HastNode;
    const pre = root.children?.find(node => node.type === 'element' && node.tagName === 'pre');
    const codeElement = pre?.children?.find(node => node.type === 'element' && node.tagName === 'code');
    if (!pre || !codeElement) {
      return frame(label, undefined, '', [], escapeHtml(code));
    }
    const icon = typeof pre.properties?.icon === 'string' ? pre.properties.icon : undefined;
    const styles = typeof pre.properties?.style === 'string' ? pre.properties.style : '';
    const themeClasses = (Array.isArray(pre.properties?.className) ? pre.properties.className : []).map(String);
    return frame(label, icon, styles, themeClasses, (codeElement.children ?? []).map(serialize).join(''));
  } catch {
    return frame(label, undefined, '', [], escapeHtml(code));
  }
}

/* Replaces every <pre> in trusted guide HTML with a framed, highlighted code block. */
export async function renderGuideCode(html: string): Promise<string> {
  const matches = [...html.matchAll(/<pre\b([^>]*)>([\s\S]*?)<\/pre>/gi)];
  if (matches.length === 0) {
    return html;
  }

  let output = '';
  let cursor = 0;
  for (const match of matches) {
    const index = match.index ?? 0;
    output += html.slice(cursor, index);
    output += await renderBlock(match[1] ?? '', match[2] ?? '', match[0]);
    cursor = index + match[0].length;
  }
  return output + html.slice(cursor);
}
