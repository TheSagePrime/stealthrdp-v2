import type { ReactNode } from 'react';
import { CodeBlock } from '@/components/ui/code-block';
import { getMarkdownHeadings } from '@/lib/stealth/resource-headings';

const CODE_INDENT = /^ {4}/;
const CODE_PREFIXES = ['sudo ', 'winrm ', 'yum ', 'bash ', 'wget '];
const HEADING_3 = /^###\s+/;
const HEADING_2 = /^##\s+/;
const HEADING_1 = /^#\s+/;
const RULE = /^=+$|^-+$/;
const STEP = /^\d+\.\s+/;
const BULLET = /^[*\-~]\s+/;
const EMPHASIS = /(?<![A-Za-z0-9])_([^_\n]+)_(?![A-Za-z0-9])/g;

type Block =
  | { kind: 'heading'; level: 2 | 3; text: string; id?: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'code'; lines: string[] };

function inline(text: string): ReactNode[] {
  const cleaned = text.replace(/\*\*/g, '').replace(EMPHASIS, '$1');
  const parts = cleaned.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={index} href={link[2]}>{link[1]}</a>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    return <span key={index}>{part}</span>;
  });
}

function parse(content: string): Block[] {
  const blocks: Block[] = [];
  const toc = getMarkdownHeadings(content);
  let headingIndex = 0;
  let code: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushCode = () => {
    if (code.length) {
      blocks.push({ kind: 'code', lines: code });
      code = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ kind: 'list', ordered: list.ordered, items: list.items });
      list = null;
    }
  };

  for (const raw of content.split(/\r?\n/)) {
    const trimmed = raw.trim();
    if (!trimmed) {
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
      blocks.push({ kind: 'heading', level: 3, text: trimmed.replace(HEADING_3, ''), id: toc[headingIndex++]?.url.slice(1) });
      continue;
    }
    if (HEADING_2.test(trimmed)) {
      flushList();
      blocks.push({ kind: 'heading', level: 2, text: trimmed.replace(HEADING_2, ''), id: toc[headingIndex++]?.url.slice(1) });
      continue;
    }
    if (HEADING_1.test(trimmed) || RULE.test(trimmed)) {
      flushList();
      continue;
    }
    if (STEP.test(trimmed)) {
      if (!list || !list.ordered) {
        flushList();
        list = { ordered: true, items: [] };
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
    blocks.push({ kind: 'paragraph', text: trimmed });
  }
  flushCode();
  flushList();
  return blocks;
}

export function DocBody({ content }: { content: string }) {
  return (
    <div className="sr-richtext">
      {parse(content).map((block, index) => {
        if (block.kind === 'heading') {
          return block.level === 2
            ? <h2 id={block.id} key={index}>{inline(block.text)}</h2>
            : <h3 id={block.id} key={index}>{inline(block.text)}</h3>;
        }
        if (block.kind === 'list') {
          const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>);
          return block.ordered ? <ol key={index}>{items}</ol> : <ul key={index}>{items}</ul>;
        }
        if (block.kind === 'code') return <CodeBlock key={index}><code>{block.lines.join('\n')}</code></CodeBlock>;
        return <p key={index}>{inline(block.text)}</p>;
      })}
    </div>
  );
}
