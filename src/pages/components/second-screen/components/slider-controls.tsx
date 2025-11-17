import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { WithVibration } from '@/components/animations/vibration';
import { LabeledInput } from '@/components/basic/input/labeled-input';
import { Button } from '@/components/basic/button/button';

import type { LinkData } from '../constants';
import type { IconName } from './slide-content';

import styles from './slider-controls.module.scss';

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
          <Button variant="magic" onClick={() => setIsOpen(!isOpen)} className={styles.button}>
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
          >
            <h3 className={styles.title}>Slider Configuration</h3>

            <div className={styles.section}>
              <LabeledInput
                label="Speed"
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={speed}
                valueDisplay={speed.toFixed(1)}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />

              <div>
                <label className={styles.label}>Direction</label>
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
                <label className={styles.label}>Slide Content</label>
                <div className={styles.slidesContainer}>
                  {slides.map((slide, index) => (
                    <div key={index} className={styles.slide}>
                      <div className={styles.slideIndex}>Slide {index + 1}</div>
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
