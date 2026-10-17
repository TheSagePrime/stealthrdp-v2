import { describe, expect, it } from 'vitest';
import { withClickToPlayVideos } from './video-embed-markup';

describe('withClickToPlayVideos', () => {
  it('replaces a YouTube iframe with a click-to-play link that loads nothing from YouTube', () => {
    const html = withClickToPlayVideos(
      '<p>Intro</p><iframe class="sb-iframe" src="https://www.youtube.com/embed/C0-31aRKx80" loading="lazy" allowfullscreen></iframe><h2>Next</h2>',
    );

    expect(html).not.toContain('<iframe');
    expect(html).toContain('data-video="C0-31aRKx80"');
    expect(html).toContain('href="https://www.youtube.com/watch?v=C0-31aRKx80"');
    expect(html).toContain('<p>Intro</p>');
    expect(html).toContain('<h2>Next</h2>');
  });
});
