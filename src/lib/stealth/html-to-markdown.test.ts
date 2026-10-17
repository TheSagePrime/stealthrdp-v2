import { describe, expect, it } from 'vitest';
import { htmlToMarkdown } from './html-to-markdown';

describe('htmlToMarkdown', () => {
  it('converts headings, paragraphs, emphasis and links', () => {
    const markdown = htmlToMarkdown('<h2 id="x" tabindex="-1">Size it</h2><p>Use <strong>CPU</strong> and <em>RAM</em>, see <a href="/plans">plans</a>.</p>');

    expect(markdown).toBe('## Size it\n\nUse **CPU** and *RAM*, see [plans](/plans).\n');
  });

  it('turns citation markers into bracketed numbers', () => {
    const markdown = htmlToMarkdown('<p>Fact.<sup class="citation-marker"><a href="#source-2" aria-label="Source 2">[2]</a></sup></p>');

    expect(markdown).toBe('Fact.[2]\n');
  });

  it('converts ordered and nested lists', () => {
    const markdown = htmlToMarkdown('<ol><li>One<ul><li>Sub</li></ul></li><li>Two</li></ol>');

    expect(markdown).toBe('1. One\n   - Sub\n2. Two\n');
  });

  it('keeps code blocks with their language', () => {
    const markdown = htmlToMarkdown('<pre><code class="language-bash">sudo nginx -t &amp;&amp; echo ok</code></pre>');

    expect(markdown).toBe('```bash\nsudo nginx -t && echo ok\n```\n');
  });

  it('writes simple tables as GFM and keeps tables with merged cells as HTML', () => {
    expect(htmlToMarkdown('<table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>'))
      .toBe('| A | B |\n| --- | --- |\n| 1 | 2 |\n');

    const merged = htmlToMarkdown('<table><tr><td colspan="2">Wide</td></tr></table>');

    expect(merged).toBe('<table><tr><td colspan="2">Wide</td></tr></table>\n');
  });

  it('drops scripts and comments and turns embedded videos into links', () => {
    const markdown = htmlToMarkdown('<!-- note --><script>x()</script><iframe src="https://www.youtube.com/embed/abc"></iframe>');

    expect(markdown).toBe('[Video](https://www.youtube.com/embed/abc)\n');
  });
});
