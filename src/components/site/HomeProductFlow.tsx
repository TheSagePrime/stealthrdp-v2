'use client';

// Cinematic infrastructure scene composed from Joly UI's Animated Beam / BeamNode
// primitives plus Joly UI's dotted world-map asset.
// Sources:
// - https://github.com/Johuniq/jolyui/tree/main/docs/registry/default/ui/animated-beam.tsx
// - https://github.com/Johuniq/jolyui/blob/main/docs/public/map-dark.svg
import {
  Bot,
  Cloud,
  Globe2,
  Monitor,
  Server,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import React from 'react';

import {
  AnimatedBeam,
  BeamContainer,
  BeamNode,
} from '@/components/ui/animated-beam';

function SceneLabel({
  title,
  meta,
  tone = 'default',
}: {
  title: string;
  meta?: string;
  tone?: 'default' | 'green' | 'red';
}) {
  return (
    <div className="srv-cinematic-label">
      <strong data-tone={tone}>{title}</strong>
      {meta ? <span>{meta}</span> : null}
    </div>
  );
}

function MiniStatus({
  icon: Icon,
  children,
  tone = 'green',
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  tone?: 'green' | 'red' | 'blue';
}) {
  return (
    <span className="srv-cinematic-status" data-tone={tone}>
      <Icon className="size-3.5" />
      {children}
    </span>
  );
}

export function HomeProductFlow() {
  const sceneRef = React.useRef<HTMLDivElement>(null);

  const browserRef = React.useRef<HTMLDivElement>(null);
  const mobileRef = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useRef<HTMLDivElement>(null);
  const cloudflareRef = React.useRef<HTMLDivElement>(null);
  const citadelRef = React.useRef<HTMLDivElement>(null);
  const originRef = React.useRef<HTMLDivElement>(null);

  const remoteRef = React.useRef<HTMLDivElement>(null);
  const vpsRef = React.useRef<HTMLDivElement>(null);
  const windowsRef = React.useRef<HTMLDivElement>(null);
  const linuxRef = React.useRef<HTMLDivElement>(null);

  return (
    <BeamContainer
      ref={sceneRef}
      className="srv-cinematic-scene"
      aria-label="StealthRDP infrastructure visual showing Citadel protecting HTTP and HTTPS web traffic separately from VPS compute"
    >
      <img
        className="srv-cinematic-map"
        src="/vendor/joly/map-dark.svg"
        alt=""
        aria-hidden="true"
      />

      <div className="srv-cinematic-grid" aria-hidden="true" />
      <div className="srv-cinematic-glow srv-cinematic-glow-blue" aria-hidden="true" />
      <div className="srv-cinematic-glow srv-cinematic-glow-green" aria-hidden="true" />

      <div className="srv-cinematic-kicker">
        <span>VPS hosting</span>
        <i />
        <span>Citadel L7</span>
        <i />
        <span>Global access</span>
      </div>

      <div className="srv-cinematic-lane-title srv-cinematic-lane-web">
        <span className="srv-cinematic-dot" data-tone="green" />
        Web application traffic
      </div>

      <div className="srv-cinematic-lane-title srv-cinematic-lane-vps">
        <span className="srv-cinematic-dot" data-tone="blue" />
        VPS compute
      </div>

      <div className="srv-cinematic-endpoint srv-cinematic-browser">
        <BeamNode ref={browserRef} className="srv-cinematic-node srv-cinematic-node-client">
          <Monitor className="size-5" aria-hidden="true" />
        </BeamNode>
        <SceneLabel title="Browsers" meta="HTTP / HTTPS" />
      </div>

      <div className="srv-cinematic-endpoint srv-cinematic-mobile">
        <BeamNode ref={mobileRef} className="srv-cinematic-node srv-cinematic-node-client">
          <Smartphone className="size-5" aria-hidden="true" />
        </BeamNode>
        <SceneLabel title="Web apps" meta="HTTPS requests" />
      </div>

      <div className="srv-cinematic-endpoint srv-cinematic-api">
        <BeamNode ref={apiRef} className="srv-cinematic-node srv-cinematic-node-client">
          <Globe2 className="size-5" aria-hidden="true" />
        </BeamNode>
        <SceneLabel title="Public web" meta="Global traffic" />
      </div>

      <div className="srv-cinematic-endpoint srv-cinematic-cloudflare">
        <BeamNode ref={cloudflareRef} className="srv-cinematic-node srv-cinematic-node-cloud">
          <Cloud className="size-6" aria-hidden="true" />
        </BeamNode>
        <SceneLabel title="Cloudflare" meta="DNS + proxy" />
      </div>

      <div className="srv-cinematic-citadel">
        <div className="srv-cinematic-shield-rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <BeamNode ref={citadelRef} className="srv-cinematic-node srv-cinematic-node-citadel">
          <ShieldCheck className="size-10" aria-hidden="true" />
        </BeamNode>
        <div className="srv-cinematic-citadel-copy">
          <strong>Citadel</strong>
          <span>Layer 7 · HTTP/S</span>
        </div>
        <div className="srv-cinematic-citadel-status">
          <MiniStatus icon={ShieldCheck}>Inspect + filter</MiniStatus>
          <MiniStatus icon={Bot} tone="red">Bots blocked</MiniStatus>
        </div>
      </div>

      <div className="srv-cinematic-endpoint srv-cinematic-origin">
        <BeamNode ref={originRef} className="srv-cinematic-node srv-cinematic-node-origin">
          <Server className="size-7" aria-hidden="true" />
        </BeamNode>
        <SceneLabel title="Web origin" meta="Clean requests" tone="green" />
      </div>

      <div className="srv-cinematic-blocked srv-cinematic-blocked-one">
        <X className="size-3" aria-hidden="true" />
        Malicious HTTP
      </div>
      <div className="srv-cinematic-blocked srv-cinematic-blocked-two">
        <Bot className="size-3" aria-hidden="true" />
        Bot request
      </div>

      <div className="srv-cinematic-vps-divider" aria-hidden="true" />

      <div className="srv-cinematic-endpoint srv-cinematic-remote">
        <BeamNode ref={remoteRef} className="srv-cinematic-node srv-cinematic-node-client">
          <Globe2 className="size-5" aria-hidden="true" />
        </BeamNode>
        <SceneLabel title="You" meta="Remote access" />
      </div>

      <div className="srv-cinematic-vps-core">
        <BeamNode ref={vpsRef} className="srv-cinematic-node srv-cinematic-node-vps">
          <Server className="size-8" aria-hidden="true" />
        </BeamNode>
        <SceneLabel title="StealthRDP VPS" meta="Full admin access" tone="green" />
      </div>

      <div className="srv-cinematic-os srv-cinematic-windows">
        <BeamNode ref={windowsRef} className="srv-cinematic-node srv-cinematic-node-os">
          <img src="/brand/windows.svg" alt="" width="22" height="22" />
        </BeamNode>
        <SceneLabel title="Windows" meta="Server editions" />
      </div>

      <div className="srv-cinematic-os srv-cinematic-linux">
        <BeamNode ref={linuxRef} className="srv-cinematic-node srv-cinematic-node-os">
          <img src="/brand/ubuntu.svg" alt="" width="22" height="22" />
        </BeamNode>
        <SceneLabel title="Linux" meta="Ubuntu + more" />
      </div>

      <div className="srv-cinematic-live">
        <span />
        Infrastructure online
      </div>

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={browserRef}
        toRef={cloudflareRef}
        duration={3.4}
        curvature={-0.12}
        gradientStartColor="#22d3ee"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={mobileRef}
        toRef={cloudflareRef}
        duration={3.6}
        delay={0.25}
        curvature={0}
        gradientStartColor="#22d3ee"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={apiRef}
        toRef={cloudflareRef}
        duration={3.8}
        delay={0.5}
        curvature={0.12}
        gradientStartColor="#22d3ee"
        gradientStopColor="#3b82f6"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={cloudflareRef}
        toRef={citadelRef}
        duration={3}
        delay={0.15}
        gradientStartColor="#3b82f6"
        gradientStopColor="#22D46B"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={cloudflareRef}
        toRef={citadelRef}
        duration={3.4}
        delay={1.15}
        pathWidth={1.5}
        gradientStartColor="#ef4444"
        gradientStopColor="#ef4444"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={citadelRef}
        toRef={originRef}
        duration={3}
        delay={0.4}
        pathWidth={2.4}
        gradientStartColor="#22D46B"
        gradientStopColor="#00F0FF"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={remoteRef}
        toRef={vpsRef}
        duration={3.5}
        delay={0.2}
        gradientStartColor="#38bdf8"
        gradientStopColor="#2845d6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={vpsRef}
        toRef={windowsRef}
        duration={3.6}
        delay={0.45}
        curvature={-0.2}
        gradientStartColor="#2845d6"
        gradientStopColor="#3b82f6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={vpsRef}
        toRef={linuxRef}
        duration={3.6}
        delay={0.7}
        curvature={0.2}
        gradientStartColor="#2845d6"
        gradientStopColor="#22d3ee"
      />
    </BeamContainer>
  );
}
