'use client';

import React from 'react';

type LottieItem = {
  destroy: () => void;
  setSpeed: (speed: number) => void;
};

type LottieApi = {
  loadAnimation: (options: {
    container: Element;
    renderer: 'svg';
    loop: boolean;
    autoplay: boolean;
    path: string;
    rendererSettings?: {
      preserveAspectRatio?: string;
      progressiveLoad?: boolean;
    };
  }) => LottieItem;
};

declare global {
  interface Window {
    lottie?: LottieApi;
  }
}

let lottieLoader: Promise<LottieApi> | null = null;

function loadLottiePlayer() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Lottie can only load in the browser.'));
  }

  if (window.lottie) {
    return Promise.resolve(window.lottie);
  }

  if (lottieLoader) {
    return lottieLoader;
  }

  lottieLoader = new Promise<LottieApi>((resolve, reject) => {
    const finish = () => {
      if (window.lottie) {
        resolve(window.lottie);
      } else {
        reject(new Error('Lottie player loaded without exposing the API.'));
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-stealth-lottie-player]',
    );

    if (existing) {
      existing.addEventListener('load', finish, { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load Lottie player.')),
        { once: true },
      );
      return;
    }

    const script = document.createElement('script');
    script.src = '/vendor/lottie/lottie_light.min.js';
    script.async = true;
    script.dataset.stealthLottiePlayer = 'true';
    script.addEventListener('load', finish, { once: true });
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load Lottie player.')),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return lottieLoader;
}

export function LottieAnimation({
  src,
  className,
  speed = 1,
  loop = true,
}: {
  src: string;
  className?: string;
  speed?: number;
  loop?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let cancelled = false;
    let animation: LottieItem | null = null;

    void loadLottiePlayer()
      .then((lottie) => {
        if (cancelled || !containerRef.current) return;

        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;

        animation = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay: !reduceMotion,
          path: src,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
            progressiveLoad: true,
          },
        });
        animation.setSpeed(speed);
      })
      .catch(() => {
        // Keep the static composition intact if animation loading ever fails.
      });

    return () => {
      cancelled = true;
      animation?.destroy();
    };
  }, [loop, speed, src]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      data-lottie-src={src}
    />
  );
}
