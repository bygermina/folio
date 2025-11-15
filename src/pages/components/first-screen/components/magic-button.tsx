import { useState } from 'react';

import { MagicLamp } from '@/components/animations/magic-lamp';
import { Button } from '@/components/basic/button/button';
import { Vibration } from '@/components/animations/vibration';
import { useScreenSizeContext } from '@/components/providers/use-context';
import { BatteryIcon } from '@/components/animations/battery-icon';

interface MagicButtonProps {
  onClick?: () => void;
}

export const MagicButton = ({ onClick }: MagicButtonProps) => {
  const [clickCount, setClickCount] = useState(5);
  const [isLampVisible, setIsLampVisible] = useState(false);
  const { isPortrait } = useScreenSizeContext();

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
      <Vibration startEvent="starAnimationComplete">
        <Button
          size={isPortrait ? 'default' : 'lg'}
          className="btn-base btn-magic"
          onClick={handleClick}
        >
          <div className="flex items-center gap-2">
            <BatteryIcon isCharging={isCharging} isFull={clickCount === 4} level={clickCount} />
            Magic button
          </div>
        </Button>
      </Vibration>

      <MagicLamp isVisible={isLampVisible} brightness={lampBrightness} />
    </>
  );
};
