import { useState, useCallback, useEffect, type KeyboardEvent } from 'react';

import { cn } from '@/shared/lib/cn';
import { useTimeout } from '@/shared/lib/animation-helpers';

import styles from './row.module.scss';

export interface DataCardProps {
  value: number;
  onToggle?: () => void;
  className?: string;
}

export const DataCard = ({ value, onToggle, className }: DataCardProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    setHasEntered(true);
  }, []);

  const handleActivate = useCallback(() => {
    setIsSelected(true);
    onToggle?.();
  }, [onToggle]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') handleActivate();
    },
    [handleActivate],
  );

  useTimeout(
    () => {
      setIsSelected(false);
    },
    isSelected ? 200 : null,
  );

  return (
    <div
      className={cn(
        styles.dataCard,
        {
          [styles.dataCardSelected]: isSelected,
          [styles.dataCardEntered]: hasEntered,
          [styles.dataCardOne]: value === 1,
          [styles.dataCardZero]: value === 0,
        },
        className,
      )}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      data-role="data-card"
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
    >
      {value}
    </div>
  );
};
