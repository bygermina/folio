import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  applyTransform,
  getInitialSlides,
  getStartState,
  type Side,
  useSlider,
  useAnimation,
  updateInfiniteScrollPositions,
} from './slider.utils';

import { useScreenSize } from '@/hooks/use-screen-size';
import { useElementSize } from '@/hooks/use-element-size';

export type SetLinksRefs = (index: number) => (el: HTMLElement | null) => void;

interface SliderProps<T> {
  speed?: number;
  side?: Side;
  slides: T[];
  slideWidth: number;
  renderSlide: (
    item: T,
    index: number,
    setRef: (el: HTMLElement | null) => void,
  ) => React.ReactNode;
}

export const Slider = <T,>({
  speed,
  side = 'left',
  slides,
  slideWidth,
  renderSlide,
}: SliderProps<T>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slidesContainerRef = useRef<HTMLDivElement | null>(null);
  const slidesRefs = useRef<(HTMLElement | null)[]>([]);
  const translateX = useRef<number[]>([]);

  const { screenWidth } = useScreenSize();
  const containerSize = useElementSize(containerRef);
  const slidesContainerSize = useElementSize(slidesContainerRef);

  const containerAdjustedSlides = useMemo(() => {
    const effectiveWidth = containerSize.width || 600;

    return getInitialSlides<T>(slides, effectiveWidth, slideWidth);
  }, [containerSize.width, slides, slideWidth]);

  const slidesNumber = containerAdjustedSlides.length;

  const gap = (slidesContainerSize.width - slidesNumber * slideWidth) / (slidesNumber - 1);

  const updatePositions = useMemo(
    () => updateInfiniteScrollPositions(slidesRefs.current, containerSize, slidesNumber, gap),
    [containerSize, slidesNumber, gap],
  );

  const { setCircularAnimationPaused } = useAnimation({
    speed,
    side,
    slides: slidesRefs.current,
    translateX,
    updatePositions,
  });

  const { domActions, stopAnimation } = useSlider({
    setCircularAnimationPaused,
    translateX,
    slides: slidesRefs.current,
    containerRef,
    updatePositions,
  });

  useEffect(() => {
    const resetSlider = () => {
      stopAnimation();
      translateX.current = getStartState(slidesNumber);
      applyTransform(slidesRefs.current, translateX.current);
    };
    resetSlider();
  }, [screenWidth, slidesNumber, stopAnimation]);

  const setLinkRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      slidesRefs.current[index] = element;
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-screen my-[-10px] py-[10px] overflow-hidden [touch-action:pan-x]"
      {...domActions}
    >
      <div ref={slidesContainerRef} className="flex flex-row gap-4 w-fit">
        {containerAdjustedSlides.map((item, index) => renderSlide(item, index, setLinkRef(index)))}
      </div>
    </div>
  );
};
