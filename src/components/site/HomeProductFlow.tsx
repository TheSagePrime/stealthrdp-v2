'use client';

// Composition follows UI Layouts' Animated Beam "multiple output" example:
// one source -> platform -> multiple destinations.
import { Globe2, Server, ShieldCheck } from 'lucide-react';
import { useRef } from 'react';

import { AnimatedBeam } from '@/components/ui/animated-beam';

export function HomeProductFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);
  const vpsRef = useRef<HTMLDivElement>(null);
  const citadelRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[390px] w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm"
      aria-label="StealthRDP product flow from your workload to VPS compute or Citadel protection"
    >
      <div className="absolute inset-x-0 top-0 border-b border-border bg-muted/30 px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            StealthRDP infrastructure
          </span>
          <span className="text-xs text-muted-foreground">Compute + protection</span>
        </div>
      </div>

      <div className="relative z-10 grid min-h-[390px] grid-cols-[minmax(110px,0.8fr)_minmax(130px,0.95fr)_minmax(160px,1.15fr)] items-center gap-7 px-7 pb-7 pt-16">
        <div
          ref={sourceRef}
          className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/95 px-4 py-4 text-center shadow-sm"
        >
          <Globe2 className="size-6 text-primary" aria-hidden="true" />
          <div>
            <strong className="block text-sm font-semibold">Your workload</strong>
            <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
              Apps · desktops · domains
            </span>
          </div>
        </div>

        <div
          ref={platformRef}
          className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-primary/30 bg-background px-4 py-5 text-center shadow-[0_12px_36px_-24px_var(--primary)]"
        >
          <img
            src="https://cdn.stealthrdp.com/images/new/6.png"
            alt=""
            width="700"
            height="170"
            className="h-auto w-[118px]"
          />
          <span className="mt-3 text-[11px] font-medium text-muted-foreground">
            Infrastructure platform
          </span>
        </div>

        <div className="grid gap-4">
          <div
            ref={vpsRef}
            className="flex min-h-28 items-center gap-3 rounded-xl border border-border bg-background/95 px-4 py-4 shadow-sm"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-muted/50">
              <Server className="size-5 text-primary" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <strong className="block text-sm font-semibold">VPS</strong>
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                Windows + Linux compute
              </span>
            </div>
          </div>

          <div
            ref={citadelRef}
            className="flex min-h-28 items-center gap-3 rounded-xl border border-border bg-background/95 px-4 py-4 shadow-sm"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-muted/50">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <strong className="block text-sm font-semibold">Citadel</strong>
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                Layer 7 traffic protection
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={sourceRef}
        toRef={platformRef}
        duration={4}
        dotted
        dotSpacing={6}
        pathColor="var(--border)"
        gradientStartColor="var(--primary)"
        gradientStopColor="#00F0FF"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={platformRef}
        toRef={vpsRef}
        curvature={-58}
        duration={4.6}
        delay={0.2}
        dotted
        dotSpacing={6}
        pathColor="var(--border)"
        gradientStartColor="var(--primary)"
        gradientStopColor="#00F0FF"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={platformRef}
        toRef={citadelRef}
        curvature={58}
        duration={4.6}
        delay={0.45}
        dotted
        dotSpacing={6}
        pathColor="var(--border)"
        gradientStartColor="var(--primary)"
        gradientStopColor="#00F0FF"
      />
    </div>
  );
}
