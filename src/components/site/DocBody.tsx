import type { ReactNode } from 'react';

function inline(text: string): ReactNode[] {
  const cleaned = text.replace(/\*\*/g, '');
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

export function DocBody({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let code: string[] = [];

  const flushCode = () => {
    if (!code.length) return;
    nodes.push(<pre key={`code-${nodes.length}`}><code>{code.join('\n')}</code></pre>);
    code = [];
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      flushCode();
      return;
    }
    if (/^ {4}/.test(raw) || trimmed.startsWith('sudo ') || trimmed.startsWith('winrm ') || trimmed.startsWith('yum ') || trimmed.startsWith('bash ') || trimmed.startsWith('wget ')) {
      code.push(trimmed);
      return;
    }
    flushCode();
    if (/^###\s+/.test(trimmed)) {
      nodes.push(<h3 key={index}>{inline(trimmed.replace(/^###\s+/, ''))}</h3>);
    } else if (/^##\s+/.test(trimmed)) {
      nodes.push(<h2 key={index}>{inline(trimmed.replace(/^##\s+/, ''))}</h2>);
    } else if (/^#\s+/.test(trimmed) || /^=+$/.test(trimmed) || /^-+$/.test(trimmed)) {
      return;
    } else if (/^\d+\.\s+/.test(trimmed)) {
      nodes.push(<p className="sr-doc-line sr-doc-step" key={index}>{inline(trimmed)}</p>);
    } else if (/^\*\s+/.test(trimmed) || /^-\s+/.test(trimmed)) {
      nodes.push(<p className="sr-doc-line" key={index}>• {inline(trimmed.replace(/^(?:\*|-)\s+/, ''))}</p>);
    } else {
      nodes.push(<p className="sr-doc-line" key={index}>{inline(trimmed)}</p>);
    }
  });
  flushCode();

  return <div className="sr-richtext">{nodes}</div>;
}