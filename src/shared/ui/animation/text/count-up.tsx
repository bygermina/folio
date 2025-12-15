import { useEffect, useState, useRef } from 'react';

import { useAnimationFrame } from '@/shared/lib/animation-helpers';

interface CountUpProps {
  end: number;
  duration?: number;
  start?: boolean;
}

export const CountUp = ({ end, duration = 2000, start = true }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (start) {
      startTimeRef.current = null;
      setCount(0);
    }
  }, [start, end, duration]);

  useAnimationFrame(() => {
    if (!start) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
      return;
    }

    const progress = performance.now() - startTimeRef.current;
    const percentage = Math.min(progress / duration, 1);
    const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

    setCount(Math.floor(end * easeOut));

    if (percentage >= 1) {
      setCount(end);
    }
  }, start);

  return <>{count.toLocaleString()}</>;
};
