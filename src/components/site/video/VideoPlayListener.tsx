'use client';

import { useEffect } from 'react';

/*
 * One delegated click handler for every click-to-play video in article bodies
 * (see video-embed-markup.ts). It swaps the placeholder for the YouTube player.
 */

let attached = false;

export function VideoPlayListener() {
  useEffect(() => {
    if (attached) {
      return;
    }
    attached = true;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest('[data-video-play]');
      const frame = link?.closest<HTMLElement>('[data-video]');
      const id = frame?.dataset.video;
      if (!frame || !id || !/^[\w-]{6,}$/.test(id)) {
        return;
      }
      event.preventDefault();
      const player = document.createElement('iframe');
      player.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
      player.title = 'Embedded video';
      player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      player.allowFullscreen = true;
      player.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.replaceChildren(player);
      frame.dataset.state = 'playing';
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      attached = false;
    };
  }, []);

  return null;
}
