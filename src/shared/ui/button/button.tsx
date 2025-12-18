import { forwardRef, type ButtonHTMLAttributes } from 'react';

import { cn } from '@/shared/lib/cn';

import styles from './button.module.scss';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'magic' | 'transparent' | 'toggle' | 'primary' | 'nav' | 'tab';
  size?: 'default' | 'sm' | 'lg';
  isActive?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isActive, ...props }, ref) => {
    const stateClass =
      variant !== 'default' && isActive !== undefined
        ? styles[`${variant}${isActive ? 'Active' : 'Inactive'}`]
        : '';

    return (
      <button
        type="button"
        className={cn(styles.root, styles[variant], styles[size], stateClass, className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
