'use client';

import {
  Cpu,
  Database,
  Globe2,
  MapPin,
  Monitor,
  Network,
  Smartphone,
  Terminal,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import {
  AnimatedBeam,
  BeamContainer,
} from '@/components/ui/animated-beam';
import { LottieAnimation } from '@/components/ui/lottie-animation';

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
      className="srv-vps-motion srv-vps-motion-lottie"
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

      <div className="srv-vps-lottie-globe-wrap">
        <div ref={globeRef} className="srv-vps-lottie-globe-anchor">
          <LottieAnimation
            src="/vendor/lottie/globe.json"
            className="srv-vps-lottie-globe"
            speed={0.62}
          />
          <span className="srv-vps-lottie-orbit srv-vps-lottie-orbit-a" aria-hidden="true" />
          <span className="srv-vps-lottie-orbit srv-vps-lottie-orbit-b" aria-hidden="true" />
          <span className="srv-vps-lottie-node srv-vps-lottie-node-a" aria-hidden="true" />
          <span className="srv-vps-lottie-node srv-vps-lottie-node-b" aria-hidden="true" />
        </div>
        <div className="srv-vps-motion-globe-label">
          <strong>Global network</strong>
          <span>Low latency · High speed</span>
        </div>
      </div>

      <div className="srv-vps-lottie-server-wrap">
        <div ref={serverRef} className="srv-vps-lottie-server-anchor">
          <motion.div
            className="srv-vps-lottie-server-float"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 6.5,
              ease: 'easeInOut',
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <LottieAnimation
              src="/vendor/lottie/server.json"
              className="srv-vps-lottie-server"
              speed={0.78}
            />
            <div className="srv-vps-lottie-os-mark">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={mode}
                  src={mode === 'windows' ? '/brand/windows.svg' : '/brand/ubuntu.svg'}
                  alt=""
                  initial={{ opacity: 0, scale: 0.82, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.82, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
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

      <div className="srv-vps-lottie-globe-fallback" aria-hidden="true">
        <Globe2 />
      </div>

      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={userRef}
        toRef={globeRef}
        curvature={28}
        duration={6.8}
        pathColor="#8fb9e8"
        pathOpacity={0.18}
        pathWidth={1.15}
        gradientStartColor="#2845d6"
        gradientStopColor="#00a8ff"
      />
      <AnimatedBeam
        containerRef={sceneRef}
        fromRef={globeRef}
        toRef={serverRef}
        curvature={35}
        delay={0.3}
        duration={6.2}
        pathColor="#87b8e9"
        pathOpacity={0.2}
        pathWidth={1.45}
        gradientStartColor="#00a8ff"
        gradientStopColor="#2845d6"
      />

      {featureRefs.map((featureRef, index) => (
        <AnimatedBeam
          key={index}
          containerRef={sceneRef}
          fromRef={serverRef}
          toRef={featureRef}
          curvature={(index - 2) * 15}
          delay={0.35 + index * 0.2}
          duration={7 + index * 0.3}
          pathColor="#9fc3e7"
          pathOpacity={0.11}
          pathWidth={0.8}
          startXOffset={92}
          endXOffset={-4}
          dotted
          dotSpacing={9}
          gradientStartColor="#2845d6"
          gradientStopColor="#00a8ff"
        />
      ))}
    </BeamContainer>
  );
}
