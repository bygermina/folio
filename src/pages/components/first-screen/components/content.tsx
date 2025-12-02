import { useEffect } from 'react';

import { TypeText } from '@/components/animations/text/type-text';
import { Typography } from '@/components/basic/typography/typography';
import { useScreenSizeContext } from '@/components/providers/use-context';
import { WithVibration } from '@/components/animations/vibration';
import { Scroll } from '@/components/navigation/scroll/scroll';
import { Button } from '@/components/basic/button/button';
import { cn } from '@/utils/cn';

import styles from './content.module.scss';

interface ContentProps {
  letterRef?: React.RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
}

export const Content = ({ letterRef, onContentReady }: ContentProps) => {
  const { screenMode, containerScreenMode } = useScreenSizeContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      onContentReady?.(true);
    }, 5800); // 5s delay + 0.8s duration

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
