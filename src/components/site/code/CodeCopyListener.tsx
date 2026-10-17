'use client';

import { useEffect } from 'react';

/*
 * One delegated click handler for the copy button of every guide code block. The block is plain
 * markup from highlight-guide-code.ts (`[data-copy-code]` inside `[data-code]`); the button shows
 * the check icon while `data-checked` is set.
 */

let attached = false;

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* Older browsers or blocked permission: fall back to a hidden textarea. */
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const done = document.execCommand('copy');
    area.remove();
    return done;
  }
}

export function CodeCopyListener() {
  useEffect(() => {
    if (attached) {
      return;
    }
    attached = true;
    const onClick = async (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-copy-code]');
      const block = button?.closest('[data-code]');
      const code = block?.querySelector('pre');
      if (!button || !code) {
        return;
      }
      const ok = await copy(code.textContent ?? '');
      button.setAttribute('aria-label', ok ? 'Copied' : 'Copy failed');
      button.toggleAttribute('data-checked', ok);
      window.setTimeout(() => {
        button.setAttribute('aria-label', 'Copy code');
        button.removeAttribute('data-checked');
      }, 1800);
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      attached = false;
    };
  }, []);

  return null;
}
