import { useState } from 'react';

import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useAnimationFrame } from '@/utils/animation-helpers';

import { applyTransform } from './slider-transform.utils';

export type Side = 'left' | 'right';

interface UseSliderAnimationParams {
  speed?: number;
  side: Side;
  slides: (HTMLElement | null)[];
  translateX: React.RefObject<number[]>;
  updatePositions: (prevTranslateX: number[], delta: number) => number[];
  containerRef: React.RefObject<HTMLElement | null>;
}

interface UseSliderAnimationReturn {
  setCircularAnimationPaused: (paused: boolean) => void;
}

export const useSliderAnimation = ({
  speed,
  side,
  slides,
  translateX,
  updatePositions,
  containerRef,
}: UseSliderAnimationParams): UseSliderAnimationReturn => {
  const [isCircularAnimationPaused, setCircularAnimationPaused] = useState(false);

  const isVisible = useIntersectionObserver(containerRef, { threshold: 0 });

  const isAnimationActive = isVisible && !isCircularAnimationPaused && !!speed;

  useAnimationFrame(() => {
    const delta = side === 'left' ? -speed! : speed!;
    translateX.current = updatePositions(translateX.current, delta);
    applyTransform(slides, translateX.current);
  }, isAnimationActive);

  return { setCircularAnimationPaused };
};
