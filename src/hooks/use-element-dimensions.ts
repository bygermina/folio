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
  container?: HTMLElement | null,
): Dimensions | null => {
  if (!element) return null;

  const rect = element?.getBoundingClientRect();
  const containerRect = container?.getBoundingClientRect();
  const offsetLeft = containerRect ? containerRect.left : 0;
  const offsetTop = containerRect ? containerRect.top : 0;

  const dimensions: Dimensions = {
    width: rect.width,
    height: rect.height,
    viewport: { x: rect.left, y: rect.top },
    bottomLeft: { x: rect.left - offsetLeft, y: rect.bottom - offsetTop },
    center: {
      x: rect.left - offsetLeft + rect.width * 0.5,
      y: rect.top - offsetTop + rect.height * part,
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

const EPSILON = 0.01; // Погрешность для сравнения чисел

const areDimensionsEqual = (a: Dimensions, b: Dimensions): boolean => {
  if (Math.abs(a.width - b.width) > EPSILON) return false;
  if (Math.abs(a.height - b.height) > EPSILON) return false;
  if (Math.abs(a.scale - b.scale) > EPSILON) return false;
  if (Math.abs(a.viewport.x - b.viewport.x) > EPSILON) return false;
  if (Math.abs(a.viewport.y - b.viewport.y) > EPSILON) return false;
  if (Math.abs(a.bottomLeft.x - b.bottomLeft.x) > EPSILON) return false;
  if (Math.abs(a.bottomLeft.y - b.bottomLeft.y) > EPSILON) return false;
  if (Math.abs(a.center.x - b.center.x) > EPSILON) return false;
  if (Math.abs(a.center.y - b.center.y) > EPSILON) return false;
  return true;
};

export const useElementDimensions = (
  elementRef: React.RefObject<HTMLElement | null>,
  isContentReady?: boolean,
  baseHeight?: number,
  part: number = 0.5,
  containerRef?: React.RefObject<HTMLElement | null>,
) => {
  const [dimensions, setDimensions] = useState<Dimensions>(structuredClone(defaultDimensions));

  useEffect(() => {
    if (!elementRef.current) return;

    const updateDimensions = () => {
      const newDimensions = getElementDimensions(
        elementRef.current,
        baseHeight,
        part,
        containerRef?.current ?? undefined,
      );
      const value = newDimensions ?? structuredClone(defaultDimensions);

      setDimensions((prevDimensions) => {
        if (areDimensionsEqual(prevDimensions, value)) {
          return prevDimensions;
        }
        return value;
      });
    };

    if (isContentReady !== false) {
      updateDimensions();
    }

    const resizeObserver = new ResizeObserver(updateDimensions);

    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updateDimensions);
    });

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
  }, [baseHeight, elementRef, isContentReady, part, containerRef]);

  return dimensions;
};
