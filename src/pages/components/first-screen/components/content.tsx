import { motion } from 'framer-motion';
import { forwardRef, useEffect } from 'react';

import { TypeText } from '@/components/animations/text/type-text';
import { useScreenSizeContext } from '@/components/providers/use-context';
import { Vibration } from '@/components/animations/vibration';
import { Scroll } from '@/components/navigation/scroll';

interface ContentProps {
  letterRef?: React.RefObject<HTMLSpanElement | null>;
  onContentReady?: (isReady: boolean) => void;
}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  ({ letterRef, onContentReady }, ref) => {
    const { isPortrait, screenMode, containerScreenMode } = useScreenSizeContext();

    useEffect(() => {
      return () => onContentReady?.(false);
    }, [onContentReady]);

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className={`content-container-${containerScreenMode}`}
      >
        <motion.h1
          className={`heading-${screenMode} mb-8`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
        >
          <TypeText
            text="Code is art"
            ref={letterRef}
            targetLetterIndex={5}
            className={`glass-text-shine text-white font-bold heading-${screenMode} mr-4`}
            speed={0.1}
            delay={1.0}
          />

          <TypeText
            text="that does something"
            className={`heading-${screenMode} text-white`}
            delay={3.0}
          />
        </motion.h1>
        <motion.p
          className={`mx-auto max-w-2xl text-slate-300 subheading-${screenMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 5.0 }}
        >
          Xenia Liubachka • interactive portfolio
        </motion.p>
        <motion.div
          className={`flex flex-row flex-wrap items-center justify-center ${
            isPortrait ? 'gap-3' : 'mb-12 gap-4'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 5.2 }}
          onAnimationComplete={() => onContentReady?.(true)}
        >
          <Scroll targetSectionId="js-animations">
            <Vibration startEvent="starAnimationComplete">
              <div className="btn-base btn-magic py-2 px-4">
                Explore what I can do for your project
              </div>
            </Vibration>
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
      </motion.div>
    );
  },
);
