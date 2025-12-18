import { useEffect, useState, useCallback, type RefObject } from 'react';

import { TypeText } from '@/shared/ui/animation/text/type-text';
import { StaticText } from '@/shared/ui/animation/text/static-text';
import { Typography } from '@/shared/ui/typography/typography';
import { WithVibration } from '@/shared/ui/animation/vibration';
import { Button } from '@/shared/ui/button/button';
import { cn } from '@/shared/lib/cn';
import { useEvent } from '@/shared/lib/hooks/use-event';

import { useMainWidgetContext } from '../../model/use-main-widget-context';

import styles from './content.module.scss';

const CONTENT_READY_DELAY = 5800;
const ANIMATION_CONFIG = {
  TITLE_SPEED: 0.1,
  TITLE_DELAY: 1.0,
  SUBTITLE_DELAY: 3.0,
  TARGET_LETTER_INDEX: 5,
} as const;

interface ContentProps {
  letterRef?: RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
  onExploreClick?: () => void;
}

export const Content = ({ letterRef, onContentReady, onExploreClick }: ContentProps) => {
  const { animate } = useMainWidgetContext();
  const [isButtonVisible, setIsButtonVisible] = useState(!animate);

  const handleStarAnimationComplete = useCallback(() => {
    setIsButtonVisible(true);
  }, []);

  useEvent('starAnimationComplete', handleStarAnimationComplete);

  useEffect(() => {
    if (!animate) {
      onContentReady?.(true);
      return;
    }

    const timer = setTimeout(() => {
      onContentReady?.(true);
    }, CONTENT_READY_DELAY);

    return () => {
      clearTimeout(timer);
      onContentReady?.(false);
    };
  }, [onContentReady, animate]);

  const TextComponent = animate ? TypeText : StaticText;

  return (
    <div className={styles.container}>
      <Typography variant="h1" className={styles.heading}>
        <TextComponent
          text="Code is art"
          ref={letterRef}
          targetLetterIndex={ANIMATION_CONFIG.TARGET_LETTER_INDEX}
          className={cn('glass-text-shine', styles.titleMain)}
          speed={ANIMATION_CONFIG.TITLE_SPEED}
          delay={ANIMATION_CONFIG.TITLE_DELAY}
        />

        <TextComponent text="that does something" delay={ANIMATION_CONFIG.SUBTITLE_DELAY} />
      </Typography>
      <div className={cn(styles.subtitleWrapper, animate && styles.subtitleWrapperAnimated)}>
        <Typography variant="subheading" className={styles.subheading} color="muted">
          Xenia Liubachka • Production UI Scenarios
        </Typography>
      </div>
      <div
        className={cn(
          styles.actions,
          styles.actionsWrapper,
          !animate && styles.hidden,
          animate && !isButtonVisible && styles.hiddenAnimated,
        )}
      >
        <WithVibration startEvent="starAnimationComplete">
          <Button variant="magic" onClick={onExploreClick}>
            Explore what I can do for your project
          </Button>
        </WithVibration>
      </div>
    </div>
  );
};
