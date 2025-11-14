import { motion } from 'framer-motion';
import { forwardRef, useEffect } from 'react';

import { TypeText } from '@/components/animations/text/type-text';
import { useScreenSizeContext } from '@/components/providers/use-context';

import { MagicButton } from './magic-button';

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
      <div ref={ref} className={`content-container-${containerScreenMode}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className={isPortrait ? 'flex flex-col items-center justify-center w-full' : ''}
        >
          <motion.h1
            className={`heading-${screenMode}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            <TypeText
              text="Code is art"
              targetLetterIndex={5} // Index of "i" letter
              ref={letterRef}
              className={`glass-text-shine font-bold heading-${screenMode}`}
              speed={0.1}
              delay={1.8}
            />
            <br />
            <TypeText
              text="that does something"
              className={`text-white heading-${screenMode}`}
              delay={3.0}
            />
          </motion.h1>
          <motion.p
            className={`mx-auto max-w-2xl text-slate-300 subheading-${screenMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 5.0 }}
          >
            React • TypeScript • Node.js • Creative Solutions
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
            <MagicButton />
            <a
              href="https://www.linkedin.com/in/kseniya-liubachka/"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-base surface-transparent py-2 ${isPortrait ? ' h-9 px-6  text-xs' : 'h-10 px-8 text-sm'}`}
            >
              Contact
            </a>
          </motion.div>
        </motion.div>
      </div>
    );
  },
);
