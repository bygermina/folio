import { useState, useTransition, type RefObject } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { WithVibration } from '@/shared/ui/animation/vibration';
import { LabeledInput } from '@/shared/ui/input/labeled-input';
import { Button } from '@/shared/ui/button/button';
import { Typography } from '@/shared/ui/typography/typography';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';

import { DirectionToggle } from './direction-toggle';
import { SlideInputs } from './slide-inputs';
import type { LinkData } from '../model/constants';
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
  sectionRef: RefObject<HTMLElement | null>;
}

export const SliderControls = ({
  onUpdate,
  initialSlides,
  initialSpeed,
  initialSide,
  sectionRef,
}: SliderControlsProps) => {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [side, setSide] = useState<'left' | 'right'>(initialSide);
  const [slides, setSlides] = useState<LinkData[]>(initialSlides);

  const isInView = useIntersectionObserver(sectionRef, { threshold: 0.01 });

  if (!isInView && isOpen) setIsOpen(false);

  const handleSlideChange = (index: number, field: 'query' | 'image', value: string) => {
    const newSlides = [...slides];
    newSlides[index] = {
      ...newSlides[index],
      [field]: value as IconName | string,
    };
    setSlides(newSlides);
  };

  const handleApply = () => {
    startTransition(() => {
      onUpdate({ slides, speed, side });
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

              <DirectionToggle side={side} onSideChange={setSide} />

              <div>
                <Typography variant="label" className={styles.label} color="muted">
                  Slide Content
                </Typography>
                <SlideInputs slides={slides} onSlideChange={handleSlideChange} />
              </div>

              <Button
                onClick={handleApply}
                variant="primary"
                className={styles.applyButton}
                disabled={isPending}
              >
                {isPending ? 'Applying...' : 'Apply Changes'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
