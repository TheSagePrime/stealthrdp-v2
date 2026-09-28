'use client';

// Motion primitive and node system are from Joly UI's Animated Beam component.
// This composition maps the same library primitives to StealthRDP's two real product flows.
import {
  Globe2,
  MonitorUp,
  Server,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';

import {
  AnimatedBeam,
  BeamContainer,
  BeamNode,
} from '@/components/ui/animated-beam';

function ProductLabel({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <div className="min-w-0">
      <strong className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground">
        {title}
      </strong>
      <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
        {meta}
      </span>
    </div>
  );
}

export function HomeProductFlow() {
  const vpsContainerRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);
  const vpsRef = React.useRef<HTMLDivElement>(null);
  const windowsRef = React.useRef<HTMLDivElement>(null);
  const linuxRef = React.useRef<HTMLDivElement>(null);

  const citadelContainerRef = React.useRef<HTMLDivElement>(null);
  const trafficRef = React.useRef<HTMLDivElement>(null);
  const citadelRef = React.useRef<HTMLDivElement>(null);
  const originRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-card/75 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.45)] backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 34%), radial-gradient(circle at 78% 72%, color-mix(in srgb, #22D46B 12%, transparent), transparent 32%)',
        }}
      />

      <div className="relative grid min-h-[430px] grid-rows-2 divide-y divide-border/80">
        <BeamContainer
          ref={vpsContainerRef}
          className="grid grid-cols-[0.9fr_0.8fr_1.15fr] items-center gap-8 px-8 py-8"
          aria-label="VPS flow: connect to StealthRDP VPS and choose Windows or Linux"
        >
          <div className="absolute left-5 top-4 z-20 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              VPS compute
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <BeamNode
              ref={userRef}
              className="size-14 border-2 border-primary/20 bg-background/90 shadow-md"
            >
              <MonitorUp className="size-6 text-primary" aria-hidden="true" />
            </BeamNode>
            <ProductLabel title="You" meta="Connect from anywhere" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <BeamNode
              ref={vpsRef}
              className="size-[72px] border-2 border-primary/35 bg-primary/10 shadow-[0_0_36px_-18px_var(--primary)]"
            >
              <Server className="size-8 text-primary" aria-hidden="true" />
            </BeamNode>
            <ProductLabel title="VPS" meta="Live in ~60 seconds" />
          </div>

          <div className="relative z-10 grid gap-4">
            <div className="flex items-center gap-3">
              <BeamNode
                ref={windowsRef}
                className="size-12 border-2 border-blue-500/20 bg-background/90"
              >
                <img
                  src="/brand/windows.svg"
                  alt=""
                  width="22"
                  height="22"
                  className="size-[22px]"
                />
              </BeamNode>
              <ProductLabel title="Windows Server" meta="Full admin access" />
            </div>

            <div className="flex items-center gap-3">
              <BeamNode
                ref={linuxRef}
                className="size-12 border-2 border-cyan-500/20 bg-background/90"
              >
                <img
                  src="/brand/ubuntu.svg"
                  alt=""
                  width="22"
                  height="22"
                  className="size-[22px]"
                />
              </BeamNode>
              <ProductLabel title="Linux VPS" meta="Ubuntu + more" />
            </div>
          </div>

          <AnimatedBeam
            containerRef={vpsContainerRef}
            fromRef={userRef}
            toRef={vpsRef}
            duration={3}
            pathWidth={2}
            gradientStartColor="#2845d6"
            gradientStopColor="#00F0FF"
          />
          <AnimatedBeam
            containerRef={vpsContainerRef}
            fromRef={vpsRef}
            toRef={windowsRef}
            duration={3.2}
            delay={0.25}
            curvature={-0.24}
            gradientStartColor="#2845d6"
            gradientStopColor="#3b82f6"
          />
          <AnimatedBeam
            containerRef={vpsContainerRef}
            fromRef={vpsRef}
            toRef={linuxRef}
            duration={3.2}
            delay={0.45}
            curvature={0.24}
            gradientStartColor="#2845d6"
            gradientStopColor="#06b6d4"
          />
        </BeamContainer>

        <BeamContainer
          ref={citadelContainerRef}
          className="grid grid-cols-[0.9fr_0.8fr_1.15fr] items-center gap-8 px-8 py-8"
          aria-label="Citadel flow: internet traffic passes through Citadel before reaching the origin"
        >
          <div className="absolute left-5 top-4 z-20 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#22D46B] shadow-[0_0_10px_#22D46B]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Citadel protection
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <BeamNode
              ref={trafficRef}
              className="size-14 border-2 border-slate-500/20 bg-background/90 shadow-md"
            >
              <Globe2 className="size-6 text-foreground" aria-hidden="true" />
            </BeamNode>
            <ProductLabel title="Internet traffic" meta="Requests arrive" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <BeamNode
              ref={citadelRef}
              className="size-[72px] border-2 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_36px_-18px_#22D46B]"
            >
              <ShieldCheck className="size-8 text-emerald-600" aria-hidden="true" />
            </BeamNode>
            <ProductLabel title="Citadel L7" meta="Filters abusive traffic" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <BeamNode
              ref={originRef}
              className="size-14 border-2 border-primary/20 bg-background/90"
            >
              <Server className="size-6 text-primary" aria-hidden="true" />
            </BeamNode>
            <ProductLabel title="Your origin" meta="Clean traffic continues" />
          </div>

          <AnimatedBeam
            containerRef={citadelContainerRef}
            fromRef={trafficRef}
            toRef={citadelRef}
            duration={3}
            pathWidth={2}
            gradientStartColor="#64748b"
            gradientStopColor="#22D46B"
          />
          <AnimatedBeam
            containerRef={citadelContainerRef}
            fromRef={citadelRef}
            toRef={originRef}
            duration={3.2}
            delay={0.35}
            pathWidth={2}
            gradientStartColor="#22D46B"
            gradientStopColor="#00F0FF"
          />
        </BeamContainer>
      </div>

      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-2 rounded-full border border-border/80 bg-background/75 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.11em] text-muted-foreground backdrop-blur">
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
        Live infrastructure
      </div>
    </div>
  );
}
