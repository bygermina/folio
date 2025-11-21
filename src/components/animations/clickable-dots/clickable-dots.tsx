import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/utils/cn';

import styles from './clickable-dots.module.scss';

interface Dot {
  id: string;
  x: number;
  y: number;
  isHighlighted: boolean;
}

interface ClickableDotsProps {
  className?: string;
}

export const ClickableDots = ({ className }: ClickableDotsProps) => {
  const [dots, setDots] = useState<Dot[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRandomPosition = () => {
    if (!containerRef.current) return { x: 50, y: 50 };

    const container = containerRef.current;
    const size = 12;
    const padding = size;

    // Batch reads to avoid forced reflow
    const rect = container.getBoundingClientRect();
    const width = rect.width || container.clientWidth;
    const height = rect.height || container.clientHeight;

    return {
      x: Math.random() * (width - padding * 2) + padding,
      y: Math.random() * (height - padding * 2) + padding,
    };
  };

  const addDot = () => {
    // Defer dimension read until after layout to avoid forced reflow
    requestAnimationFrame(() => {
      const position = getRandomPosition();
      const newDot: Dot = {
        id: `dot-${Date.now()}-${Math.random()}`,
        x: position.x,
        y: position.y,
        isHighlighted: true,
      };

      setDots((prev) => {
        const updated = prev.map((dot) => ({ ...dot, isHighlighted: false }));
        return [...updated, newDot];
      });
    });
  };

  const handleDotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addDot();
  };

  useEffect(() => {
    if (containerRef.current) {
      addDot();
    }
  }, []);

  return (
    <div ref={containerRef} className={cn(styles.container, className)}>
      <AnimatePresence>
        {dots.map((dot) => (
          <motion.div
            key={dot.id}
            className={cn(styles.dot, dot.isHighlighted && styles.highlighted)}
            style={{
              left: `${dot.x}px`,
              top: `${dot.y}px`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={handleDotClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
