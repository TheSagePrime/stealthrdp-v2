import { addMissingHtmlHeadingIds } from '@/lib/stealth/resource-headings';

export function TrustedArticleBody({ html }: { html: string }) {
  return (
    <div
      className="sr-richtext"
      dangerouslySetInnerHTML={{ __html: addMissingHtmlHeadingIds(html) }}
    />
  );
}
