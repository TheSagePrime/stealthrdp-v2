'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['server.', 'Windows VPS.', 'Linux VPS.'] as const;

export function HeroWordRotator() {
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const interval = window.setInterval(() => {
      setTransitioning(true);

      settleTimer.current = window.setTimeout(() => {
        setIndex(current => (current + 1) % WORDS.length);
        setTransitioning(false);
      }, 1050);
    }, 5200);

    return () => {
      window.clearInterval(interval);
      if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    };
  }, []);

  const nextIndex = (index + 1) % WORDS.length;

  return (
    <span className="srv-home-word-slot" data-transitioning={transitioning ? 'true' : 'false'}>
      <span className="sr-visually-hidden">server.</span>
      <span className="srv-home-word-layer srv-home-word-current" aria-hidden="true">
        {WORDS[index]}
      </span>
      <span className="srv-home-word-layer srv-home-word-next" aria-hidden="true">
        {WORDS[nextIndex]}
      </span>
    </span>
  );
}
