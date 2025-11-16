import { useEffect, useRef } from 'react';
import { useScreenSizeContext } from '../../providers/use-context';

import styles from './light-follow.module.scss';

const SIZE = 360;
const OFFSET = SIZE / 2;

const LightFollowCoursor = () => {
  const { isMobile } = useScreenSizeContext();

  const ref = useRef<HTMLDivElement>(null);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastX.current = e.clientX;
      lastY.current = e.clientY;
    };

    const updatePosition = () => {
      const el = ref.current;
      if (el) {
        el.style.left = `${lastX.current - OFFSET}px`;
        el.style.top = `${lastY.current - OFFSET}px`;
      }
    };

    const tick = () => {
      updatePosition();
      rafId.current = requestAnimationFrame(tick);
    };

    // Initial position
    if (typeof window !== 'undefined') {
      lastX.current = window.innerWidth / 2;
      lastY.current = window.innerHeight / 2;
    }
    updatePosition();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isMobile) return null;

  return <div ref={ref} className={styles.root} />;
};

export default LightFollowCoursor;
