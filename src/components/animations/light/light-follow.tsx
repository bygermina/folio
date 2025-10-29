import { useEffect, useRef } from 'react';
import { useScreenSizeContext } from '../../providers/use-context';
import { commonColors } from '../../../utils/colors';

const colors = commonColors.light;

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

    const tick = () => {
      const el = ref.current;
      if (el) {
        el.style.left = `${lastX.current - 180}px`;
        el.style.top = `${lastY.current - 180}px`;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    const el = ref.current;
    if (el) {
      el.style.left = `${lastX.current - 180}px`;
      el.style.top = `${lastY.current - 180}px`;
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: typeof window !== 'undefined' ? window.innerWidth / 2 - 180 : 0,
        top: typeof window !== 'undefined' ? window.innerHeight / 2 - 180 : 0,
        width: 360,
        height: 360,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${colors.core} 0%, ${colors.middle} 30%, ${colors.outer} 70%, transparent 100%)`,
        filter: 'blur(80px)',
        zIndex: 50,
        mixBlendMode: 'color-dodge',
        pointerEvents: 'none',
        willChange: 'left, top',
      }}
    />
  );
};

export default LightFollowCoursor;
