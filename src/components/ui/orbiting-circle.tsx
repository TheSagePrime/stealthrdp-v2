'use client';

// Joly UI Orbiting Circles, lightly adapted for this project.
// Source: https://github.com/Johuniq/jolyui/tree/main/docs/registry/default/ui/orbiting-circle.tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  iconSize?: number;
}

const OrbitingCircles = React.forwardRef<HTMLDivElement, OrbitingCirclesProps>(
  (
    {
      className,
      children,
      radius = 80,
      duration = 20,
      delay = 0,
      reverse = false,
      iconSize = 10,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn('orbiting-circle', className)}
      style={
        {
          '--duration': `${duration}s`,
          '--delay': `${-delay}s`,
          '--radius': `${radius}px`,
          '--icon-size': `${iconSize}px`,
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          animationDirection: reverse ? 'reverse' : 'normal',
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  ),
);
OrbitingCircles.displayName = 'OrbitingCircles';

interface OrbitingCirclesContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  pathRadii?: number[];
}

const OrbitingCirclesContainer = React.forwardRef<
  HTMLDivElement,
  OrbitingCirclesContainerProps
>(({ className, children, pathRadii = [58, 82], ...props }, ref) => (
  <div
    ref={ref}
    className={cn('orbiting-container', className)}
    {...props}
  >
    {pathRadii.map((radius) => (
      <svg
        key={radius}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 7"
          className="opacity-20"
        />
      </svg>
    ))}
    {children}
  </div>
));
OrbitingCirclesContainer.displayName = 'OrbitingCirclesContainer';

export {
  OrbitingCircles,
  OrbitingCirclesContainer,
  type OrbitingCirclesProps,
  type OrbitingCirclesContainerProps,
};
