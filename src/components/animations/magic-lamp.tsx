import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import tailwindConfig, { rgba } from '../../../tailwind.config';

const lampColors = tailwindConfig.theme.extend.colors.lamp;
const DEG_PER_RAD = 180 / Math.PI;
const MAX_DT = 0.05; // seconds, cap integration step
const PARALLAX = 0.22;

interface MagicLampProps {
  isVisible: boolean;
  brightness?: number;

  /** Cord length in px (visual); physical L = cordLengthPx / pxPerMeter */
  cordLengthPx?: number;

  /** Pixels per meter (calibrates "physics scale" to your UI). 100–120 is good. */
  pxPerMeter?: number;

  /** Gravity (m/s^2). 9.81 by default. Can be slightly reduced for "cinematic" effect. */
  gravity?: number;

  /** Damping coefficient (1/s). 0.2–0.6 is realistic; higher — faster decay. */
  damping?: number;

  /** Stop threshold (rad/s and rad): smaller — longer "sitting" near 0. */
  stopEpsilonVel?: number;
  stopEpsilonAngleDeg?: number;

  /** Horizontal position of suspension point, % of screen width */
  pivotLeftPercent?: number;

  /** Vertical "drop-in" animation of node into screen (ms) — purely visual, not physics */
  dropInMs?: number;
}

export const MagicLamp: React.FC<MagicLampProps> = ({
  isVisible,
  brightness = 1,
  cordLengthPx = 300,
  pxPerMeter = 110,
  gravity = 9.81,
  damping = 0.35,
  stopEpsilonVel = 0.02,
  stopEpsilonAngleDeg = 0.8,
  pivotLeftPercent = 75,
  dropInMs = 550,
}) => {
  const prefersReduced = useReducedMotion();

  // ==== PHYSICS ====
  // angle (rad) and angular velocity (rad/s)
  const thetaRef = useRef<number>((-90 * Math.PI) / 180); // start from horizontal
  const omegaRef = useRef<number>(0); // initial velocity 0
  const stoppedRef = useRef<boolean>(false);

  // physical pendulum length (meters) from visual length (px)
  const L = Math.max(0.2, cordLengthPx / pxPerMeter); // not less than 20 cm

  // motion values for rotation and shadow offset
  const rotDeg = useMotionValue<number>((thetaRef.current * 180) / Math.PI);
  const shadowX = useMotionValue<number>(0);
  const lastTs = useRef<number | null>(null);

  // Visual drop-in + reset physics on show
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    // Reset physics state when shown
    stoppedRef.current = false;
    thetaRef.current = (-90 * Math.PI) / 180;
    omegaRef.current = 0;
    lastTs.current = null;
    setDropped(false);
    const id = requestAnimationFrame(() => setDropped(true));
    return () => cancelAnimationFrame(id);
  }, [isVisible]);

  // integrator (semi-implicit Euler) in real time
  useAnimationFrame((ts) => {
    if (!isVisible || prefersReduced) return;
    if (stoppedRef.current) return;

    // wait for visual "entry" to complete, so as not to interfere with the eye
    if (!dropped) {
      lastTs.current = ts;
      return;
    }

    const lt = lastTs.current;
    lastTs.current = ts;
    if (lt == null) return;

    // Δt (sec), with limitation (in case of lags/hidden tabs)
    let dt = (ts - lt) / 1000;
    if (dt > MAX_DT) dt = MAX_DT;

    const theta = thetaRef.current;
    const omega = omegaRef.current;

    // pendulum equation with damping: θ¨ = -(g/L) sin θ - c θ˙
    const alpha = -(gravity / L) * Math.sin(theta) - damping * omega;

    // semi-implicit (symplectic) Euler: first velocity, then position
    const newOmega = omega + alpha * dt;
    const newTheta = theta + newOmega * dt;

    thetaRef.current = newTheta;
    omegaRef.current = newOmega;

    // Update visual values
    const deg = newTheta * DEG_PER_RAD;
    rotDeg.set(deg);

    // Shadow/highlight moves with slight parallax
    const x = cordLengthPx * Math.sin(newTheta) * PARALLAX;
    shadowX.set(x);

    // Stop condition (near zero and almost no velocity for several ticks in a row)
    const nearZeroAngle = Math.abs(deg) < stopEpsilonAngleDeg;
    const nearZeroVel = Math.abs(newOmega) < stopEpsilonVel;

    if (nearZeroAngle && nearZeroVel) {
      // fix at "ideal" zero so it doesn't shake
      thetaRef.current = 0;
      omegaRef.current = 0;
      rotDeg.set(0);
      shadowX.set(0);
      stoppedRef.current = true;
    }
  });

  if (!isVisible || prefersReduced) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden role="presentation">
      <div className="relative h-full" style={{ left: `${pivotLeftPercent}%` }}>
        {/* Entire pendulum system: rotate around top-center */}
        <motion.div
          className="absolute -top-5 origin-top"
          style={{
            rotate: rotDeg, // <- real physical angle
            y: dropped ? 0 : -220, // visual entry from above
            opacity: dropped ? 1 : 0,
          }}
          transition={{
            y: { duration: dropInMs / 1000, ease: 'easeOut' },
            opacity: { duration: 0.2, ease: 'easeOut' },
          }}
        >
          {/* Cord */}
          <div
            className="w-[2px] mx-auto"
            style={{
              height: cordLengthPx,
              background: `linear-gradient(to bottom, ${rgba(lampColors.cord.from, 0.4)}, ${rgba(
                lampColors.cord.to,
                0.5,
              )})`,
            }}
          />

          {/* Lamp - donut with transparent center */}
          <div className="relative mx-auto">
            <div
              className="w-16 h-16 rounded-full relative overflow-hidden bg-transparent"
              style={{
                border: `2px solid ${rgba(lampColors.border, 0.5)}`,
                boxShadow: `0 0 ${20 * brightness}px ${rgba(
                  lampColors.glow,
                  0.4 * brightness,
                )}, 0 0 ${40 * brightness}px ${rgba(
                  lampColors.glow,
                  0.2 * brightness,
                )}, 0 0 ${60 * brightness}px ${rgba(lampColors.glow, 0.1 * brightness)}, 0 8px 16px ${
                  lampColors.shadow.black
                }`,
              }}
            />

            {/* Shadow under lamp for depth effect */}
            <div
              className="absolute top-20 left-1/2 w-12 h-6 -translate-x-1/2 rounded-full blur-md opacity-60"
              style={{
                background: `radial-gradient(ellipse at center, ${lampColors.shadow.radial} 0%, transparent 70%)`,
              }}
            />
          </div>
        </motion.div>

        {/* SHADOW/HIGHLIGHT on "wall" — synchronized with angle via shadowX */}
        <motion.div
          className="absolute left-0 w-[180px] h-[90px] -ml-[90px] blur-[22px] opacity-[0.55]"
          style={{
            top: cordLengthPx + 40,
            x: shadowX,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(50% 60% at 50% 50%, ${
                lampColors.highlight.core
              } 0%, ${lampColors.highlight.middle} 45%, ${
                lampColors.highlight.outer
              } 78%, rgba(0,0,0,0.0) 100%)`,
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
