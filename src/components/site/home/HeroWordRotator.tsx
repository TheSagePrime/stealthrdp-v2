'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['server.', 'Windows VPS.', 'Linux VPS.'] as const;
type Phase = 'idle' | 'out' | 'in';

export function HeroWordRotator() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const swapTimer = useRef<number | null>(null);
  const settleTimer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const interval = window.setInterval(() => {
      setPhase('out');

      swapTimer.current = window.setTimeout(() => {
        setIndex(current => (current + 1) % WORDS.length);
        setPhase('in');

        settleTimer.current = window.setTimeout(() => {
          setPhase('idle');
        }, 520);
      }, 230);
    }, 3400);

    return () => {
      window.clearInterval(interval);
      if (swapTimer.current !== null) window.clearTimeout(swapTimer.current);
      if (settleTimer.current !== null) window.clearTimeout(settleTimer.current);
    };
  }, []);

  return (
    <span className="srv-home-word-slot" data-phase={phase}>
      <span className="sr-visually-hidden">server.</span>
      <span className="srv-home-word-value" aria-hidden="true">
        {WORDS[index]}
      </span>
    </span>
  );
}
