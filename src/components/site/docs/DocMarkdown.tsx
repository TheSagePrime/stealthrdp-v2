/* eslint-disable react-refresh/only-export-components */
import type { TOCItemType } from 'fumadocs-core/toc';
import { createMarkdownRenderer } from 'fumadocs-core/content/md';
import { getTableOfContents } from 'fumadocs-core/content/toc';
import { rehypeCode } from 'fumadocs-core/mdx-plugins/rehype-code';
import { remarkGfm } from 'fumadocs-core/mdx-plugins/remark-gfm';
import { remarkHeading } from 'fumadocs-core/mdx-plugins/remark-heading';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { legacyToMarkdown } from '@/lib/stealth/legacy-markdown';

/* Help Center and Citadel articles go through the Fumadocs Markdown pipeline: GFM tables and
   lists, heading anchors, a table of contents and Shiki-highlighted code with a copy button. */

const renderer = createMarkdownRenderer({
  // Single tildes appear in plain text ("~5 minutes"); only '~~' marks deleted text.
  remarkPlugins: [[remarkGfm, { singleTilde: false }], remarkHeading],
  rehypePlugins: [[rehypeCode, { themes: { light: 'github-light', dark: 'github-dark' }, fallbackLanguage: 'text' }]],
});

export function docToc(content: string, title?: string): TOCItemType[] {
  return getTableOfContents(legacyToMarkdown(content, title));
}

export function DocMarkdown({ content, title }: { content: string; title?: string }) {
  return (
    <renderer.MarkdownServer components={defaultMdxComponents}>
      {legacyToMarkdown(content, title)}
    </renderer.MarkdownServer>
  );
}
