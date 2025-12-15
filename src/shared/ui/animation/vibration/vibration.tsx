import { useState, useRef, type ReactNode } from 'react';

import { motion } from 'framer-motion';

import { useEvent } from '@/shared/lib/hooks/use-event';

export interface WithVibrationProps {
  children: ReactNode;
  startEvent?: string;
}

export const WithVibration = ({ startEvent, children }: WithVibrationProps) => {
  const [isVibrating, setIsVibrating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEvent(
    startEvent,
    () => {
      setIsVibrating(true);
    },
    containerRef,
  );

  return (
    <motion.div
      ref={containerRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={
        isVibrating
          ? {
              x: [0, -2, 2, -2, 2, -1, 1, 0],
              rotate: [0, -1, 1, -1, 1, 0],
            }
          : { x: 0, rotate: 0 }
      }
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
        x: {
          duration: 0.6,
          ease: 'easeInOut',
          repeat: isVibrating ? Infinity : 0,
          repeatType: 'loop',
          repeatDelay: 5,
        },
        rotate: {
          duration: 0.6,
          ease: 'easeInOut',
          repeat: isVibrating ? Infinity : 0,
          repeatType: 'loop',
          repeatDelay: 5,
        },
      }}
    >
      {children}
    </motion.div>
  );
};
