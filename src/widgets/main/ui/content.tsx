import { useEffect, type RefObject } from 'react';

import { TypeText } from '@/shared/ui/animation/text/type-text';
import { StaticText } from '@/shared/ui/animation/text/static-text';
import { Typography } from '@/shared/ui/typography/typography';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { WithVibration } from '@/shared/ui/animation/vibration';
import { Button } from '@/shared/ui/button/button';
import { cn } from '@/shared/lib/cn';

import { useMainWidgetContext } from '../model/use-main-widget-context';

import styles from './content.module.scss';

interface ContentProps {
  letterRef?: RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
  onExploreClick?: () => void;
}

export const Content = ({ letterRef, onContentReady, onExploreClick }: ContentProps) => {
  const { screenMode, containerScreenMode } = useScreenSizeContext();
  const { animate } = useMainWidgetContext();

  useEffect(() => {
    if (!animate) {
      onContentReady?.(true);
      return;
    }

    const timer = setTimeout(() => {
      onContentReady?.(true);
    }, 5800);

    return () => {
      clearTimeout(timer);
      onContentReady?.(false);
    };
  }, [onContentReady, animate]);

  const TextComponent = animate ? TypeText : StaticText;

  return (
    <div className={cn(styles.container, styles[`container${containerScreenMode}`])}>
      <Typography variant="h1" className={cn(styles.heading, styles[`heading${screenMode}`])}>
        <TextComponent
          text="Code is art"
          ref={letterRef}
          targetLetterIndex={5}
          className={cn('glass-text-shine', styles.titleMain, styles[`heading${screenMode}`])}
          speed={0.1}
          delay={1.0}
        />

        <TextComponent
          text="that does something"
          className={styles[`heading${screenMode}`]}
          delay={3.0}
        />
      </Typography>
      <div className={styles.subtitleWrapper}>
        <Typography
          variant="subheading"
          className={cn(styles.subtitle, styles[`subheading${screenMode}`])}
          color="muted"
        >
          Xenia Liubachka • Production UI Scenarios
        </Typography>
      </div>
      {animate && (
        <div className={cn(styles.actions, styles[`actions${screenMode}`], styles.actionsWrapper)}>
          <WithVibration startEvent="starAnimationComplete">
            <Button variant="magic" onClick={onExploreClick}>
              Explore what I can do for your project
            </Button>
          </WithVibration>
        </div>
      )}
    </div>
  );
};
