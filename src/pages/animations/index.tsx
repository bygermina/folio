import { useRef, useState, useTransition, useDeferredValue } from 'react';

import { Slider } from '@/shared/ui/slider/slider';
import { Typography } from '@/shared/ui/typography/typography';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';
import { SlideContent } from '@/widgets/animations-showcase/ui/slide-content';
import { SliderControls } from '@/widgets/animations-showcase/ui/slider-controls';
import { LINKS, SLIDE_WIDTH, type LinkData } from '@/widgets/animations-showcase/model/constants';

import styles from './index.module.scss';
import widgetStyles from '@/widgets/animations-showcase/ui/animations-showcase.module.scss';

const SLIDERS_COUNT = 6;

const SLIDER_COLORS = [
  '#3B82F6', // blue-400
  '#2563EB', // blue-500
  '#1D4ED8', // blue-600
  '#60A5FA', // blue-400 lighter
  '#93C5FD', // blue-300
  '#DBEAFE', // blue-200
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

interface SliderConfig {
  slides: LinkData[];
  speed: number;
  side: 'left' | 'right';
}

const AnimationsPage = () => {
  const { isMobile } = useScreenSizeContext();
  const slideWidth = isMobile ? SLIDE_WIDTH.MOBILE : SLIDE_WIDTH.DESKTOP;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isVisible = useIntersectionObserver(containerRef, { threshold: 0.1 });

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
    <div className={styles.content}>
      <section ref={containerRef} className={widgetStyles.root} aria-labelledby={headingId}>
        <div className={widgetStyles.content}>
          <div className={widgetStyles.header}>
            <Typography
              id={headingId}
              variant="h2"
              size="3xl"
              weight="bold"
              className={widgetStyles.title}
            >
              Reusable components with JS animations
            </Typography>
            <Typography variant="body" className={widgetStyles.subtitle} color="muted">
              Configure your own slider
            </Typography>
          </div>
          <SliderControls
            onUpdate={handleSliderConfigUpdate}
            initialSlides={LINKS}
            initialSpeed={0.6}
            initialSide="left"
            sectionRef={containerRef}
          />
          {SLIDER_INDICES.map((index) => (
            <div key={index} className={widgetStyles.sliderContainer} style={SLIDER_STYLES[index]}>
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
    </div>
  );
};

export default AnimationsPage;
