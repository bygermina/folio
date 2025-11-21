import { memo, useState, useCallback } from 'react';

import { cn } from '@/utils/cn';

import styles from './row.module.scss';

export interface DataCardProps {
  value: number;
  onToggle?: () => void;
  className?: string;
}

export const DataCard = memo(
  ({ value, onToggle, className }: DataCardProps) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleClick = useCallback(() => {
      setIsSelected(true);
      onToggle?.();

      setTimeout(() => setIsSelected(false), 200);
    }, [onToggle]);

    return (
      <div
        className={cn(styles.dataCard, isSelected && styles.dataCardSelected, className)}
        onClick={handleClick}
      >
        {value}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.value === nextProps.value,
);
