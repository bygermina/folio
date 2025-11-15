import { useEffect, useRef } from 'react';

export const useEvent = (
  event: string | undefined,
  callback: () => void,
  elementRef?: React.RefObject<HTMLElement | null>,
) => {
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!event) {
      if (!elementRef?.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasTriggered.current) {
            hasTriggered.current = true;
            callback();
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(elementRef.current);

      return () => {
        observer.disconnect();
      };
    }

    window.addEventListener(event, callback);

    return () => window.removeEventListener(event, callback);
  }, [event, callback, elementRef]);
};
