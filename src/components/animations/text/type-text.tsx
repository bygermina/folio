import { motion } from 'framer-motion';
import { useEffect, useState, forwardRef } from 'react';

import { TextWithTargetLetter } from './displayed-text';

interface TypeTextProps {
  text: string;
  targetLetterIndex?: number; // Index of the letter for reference
  className?: string;
  delay?: number;
  speed?: number;
  opacity?: number;
}

export const TypeText = forwardRef<HTMLSpanElement, TypeTextProps>(
  ({ text, targetLetterIndex, className = '', delay = 0, speed = 0.1, opacity = 100 }, ref) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      setDisplayedText('');
      setCurrentIndex(0);
    }, [text]);

    useEffect(() => {
      if (currentIndex >= text.length) return;

      const timer = setTimeout(
        () => {
          setDisplayedText((prev) => prev + text[currentIndex]);
          setCurrentIndex(currentIndex + 1);
        },
        currentIndex === 0 ? delay * 1000 : speed * 1000,
      );

      return () => clearTimeout(timer);
    }, [currentIndex, text, delay, speed]);

    return (
      <span className={className}>
        <TextWithTargetLetter
          ref={ref}
          opacity={opacity}
          text={displayedText}
          targetLetterIndex={targetLetterIndex}
        />
        {currentIndex < text.length && displayedText && (
          <motion.span
            className="ml-1 inline-block h-[1em] w-0.5 bg-blue-500"
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          />
        )}
      </span>
    );
  },
);
