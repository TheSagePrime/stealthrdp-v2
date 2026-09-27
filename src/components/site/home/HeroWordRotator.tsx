'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['server.', 'Windows VPS.', 'Linux VPS.'] as const;
type Phase = 'idle' | 'transition' | 'settle';

export function HeroWordRotator() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const finishTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const interval = window.setInterval(() => {
      setPhase('transition');

      finishTimer.current = window.setTimeout(() => {
        setIndex(current => (current + 1) % WORDS.length);
        setPhase('settle');

        settleTimer.current = window.setTimeout(() => {
          setPhase('idle');
        }, 80);
      }, 1350);
    }, 6200);

    return () => {
      window.clearInterval(interval);
      if (finishTimer.current !== null) window.clearTimeout(finishTimer.current);
      if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    };
  }, []);

  const nextIndex = (index + 1) % WORDS.length;

  return (
    <span className="srv-home-word-slot" data-phase={phase}>
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
