import { useEffect, useRef, type ReactNode } from 'react';

import { getPathLength } from '@/utils/svg';

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
}

export const CSSPathMotion: React.FC<CSSPathMotionProps> = ({
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
}) => {
  const motionRef = useRef<HTMLDivElement>(null);
  const computedDurationRef = useRef<number>(duration);

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

export default CSSPathMotion;
