import { useRef, useEffect } from 'react';

export const normalizeScrollProgress = (
  progress: number,
  scrollStart: number = 0,
  scrollEnd: number = 1,
): number => {
  return Math.max(0, Math.min(1, (progress - scrollStart) / (scrollEnd - scrollStart || 1)));
};

export const useTimeout = (callback: () => void, delay: number | null) => {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    if (delay === null) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [delay]);
};

export const useAnimationFrame = (callback: () => void, isActive: boolean = true) => {
  const callbackRef = useRef(callback);
  const rafRef = useRef<number | null>(null);

  callbackRef.current = callback;

  useEffect(() => {
    if (!isActive) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const animate = () => {
      callbackRef.current();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isActive]);
};


