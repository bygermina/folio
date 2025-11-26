import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import styles from './scroll-path.module.scss';

interface SvgScrollDrawProps {
  path: string;
  scrollStart?: number;
  scrollEnd?: number;
  strokeColor?: string;
  offsetYPercent?: number; // 0–1: вертикальное смещение относительно высоты лэндинга/контейнера
  fixAxis?: 'x' | 'y';
  strokeWidth?: number;
}

export default function SvgScrollDraw({
  path,
  scrollStart = 0,
  scrollEnd = 1,
  strokeColor = 'white',
  offsetYPercent = 0,
  fixAxis = 'x',
  strokeWidth = 1,
}: SvgScrollDrawProps) {
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

  const topPercent = Math.max(0, Math.min(1, offsetYPercent)) * 100;

  return (
    <div className={styles.root} style={{ top: `${topPercent}%` }}>
      <svg
        className={fixAxis === 'y' ? styles.svgFitY : styles.svgFitX}
        viewBox={box.viewBox}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
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
        </motion.g>
      </svg>
    </div>
  );
}
