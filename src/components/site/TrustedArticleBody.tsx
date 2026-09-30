/* eslint-disable better-tailwindcss/no-unknown-classes */
import { addMissingHtmlHeadingIds } from '@/lib/stealth/resource-headings';

// Article HTML is authored content. Add the small accessibility attributes it often
// lacks: a title on embedded frames, and keyboard focus on code blocks that scroll.
function withAccessibleEmbeds(html: string): string {
  return html
    .replace(/<iframe\b([^>]*)>/gi, (tag, attrs: string) =>
      /\btitle\s*=/i.test(attrs) ? tag : `<iframe title="Embedded video"${attrs}>`)
    .replace(/<pre\b([^>]*)>/gi, (tag, attrs: string) =>
      /\btabindex\s*=/i.test(attrs) ? tag : `<pre tabindex="0"${attrs}>`);
}

export function TrustedArticleBody({ html }: { html: string }) {
  return (
    <div
      className="sr-richtext"
      dangerouslySetInnerHTML={{ __html: withAccessibleEmbeds(addMissingHtmlHeadingIds(html)) }}
    />
  );
}
