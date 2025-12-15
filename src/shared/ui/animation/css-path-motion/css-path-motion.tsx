import { useEffect, useRef, type ReactNode, type RefObject } from 'react';

import { getPathLength } from '@/shared/lib/svg';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';

import styles from './css-path-motion.module.scss';

const getDurationFromSpeed = (fallbackSeconds: number, speed?: number, length?: number): number => {
  if (!speed || speed <= 0 || !length || length <= 0) return fallbackSeconds;

  return Math.max(0.001, length / speed);
};

interface CSSPathMotionProps {
  path: string;
  children: ReactNode;
  duration?: number;
  delay?: number;
  iterations?: number | 'infinite';
  timingFunction?: string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  autoRotate?: boolean;
  rotationDegrees?: number;
  enableRotation?: boolean;
  speed?: number; //px/sec
  onCompleteEvent?: string;
  onComplete?: () => void;
  containerRef?: RefObject<HTMLElement | null>;
}

export const CSSPathMotion = ({
  path,
  children,
  duration = 3,
  delay = 0,
  iterations = 1,
  timingFunction = 'linear',
  direction = 'normal',
  autoRotate = false,
  rotationDegrees = 1080,
  enableRotation = true,
  speed,
  onCompleteEvent,
  onComplete,
  containerRef,
}: CSSPathMotionProps) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const computedDurationRef = useRef<number>(duration);

  const visibilityRef = containerRef || motionRef;
  const isVisible = useIntersectionObserver(visibilityRef, {
    threshold: 0,
    rootMargin: '0px',
  });

  useEffect(() => {
    if (!speed || speed <= 0 || !path) {
      computedDurationRef.current = duration;
      return;
    }

    const length = getPathLength(path);
    computedDurationRef.current = getDurationFromSpeed(duration, speed, length);
  }, [path, speed, duration]);

  useEffect(() => {
    if (motionRef.current) {
      const seconds = computedDurationRef.current;
      motionRef.current.style.setProperty('--animation-duration', `${seconds}s`);
      motionRef.current.style.setProperty('--animation-delay', `${delay}s`);
      motionRef.current.style.setProperty('--animation-timing', timingFunction);
      motionRef.current.style.setProperty('--animation-iterations', iterations.toString());
      motionRef.current.style.setProperty('--animation-direction', direction);
      motionRef.current.style.setProperty('--rotation-degrees', `${rotationDegrees}deg`);

      const totalAnimationTime = (seconds + delay) * 1000;

      const timer = setTimeout(() => {
        if (onCompleteEvent) {
          window.dispatchEvent(new CustomEvent(onCompleteEvent));
        }
        onComplete?.();
      }, totalAnimationTime);

      return () => clearTimeout(timer);
    }
  }, [
    duration,
    delay,
    timingFunction,
    iterations,
    direction,
    rotationDegrees,
    path,
    speed,
    onCompleteEvent,
    onComplete,
  ]);

  useEffect(() => {
    if (motionRef.current) {
      motionRef.current.style.animationPlayState = isVisible ? 'running' : 'paused';
    }
  }, [isVisible]);

  return (
    <div className={styles.container}>
      <div
        ref={motionRef}
        className={enableRotation ? styles.motionWithRotation : styles.motion}
        style={{
          offsetPath: `path('${path}')`,
          offsetRotate: autoRotate ? 'auto' : '0deg',
        }}
      >
        {children}
      </div>
    </div>
  );
};
