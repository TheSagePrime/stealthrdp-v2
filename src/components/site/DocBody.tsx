/* eslint-disable better-tailwindcss/no-unknown-classes, react-refresh/only-export-components */
import type { ReactNode } from 'react';
import type { ResourceHeading } from '@/components/site/TrustedArticleBody';
import { CopySimple } from '@phosphor-icons/react/dist/ssr';
import { codeLabel } from '@/components/site/code/code-block-markup';
import { CodeCopyListener } from '@/components/site/code/CodeCopyListener';

const CODE_INDENT = /^ {4}/;
const CODE_PREFIXES = ['sudo ', 'winrm ', 'yum ', 'bash ', 'wget '];
const HEADING_3 = /^###\s+/;
const HEADING_2 = /^##\s+/;
const HEADING_1 = /^#\s+/;
const RULE = /^(?:={3,}|(?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,})$/;
const STEP = /^\d+\.\s+/;
// The docs content marks bullets with '-', '*' and '~'. All three are bullets;
// the old renderer printed the marker literally for the tilde.
const BULLET = /^[*\-~]\s+/;
// Emphasis markers around whole words. The alphanumeric guards keep identifiers
// such as open_lite_speed intact.
const EMPHASIS = /(?<![A-Z0-9])_([^_\n]+)_(?![A-Z0-9])/gi;
const FENCE = /^```\s?([\w-]*)$/;
// Markdown escapes such as install\_fastpanel.sh must render without the backslash.
const unescapeMarkdown = (value: string) => value.replace(/\\([\\`*_{}[\]()#+\-.!|])/g, '$1');

type Block
  = | { kind: 'heading'; level: 2 | 3; text: string }
    | { kind: 'paragraph'; text: string }
    | { kind: 'label'; text: string }
    | { kind: 'list'; ordered: boolean; start?: number; items: string[] }
    | { kind: 'code'; lines: string[]; language?: string };

function slugifyHeading(value: string): string {
  return value
    .replace(/\*\*/g, '')
    .replace(EMPHASIS, '$1')
    .replace(/\[[^\]]+\]\([^)]+\)/g, match => match.replace(/^\[|\]\([^)]+\)$/g, ''))
    .replace(/`/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inline(text: string): ReactNode[] {
  const cleaned = unescapeMarkdown(text.replace(/\*\*/g, '').replace(EMPHASIS, '$1'));
  const parts = cleaned.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return <a key={index} href={link[2]}>{link[1]}</a>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    return <span key={index}>{part}</span>;
  });
}

/**
 * Group the source lines into semantic blocks, so lists become real lists and
 * commands become a code block instead of styled paragraphs.
 */
function normalizeLegacyHeader(content: string, title?: string): string {
  if (!title) {
    return content;
  }

  const lines = content.split(/\r?\n/);
  const normalizedTitle = title.trim().toLowerCase();
  let cursor = 0;

  const skipBlank = () => {
    while (cursor < lines.length && !lines[cursor]?.trim()) {
      cursor += 1;
    }
  };

  skipBlank();

  // Imported Help Center snapshots contain the article title twice, followed by
  // a Setext H1 underline. The page shell already owns the only visible H1.
  for (let pass = 0; pass < 2; pass += 1) {
    if ((lines[cursor]?.trim().toLowerCase() ?? '') === normalizedTitle) {
      cursor += 1;
      skipBlank();
    }
  }

  if (/^=+$/.test(lines[cursor]?.trim() ?? '')) {
    cursor += 1;
    skipBlank();
  }

  if (/^last updated(?: on)?\b/i.test(lines[cursor]?.trim() ?? '')) {
    cursor += 1;
    skipBlank();
  }

  return lines.slice(cursor).join('\n');
}

function parse(content: string, title?: string): Block[] {
  const blocks: Block[] = [];
  const normalizedContent = normalizeLegacyHeader(content, title);
  let code: string[] = [];
  let list: { ordered: boolean; start?: number; items: string[] } | null = null;

  const flushCode = () => {
    if (code.length) {
      blocks.push({ kind: 'code', lines: code });
      code = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ kind: 'list', ordered: list.ordered, start: list.start, items: list.items });
      list = null;
    }
  };

  let fence: { language?: string; lines: string[] } | null = null;

  for (const raw of normalizedContent.split(/\r?\n/)) {
    const trimmed = raw.trim();
    // Fenced blocks keep their lines exactly, including blank lines and indentation.
    if (fence) {
      if (trimmed === '```') {
        blocks.push({ kind: 'code', lines: fence.lines, language: fence.language });
        fence = null;
      } else {
        fence.lines.push(raw);
      }
      continue;
    }
    const opening = trimmed.match(FENCE);
    if (opening) {
      flushCode();
      flushList();
      fence = { language: opening[1] || undefined, lines: [] };
      continue;
    }
    // Imported snapshots kept the old site's copy-button label as text.
    if (trimmed === 'Copy') {
      continue;
    }
    if (!trimmed) {
      // A blank line inside a run of list items must not split the list,
      // otherwise every numbered step renders as "1." again.
      flushCode();
      continue;
    }
    if (CODE_INDENT.test(raw) || CODE_PREFIXES.some(prefix => trimmed.startsWith(prefix))) {
      flushList();
      code.push(trimmed);
      continue;
    }
    flushCode();
    if (HEADING_3.test(trimmed)) {
      flushList();
      blocks.push({ kind: 'heading', level: 3, text: trimmed.replace(HEADING_3, '') });
      continue;
    }
    if (HEADING_2.test(trimmed)) {
      flushList();
      blocks.push({ kind: 'heading', level: 2, text: trimmed.replace(HEADING_2, '') });
      continue;
    }
    if (HEADING_1.test(trimmed) || RULE.test(trimmed)) {
      flushList();
      continue;
    }
    if (STEP.test(trimmed)) {
      if (!list || !list.ordered) {
        flushList();
        // A list split by a code block keeps its step number.
        list = { ordered: true, start: Number.parseInt(trimmed, 10), items: [] };
      }
      list.items.push(trimmed.replace(STEP, ''));
      continue;
    }
    if (BULLET.test(trimmed)) {
      if (!list || list.ordered) {
        flushList();
        list = { ordered: false, items: [] };
      }
      list.items.push(trimmed.replace(BULLET, ''));
      continue;
    }
    flushList();
    // Imported docs use a whole bold line as a step label ("**2. Server Update:**").
    const label = trimmed.match(/^\*\*([^*]+)\*\*$/);
    blocks.push(label && label[1]!.length <= 90 ? { kind: 'label', text: label[1]! } : { kind: 'paragraph', text: trimmed });
  }
  flushCode();
  flushList();
  if (fence) {
    blocks.push({ kind: 'code', lines: fence.lines, language: fence.language });
  }

  return blocks;
}

