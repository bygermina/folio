import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface LabeledInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  id?: string;
  valueDisplay?: string;
  showValue?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

const baseInputClasses = 'w-full rounded-lg';
const baseLabelClasses = 'block text-slate-300 text-sm font-medium mb-2';

const inputVariants = {
  range: cn(baseInputClasses, 'h-2 bg-slate-700 appearance-none cursor-pointer accent-cyan-400'),
  text: cn(
    baseInputClasses,
    'px-3 py-2 bg-slate-900 border border-slate-600 text-slate-200 text-sm',
    'focus:outline-none focus:border-cyan-400',
  ),
} as const;

export const LabeledInput = ({
  label,
  id,
  valueDisplay,
  showValue = true,
  className,
  labelClassName,
  inputClassName,
  type = 'text',
  ...inputProps
}: LabeledInputProps) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const displayValue = valueDisplay !== undefined ? valueDisplay : inputProps.value?.toString();

  const inputVariant = type === 'range' ? inputVariants.range : inputVariants.text;

  return (
    <div className={className}>
      <label htmlFor={inputId} className={cn(baseLabelClasses, labelClassName)}>
        {label}
        {showValue && displayValue && `: ${displayValue}`}
      </label>
      <input
        id={inputId}
        type={type}
        {...inputProps}
        className={cn(inputVariant, inputClassName)}
      />
    </div>
  );
};
