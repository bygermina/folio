import { useCallback, useState } from 'react';

import { Slider } from '@/components/basic/slider/slider';
import { useScreenSize } from '@/hooks/use-screen-size';

import { SlideContent } from './components/slide-content';
import { SliderControls } from './components/slider-controls';
import { LINKS, type LinkData } from './constants';

const SLIDE_WIDTH = {
  DESKTOP: 244,
  MOBILE: 200,
} as const;

export const SecondScreen = () => {
  const { screenWidth } = useScreenSize();
  const slideWidth = screenWidth > 700 ? SLIDE_WIDTH.DESKTOP : SLIDE_WIDTH.MOBILE;

  const [sliderConfig, setSliderConfig] = useState<{
    slides: LinkData[];
    speed: number;
    side: 'left' | 'right';
  }>({
    slides: LINKS,
    speed: 0.6,
    side: 'left',
  });

  const renderSlide = useCallback(
    (item: LinkData, index: number, setRef: (el: HTMLElement | null) => void) => (
      <SlideContent key={index} ref={setRef} {...item} />
    ),
    [],
  );

  return (
    <div className="relative z-[1] pt-0 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            reusable customizable components Add sliders with JS animations
          </h2>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-2">
            Reusable blocks with JS animations
          </p>
        </div>
        <SliderControls
          onUpdate={setSliderConfig}
          initialSlides={LINKS}
          initialSpeed={0.6}
          initialSide="left"
        />
        <div data-slider>
          <Slider<LinkData>
            slides={sliderConfig.slides}
            speed={sliderConfig.speed}
            side={sliderConfig.side}
            slideWidth={slideWidth}
            renderSlide={renderSlide}
          />
        </div>
      </div>
    </div>
  );
};
