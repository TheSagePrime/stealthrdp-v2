import { describe, expect, it } from 'vitest';
import { guideMarkdownToHtml } from './guide-markdown';

describe('guide Markdown', () => {
  it('keeps the heading text and sets an explicit id from "[#id]"', async () => {
    const html = await guideMarkdownToHtml('## Choose a region [#choose-a-region]\n\nText.\n');

    expect(html).toBe('<h2 id="choose-a-region">Choose a region</h2>\n<p>Text.</p>');
  });

  it('leaves headings without an id for the article page to name', async () => {
    const html = await guideMarkdownToHtml('## Windows or Linux?\n');

    expect(html).toBe('<h2>Windows or Linux?</h2>');
  });

  it('passes raw HTML through unchanged', async () => {
    const markdown = 'Text <a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a>.\n\n'
      + '<details>\n<summary>Sources &amp; references</summary>\n<ol><li id="source-1">Item</li></ol>\n</details>\n';
    const html = await guideMarkdownToHtml(markdown);

    expect(html).toContain('<a class="seo-article-citation" href="#source-1" aria-label="Source 1">[1]</a>');
    expect(html).toContain('<details>\n<summary>Sources &amp; references</summary>\n<ol><li id="source-1">Item</li></ol>\n</details>');
  });

  it('keeps a bare URL as text and a bracketed link as a link', async () => {
    const html = await guideMarkdownToHtml('See https://example.com/a and [docs](https://example.com/b).\n');

    expect(html).toBe('<p>See https://example.com/a and <a href="https://example.com/b" target="_blank" rel="nofollow noopener noreferrer">docs</a>.</p>');
  });

  it('opens links to other sites in a new tab, and leaves stealthrdp.com links plain', async () => {
    const html = await guideMarkdownToHtml('[Plans](/plans) [Login](https://dash.stealthrdp.com/login)\n');

    expect(html).toBe('<p><a href="/plans">Plans</a> <a href="https://dash.stealthrdp.com/login">Login</a></p>');
  });

  it('escapes text and attribute values', async () => {
    const html = await guideMarkdownToHtml('Use `a < b` & \\* here.\n');

    expect(html).toBe('<p>Use <code>a &lt; b</code> &amp; * here.</p>');
  });

  it('writes tables and code blocks with the language class the guide renderer expects', async () => {
    const html = await guideMarkdownToHtml('| A | B |\n|---|---|\n| 1 | 2 |\n\n```bash\nsudo nginx -t\n```\n');

    expect(html).toContain('<table>\n<thead>\n<tr>\n<th>A</th>\n<th>B</th>\n</tr>\n</thead>');
    expect(html).toContain('<pre><code class="language-bash">sudo nginx -t\n</code></pre>');
  });

  it('renders a callout with the Help Center classes, icon and optional title', async () => {
    const html = await guideMarkdownToHtml('Intro.\n\n:::warn\nBack up first.\n:::\n\n:::info[Before you start]\nYou need root.\n:::\n');

    expect(html).toContain('<div class="my-4 flex gap-2 rounded-xl border bg-fd-card p-3 ps-1 text-sm text-fd-card-foreground shadow-md" style="--callout-color: var(--color-fd-warning, var(--color-fd-muted))">');
    expect(html).toContain('<div class="text-fd-muted-foreground prose-no-margin empty:hidden">\n<p>Back up first.</p>\n</div></div></div>');
    expect(html).toContain('<p class="font-medium my-0!">Before you start</p>');
    expect(html).toContain('<p>You need root.</p>');
  });

  it('maps a tip to the idea callout', async () => {
    const html = await guideMarkdownToHtml(':::tip\nUse one region.\n:::\n');

    expect(html).toContain('--callout-color: var(--color-fd-idea, var(--color-fd-muted))');
    expect(html).not.toContain('<p class="font-medium my-0!">');
  });

  it('rejects a ":::" line that is not a callout, so it does not reach the page as text', async () => {
    await expect(guideMarkdownToHtml('Intro.\n\n:::note-ish\nText.\n:::\n')).rejects.toThrow('unknown callout');
  });

  it('rejects a callout that is never closed', async () => {
    await expect(guideMarkdownToHtml(':::warn\nBack up first.\n')).rejects.toThrow('not a complete callout');
  });

  it('writes a titled code fence with its title as text before the block', async () => {
    const html = await guideMarkdownToHtml('```apache title=".htaccess"\nRewriteEngine On\n```\n');

    expect(html).toBe('<p data-code-title>.htaccess</p><pre><code class="language-apache">RewriteEngine On\n</code></pre>');
  });

  it('writes consecutive tab fences as one tab group with every panel', async () => {
    const html = await guideMarkdownToHtml('```bash tab="Ubuntu"\nsudo apt update\n```\n\n```bash tab="AlmaLinux"\nsudo dnf update\n```\n');

    expect(html).toContain('data-code-tabs>');
    expect(html).toContain('data-code-tab-trigger="0" data-state="active" aria-selected="true"');
    expect(html).toContain('<span class="absolute inset-x-2 bottom-0 h-px group-data-[state=active]:bg-fd-primary"></span>Ubuntu</button>');
    expect(html).toContain('data-code-tab-trigger="1" data-state="inactive" aria-selected="false"');
    expect(html).toContain('<div role="tabpanel" data-code-tab-panel="1" data-state="inactive" class="data-[state=inactive]:hidden">\n<pre data-in-tab><code class="language-bash">sudo dnf update\n</code></pre>');
  });

  it('writes "1. Title" runs as a step timeline, keeping the number as hidden text and the id', async () => {
    const html = await guideMarkdownToHtml('### 1. Install the panel\n\nRun it.\n\n### 2. Open the panel [#open]\n\nVisit it.\n\n## Next\n');

    expect(html).toContain('<div class="fd-steps">\n<div class="fd-step">\n<h3><span class="sr-only">1. </span>Install the panel</h3>');
    expect(html).toContain('<div class="fd-step">\n<h3 id="open"><span class="sr-only">2. </span>Open the panel</h3>');
    expect(html).toContain('</div>\n<h2>Next</h2>');
  });

  it('ends a step run at a heading without a number, and a plain heading is not a step', async () => {
    const html = await guideMarkdownToHtml('## 1. Overview\n\nText.\n\n## Background\n\nMore.\n');

    expect(html).toBe('<div class="fd-steps">\n<div class="fd-step">\n<h2><span class="sr-only">1. </span>Overview</h2>\n<p>Text.</p>\n</div>\n</div>\n<h2>Background</h2>\n<p>More.</p>');
  });

  it('removes Shiki line notation from the code and records the marked lines', async () => {
    const html = await guideMarkdownToHtml('```js\n// [!code ++]\nadd();\nkeep(); // [!code highlight]\nold(); // [!code --]\n```\n');

    expect(html).toBe('<pre data-marks="1:add 2:highlight 3:remove"><code class="language-js">add();\nkeep();\nold();\n</code></pre>');
  });

  it('ignores ":::" inside a code block', async () => {
    const html = await guideMarkdownToHtml('```text\n:::warn\n```\n');

    expect(html).toContain(':::warn');
  });
});
