'use client';

import { useEffect } from 'react';

/*
 * One delegated click and key handler for the tab bars of guide code blocks. The tabs are plain
 * markup from guide-markdown.ts: a [data-code-tabs] group with [data-code-tab-trigger] buttons and
 * [data-code-tab-panel] panels. Selecting a tab sets data-state (the panels hide with the Tailwind
 * data-[state=inactive] class). Without JavaScript the first tab is shown and the others stay hidden.
 */

let attached = false;

function select(group: Element, index: number) {
  group.querySelectorAll<HTMLElement>('[data-code-tab-trigger]').forEach((trigger) => {
    const active = trigger.dataset.codeTabTrigger === String(index);
    trigger.dataset.state = active ? 'active' : 'inactive';
    trigger.setAttribute('aria-selected', String(active));
    trigger.tabIndex = active ? 0 : -1;
  });
  group.querySelectorAll<HTMLElement>('[data-code-tab-panel]').forEach((panel) => {
    panel.dataset.state = panel.dataset.codeTabPanel === String(index) ? 'active' : 'inactive';
  });
}

export function CodeTabsListener() {
  useEffect(() => {
    if (attached) {
      return;
    }
    attached = true;
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-code-tab-trigger]');
      const group = trigger?.closest('[data-code-tabs]');
      if (!trigger || !group) {
        return;
      }
      select(group, Number(trigger.dataset.codeTabTrigger));
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
        return;
      }
      const trigger = (event.target as Element | null)?.closest<HTMLElement>('[data-code-tab-trigger]');
      const group = trigger?.closest('[data-code-tabs]');
      if (!trigger || !group) {
        return;
      }
      const triggers = [...group.querySelectorAll<HTMLElement>('[data-code-tab-trigger]')];
      const step = event.key === 'ArrowRight' ? 1 : -1;
      const next = triggers[(triggers.indexOf(trigger) + step + triggers.length) % triggers.length];
      if (next) {
        event.preventDefault();
        next.focus();
        select(group, Number(next.dataset.codeTabTrigger));
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      attached = false;
    };
  }, []);

  return null;
}
