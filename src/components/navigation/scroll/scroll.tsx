import type { ReactNode, MouseEvent, KeyboardEvent } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

import { cn } from '@/utils/cn';

import styles from './scroll.module.scss';

interface ScrollProps extends HTMLMotionProps<'div'> {
  targetSectionId: string;
  label?: string;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

export const Scroll = ({
  targetSectionId,
  label,
  arrow,
  className,
  children,
  ...props
}: ScrollProps) => {
  const scrollToNext = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const targetSection = document.getElementById(targetSectionId);
    if (!targetSection) return;

    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') scrollToNext(event as unknown as MouseEvent<HTMLDivElement>);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(styles.root, className)}
      {...props}
    >
      <div
        role="button"
        tabIndex={0}
        className={styles.buttonWrapper}
        onClick={scrollToNext}
        onKeyDown={handleKeyDown}
      >
        {children}
        {label && <span className={styles.label}>{label}</span>}
        {arrow && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={styles.arrow}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.arrowIcon}
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
