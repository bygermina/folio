import { useState } from 'react';

import { MagicLamp } from '@/components/animations/magic-lamp';
import { VibrateButton } from '@/components/animations/vibrate-button';

interface MagicButtonProps {
  onClick?: () => void;
}

export const MagicButton = ({ onClick }: MagicButtonProps) => {
  const [clickCount, setClickCount] = useState(5);
  const [isLampVisible, setIsLampVisible] = useState(false);

  const lampBrightness =
    clickCount <= 1 ? 1 : clickCount === 2 ? 1.5 : Math.max(0.3, 1.5 - (clickCount - 2) * 0.2);
  const isCharging = clickCount < 4;

  const handleClick = () => {
    if (isLampVisible) {
      setClickCount((prev) => (prev >= 5 ? 0 : prev + 1));
      onClick?.();
    } else {
      setIsLampVisible(true);
      setClickCount(0);
    }
  };

  return (
    <>
      <VibrateButton
        onClick={handleClick}
        isCharging={isCharging}
        isFull={clickCount === 4}
        level={clickCount}
      />

      <MagicLamp isVisible={isLampVisible} brightness={lampBrightness} />
    </>
  );
};
