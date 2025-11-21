import { useCallback, useState, useRef, useEffect } from 'react';

import { Slider } from '@/components/basic/slider/slider';
import { Typography } from '@/components/basic/typography/typography';
import { useScreenSize } from '@/hooks/use-screen-size';

import { SlideContent } from './components/slide-content';
import { SliderControls } from './components/slider-controls';
import { LINKS, type LinkData } from './constants';

import styles from './second-screen.module.scss';

const SLIDE_WIDTH = {
  DESKTOP: 244,
  MOBILE: 200,
} as const;

const MOBILE_BREAKPOINT = 768;

const SLIDERS_COUNT = 6;

const SLIDER_COLORS = [
  '#06B6D4', // cyan-400
  '#3B82F6', // blue-400
  '#A855F7', // purple-500
  '#6366F1', // indigo-500
  '#7DD3FC', // sky-300
  '#8B5CF6', // purple-400 (custom)
] as const;

const SLIDER_INDICES = Array.from({ length: SLIDERS_COUNT }, (_, i) => i);
const SLIDER_STYLES = SLIDER_COLORS.map(
  (color) => ({ '--slider-color': color }) as React.CSSProperties,
);

const DEFAULT_SLIDER_CONFIG = {
  slides: LINKS,
  speed: 0.6,
  side: 'left' as const,
};

const TitleSection = () => (
  <div className={styles.header}>
    <Typography variant="h2" size="3xl" weight="bold" className={styles.title}>
      Reusable components with JS animations
    </Typography>
    <Typography variant="body" className={styles.subtitle} color="muted">
      Configure your own slider
    </Typography>
  </div>
);

export const SecondScreen = () => {
  const { screenWidth } = useScreenSize();
  const slideWidth = screenWidth > MOBILE_BREAKPOINT ? SLIDE_WIDTH.DESKTOP : SLIDE_WIDTH.MOBILE;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting && entry.intersectionRatio > 0.1);
      },
      { threshold: [0, 0.1, 0.5, 1], rootMargin: '0px' },
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const [sliderConfig, setSliderConfig] = useState<{
    slides: LinkData[];
    speed: number;
    side: 'left' | 'right';
  }>(DEFAULT_SLIDER_CONFIG);

  const renderSlide = useCallback(
    (item: LinkData, index: number, setRef: (el: HTMLElement | null) => void) => (
      <SlideContent key={index} ref={setRef} {...item} />
    ),
    [],
  );

  return (
    <div ref={containerRef} className={styles.root}>
      <div className={styles.content}>
        <TitleSection />
        <SliderControls
          onUpdate={setSliderConfig}
          initialSlides={DEFAULT_SLIDER_CONFIG.slides}
          initialSpeed={DEFAULT_SLIDER_CONFIG.speed}
          initialSide={DEFAULT_SLIDER_CONFIG.side}
        />
        {SLIDER_INDICES.map((index) => (
          <div key={index} className={styles.sliderContainer} style={SLIDER_STYLES[index]}>
            <Slider<LinkData>
              slides={sliderConfig.slides}
              speed={isVisible ? sliderConfig.speed : 0}
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
