import { useCallback, useEffect, useRef } from 'react';

import { applyTransform } from './slider-transform.utils';

const FRICTION = 0.95;
const VELOCITY_STOP_THRESHOLD = 0.5;
const VELOCITY_ANIMATE_THRESHOLD = 2;
const VELOCITY_MULTIPLIER = 25;

interface UseSliderDragParams {
  setCircularAnimationPaused: (paused: boolean) => void;
  translateX: React.RefObject<number[]>;
  slides: (HTMLElement | null)[];
  containerRef: React.RefObject<HTMLElement | null>;
  updatePositions: (prevTranslateX: number[], delta: number) => number[];
}

interface UseSliderDragReturn {
  domActions: {
    onTouchStart: (e: React.TouchEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchEnd: () => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onMouseEnter: () => void;
  };
  stopAnimation: () => void;
}

export const useSliderDrag = ({
  setCircularAnimationPaused,
  translateX,
  slides,
  containerRef,
  updatePositions,
}: UseSliderDragParams): UseSliderDragReturn => {
  const lastMoveX = useRef(0);
  const isDragging = useRef(false);
  const lastMoveTime = useRef(performance.now());
  const velocity = useRef(0);
  const animationId = useRef<number | null>(null);
  const isInertionAnimationRunning = useRef(false);

  const stopAnimation = useCallback(() => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
    }
    animationId.current = null;
    isInertionAnimationRunning.current = false;
    isDragging.current = false;
    velocity.current = 0;
    lastMoveX.current = 0;

    setCircularAnimationPaused(false);
  }, [setCircularAnimationPaused]);

  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  const onPointerStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const isTouchEvent = 'touches' in e;
      if (isTouchEvent && e.touches.length !== 1) return;

      const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;

      stopAnimation();
      setCircularAnimationPaused(true);
      isDragging.current = true;

      lastMoveTime.current = performance.now();
      lastMoveX.current = clientX;
      velocity.current = 0;
    },
    [setCircularAnimationPaused, stopAnimation],
  );

  const onPointerEnd = useCallback(() => {
    isDragging.current = false;
    let delta = velocity.current;

    const animate = () => {
      if (Math.abs(delta) > VELOCITY_STOP_THRESHOLD) {
        delta *= FRICTION;

        translateX.current = updatePositions(translateX.current, delta);
        applyTransform(slides, translateX.current);

        animationId.current = requestAnimationFrame(animate);
      } else {
        stopAnimation();
      }
    };

    if (Math.abs(delta) > VELOCITY_ANIMATE_THRESHOLD) {
      isInertionAnimationRunning.current = true;
      animate();
    } else {
      stopAnimation();
    }
  }, [updatePositions, stopAnimation, slides, translateX]);

  const onPointerMove = useCallback(
    (e: Event) => {
      if (!isDragging.current) return;

      if (e.cancelable) {
        e.preventDefault();
      }

      const isTouchEvent = e instanceof TouchEvent;
      if (isTouchEvent && e.touches.length !== 1) return;

      const clientX = isTouchEvent ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const delta = clientX - lastMoveX.current;

      lastMoveX.current = clientX;

      translateX.current = updatePositions(translateX.current, delta);
      applyTransform(slides, translateX.current);

      const now = performance.now();
      const dt = now - lastMoveTime.current;

      velocity.current = (delta / dt) * VELOCITY_MULTIPLIER;
      lastMoveTime.current = now;
    },
    [translateX, slides, updatePositions],
  );

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    container.addEventListener('touchmove', onPointerMove as EventListener, { passive: false });
    container.addEventListener('mousemove', onPointerMove as EventListener, { passive: false });

    const handlePointerEnd = () => {
      if (isDragging.current) {
        onPointerEnd();
      }
    };

    document.addEventListener('touchend', handlePointerEnd);
    document.addEventListener('mouseup', handlePointerEnd);

    return () => {
      container.removeEventListener('touchmove', onPointerMove as EventListener);
      container.removeEventListener('mousemove', onPointerMove as EventListener);

      document.removeEventListener('touchend', handlePointerEnd);
      document.removeEventListener('mouseup', handlePointerEnd);
    };
  }, [containerRef, onPointerMove, onPointerEnd]);

  const onMouseEnter = useCallback(() => {
    setCircularAnimationPaused(true);
  }, [setCircularAnimationPaused]);

  const onMouseLeave = useCallback(() => {
    setCircularAnimationPaused(false);
  }, [setCircularAnimationPaused]);

  return {
    domActions: {
      onTouchStart: onPointerStart,
      onMouseDown: onPointerStart,
      onTouchEnd: onPointerEnd,
      onMouseUp: onPointerEnd,
      onMouseEnter,
      onMouseLeave,
    },
    stopAnimation,
  };
};
