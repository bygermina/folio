import * as React from 'react';
import { cn } from '@/utils/cn';

import styles from './button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'magic' | 'transparent' | 'toggle' | 'primary' | 'nav';
  size?: 'default' | 'sm' | 'lg';
  isActive?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isActive, ...props }, ref) => {
    const stateClass =
      variant !== 'default' && isActive !== undefined
        ? styles[`${variant}${isActive ? 'Active' : 'Inactive'}`]
        : '';

    return (
      <button
        className={cn(styles.root, styles[variant], styles[size], stateClass, className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };
