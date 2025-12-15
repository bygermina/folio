import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { animate, motion, useMotionValue, useScroll, useTransform } from 'framer-motion';

import { Sparkle, SparkleDefs } from './sparkle';

import styles from './scroll-path.module.scss';

interface SvgScrollDrawProps {
  path: string;
  scrollStart?: number;
  scrollEnd?: number;
  strokeColor?: string;
  offsetYPercent?: number; // 0–1: vertical offset relative to landing page/container height
  fixAxis?: 'x' | 'y';
  strokeWidth?: number;
  showSparkle?: boolean;
  sparkleRadius?: number;
}

export const SvgScrollDraw = ({
  path,
  scrollStart = 0,
  scrollEnd = 1,
  strokeColor = 'white',
  offsetYPercent = 0,
  fixAxis = 'x',
  strokeWidth = 1,
  showSparkle = false,
  sparkleRadius = 0.2,
}: SvgScrollDrawProps) => {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [scrollStart, scrollEnd], [0, 1]);

  const pathRef = useRef<SVGPathElement | null>(null);
  const [box, setBox] = useState<{ viewBox: string; offsetX: number; offsetY: number }>({
    viewBox: '0 0 1 1',
    offsetX: 0,
    offsetY: 0,
  });

  useLayoutEffect(() => {
    if (!pathRef.current) return;

    const bbox = pathRef.current.getBBox();
    if (!bbox.width || !bbox.height) return;

    const pad = strokeWidth;

    setBox({
      viewBox: `0 0 ${bbox.width + pad * 2} ${bbox.height + pad * 2}`,
      offsetX: -(bbox.x - pad),
      offsetY: -(bbox.y - pad),
    });
  }, [path, strokeWidth]);

  const sparkleProgress = useMotionValue(0);
  const drawnMax = useMotionValue(0); // maximum drawn part of the line (0–1)
  const sparkleX = useMotionValue(0);
  const sparkleY = useMotionValue(0);

  useLayoutEffect(() => {
    if (!showSparkle) return;

    const updateMax = (t: number) => {
      if (!Number.isFinite(t)) return;
      const clamped = Math.max(0, Math.min(1, t));
      drawnMax.set(clamped);
    };

    updateMax(pathLength.get());
    const unsubscribe = pathLength.on('change', updateMax);

    return () => {
      unsubscribe();
    };
  }, [pathLength, showSparkle, drawnMax]);

  useLayoutEffect(() => {
    if (!showSparkle || !pathRef.current) return;

    const pathElement = pathRef.current;
    let length: number;

    try {
      length = pathElement.getTotalLength();
    } catch {
      return;
    }

    if (!Number.isFinite(length) || length <= 0) return;

    const unsubscribeMv = sparkleProgress.on('change', (t) => {
      const local = ((t % 1) + 1) % 1; // normalize to [0,1)
      const maxDrawn = drawnMax.get();

      if (maxDrawn <= 0) return;

      const progress = local >= maxDrawn ? 0 : local;
      const point = pathElement.getPointAtLength(length * progress);
      sparkleX.set(point.x);
      sparkleY.set(point.y);
    });

    const controls = animate(sparkleProgress, 1, {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    });

    return () => {
      unsubscribeMv();
      controls.stop();
    };
  }, [showSparkle, sparkleProgress, sparkleX, sparkleY, drawnMax]);

  const topPercent = Math.max(0, Math.min(1, offsetYPercent)) * 100;

  const gradientId = `sparkle-gradient-${Math.random().toString(36).slice(2, 11)}`;
  const filterId = useMemo(() => `glow-${Math.random().toString(36).slice(2, 11)}`, []);

  return (
    <div className={styles.root} style={{ top: `${topPercent}%` }}>
      <svg
        className={fixAxis === 'y' ? styles.svgFitY : styles.svgFitX}
        viewBox={box.viewBox}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {showSparkle && (
          <SparkleDefs strokeColor={strokeColor} gradientId={gradientId} filterId={filterId} />
        )}
        <motion.g transform={`translate(${box.offsetX} ${box.offsetY})`}>
          <motion.path
            ref={pathRef}
            d={path}
            stroke={strokeColor}
            strokeOpacity={0.1}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray="0 1"
            style={{ pathLength }}
          />

          {showSparkle && (
            <Sparkle
              x={sparkleX}
              y={sparkleY}
              strokeColor={strokeColor}
              radius={sparkleRadius}
              gradientId={gradientId}
              filterId={filterId}
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
}
