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
          <p className={styles.subtitle}>Configure slider to</p>
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
