import { motion } from 'framer-motion';
import { forwardRef, useEffect } from 'react';

import { TypeText } from '@/components/animations/text/type-text';
import { Typography } from '@/components/basic/typography/typography';
import { useScreenSizeContext } from '@/components/providers/use-context';
import { WithVibration } from '@/components/animations/vibration';
import { Scroll } from '@/components/navigation/scroll';
import { Button } from '@/components/basic/button/button';
import { cn } from '@/utils/cn';

import styles from './content.module.scss';

interface ContentProps {
  letterRef?: React.RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ letterRef, onContentReady }, ref) => {
    const { screenMode, containerScreenMode } = useScreenSizeContext();

    useEffect(() => {
      return () => onContentReady?.(false);
    }, [onContentReady]);

    return (
      <div ref={ref} className={cn(styles.container, styles[`container${containerScreenMode}`])}>
        <div className={styles.content}>
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 5.0 }}
          >
            <Typography
              variant="subheading"
              className={cn(styles.subtitle, styles[`subheading${screenMode}`])}
              color="muted"
            >
              Xenia Liubachka • interactive portfolio
            </Typography>
          </motion.div>
          <motion.div
            className={cn(styles.actions, styles[`actions${screenMode}`])}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 5.2 }}
            onAnimationComplete={() => onContentReady?.(true)}
          >
            <Scroll targetSectionId="js-animations">
              <WithVibration startEvent="starAnimationComplete">
                <Button variant="magic">Explore what I can do for your project</Button>
              </WithVibration>
            </Scroll>

            {/* <a
            href="https://www.linkedin.com/in/kseniya-liubachka/"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-base surface-transparent py-2 ${isPortrait ? ' h-9 px-6  text-xs' : 'h-10 px-8 text-sm'}`}
          >
            Contact
          </a> */}
          </motion.div>
        </div>
      </div>
    );
  },
);
