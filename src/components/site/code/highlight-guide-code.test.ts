import { describe, expect, it } from 'vitest';
import { renderGuideCode } from './highlight-guide-code';

describe('guide code blocks', () => {
  it('keeps the language label bar for a plain block', async () => {
    const html = await renderGuideCode('<pre><code class="language-bash">sudo nginx -t\n</code></pre>');

    expect(html).toContain('<figure dir="ltr" data-code class="my-4 bg-fd-card rounded-xl');
    expect(html).toContain('<figcaption class="flex-1 truncate">Shell</figcaption>');
  });

  it('shows the title in the bar, with an icon, and drops the title paragraph', async () => {
    const html = await renderGuideCode('<p data-code-title>install.sh</p>\n<pre><code class="language-bash">echo hi\n</code></pre>');

    expect(html).toContain('<figcaption class="flex-1 truncate">install.sh</figcaption>');
    expect(html).toContain('<div class="[&_svg]:size-3.5"><svg');
    expect(html).not.toContain('data-code-title');
  });

  it('escapes the title text', async () => {
    const html = await renderGuideCode('<p data-code-title>a &amp; &lt;b&gt;</p><pre><code class="language-text">x\n</code></pre>');

    expect(html).toContain('<figcaption class="flex-1 truncate">a &amp; &lt;b&gt;</figcaption>');
  });

  it('frames a block in a tab with no bar and the copy button in the corner', async () => {
    const html = await renderGuideCode('<pre data-in-tab><code class="language-bash">sudo dnf update\n</code></pre>');

    expect(html).toContain('class="bg-fd-secondary -mx-px -mb-px last:rounded-b-xl shiki relative border');
    expect(html).not.toContain('<figcaption');
    expect(html).toContain('class="absolute top-3 right-2 z-2 rounded-lg bg-fd-secondary text-fd-muted-foreground"');
    expect(html).toContain('data-copy-code');
  });

  it('applies the line notation marks as Fumadocs classes', async () => {
    const html = await renderGuideCode('<pre data-marks="1:add 2:remove 3:highlight"><code class="language-bash">one\ntwo\nthree\n</code></pre>');

    expect(html).toContain('class="line diff add"');
    expect(html).toContain('class="line diff remove"');
    expect(html).toContain('class="line highlighted"');
    expect(html).toContain('has-diff');
  });

  it('leaves the text of a block without marks unchanged', async () => {
    const html = await renderGuideCode('<pre><code class="language-bash">a &amp; b\n</code></pre>');

    expect(html).toContain('&amp;');
    expect(html).not.toContain('diff add');
  });
});
