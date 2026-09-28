'use client';

// Minimal infrastructure illustration using:
// - UI Layouts Animated Beam for the moving network paths
// - Joly UI Orbiting Circles for a single global-network orbit
// - Joly UI dotted world-map asset as subtle geographic context
// Citadel remains isolated to the HTTP/S application path.
import {
  Cloud,
  Globe2,
  Monitor,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react';
import React from 'react';

import {
  AnimatedBeam,
  BeamContainer,
} from '@/components/ui/animated-beam';
import {
  OrbitingCircles,
  OrbitingCirclesContainer,
} from '@/components/ui/orbiting-circle';

function FlowLabel({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <div className="srv-hero-net-label">
      <strong>{title}</strong>
      <span>{meta}</span>
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
      className="srv-hero-net srv-hero-net-simple"
      aria-label="StealthRDP infrastructure illustration. VPS compute and Citadel Layer 7 protection are separate product flows."
    >
      <img
        src="/vendor/joly/map-dark.svg"
        alt=""
        aria-hidden="true"
        className="srv-hero-net-map"
      />

      <div className="srv-hero-net-users" ref={usersRef}>
        <div className="srv-hero-net-devices" aria-hidden="true">
          <Monitor />
          <Smartphone />
        </div>
        <FlowLabel title="Users" meta="Connect globally" />
      </div>

      <div className="srv-hero-net-globe-wrap">
        <OrbitingCirclesContainer
          ref={globeRef}
          className="srv-hero-net-globe"
          pathRadii={[68]}
        >
          <div className="srv-hero-net-globe-core" aria-hidden="true">
            <img src="/vendor/joly/map-dark.svg" alt="" />
            <Globe2 />
          </div>

          <OrbitingCircles radius={68} duration={22} delay={4} iconSize={7}>
            <span className="srv-hero-net-orbit-dot" />
          </OrbitingCircles>
        </OrbitingCirclesContainer>
        <FlowLabel title="Global network" meta="Low-latency routes" />
      </div>

      <div className="srv-hero-net-vps srv-hero-net-vps-simple" ref={vpsRef}>
        <div className="srv-hero-net-rack" aria-hidden="true">
          <div className="srv-hero-net-rack-top">
            <span />
            <span />
          </div>
          <div className="srv-hero-net-rack-row">
            <b />
            <i />
            <i />
          </div>
          <div className="srv-hero-net-rack-row">
            <b />
            <i />
            <i />
          </div>
          <div className="srv-hero-net-rack-row">
            <b />
            <i />
            <i />
          </div>
        </div>

        <div className="srv-hero-net-vps-copy">
          <FlowLabel title="StealthRDP VPS" meta="Windows + Linux compute" />
          <div className="srv-hero-net-os" aria-label="Windows and Linux">
            <span>
              <img src="/brand/windows.svg" alt="" />
              Windows
            </span>
            <span>
              <img src="/brand/ubuntu.svg" alt="" />
              Linux
            </span>
          </div>
        </div>
      </div>

      <div className="srv-hero-net-cloudflare" ref={cloudflareRef}>
        <Cloud aria-hidden="true" />
        <FlowLabel title="Cloudflare" meta="DNS + proxy" />
      </div>

      <div className="srv-hero-net-citadel srv-hero-net-citadel-simple" ref={citadelRef}>
        <div className="srv-hero-net-shield" aria-hidden="true">
          <ShieldCheck />
        </div>
        <FlowLabel title="Citadel L7" meta="Filter · challenge · protect" />
        <div className="srv-hero-net-threat-line">
          <X aria-hidden="true" />
          Bots · HTTP floods · abusive requests blocked
        </div>
      </div>

      <div className="srv-hero-net-origin" ref={originRef}>
        <div className="srv-hero-net-browser" aria-hidden="true">
          <div className="srv-hero-net-browser-top">
            <i />
            <i />
            <i />
          </div>
          <div className="srv-hero-net-browser-body">
            <b />
            <span />
            <span />
          </div>
        </div>
        <FlowLabel title="Website / app" meta="Clean HTTP/S traffic" />
      </div>

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={usersRef}
        toRef={globeRef}
        curvature={8}
        duration={6.5}
        pathColor="#9bc7f5"
        pathOpacity={0.2}
        pathWidth={1.15}
        gradientStartColor="#2845d6"
        gradientStopColor="#00a8ff"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={vpsRef}
        curvature={34}
        delay={0.35}
        duration={5.9}
        pathColor="#8db8e8"
        pathOpacity={0.18}
        pathWidth={1.35}
        gradientStartColor="#00a8ff"
        gradientStopColor="#2845d6"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={cloudflareRef}
        curvature={-32}
        delay={0.75}
        duration={6.4}
        pathColor="#9ec7eb"
        pathOpacity={0.14}
        pathWidth={1}
        gradientStartColor="#00a8ff"
        gradientStopColor="#5c8df6"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={cloudflareRef}
        toRef={citadelRef}
        curvature={-4}
        delay={0.2}
        duration={5.4}
        pathColor="#a7c7e8"
        pathOpacity={0.18}
        pathWidth={1.25}
        gradientStartColor="#5c8df6"
        gradientStopColor="#00a8ff"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={citadelRef}
        toRef={originRef}
        curvature={10}
        delay={0.45}
        duration={5.2}
        pathColor="#9ec7eb"
        pathOpacity={0.18}
        pathWidth={1.3}
        gradientStartColor="#00a8ff"
        gradientStopColor="#2845d6"
      />
    </BeamContainer>
  );
}
