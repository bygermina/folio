import { memo, useState, useCallback, useEffect, useRef } from 'react';

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
    const timeoutRef = useRef<number | null>(null);

    const handleClick = useCallback(() => {
      setIsSelected(true);
      onToggle?.();

      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setIsSelected(false);
        timeoutRef.current = null;
      }, 200);
    }, [onToggle]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

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
