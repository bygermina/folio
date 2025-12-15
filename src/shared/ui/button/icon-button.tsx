import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './icon-button.module.scss';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon: ReactNode;
  iconPosition?: 'left' | 'right';
  isIconRotated?: boolean;
  className?: string;
}

export const IconButton = ({
  children,
  icon,
  iconPosition = 'right',
  isIconRotated = false,
  className,
  ...props
}: IconButtonProps) => {
  return (
    <button type="button" className={cn(styles.root, className)} {...props}>
      {iconPosition === 'left' && (
        <span
          aria-hidden="true"
          className={cn(styles.icon, styles.iconLeft, isIconRotated && styles.iconRotated)}
        >
          {icon}
        </span>
      )}
      <span className={styles.content}>{children}</span>
      {iconPosition === 'right' && (
        <span
          aria-hidden="true"
          className={cn(styles.icon, styles.iconRight, isIconRotated && styles.iconRotated)}
        >
          {icon}
        </span>
      )}
    </button>
  );
};


