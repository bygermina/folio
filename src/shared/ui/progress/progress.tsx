import type { CSSProperties } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './progress.module.scss';

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export const Progress = ({ value, max = 100, label, className }: ProgressProps) => {
  if (max <= 0) return null;

  const safeValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.min(Math.max(safeValue, 0), max);
  const percent = Math.round((clamped / max) * 100);

  return (
    <div className={cn(styles.root, className)}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={styles.fill}
          style={{ '--progress-value': `${percent}%` } as CSSProperties}
        />
        <span className={styles.srOnly}>{percent}%</span>
      </div>
    </div>
  );
};


