import { useEffect, useRef } from 'react';

import { useScreenSizeContext } from '../../providers/use-context';
import { useAnimationFrame } from '@/utils/animation-helpers';

import styles from './light-follow.module.scss';

const SIZE = 360;
const OFFSET = SIZE / 2;

const LightFollowCoursor = () => {
  const { isMobile } = useScreenSizeContext();

  const ref = useRef<HTMLDivElement>(null);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

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
    if (el) {
      el.style.left = `${lastX.current - OFFSET}px`;
      el.style.top = `${lastY.current - OFFSET}px`;
    }
  }, !isMobile);

  if (isMobile) return null;

  return <div ref={ref} className={styles.root} />;
};

export default LightFollowCoursor;
