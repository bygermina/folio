import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Vibration } from '@/components/animations/vibration';
import { LabeledInput } from '@/components/basic/labeled-input';
import { Button } from '@/components/basic/button/button';

import type { LinkData } from '../constants';
import type { IconName } from './slide-content';

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
      <Vibration>
        <div className="mb-8 z-40">
          <Button
            variant="magic"
            onClick={() => setIsOpen(!isOpen)}
            className="hover:scale-105 active:scale-95"
          >
            {isOpen ? '✕ Close' : '⚙️ Configure Slider'}
          </Button>
        </div>
      </Vibration>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-32 right-6 z-40 w-80 max-h-[80vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border border-cyan-400/30 rounded-lg p-6 shadow-xl"
          >
            <h3 className="text-cyan-400 font-bold text-lg mb-4">Slider Configuration</h3>

            <div className="space-y-4">
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
                <label className="block text-slate-300 text-sm font-medium mb-2">Direction</label>
                <div className="flex gap-2">
                  <Button
                    variant="toggle"
                    isActive={side === 'left'}
                    onClick={() => setSide('left')}
                    className="flex-1"
                  >
                    ← Left
                  </Button>
                  <Button
                    variant="toggle"
                    isActive={side === 'right'}
                    onClick={() => setSide('right')}
                    className="flex-1"
                  >
                    Right →
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Slide Content
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {slides.map((slide, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/50 p-3 rounded border border-slate-700"
                    >
                      <div className="text-xs text-slate-400 mb-2">Slide {index + 1}</div>
                      <input
                        type="text"
                        value={slide.query}
                        onChange={(e) => handleSlideChange(index, 'query', e.target.value)}
                        placeholder="Slide text"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm mb-2 focus:outline-none focus:border-cyan-400"
                      />
                      <select
                        value={slide.image}
                        onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-200 text-sm focus:outline-none focus:border-cyan-400"
                      >
                        <option value="reactlogo">React Logo</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleApply} variant="primary" className="w-full">
                Apply Changes
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
