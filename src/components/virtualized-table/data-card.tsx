import { memo, useState, useCallback } from 'react';

import { cn } from '@/utils/cn';

import styles from './row.module.scss';

export interface DataCardProps {
  value: number;
  onToggle?: () => void;
  isFlashing?: boolean;
  className?: string;
}

export const DataCard = memo(
  ({ value, onToggle, isFlashing = false, className }: DataCardProps) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = useCallback(() => {
      setIsSelected(true);
      onToggle?.();

      setTimeout(() => setIsSelected(false), 200);
    }, [onToggle]);

    return (
      <div
        className={cn(
          styles.dataCard,
          isSelected && styles.dataCardSelected,
          isFlashing && styles.dataCardFlash,
          className,
        )}
        onClick={handleClick}
      >
        {value}
      </div>
    );
  },
);
