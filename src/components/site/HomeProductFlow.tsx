'use client';

// Transparent hero illustration using:
// - UI Layouts Animated Beam for motion paths
// - Joly UI Orbiting Circles for the network node
// - Joly UI dotted world-map asset for geographic context
// Citadel remains isolated to the HTTP/S application path.
import {
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
      className="srv-hero-net"
      aria-label="StealthRDP infrastructure illustration. VPS compute and Citadel Layer 7 protection are shown as separate product flows."
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
          pathRadii={[56, 78]}
        >
          <div className="srv-hero-net-globe-core" aria-hidden="true">
            <img src="/vendor/joly/map-dark.svg" alt="" />
            <Globe2 />
          </div>

          <OrbitingCircles radius={56} duration={16} delay={2} iconSize={7}>
            <span className="srv-hero-net-orbit-dot" />
          </OrbitingCircles>
          <OrbitingCircles
            radius={78}
            duration={24}
            delay={5}
            reverse
            iconSize={8}
          >
            <span className="srv-hero-net-orbit-dot srv-hero-net-orbit-dot-soft" />
          </OrbitingCircles>
          <OrbitingCircles radius={78} duration={24} delay={14} iconSize={6}>
            <span className="srv-hero-net-orbit-dot" />
          </OrbitingCircles>
        </OrbitingCirclesContainer>
        <FlowLabel title="Global network" meta="Low-latency routes" />
      </div>

      <div className="srv-hero-net-vps" ref={vpsRef}>
        <div className="srv-hero-net-server" aria-hidden="true">
          <div className="srv-hero-net-server-plane srv-hero-net-server-back">
            <Server />
          </div>
          <div className="srv-hero-net-server-plane srv-hero-net-server-mid">
            <Server />
          </div>
          <div className="srv-hero-net-server-plane srv-hero-net-server-front">
            <Server />
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

      <div className="srv-hero-net-citadel" ref={citadelRef}>
        <div className="srv-hero-net-shields" aria-hidden="true">
          <ShieldCheck />
          <ShieldCheck />
          <ShieldCheck />
        </div>
        <FlowLabel title="Citadel L7" meta="Filter · challenge · protect" />

        <div className="srv-hero-net-threats" aria-label="Examples of blocked Layer 7 traffic">
          <span><X /> Bots</span>
          <span><X /> HTTP floods</span>
          <span><X /> Abusive requests</span>
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

      <div className="srv-hero-net-caption srv-hero-net-caption-vps">
        VPS COMPUTE
      </div>
      <div className="srv-hero-net-caption srv-hero-net-caption-web">
        WEB PROTECTION
      </div>

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={usersRef}
        toRef={globeRef}
        curvature={18}
        duration={6.4}
        pathColor="#9bc7f5"
        pathOpacity={0.22}
        pathWidth={1.2}
        gradientStartColor="#2845d6"
        gradientStopColor="#00a8ff"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={usersRef}
        toRef={globeRef}
        curvature={-20}
        delay={1.4}
        duration={7.4}
        pathColor="#b9d9f7"
        pathOpacity={0.14}
        pathWidth={0.8}
        dotted
        dotSpacing={8}
        gradientStartColor="#4f7ef7"
        gradientStopColor="#00b8d9"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={vpsRef}
        curvature={46}
        delay={0.35}
        duration={5.8}
        pathColor="#8db8e8"
        pathOpacity={0.18}
        pathWidth={1.4}
        gradientStartColor="#00a8ff"
        gradientStopColor="#2845d6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={vpsRef}
        curvature={12}
        delay={1.6}
        duration={6.8}
        pathColor="#bed7ef"
        pathOpacity={0.12}
        pathWidth={0.8}
        dotted
        dotSpacing={9}
        gradientStartColor="#22a7f0"
        gradientStopColor="#5478ff"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={cloudflareRef}
        curvature={-42}
        delay={0.8}
        duration={6.6}
        pathColor="#9ec7eb"
        pathOpacity={0.15}
        pathWidth={1}
        gradientStartColor="#00a8ff"
        gradientStopColor="#5c8df6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={cloudflareRef}
        toRef={citadelRef}
        curvature={-6}
        delay={0.2}
        duration={5.4}
        pathColor="#a7c7e8"
        pathOpacity={0.18}
        pathWidth={1.3}
        gradientStartColor="#5c8df6"
        gradientStopColor="#00b8d9"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={citadelRef}
        toRef={originRef}
        curvature={12}
        delay={0.45}
        duration={5.2}
        pathColor="#9ec7eb"
        pathOpacity={0.18}
        pathWidth={1.4}
        gradientStartColor="#00b8d9"
        gradientStopColor="#2845d6"
      />
    </BeamContainer>
  );
}
