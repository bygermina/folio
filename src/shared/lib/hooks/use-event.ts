import { useEffect, useRef } from 'react';

import { useIntersectionObserver } from './use-intersection-observer';

export const useEvent = (
  event: string | undefined,
  callback: () => void,
  elementRef?: React.RefObject<HTMLElement | null>,
) => {
  const hasTriggered = useRef(false);
  const isIntersecting = useIntersectionObserver(elementRef || { current: null }, {
    threshold: 0.1,
    once: true,
  });

  useEffect(() => {
    if (!event && isIntersecting && !hasTriggered.current) {
      hasTriggered.current = true;
      callback();
    }
  }, [event, isIntersecting, callback]);

  useEffect(() => {
    if (!event) return;

    window.addEventListener(event, callback);

    return () => window.removeEventListener(event, callback);
  }, [event, callback]);
};
