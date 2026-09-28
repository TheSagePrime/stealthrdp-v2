'use client';

// Structured infrastructure flow based on the approved product diagram.
// Motion paths use UI Layouts Animated Beam.
// Citadel is shown only for HTTP/S application traffic and is not implied
// to protect the VPS RDP/admin path.
import {
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

function NodeLabel({
  title,
  meta,
}: {
  title: string;
  meta: string;
}) {
  return (
    <div className="srv-route-label">
      <strong>{title}</strong>
      <span>{meta}</span>
    </div>
  );
}

function EdgeLabel({ className, children }: { className: string; children: React.ReactNode }) {
  return <span className={`srv-route-edge-label ${className}`}>{children}</span>;
}

export function HomeProductFlow() {
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const adminRef = React.useRef<HTMLDivElement>(null);
  const visitorsRef = React.useRef<HTMLDivElement>(null);
  const internetRef = React.useRef<HTMLDivElement>(null);
  const vpsRef = React.useRef<HTMLDivElement>(null);
  const citadelRef = React.useRef<HTMLDivElement>(null);
  const originRef = React.useRef<HTMLDivElement>(null);
  const blockedRef = React.useRef<HTMLDivElement>(null);

  return (
    <BeamContainer
      ref={sceneRef}
      className="srv-route-scene"
      aria-label="StealthRDP product flow: RDP and admin traffic connects to the VPS, while web requests can optionally pass through Citadel Layer 7 protection before reaching the website or app origin."
    >
      <img
        src="/vendor/joly/map-dark.svg"
        alt=""
        aria-hidden="true"
        className="srv-route-map"
      />

      <div className="srv-route-source srv-route-admin" ref={adminRef}>
        <div className="srv-route-source-icon" aria-hidden="true">
          <Monitor />
        </div>
        <NodeLabel title="You · RDP / admin" meta="Server access" />
      </div>

      <div className="srv-route-source srv-route-visitors" ref={visitorsRef}>
        <div className="srv-route-source-icons" aria-hidden="true">
          <Monitor />
          <Smartphone />
        </div>
        <NodeLabel title="Website visitors" meta="HTTP / HTTPS" />
      </div>

      <div className="srv-route-internet" ref={internetRef}>
        <div className="srv-route-internet-mark" aria-hidden="true">
          <img src="/vendor/joly/map-dark.svg" alt="" />
          <Globe2 />
        </div>
        <NodeLabel title="Internet" meta="Public network" />
      </div>

      <div className="srv-route-vps" ref={vpsRef}>
        <div className="srv-route-rack" aria-hidden="true">
          <div className="srv-route-rack-head">
            <i />
            <i />
          </div>
          <div className="srv-route-rack-row"><b /><i /><i /></div>
          <div className="srv-route-rack-row"><b /><i /><i /></div>
          <div className="srv-route-rack-row"><b /><i /><i /></div>
        </div>

        <div className="srv-route-vps-copy">
          <NodeLabel title="StealthRDP VPS" meta="Windows or Linux" />
          <div className="srv-route-os" aria-label="Windows and Linux">
            <span><img src="/brand/windows.svg" alt="" />Windows</span>
            <span><img src="/brand/ubuntu.svg" alt="" />Linux</span>
          </div>
        </div>
      </div>

      <div className="srv-route-citadel" ref={citadelRef}>
        <div className="srv-route-shield" aria-hidden="true">
          <ShieldCheck />
        </div>
        <NodeLabel title="Citadel L7" meta="Optional web protection" />
      </div>

      <div className="srv-route-origin" ref={originRef}>
        <div className="srv-route-browser" aria-hidden="true">
          <div className="srv-route-browser-bar"><i /><i /><i /></div>
          <div className="srv-route-browser-body"><b /><span /><span /></div>
        </div>
        <NodeLabel title="Website / app origin" meta="Allowed HTTP/S traffic" />
      </div>

      <div className="srv-route-blocked" ref={blockedRef}>
        <div className="srv-route-blocked-mark" aria-hidden="true">
          <X />
        </div>
        <NodeLabel title="Suspicious requests stopped" meta="Challenge or block" />
      </div>

      <EdgeLabel className="srv-route-edge-rdp">RDP / admin</EdgeLabel>
      <EdgeLabel className="srv-route-edge-web">Web requests</EdgeLabel>
      <EdgeLabel className="srv-route-edge-allowed">Allowed</EdgeLabel>
      <EdgeLabel className="srv-route-edge-blocked">Challenge or block</EdgeLabel>

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={adminRef}
        toRef={internetRef}
        curvature={8}
        duration={6.2}
        pathColor="#9cb9dd"
        pathOpacity={0.2}
        pathWidth={1.05}
        gradientStartColor="#2845d6"
        gradientStopColor="#00a8ff"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={visitorsRef}
        toRef={internetRef}
        curvature={-8}
        delay={0.6}
        duration={6.4}
        pathColor="#9cb9dd"
        pathOpacity={0.2}
        pathWidth={1.05}
        gradientStartColor="#2845d6"
        gradientStopColor="#00a8ff"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={internetRef}
        toRef={vpsRef}
        curvature={24}
        delay={0.25}
        duration={5.7}
        pathColor="#89a9d6"
        pathOpacity={0.18}
        pathWidth={1.2}
        gradientStartColor="#00a8ff"
        gradientStopColor="#2845d6"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={internetRef}
        toRef={citadelRef}
        curvature={-22}
        delay={0.55}
        duration={5.8}
        pathColor="#89a9d6"
        pathOpacity={0.18}
        pathWidth={1.2}
        gradientStartColor="#00a8ff"
        gradientStopColor="#4f7ef7"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={citadelRef}
        toRef={originRef}
        curvature={18}
        delay={0.2}
        duration={5.2}
        pathColor="#9cb9dd"
        pathOpacity={0.18}
        pathWidth={1.15}
        gradientStartColor="#4f7ef7"
        gradientStopColor="#00a8ff"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={citadelRef}
        toRef={blockedRef}
        curvature={-18}
        delay={0.85}
        duration={5.5}
        pathColor="#d7a1a1"
        pathOpacity={0.2}
        pathWidth={1.05}
        gradientStartColor="#d65050"
        gradientStopColor="#b64747"
      />
    </BeamContainer>
  );
}
