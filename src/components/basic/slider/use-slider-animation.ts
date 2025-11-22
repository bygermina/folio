import { useEffect, useState } from 'react';

import { useElementVisible } from '@/hooks/use-element-visible';
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

  const isVisible = useElementVisible(containerRef);

  useEffect(() => {
    setCircularAnimationPaused(!isVisible);
  }, [isVisible]);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const animate = () => {
      if (isCircularAnimationPaused || !speed) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        return;
      }

      const delta = side === 'left' ? -speed : speed;
      translateX.current = updatePositions(translateX.current, delta);
      applyTransform(slides, translateX.current);

      animationFrameId = requestAnimationFrame(animate);
    };

    if (!isCircularAnimationPaused && speed) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isCircularAnimationPaused, side, speed, translateX, slides, updatePositions]);

  return { setCircularAnimationPaused };
};
