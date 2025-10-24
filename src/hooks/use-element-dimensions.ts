import { useState, useEffect } from 'react';

type ViewportPosition = { x: number; y: number };

export type Dimensions = {
  width: number;
  height: number;
  viewport: ViewportPosition;
  bottomLeft: ViewportPosition;
  center: ViewportPosition;
  scale: number;
};

const getElementDimensions = (
  element: HTMLElement | null,
  baseHeight?: number,
  part: number = 0.5,
): Dimensions | null => {
  if (!element) return null;

  const rect = element?.getBoundingClientRect();

  const dimensions: Dimensions = {
    width: rect.width,
    height: rect.height,
    viewport: { x: rect.left, y: rect.top },
    bottomLeft: { x: rect.left, y: rect.bottom },
    center: {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * part,
    },
    scale: baseHeight ? rect.height / baseHeight : 1,
  };

  return dimensions;
};

const defaultDimensions = {
  width: 0,
  height: 0,
  viewport: { x: 0, y: 0 },
  bottomLeft: { x: 0, y: 0 },
  center: { x: 0, y: 0 },
  scale: 0,
};

export const useElementDimensions = (
  elementRef: React.RefObject<HTMLElement | null>,
  isContentReady?: boolean,
  baseHeight?: number,
  part: number = 0.5,
) => {
  const [dimensions, setDimensions] = useState<Dimensions>(structuredClone(defaultDimensions));

  useEffect(() => {
    if (!elementRef.current) return;

    const updateDimensions = () => {
      const newDimensions = getElementDimensions(elementRef.current, baseHeight, part);
      const value = newDimensions ?? structuredClone(defaultDimensions);

      setDimensions(value);
    };

    if (isContentReady !== false) {
      updateDimensions();
    }

    const resizeObserver = new ResizeObserver(updateDimensions);
    const mutationObserver = new MutationObserver(updateDimensions);

    resizeObserver.observe(elementRef.current);
    mutationObserver.observe(elementRef.current, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: false,
    });

    window.addEventListener('scroll', updateDimensions, { passive: true });
    window.addEventListener('resize', updateDimensions, { passive: true });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', updateDimensions);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [baseHeight, elementRef, isContentReady, part]);

  return dimensions;
};
