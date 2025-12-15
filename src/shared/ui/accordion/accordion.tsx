import { useId, useState, type ReactNode } from 'react';

import { AnimatePresence, motion, type Variants } from 'framer-motion';

import { IconButton } from '@/shared/ui/button/icon-button';
import { cn } from '@/shared/lib/cn';

import styles from './accordion.module.scss';

const PANEL_ANIMATION_DURATION = 0.22;
const PANEL_ANIMATION_EASE = 'easeOut' as const;

const panelVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: 'auto',
    opacity: 1,
  },
};

const panelTransition = {
  duration: PANEL_ANIMATION_DURATION,
  ease: PANEL_ANIMATION_EASE,
};

interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export const Accordion = ({ children, className }: AccordionProps) => {
  return <div className={cn(styles.root, className)}>{children}</div>;
};

interface AccordionItemProps {
  title: string;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export const AccordionItem = ({ title, children, className, defaultOpen }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(Boolean(defaultOpen));
  const baseId = useId();
  const buttonId = `${baseId}-button`;
  const panelId = `${baseId}-panel`;

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={cn(styles.item, className)}>
      <IconButton
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={handleToggle}
        icon="▸"
        isIconRotated={isOpen}
      >
        <span className={styles.headerTitle}>{title}</span>
      </IconButton>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={panelId}
            className={styles.panel}
            role="region"
            aria-labelledby={buttonId}
            initial="closed"
            animate="open"
            exit="closed"
            variants={panelVariants}
            transition={panelTransition}
          >
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
