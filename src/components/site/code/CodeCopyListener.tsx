'use client';

import { useEffect } from 'react';

/*
 * One delegated click handler for every copy button in article bodies. The
 * buttons are plain markup (`[data-copy-code]` inside `[data-code]`), so the
 * same block works in trusted HTML guides and in rendered help docs.
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
      const label = button.querySelector('span');
      if (label) {
        label.textContent = ok ? 'Copied' : 'Copy failed';
      }
      button.dataset.state = ok ? 'copied' : 'failed';
      window.setTimeout(() => {
        if (label) {
          label.textContent = 'Copy';
        }
        delete button.dataset.state;
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
