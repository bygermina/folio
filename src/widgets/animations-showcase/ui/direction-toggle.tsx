import { Button } from '@/shared/ui/button/button';
import { Typography } from '@/shared/ui/typography/typography';

import styles from './slider-controls.module.scss';

interface DirectionToggleProps {
  side: 'left' | 'right';
  onSideChange: (side: 'left' | 'right') => void;
}

export const DirectionToggle = ({ side, onSideChange }: DirectionToggleProps) => (
  <div>
    <Typography variant="label" className={styles.label} color="muted">
      Direction
    </Typography>
    <div className={styles.directionGroup}>
      <Button
        variant="toggle"
        isActive={side === 'left'}
        onClick={() => onSideChange('left')}
        className={styles.directionButton}
      >
        ← Left
      </Button>
      <Button
        variant="toggle"
        isActive={side === 'right'}
        onClick={() => onSideChange('right')}
        className={styles.directionButton}
      >
        Right →
      </Button>
    </div>
  </div>
);

