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

  it('rejects callouts, which guide Markdown does not support', async () => {
    await expect(guideMarkdownToHtml('Intro.\n\n:::warn\nBack up first.\n:::\n')).rejects.toThrow('callouts');
  });

  it('ignores ":::" inside a code block', async () => {
    const html = await guideMarkdownToHtml('```text\n:::warn\n```\n');

    expect(html).toContain(':::warn');
  });
});
