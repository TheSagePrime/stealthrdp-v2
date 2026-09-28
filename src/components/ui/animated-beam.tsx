'use client';

// UI Layouts Animated Beam, adapted for deterministic production rendering.
// Source: https://github.com/ui-layouts/uilayouts/tree/main/apps/ui-layout/components/ui/animated-beam.tsx
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import {
  type RefObject,
  forwardRef,
  useEffect,
  useId,
  useState,
} from 'react';

interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
  dotted?: boolean;
  dotSpacing?: number;
}

const AnimatedBeam = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5.2,
  delay = 0,
  pathColor = '#38bdf8',
  pathWidth = 1.5,
  pathOpacity = 0.18,
  gradientStartColor = '#38bdf8',
  gradientStopColor = '#00F0FF',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  dotted = false,
  dotSpacing = 7,
}: AnimatedBeamProps) => {
  const id = useId();
  const [pathD, setPathD] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  const strokeDasharray = dotted ? `${dotSpacing} ${dotSpacing}` : 'none';

  const gradientCoordinates = reverse
    ? {
        x1: ['95%', '-15%'],
        x2: ['110%', '0%'],
        y1: ['0%', '0%'],
        y2: ['0%', '0%'],
      }
    : {
        x1: ['5%', '115%'],
        x2: ['-10%', '100%'],
        y1: ['0%', '0%'],
        y2: ['0%', '0%'],
      };

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const rectA = fromRef.current.getBoundingClientRect();
      const rectB = toRef.current.getBoundingClientRect();

      setSvgDimensions({
        width: containerRect.width,
        height: containerRect.height,
      });

      const startX =
        rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
      const startY =
        rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
      const endX =
        rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
      const endY =
        rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

      const controlX = (startX + endX) / 2;
      const controlY = (startY + endY) / 2 - curvature;

      setPathD(
        `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`,
      );
    };

    updatePath();

    const resizeObserver = new ResizeObserver(updatePath);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    window.addEventListener('resize', updatePath);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePath);
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'pointer-events-none absolute left-0 top-0 h-full w-full transform-gpu',
        className,
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      aria-hidden="true"
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
      />

      <motion.path
        d={pathD}
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        initial={{ strokeOpacity: 0 }}
        animate={{ strokeOpacity: 1 }}
        transition={{ duration: 0.45, delay }}
        strokeWidth={pathWidth * 1.35}
      />

      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: '0%', x2: '0%', y1: '0%', y2: '0%' }}
          animate={{
            x1: gradientCoordinates.x1,
            x2: gradientCoordinates.x2,
            y1: gradientCoordinates.y1,
            y2: gradientCoordinates.y2,
          }}
          transition={{
            delay,
            duration,
            ease: 'linear',
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop offset="18%" stopColor={gradientStartColor} />
          <stop offset="55%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};

AnimatedBeam.displayName = 'AnimatedBeam';

interface BeamContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const BeamContainer = forwardRef<HTMLDivElement, BeamContainerProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn('relative', className)} {...props}>
      {children}
    </div>
  ),
);
BeamContainer.displayName = 'BeamContainer';

interface BeamNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const BeamNode = forwardRef<HTMLDivElement, BeamNodeProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'relative z-10 flex items-center justify-center rounded-xl border bg-background p-3 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
BeamNode.displayName = 'BeamNode';

export {
  AnimatedBeam,
  BeamContainer,
  BeamNode,
  type AnimatedBeamProps,
  type BeamContainerProps,
  type BeamNodeProps,
};
