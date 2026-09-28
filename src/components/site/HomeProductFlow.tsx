'use client';

// Hero network scene built from UI Layouts Animated Beam + Joly UI world-map asset.
// The two product paths are deliberately separate:
// 1) VPS compute: Users -> Global network -> StealthRDP VPS.
// 2) Citadel L7: Web traffic -> Cloudflare -> Citadel -> Website/App.
import {
  Bot,
  Cloud,
  Globe2,
  Monitor,
  Server,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import React from 'react';

import {
  AnimatedBeam,
  BeamContainer,
  BeamNode,
} from '@/components/ui/animated-beam';

function Label({
  title,
  meta,
  tone = 'default',
}: {
  title: string;
  meta?: string;
  tone?: 'default' | 'cyan' | 'green';
}) {
  return (
    <div className="srv-flow-label">
      <strong data-tone={tone}>{title}</strong>
      {meta ? <span>{meta}</span> : null}
    </div>
  );
}

export function HomeProductFlow() {
  const sceneRef = React.useRef<HTMLDivElement>(null);

  const usersRef = React.useRef<HTMLDivElement>(null);
  const globeRef = React.useRef<HTMLDivElement>(null);
  const vpsRef = React.useRef<HTMLDivElement>(null);

  const cloudflareRef = React.useRef<HTMLDivElement>(null);
  const citadelRef = React.useRef<HTMLDivElement>(null);
  const originRef = React.useRef<HTMLDivElement>(null);

  return (
    <BeamContainer
      ref={sceneRef}
      className="srv-flow-scene"
      aria-label="StealthRDP infrastructure flow with VPS compute separate from Citadel Layer 7 web protection"
    >
      <img
        src="/vendor/joly/map-dark.svg"
        alt=""
        aria-hidden="true"
        className="srv-flow-world-map"
      />

      <div className="srv-flow-grid" aria-hidden="true" />
      <div className="srv-flow-haze srv-flow-haze-one" aria-hidden="true" />
      <div className="srv-flow-haze srv-flow-haze-two" aria-hidden="true" />

      <div className="srv-flow-eyebrow">
        <span>Global network</span>
        <i />
        <span>VPS compute</span>
        <i />
        <span>Citadel L7</span>
      </div>

      <div className="srv-flow-users">
        <BeamNode ref={usersRef} className="srv-flow-node srv-flow-node-users">
          <Monitor className="size-5" aria-hidden="true" />
          <Smartphone className="size-4" aria-hidden="true" />
        </BeamNode>
        <Label title="Users / visitors" meta="Connect from anywhere" />
      </div>

      <div className="srv-flow-globe">
        <BeamNode ref={globeRef} className="srv-flow-node srv-flow-node-globe">
          <img
            src="/vendor/joly/map-dark.svg"
            alt=""
            aria-hidden="true"
            className="srv-flow-globe-map"
          />
          <Globe2 className="srv-flow-globe-icon" aria-hidden="true" />
        </BeamNode>
        <Label title="Global network" meta="Low-latency access" tone="cyan" />
      </div>

      <div className="srv-flow-vps">
        <BeamNode ref={vpsRef} className="srv-flow-node srv-flow-node-vps">
          <div className="srv-flow-server-stack" aria-hidden="true">
            <span><b /><i /><i /></span>
            <span><b /><i /><i /></span>
            <span><b /><i /><i /></span>
          </div>
          <Server className="srv-flow-vps-icon" aria-hidden="true" />
        </BeamNode>
        <div className="srv-flow-vps-copy">
          <Label title="StealthRDP VPS" meta="Windows + Linux compute" tone="cyan" />
          <div className="srv-flow-os-pills">
            <span><img src="/brand/windows.svg" alt="" /> Windows</span>
            <span><img src="/brand/ubuntu.svg" alt="" /> Linux</span>
          </div>
        </div>
      </div>

      <div className="srv-flow-cloudflare">
        <BeamNode
          ref={cloudflareRef}
          className="srv-flow-node srv-flow-node-cloudflare"
        >
          <Cloud className="size-6" aria-hidden="true" />
        </BeamNode>
        <Label title="Cloudflare" meta="DNS + proxy" />
      </div>

      <div className="srv-flow-citadel">
        <div className="srv-flow-shield-layers" aria-hidden="true">
          <span />
          <span />
        </div>
        <BeamNode ref={citadelRef} className="srv-flow-node srv-flow-node-citadel">
          <ShieldCheck className="size-9" aria-hidden="true" />
        </BeamNode>
        <Label title="Citadel L7" meta="Filter · challenge · protect" tone="green" />
        <div className="srv-flow-threats">
          <span><Bot className="size-3" /> Bots</span>
          <span>HTTP floods</span>
          <span>Abusive requests</span>
        </div>
      </div>

      <div className="srv-flow-origin">
        <BeamNode ref={originRef} className="srv-flow-node srv-flow-node-origin">
          <div className="srv-flow-browser-window" aria-hidden="true">
            <span />
            <span />
            <span />
            <b />
            <i />
            <i />
          </div>
        </BeamNode>
        <Label title="Website / app" meta="Clean HTTP/S traffic" tone="green" />
      </div>

      <div className="srv-flow-lane srv-flow-lane-compute">
        <span />
        VPS COMPUTE
      </div>
      <div className="srv-flow-lane srv-flow-lane-web">
        <span />
        WEB PROTECTION
      </div>

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={usersRef}
        toRef={globeRef}
        curvature={30}
        duration={6.2}
        pathWidth={1.3}
        pathOpacity={0.16}
        gradientStartColor="#38bdf8"
        gradientStopColor="#00F0FF"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={usersRef}
        toRef={globeRef}
        curvature={-22}
        delay={1.2}
        duration={7}
        pathWidth={0.9}
        pathOpacity={0.1}
        gradientStartColor="#60a5fa"
        gradientStopColor="#22d3ee"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={vpsRef}
        curvature={54}
        delay={0.4}
        duration={5.8}
        pathWidth={1.7}
        pathOpacity={0.2}
        gradientStartColor="#00F0FF"
        gradientStopColor="#2845d6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={vpsRef}
        curvature={18}
        delay={1.4}
        duration={6.8}
        pathWidth={0.9}
        pathOpacity={0.09}
        gradientStartColor="#38bdf8"
        gradientStopColor="#3b82f6"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={cloudflareRef}
        curvature={-50}
        delay={0.75}
        duration={6.4}
        pathWidth={1.2}
        pathOpacity={0.14}
        gradientStartColor="#38bdf8"
        gradientStopColor="#60a5fa"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={cloudflareRef}
        toRef={citadelRef}
        curvature={8}
        delay={0.2}
        duration={5.3}
        pathWidth={1.7}
        pathOpacity={0.17}
        gradientStartColor="#60a5fa"
        gradientStopColor="#22D46B"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={citadelRef}
        toRef={originRef}
        curvature={-18}
        delay={0.5}
        duration={5.1}
        pathWidth={1.9}
        pathOpacity={0.18}
        gradientStartColor="#22D46B"
        gradientStopColor="#00F0FF"
      />
    </BeamContainer>
  );
}
