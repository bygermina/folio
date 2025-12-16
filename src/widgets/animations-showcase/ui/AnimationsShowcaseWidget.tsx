import { useEffect, useRef, useState, useTransition, useDeferredValue } from 'react';

import { Slider } from '@/shared/ui/slider/slider';
import { Typography } from '@/shared/ui/typography/typography';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import { SlideContent } from './slide-content';
import { SliderControls } from './slider-controls';
import { LINKS, SLIDE_WIDTH, type LinkData } from '../model/constants';

import styles from './animations-showcase.module.scss';

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
  (color) =>
    ({
      '--slider-color': color,
      '--slide-width-mobile': `${SLIDE_WIDTH.MOBILE}px`,
      '--slide-width-desktop': `${SLIDE_WIDTH.DESKTOP}px`,
    }) as React.CSSProperties,
);

type SliderConfig = {
  slides: LinkData[];
  speed: number;
  side: 'left' | 'right';
};

export const AnimationsShowcaseWidget = () => {
  const { isMobile } = useScreenSizeContext();
  const slideWidth = isMobile ? SLIDE_WIDTH.MOBILE : SLIDE_WIDTH.DESKTOP;
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const [, startTransition] = useTransition();
  const [sliderConfig, setSliderConfig] = useState<SliderConfig>({
    slides: LINKS,
    speed: 0.6,
    side: 'left',
  });

  const handleSliderConfigUpdate = (config: SliderConfig) => {
    startTransition(() => {
      setSliderConfig(config);
    });
  };

  const deferredSliderConfig = useDeferredValue(sliderConfig);

  const headingId = 'js-animations-heading';

  return (
    <section ref={containerRef} className={styles.root} aria-labelledby={headingId}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Typography id={headingId} variant="h2" size="3xl" weight="bold" className={styles.title}>
            Reusable components with JS animations
          </Typography>
          <Typography variant="body" className={styles.subtitle} color="muted">
            Configure your own slider
          </Typography>
        </div>
        <SliderControls
          onUpdate={handleSliderConfigUpdate}
          initialSlides={LINKS}
          initialSpeed={0.6}
          initialSide="left"
        />
        {SLIDER_INDICES.map((index) => (
          <div key={index} className={styles.sliderContainer} style={SLIDER_STYLES[index]}>
            <Slider<LinkData>
              slides={deferredSliderConfig.slides}
              speed={isVisible ? deferredSliderConfig.speed : 0}
              side={deferredSliderConfig.side}
              slideWidth={slideWidth}
              renderSlide={(item, index, setRef) => (
                <SlideContent key={index} ref={setRef} {...item} />
              )}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
