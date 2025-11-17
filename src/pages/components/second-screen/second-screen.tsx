import { useCallback, useState } from 'react';

import { Slider } from '@/components/basic/slider/slider';
import { useScreenSize } from '@/hooks/use-screen-size';

import { SlideContent } from './components/slide-content';
import { SliderControls } from './components/slider-controls';
import { LINKS, type LinkData } from './constants';

import styles from './second-screen.module.scss';

const SLIDE_WIDTH = {
  DESKTOP: 244,
  MOBILE: 200,
} as const;

const SLIDERS_COUNT = 6;

const SLIDER_COLORS = [
  '#06B6D4', // cyan-400
  '#3B82F6', // blue-400
  '#A855F7', // purple-500
  '#6366F1', // indigo-500
  '#7DD3FC', // sky-300
  '#8B5CF6', // purple-400 (custom)
] as const;

export const SecondScreen = () => {
  const { screenWidth } = useScreenSize();
  const slideWidth = screenWidth > 768 ? SLIDE_WIDTH.DESKTOP : SLIDE_WIDTH.MOBILE;

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
    <div className={styles.root}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Reusable components with JS animations</h2>
          <p className={styles.subtitle}>Configure your own slider</p>
        </div>
        <SliderControls
          onUpdate={setSliderConfig}
          initialSlides={LINKS}
          initialSpeed={0.6}
          initialSide="left"
        />
        {Array.from({ length: SLIDERS_COUNT }).map((_, index) => (
          <div
            key={index}
            className={styles.sliderContainer}
            style={{ '--slider-color': SLIDER_COLORS[index] } as React.CSSProperties}
          >
            <Slider<LinkData>
              slides={sliderConfig.slides}
              speed={sliderConfig.speed}
              side={sliderConfig.side}
              slideWidth={slideWidth}
              renderSlide={renderSlide}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
