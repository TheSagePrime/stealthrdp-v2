'use client';

import {
  Cpu,
  Database,
  MapPin,
  Monitor,
  Network,
  Smartphone,
  Terminal,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import {
  AnimatedBeam,
  BeamContainer,
} from '@/components/ui/animated-beam';
import {
  OrbitingCircles,
  OrbitingCirclesContainer,
} from '@/components/ui/orbiting-circle';

type VpsMode = 'windows' | 'linux';

type Feature = {
  icon: LucideIcon;
  title: string;
  meta: string;
};

const modeFeature: Record<VpsMode, Feature> = {
  windows: {
    icon: Monitor,
    title: 'RDP ready',
    meta: 'Remote desktop ready',
  },
  linux: {
    icon: Terminal,
    title: 'Root access',
    meta: 'Full server control',
  },
};

export function VpsMotionShowcase() {
  const [mode, setMode] = React.useState<VpsMode>('windows');

  const sceneRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);
  const globeRef = React.useRef<HTMLDivElement>(null);
  const serverRef = React.useRef<HTMLDivElement>(null);
  const featureOneRef = React.useRef<HTMLSpanElement>(null);
  const featureTwoRef = React.useRef<HTMLSpanElement>(null);
  const featureThreeRef = React.useRef<HTMLSpanElement>(null);
  const featureFourRef = React.useRef<HTMLSpanElement>(null);
  const featureFiveRef = React.useRef<HTMLSpanElement>(null);

  const features: Feature[] = [
    { icon: Cpu, title: 'High performance', meta: 'Modern server CPUs' },
    { icon: Database, title: 'NVMe storage', meta: 'Fast local storage' },
    { icon: Network, title: 'High bandwidth', meta: 'Global connectivity' },
    modeFeature[mode],
    { icon: MapPin, title: 'Multiple locations', meta: 'USA · Europe' },
  ];
  const featureRefs = [
    featureOneRef,
    featureTwoRef,
    featureThreeRef,
    featureFourRef,
    featureFiveRef,
  ];

  return (
    <BeamContainer
      ref={sceneRef}
      className="srv-vps-motion"
      aria-label="Animated StealthRDP VPS network showing access from your device through the global network to a Windows or Linux VPS."
    >
      <img
        src="/vendor/joly/map-dark.svg"
        alt=""
        aria-hidden="true"
        className="srv-vps-motion-map"
      />

      <div className="srv-vps-mode-switch" role="group" aria-label="VPS operating system">
        <button
          type="button"
          aria-pressed={mode === 'windows'}
          onClick={() => setMode('windows')}
        >
          <img src="/brand/windows.svg" alt="" />
          Windows
        </button>
        <button
          type="button"
          aria-pressed={mode === 'linux'}
          onClick={() => setMode('linux')}
        >
          <img src="/brand/ubuntu.svg" alt="" />
          Linux
        </button>
      </div>

      <div ref={userRef} className="srv-vps-motion-user">
        <div className="srv-vps-motion-devices" aria-hidden="true">
          <Monitor />
          <Smartphone />
        </div>
        <div>
          <strong>You</strong>
          <span>Access from anywhere</span>
        </div>
      </div>

      <div className="srv-vps-motion-globe-wrap">
        <OrbitingCirclesContainer
          ref={globeRef}
          className="srv-vps-motion-globe"
          pathRadii={[78, 104]}
        >
          <div className="srv-vps-motion-globe-core" aria-hidden="true">
            <img src="/vendor/joly/map-dark.svg" alt="" />
          </div>

          <OrbitingCircles radius={78} duration={19} delay={2} iconSize={7}>
            <span className="srv-vps-motion-orbit-dot" />
          </OrbitingCircles>
          <OrbitingCircles
            radius={104}
            duration={28}
            delay={8}
            reverse
            iconSize={6}
          >
            <span className="srv-vps-motion-orbit-dot srv-vps-motion-orbit-dot-soft" />
          </OrbitingCircles>
        </OrbitingCirclesContainer>

        <div className="srv-vps-motion-globe-label">
          <strong>Global network</strong>
          <span>Low latency · High speed</span>
        </div>
      </div>

      <div ref={serverRef} className="srv-vps-motion-server-wrap">
        <motion.div
          className="srv-vps-motion-server-float"
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 6,
            ease: 'easeInOut',
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <div className="srv-vps-motion-server" aria-hidden="true">
          <div className="srv-vps-motion-server-top">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={mode}
                src={mode === 'windows' ? '/brand/windows.svg' : '/brand/ubuntu.svg'}
                alt=""
                initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 6 }}
                transition={{ duration: 0.22 }}
              />
            </AnimatePresence>
          </div>
          <div className="srv-vps-motion-server-layer">
            <b />
            <i />
            <i />
          </div>
          <div className="srv-vps-motion-server-layer">
            <b />
            <i />
            <i />
          </div>
          <div className="srv-vps-motion-server-layer">
            <b />
            <i />
            <i />
          </div>
        </div>

          <div className="srv-vps-motion-server-label">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <strong>{mode === 'windows' ? 'Windows VPS' : 'Linux VPS'}</strong>
                <span>
                  {mode === 'windows' ? 'NVMe · Admin access' : 'NVMe · Root access'}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="srv-vps-motion-features" aria-label="VPS features">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              className="srv-vps-motion-feature"
              key={feature.title}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: index * 0.035 }}
            >
              <span
                ref={featureRefs[index]}
                className="srv-vps-motion-feature-anchor"
                aria-hidden="true"
              />
              <div className="srv-vps-motion-feature-icon" aria-hidden="true">
                <Icon />
              </div>
              <div className="srv-vps-motion-feature-copy">
                <strong>{feature.title}</strong>
                <span>{feature.meta}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="srv-vps-motion-user-mark" aria-hidden="true">
        <UserRound />
      </div>

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={userRef}
        toRef={globeRef}
        curvature={30}
        duration={6.8}
        pathColor="#8fb9e8"
        pathOpacity={0.18}
        pathWidth={1.2}
        gradientStartColor="#2845d6"
        gradientStopColor="#00a8ff"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={userRef}
        toRef={globeRef}
        curvature={-20}
        delay={1.5}
        duration={8}
        pathColor="#b9d7ef"
        pathOpacity={0.1}
        pathWidth={0.8}
        dotted
        dotSpacing={9}
        gradientStartColor="#4f7ef7"
        gradientStopColor="#22d3ee"
      />

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={serverRef}
        curvature={42}
        delay={0.3}
        duration={6.2}
        pathColor="#87b8e9"
        pathOpacity={0.2}
        pathWidth={1.5}
        gradientStartColor="#00a8ff"
        gradientStopColor="#2845d6"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={serverRef}
        curvature={8}
        delay={1.3}
        duration={7.6}
        pathColor="#b5d5ef"
        pathOpacity={0.1}
        pathWidth={0.8}
        dotted
        dotSpacing={10}
        gradientStartColor="#22d3ee"
        gradientStopColor="#4f7ef7"
      />

      {featureRefs.map((featureRef, index) => (
        <AnimatedBeam
          key={index}
          containerRef={sceneRef}
          fromRef={serverRef}
          toRef={featureRef}
          curvature={(index - 2) * 18}
          delay={0.3 + index * 0.22}
          duration={7 + index * 0.35}
          pathColor="#9fc3e7"
          pathOpacity={0.12}
          pathWidth={0.85}
          startXOffset={62}
          endXOffset={-4}
          dotted
          dotSpacing={8}
          gradientStartColor="#2845d6"
          gradientStopColor="#00a8ff"
        />
      ))}
    </BeamContainer>
  );
}
