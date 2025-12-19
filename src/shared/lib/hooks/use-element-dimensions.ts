import { useEffect, useRef, useState } from 'react';

type ViewportPosition = { x: number; y: number };

export type Dimensions = {
  width: number;
  height: number;
  bottomLeft: ViewportPosition;
  center: ViewportPosition;
  scale: number;
};

const getElementDimensions = (
  element: HTMLElement,
  baseHeight: number | undefined,
  part: number,
  container: HTMLElement | null | undefined,
): Dimensions => {
  const rect = element.getBoundingClientRect();
  const containerRect = container?.getBoundingClientRect();
  const offsetLeft = containerRect?.left ?? 0;
  const offsetTop = containerRect?.top ?? 0;
  const left = rect.left - offsetLeft;
  const top = rect.top - offsetTop;

  return {
    width: rect.width,
    height: rect.height,
    bottomLeft: { x: left, y: rect.bottom - offsetTop },
    center: {
      x: left + rect.width * 0.5,
      y: top + rect.height * part,
    },
    scale: baseHeight ? rect.height / baseHeight : 1,
  };
};

const defaultDimensions: Dimensions = {
  width: 0,
  height: 0,
  bottomLeft: { x: 0, y: 0 },
  center: { x: 0, y: 0 },
  scale: 0,
};

const EPSILON = 0.9;

const areEqual = (a: number, b: number): boolean => Math.abs(a - b) <= EPSILON;

const areSizesEqual = (a: Dimensions, b: Dimensions): boolean =>
  areEqual(a.width, b.width) && areEqual(a.height, b.height) && areEqual(a.scale, b.scale);

export const useElementDimensions = (
  elementRef: React.RefObject<HTMLElement | null>,
  isContentReady: boolean = true,
  baseHeight?: number,
  part: number = 0.5,
  containerRef?: React.RefObject<HTMLElement | null>,
) => {
  const [dimensions, setDimensions] = useState<Dimensions>(defaultDimensions);
  const prevDimensions = useRef<Dimensions>(defaultDimensions);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateDimensions = () => {
      const newDimensions = getElementDimensions(element, baseHeight, part, containerRef?.current);
      const sizesChanged = !areSizesEqual(prevDimensions.current, newDimensions);
      prevDimensions.current = newDimensions;

      if (sizesChanged) setDimensions(newDimensions);
    };

    if (isContentReady) updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);

    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updateDimensions);
    });

    resizeObserver.observe(element);
    mutationObserver.observe(element, {
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
