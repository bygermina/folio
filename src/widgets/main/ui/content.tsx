import { useEffect, type RefObject } from 'react';

import { TypeText } from '@/shared/ui/animation/text/type-text';
import { Typography } from '@/shared/ui/typography/typography';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { WithVibration } from '@/shared/ui/animation/vibration';
import { Scroll } from '@/shared/ui/scroll/scroll';
import { Button } from '@/shared/ui/button/button';
import { cn } from '@/shared/lib/cn';

import styles from './content.module.scss';

interface ContentProps {
  letterRef?: RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
}

export const Content = ({ letterRef, onContentReady }: ContentProps) => {
  const { screenMode, containerScreenMode } = useScreenSizeContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      onContentReady?.(true);
    }, 5800);

    return () => {
      clearTimeout(timer);
      onContentReady?.(false);
    };
  }, [onContentReady]);

  return (
    <div className={cn(styles.container, styles[`container${containerScreenMode}`])}>
      <Typography variant="h1" className={cn(styles.heading, styles[`heading${screenMode}`])}>
        <TypeText
          text="Code is art"
          ref={letterRef}
          targetLetterIndex={5}
          className={cn('glass-text-shine', styles.titleMain, styles[`heading${screenMode}`])}
          speed={0.1}
          delay={1.0}
        />

        <TypeText
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
          Xenia Liubachka • interactive portfolio
        </Typography>
      </div>
      <div className={cn(styles.actions, styles[`actions${screenMode}`], styles.actionsWrapper)}>
        <Scroll targetSectionId="js-animations">
          <WithVibration startEvent="starAnimationComplete">
            <Button variant="magic">Explore what I can do for your project</Button>
          </WithVibration>
        </Scroll>
      </div>
    </div>
  );
};

