'use client';

// Uses Joly UI's Animated Beam "microservices architecture" composition.
// We only map its nodes to StealthRDP's actual product categories.
import {
  Activity,
  Globe2,
  Monitor,
  Network,
  ShieldCheck,
  TerminalSquare,
} from 'lucide-react';
import React from 'react';

import {
  AnimatedBeam,
  BeamContainer,
  BeamNode,
} from '@/components/ui/animated-beam';

export function HomeProductFlow() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const internetRef = React.useRef<HTMLDivElement>(null);
  const platformRef = React.useRef<HTMLDivElement>(null);
  const windowsRef = React.useRef<HTMLDivElement>(null);
  const linuxRef = React.useRef<HTMLDivElement>(null);
  const citadelRef = React.useRef<HTMLDivElement>(null);
  const workloadRef = React.useRef<HTMLDivElement>(null);

  return (
    <BeamContainer
      ref={containerRef}
      className="srv-product-beam mx-auto flex min-h-[390px] w-full items-center justify-center gap-8 overflow-hidden px-5 py-8"
      aria-label="StealthRDP infrastructure: internet traffic connects through the platform to Windows VPS, Linux VPS, and Citadel protection"
    >
      <div className="flex flex-col items-center gap-2">
        <BeamNode
          ref={internetRef}
          className="size-14 border-2 border-primary/20 bg-primary/5"
        >
          <Globe2 className="size-6 text-primary" aria-hidden="true" />
        </BeamNode>
        <span className="srv-product-beam-label">Internet</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BeamNode
          ref={platformRef}
          className="size-16 border-2 border-primary/30 bg-primary/10 shadow-[0_0_34px_-15px_var(--primary)]"
        >
          <Network className="size-8 text-primary" aria-hidden="true" />
        </BeamNode>
        <span className="srv-product-beam-label">StealthRDP</span>
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex items-center gap-3">
          <BeamNode
            ref={windowsRef}
            className="size-12 border-2 border-blue-500/20 bg-blue-500/5"
          >
            <Monitor className="size-5 text-blue-600" aria-hidden="true" />
          </BeamNode>
          <span className="srv-product-beam-service">Windows VPS</span>
        </div>

        <div className="flex items-center gap-3">
          <BeamNode
            ref={linuxRef}
            className="size-12 border-2 border-cyan-500/20 bg-cyan-500/5"
          >
            <TerminalSquare className="size-5 text-cyan-600" aria-hidden="true" />
          </BeamNode>
          <span className="srv-product-beam-service">Linux VPS</span>
        </div>

        <div className="flex items-center gap-3">
          <BeamNode
            ref={citadelRef}
            className="size-12 border-2 border-emerald-500/20 bg-emerald-500/5"
          >
            <ShieldCheck className="size-5 text-emerald-600" aria-hidden="true" />
          </BeamNode>
          <span className="srv-product-beam-service">Citadel L7</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BeamNode
          ref={workloadRef}
          className="size-14 border-2 border-slate-500/20 bg-slate-500/5"
        >
          <Activity className="size-6 text-foreground" aria-hidden="true" />
        </BeamNode>
        <span className="srv-product-beam-label">Your workload</span>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={internetRef}
        toRef={platformRef}
        duration={3.2}
        gradientStartColor="#2845d6"
        gradientStopColor="#00F0FF"
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={platformRef}
        toRef={windowsRef}
        duration={3.4}
        delay={0.15}
        curvature={-0.28}
        gradientStartColor="#2845d6"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={platformRef}
        toRef={linuxRef}
        duration={3.4}
        delay={0.3}
        curvature={0}
        gradientStartColor="#2845d6"
        gradientStopColor="#06b6d4"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={platformRef}
        toRef={citadelRef}
        duration={3.4}
        delay={0.45}
        curvature={0.28}
        gradientStartColor="#2845d6"
        gradientStopColor="#22D46B"
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={windowsRef}
        toRef={workloadRef}
        duration={3.5}
        delay={0.8}
        curvature={0.28}
        gradientStartColor="#3b82f6"
        gradientStopColor="#64748b"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={linuxRef}
        toRef={workloadRef}
        duration={3.5}
        delay={0.95}
        curvature={0}
        gradientStartColor="#06b6d4"
        gradientStopColor="#64748b"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={citadelRef}
        toRef={workloadRef}
        duration={3.5}
        delay={1.1}
        curvature={-0.28}
        gradientStartColor="#22D46B"
        gradientStopColor="#64748b"
      />
    </BeamContainer>
  );
}
