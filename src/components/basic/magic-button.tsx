import { useState } from 'react';
import { motion } from 'framer-motion';

import { MagicLamp } from '@/components/animations/magic-lamp';
import { BatteryIcon } from '@/components/animations/battery-icon';
import { useEvent } from '@/hooks/use-event';

import tailwindConfig from '../../../tailwind.config';
import { useScreenSizeContext } from '../providers/use-context';
import { Button } from './button';

interface MagicButtonProps {
  onClick?: () => void;
}

const glowColor = tailwindConfig.theme.extend.colors.cyan[400];

export const MagicButton = ({
  onClick,
}: MagicButtonProps) => {
  const { isPortrait } = useScreenSizeContext();

  const [clickCount, setClickCount] = useState(5);
  const [isLampVisible, setIsLampVisible] = useState(false);

  const lampBrightness =
    clickCount <= 1
      ? 1
      : clickCount === 2
      ? 1.5
      : Math.max(0.3, 1.5 - (clickCount - 2) * 0.2);
  const isCharging = clickCount < 4;

  const handleClick = () => {
    if (isLampVisible) {
      setClickCount((prev) => prev >= 5 ? 0 : prev + 1);
      onClick?.();
    } else {
      setIsLampVisible(true);
      setClickCount(0);
    }
  };

  const [isVibrating, setIsVibrating] = useState(false);

  useEvent('starAnimationComplete', () => {
    setIsVibrating(true);
  });

  return (
    <>
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
        <Button
          size={isPortrait ? 'default' : 'lg'}
          className='btn-base btn-magic'
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            <BatteryIcon
              isCharging={isCharging}
              isFull={clickCount === 4}
              level={clickCount}
            />
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

      <MagicLamp
        isVisible={isLampVisible}
        brightness={lampBrightness}
      />
    </>
  );
};