export function docHeadings(content: string, title?: string): ResourceHeading[] {
  const seen = new Map<string, number>();
  return parse(content, title)
    .filter((block): block is Extract<Block, { kind: 'heading' }> => block.kind === 'heading')
    .map((block) => {
      const base = slugifyHeading(block.text) || 'section';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return {
        id: count === 0 ? base : `${base}-${count + 1}`,
        text: unescapeMarkdown(block.text.replace(/\*\*/g, '').replace(EMPHASIS, '$1')),
        level: block.level,
      };
    });
}

export function DocBody({ content, title }: { content: string; title?: string }) {
  const headings = docHeadings(content, title);
  let headingIndex = 0;

  return (
    <div className="sr-richtext">
      <CodeCopyListener />
      {parse(content, title).map((block, index) => {
        if (block.kind === 'heading') {
          const heading = headings[headingIndex++];
          return block.level === 2
            ? <h2 key={index} id={heading?.id}>{inline(block.text)}</h2>
            : <h3 key={index} id={heading?.id}>{inline(block.text)}</h3>;
        }
        if (block.kind === 'list') {
          const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>);
          return block.ordered
            ? <ol key={index} start={block.start && block.start > 1 ? block.start : undefined}>{items}</ol>
            : <ul key={index}>{items}</ul>;
        }
        if (block.kind === 'code') {
          return (
            <figure key={index} className="sr-code" data-code>
              <figcaption className="sr-code-head">
                <span>{codeLabel(block.language)}</span>
                <button type="button" className="sr-code-copy" data-copy-code aria-label="Copy code">
                  <CopySimple size={14} aria-hidden="true" />
                  <span>Copy</span>
                </button>
              </figcaption>
              <pre tabIndex={0}><code>{block.lines.join('\n')}</code></pre>
            </figure>
          );
        }
        if (block.kind === 'label') {
          return <p key={index} className="sr-doc-label"><strong>{inline(block.text)}</strong></p>;
        }
        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}
