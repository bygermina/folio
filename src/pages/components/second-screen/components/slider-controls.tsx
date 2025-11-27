import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { WithVibration } from '@/components/animations/vibration';
import { LabeledInput } from '@/components/basic/input/labeled-input';
import { Button } from '@/components/basic/button/button';
import { Typography } from '@/components/basic/typography/typography';

import type { LinkData } from '../constants';
import type { IconName } from './slide-content';

import styles from './slider-controls.module.scss';

const SPEED_RANGE = {
  MIN: 0.1,
  MAX: 3,
  STEP: 0.1,
} as const;

interface SliderControlsProps {
  onUpdate: (config: { slides: LinkData[]; speed: number; side: 'left' | 'right' }) => void;
  initialSlides: LinkData[];
  initialSpeed: number;
  initialSide: 'left' | 'right';
}

export const SliderControls = ({
  onUpdate,
  initialSlides,
  initialSpeed,
  initialSide,
}: SliderControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [side, setSide] = useState<'left' | 'right'>(initialSide);
  const [slides, setSlides] = useState<LinkData[]>(initialSlides);

  useEffect(() => {
    const sliderSection = document.getElementById('js-animations');
    if (!sliderSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsOpen(false);
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(sliderSection);

    return () => {
      observer.unobserve(sliderSection);
    };
  }, []);

  const handleSlideChange = (index: number, field: 'query' | 'image', value: string) => {
    const newSlides = [...slides];
    newSlides[index] = {
      ...newSlides[index],
      [field]: value as IconName | string,
    };
    setSlides(newSlides);
  };

  const handleApply = () => {
    onUpdate({
      slides,
      speed,
      side,
    });
    setIsOpen(false);
  };

  return (
    <>
      <WithVibration>
        <div className={styles.root}>
          <Button
            variant="magic"
            onClick={() => setIsOpen(!isOpen)}
            className={styles.button}
            aria-expanded={isOpen}
            aria-controls="slider-configuration-panel"
          >
            {isOpen ? '✕ Close' : '⚙️ Configure Slider'}
          </Button>
        </div>
      </WithVibration>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={styles.panel}
            role="dialog"
            aria-modal="false"
            aria-labelledby="slider-configuration-title"
            id="slider-configuration-panel"
          >
            <Typography
              variant="h3"
              size="lg"
              weight="bold"
              color="primary"
              className={styles.title}
              id="slider-configuration-title"
            >
              Slider Configuration
            </Typography>

            <div className={styles.section}>
              <LabeledInput
                label="Speed"
                type="range"
                min={SPEED_RANGE.MIN}
                max={SPEED_RANGE.MAX}
                step={SPEED_RANGE.STEP}
                value={speed}
                valueDisplay={speed.toFixed(1)}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />

              <div>
                <Typography variant="label" className={styles.label} color="muted">
                  Direction
                </Typography>
                <div className={styles.directionGroup}>
                  <Button
                    variant="toggle"
                    isActive={side === 'left'}
                    onClick={() => setSide('left')}
                    className={styles.directionButton}
                  >
                    ← Left
                  </Button>
                  <Button
                    variant="toggle"
                    isActive={side === 'right'}
                    onClick={() => setSide('right')}
                    className={styles.directionButton}
                  >
                    Right →
                  </Button>
                </div>
              </div>

              <div>
                <Typography variant="label" className={styles.label} color="muted">
                  Slide Content
                </Typography>
                <div className={styles.slidesContainer}>
                  {slides.map((slide, index) => (
                    <div key={index} className={styles.slide}>
                      <Typography variant="caption" className={styles.slideIndex}>
                        Slide {index + 1}
                      </Typography>
                      <input
                        type="text"
                        value={slide.query}
                        onChange={(e) => handleSlideChange(index, 'query', e.target.value)}
                        placeholder="Slide text"
                        className={styles.input}
                      />
                      <select
                        value={slide.image}
                        onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                        className={styles.select}
                      >
                        <option value="reactlogo">React Logo</option>
                        <option value="typescript">TypeScript Logo</option>
                        <option value="nodejs">Node.js Logo</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleApply} variant="primary" className={styles.applyButton}>
                Apply Changes
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
