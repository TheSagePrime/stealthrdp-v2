/* The Help Center articles were imported from the old help desk as loose Markdown: the title
   repeated above a Setext underline, commands as indented or bare lines, '~' bullets, bold
   lines used as step labels and a leftover "Copy" button label. This turns that into standard
   Markdown, so Fumadocs renders the articles like any other docs page. The source files stay
   untouched: their text feeds page dates, search and llms-full.txt. */

const CODE_INDENT = /^ {4}/;
const CODE_PREFIXES = ['sudo ', 'winrm ', 'yum ', 'bash ', 'wget '];
const HEADING_3 = /^###\s+/;
const HEADING_2 = /^##\s+/;
const HEADING_1 = /^#\s+/;
const RULE = /^(?:={3,}|(?:-\s*){3,}|(?:\*\s*){3,}|(?:_\s*){3,})$/;
const STEP = /^\d+\.\s+/;
// The docs content marks bullets with '-', '*' and '~'. All three are bullets.
const BULLET = /^[*\-~]\s+/;
const FENCE = /^```\s?([\w-]*)$/;
// A bold line or a one-item numbered list ending in ':' was the old help desk's way to write a
// step or section heading ("**Step 1: Update the server**", "1. General Use:").
const STEP_LABEL = /^\*\*((?:step\s*\d+|\d+\.)[^*]{0,80})\*\*$/i;
const SHELL_HINT = /^(?:sudo|yum|apt|apt-get|wget|curl|bash|sh|cd|chmod|systemctl|service|nano|vi|mkdir|cp|mv|rm|echo|cat|dnf|winrm)\b/;

type Block
  = | { kind: 'heading'; level: 2 | 3; text: string }
    | { kind: 'paragraph'; text: string }
    | { kind: 'list'; ordered: boolean; start?: number; items: string[] }
    | { kind: 'code'; lines: string[]; language?: string };

/* Imported snapshots contain the article title twice, a Setext H1 underline and a
   "Last updated on" line. The page shell already owns the title and the date. */
function stripLegacyHeader(content: string, title?: string): string {
  const lines = content.split(/\r?\n/);
  let cursor = 0;
  const skipBlank = () => {
    while (cursor < lines.length && !lines[cursor]?.trim()) {
      cursor += 1;
    }
  };

  skipBlank();
  if (title) {
    const normalizedTitle = title.trim().toLowerCase();
    for (let pass = 0; pass < 2; pass += 1) {
      if ((lines[cursor]?.trim().toLowerCase() ?? '') === normalizedTitle) {
        cursor += 1;
        skipBlank();
      }
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
  let code: string[] = [];
  let list: { ordered: boolean; start?: number; items: string[] } | null = null;
  let fence: { language?: string; lines: string[] } | null = null;

  const flushCode = () => {
    if (code.length) {
      blocks.push({ kind: 'code', lines: code });
      code = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ kind: 'list', ...list });
      list = null;
    }
  };

  for (const raw of stripLegacyHeader(content, title).split(/\r?\n/)) {
    const trimmed = raw.trim();
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
      // A blank line inside a run of list items must not split the list.
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
    blocks.push({ kind: 'paragraph', text: trimmed });
  }
  flushCode();
  flushList();
  if (fence) {
    blocks.push({ kind: 'code', lines: fence.lines, language: fence.language });
  }

  return blocks;
}

/* Inline text keeps its Markdown (links, code, bold). A bare '<' would start raw HTML,
   which the renderer drops, so it is escaped outside code spans. */
function inline(text: string): string {
  return text
    .split(/(`[^`]+`)/g)
    .map(part => (part.startsWith('`') ? part : part.replace(/</g, '&lt;')))
    .join('');
}

function codeLanguage(block: Extract<Block, { kind: 'code' }>): string {
  if (block.language) {
    return block.language;
  }
  return block.lines.some(line => SHELL_HINT.test(line.trim())) ? 'bash' : 'text';
}

export function legacyToMarkdown(content: string, title?: string): string {
  return parse(content, title)
    .map((block) => {
      switch (block.kind) {
        case 'heading':
          // Headings wrapped in bold ("## **Step 1:**") read as plain headings.
          return `${'#'.repeat(block.level)} ${inline(block.text.replace(/^\*\*(.+)\*\*$/, '$1').replace(/:$/, ''))}`;
        case 'list': {
          const only = block.items.length === 1 ? block.items[0]! : '';
          if (block.ordered && only.endsWith(':') && only.length <= 60) {
            return `### ${block.start ?? 1}. ${inline(only.slice(0, -1))}`;
          }
          return block.items
            .map((item, index) => `${block.ordered ? `${(block.start ?? 1) + index}.` : '-'} ${inline(item)}`)
            .join('\n');
        }
        case 'code':
          return `\`\`\`${codeLanguage(block)}\n${block.lines.join('\n')}\n\`\`\``;
        default: {
          const label = block.text.match(STEP_LABEL);
          return label ? `### ${inline(label[1]!.replace(/:$/, ''))}` : inline(block.text);
        }
      }
    })
    .join('\n\n');
}
