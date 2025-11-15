import * as React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'magic' | 'transparent' | 'toggle' | 'primary' | 'nav';
  size?: 'default' | 'sm' | 'lg';
  isActive?: boolean;
}

const baseButtonClasses = cn(
  'inline-flex items-center justify-center',
  'rounded-md font-medium',
  'transition-all duration-300',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
  'disabled:pointer-events-none disabled:opacity-50',
);

const variantClasses = {
  default: cn('bg-transparent text-white', 'focus-visible:ring-cyan-400/60'),
  magic: cn(
    'bg-transparent text-white',
    'border border-cyan-400/40 shadow-lg shadow-cyan-500/25',
    'hover:scale-105 hover:border-cyan-300/60 hover:bg-cyan-500/5',
    'hover:shadow-xl hover:shadow-cyan-400/35',
    'focus-visible:ring-cyan-400/60',
  ),
  transparent: cn(
    'bg-transparent text-white',
    'border border-blue-500/50',
    'hover:border-blue-500 hover:bg-blue-500/10',
    'focus-visible:ring-blue-400/60',
  ),
  primary: cn('bg-cyan-500 text-white', 'hover:bg-cyan-600', 'focus-visible:ring-cyan-400/60'),
  toggle: cn('border transition-colors', 'focus-visible:ring-cyan-400/60'),
  nav: cn(
    'bg-transparent border-0',
    'transition-all duration-300',
    'focus-visible:ring-cyan-400/60',
  ),
} as const;

const sizeClasses = {
  sm: 'h-9 px-6 text-xs',
  default: 'h-10 px-4 py-2 text-sm',
  lg: 'h-11 px-8 text-base',
} as const;

const toggleStates = {
  active: cn('bg-cyan-500/20 border-cyan-400 text-cyan-300'),
  inactive: cn('bg-slate-800 border-slate-600 text-slate-400', 'hover:border-slate-500'),
} as const;

const navStates = {
  active: cn('text-cyan-400'),
  inactive: cn('text-slate-400 hover:text-cyan-300'),
} as const;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isActive, ...props }, ref) => {
    let variantClass: string;

    if (variant === 'toggle') {
      variantClass = cn(variantClasses.toggle, toggleStates[isActive ? 'active' : 'inactive']);
    } else if (variant === 'nav') {
      variantClass = cn(variantClasses.nav, navStates[isActive ? 'active' : 'inactive']);
    } else {
      variantClass = variantClasses[variant];
    }

    return (
      <button
        className={cn(baseButtonClasses, variantClass, sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button };
