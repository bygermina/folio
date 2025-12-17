import { useEffect, useRef } from 'react';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { useAnimationFrame } from '@/shared/lib/animation-helpers';

import styles from './light-follow.module.scss';

const SIZE = 360;
const OFFSET = SIZE / 2;
const FRAME_THROTTLE_MS = 50;

export const LightFollowCoursor = () => {
  const { isMobile } = useScreenSizeContext();

  const ref = useRef<HTMLDivElement | null>(null);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);
  const prevX = useRef<number>(0);
  const prevY = useRef<number>(0);
  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };

    if (typeof window !== 'undefined') {
      lastX.current = window.innerWidth + SIZE;
      lastY.current = window.innerHeight + SIZE;
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useAnimationFrame(() => {
    const el = ref.current;
    if (!el) return;

    const now = performance.now();
    if (now - lastUpdateTime.current < FRAME_THROTTLE_MS) return;
    lastUpdateTime.current = now;

    const nextX = lastX.current - OFFSET;
    const nextY = lastY.current - OFFSET;

    if (nextX === prevX.current && nextY === prevY.current) return;

    prevX.current = nextX;
    prevY.current = nextY;

    el.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
  }, !isMobile);

  if (isMobile) return null;

  return <div ref={ref} className={styles.root} />;
};
