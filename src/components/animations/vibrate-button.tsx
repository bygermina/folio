import { useState } from 'react';
import { motion } from 'framer-motion';

import { BatteryIcon } from '@/components/animations/battery-icon';
import { useEvent } from '@/hooks/use-event';

import tailwindConfig from '../../../tailwind.config';
import { useScreenSizeContext } from '../providers/use-context';
import { Button } from '../basic/button/button';

interface VibrateButtonProps {
  onClick?: () => void;
  isCharging: boolean;
  isFull: boolean;
  level: number;
}

const glowColor = tailwindConfig.theme.extend.colors.cyan[400];

export const VibrateButton = ({ onClick, isCharging, isFull, level }: VibrateButtonProps) => {
  const { isPortrait } = useScreenSizeContext();

  const [isVibrating, setIsVibrating] = useState(false);

  useEvent('starAnimationComplete', () => {
    setIsVibrating(true);
  });

  return (
    <motion.div
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
      <Button size={isPortrait ? 'default' : 'lg'} className="btn-base btn-magic" onClick={onClick}>
        <div className="flex items-center gap-2">
          <BatteryIcon isCharging={isCharging} isFull={isFull} level={level} />
          <motion.span
            animate={
              isCharging
                ? {
                    textShadow: [
                      `0 0 5px ${glowColor}`,
                      `0 0 10px ${glowColor}`,
                      `0 0 15px ${glowColor}`,
                      `0 0 10px ${glowColor}`,
                      `0 0 5px ${glowColor}`,
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.5, repeat: isCharging ? Infinity : 0 }}
          >
            Magic button
          </motion.span>
        </div>
      </Button>
    </motion.div>
  );
};
