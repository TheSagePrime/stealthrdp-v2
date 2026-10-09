/* eslint-disable react-refresh/only-export-components */
import type { TOCItemType } from 'fumadocs-core/toc';
import type { CalloutType } from 'fumadocs-ui/components/callout';
import type { ReactNode } from 'react';
import { CheckCircle, Info, Lightbulb, WarningCircle, XCircle } from '@phosphor-icons/react/dist/ssr';
import { createMarkdownRenderer } from 'fumadocs-core/content/md';
import { getTableOfContents } from 'fumadocs-core/content/toc';
import { rehypeCode } from 'fumadocs-core/mdx-plugins/rehype-code';
import { remarkAdmonition } from 'fumadocs-core/mdx-plugins/remark-admonition';
import { remarkCodeTab } from 'fumadocs-core/mdx-plugins/remark-code-tab';
import { remarkGfm } from 'fumadocs-core/mdx-plugins/remark-gfm';
import { remarkHeading } from 'fumadocs-core/mdx-plugins/remark-heading';
import { remarkSteps } from 'fumadocs-core/mdx-plugins/remark-steps';
import { Callout } from 'fumadocs-ui/components/callout';
import { CodeBlockTab, CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger } from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';

/* Help Center and Citadel articles go through the Fumadocs Markdown pipeline: GFM tables and
   lists, heading anchors, a table of contents, Shiki-highlighted code with a copy button, callouts,
   numbered step timelines and tabbed code blocks. Callouts are written as ':::info', ':::warn' and
   ':::tip' blocks and rendered with the Fumadocs Callout component, with Phosphor icons. The syntax
   for steps, tabs, titles and line notation is in CONTRIBUTING.md (recipe 2). */

const calloutIcons: Record<CalloutType, ReactNode> = {
  info: <Info size={20} weight="fill" aria-hidden="true" />,
  warn: <WarningCircle size={20} weight="fill" aria-hidden="true" />,
  warning: <WarningCircle size={20} weight="fill" aria-hidden="true" />,
  error: <XCircle size={20} weight="fill" aria-hidden="true" />,
  success: <CheckCircle size={20} weight="fill" aria-hidden="true" />,
  idea: <Lightbulb size={20} weight="fill" aria-hidden="true" />,
};

function DocCallout({ type = 'info', title, children }: { type?: CalloutType; title?: ReactNode; children?: ReactNode }) {
  return (
    <Callout type={type} title={title} icon={calloutIcons[type] ?? calloutIcons.info}>
      {children}
    </Callout>
  );
}

type MdNode = { type: string; name?: string | null; children?: MdNode[] };

/* The Markdown renderer resolves only lowercase JSX names from the components map (capitalised
   names need an MDX evaluator). The admonition and tab plugins emit these capitalised names, so
   they are renamed to lowercase here and mapped back to their components below. */
const jsxNames: Record<string, string> = {
  Callout: 'callout',
  CodeBlockTabs: 'codeBlockTabs',
  CodeBlockTabsList: 'codeBlockTabsList',
  CodeBlockTabsTrigger: 'codeBlockTabsTrigger',
  CodeBlockTab: 'codeBlockTab',
};

const lowercaseJsxNames = () => (tree: MdNode) => {
  const walk = (node: MdNode) => {
    if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name && node.name in jsxNames) {
      node.name = jsxNames[node.name];
    }
    node.children?.forEach(walk);
  };
  walk(tree);
};

const renderer = createMarkdownRenderer({
  // Single tildes appear in plain text ("~5 minutes"); only '~~' marks deleted text.
  remarkPlugins: [
    [remarkGfm, { singleTilde: false }],
    remarkHeading,
    // :::info / :::warn / :::tip ... ::: blocks become <Callout>. A tip is shown as an idea.
    [remarkAdmonition, { typeMap: { info: 'info', note: 'info', tip: 'idea', warn: 'warn', warning: 'warn', danger: 'error' } }],
    // Consecutive fences with tab="..." meta become one tabbed code block.
    remarkCodeTab,
    // Headings written as "### 1. Title" become a numbered step timeline.
    remarkSteps,
    lowercaseJsxNames,
  ],
  rehypePlugins: [[rehypeCode, { themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' }, fallbackLanguage: 'text' }]],
  // The admonition creates JSX nodes; pass them through so they reach the components map.
  remarkRehypeOptions: { passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement'] },
});

const components = {
  ...defaultMdxComponents,
  callout: DocCallout,
  codeBlockTabs: CodeBlockTabs,
  codeBlockTabsList: CodeBlockTabsList,
  codeBlockTabsTrigger: CodeBlockTabsTrigger,
  codeBlockTab: CodeBlockTab,
};

/* The admonition plugin reads a callout only when its ':::' markers are paragraphs of their own,
   so a blank line goes before and after each marker. Lines inside code fences are left alone. */
const CALLOUT_OPEN = /^:::(?:info|note|tip|warn|warning|danger)(?:\[[^\]]*\])?\s*$/;
const CALLOUT_CLOSE = /^:::\s*$/;

function separateCallouts(markdown: string): string {
  const out: string[] = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
    } else if (!inFence && (CALLOUT_OPEN.test(line) || CALLOUT_CLOSE.test(line))) {
      out.push('', line.trim(), '');
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

export function docToc(content: string): TOCItemType[] {
  return getTableOfContents(content);
}

export function DocMarkdown({ content }: { content: string }) {
  return (
    <renderer.MarkdownServer components={components}>
      {separateCallouts(content)}
    </renderer.MarkdownServer>
  );
}
