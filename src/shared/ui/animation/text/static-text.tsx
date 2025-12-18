import { forwardRef } from 'react';

import { TextWithTargetLetter } from './displayed-text';

interface StaticTextProps {
  text: string;
  targetLetterIndex?: number;
  className?: string;
  delay?: number;
  speed?: number;
  opacity?: number;
}

export const StaticText = forwardRef<HTMLSpanElement, StaticTextProps>(
  ({ text, targetLetterIndex, className = '', opacity = 100 }, ref) => {
    return (
      <div className={className}>
        <TextWithTargetLetter
          ref={ref}
          opacity={opacity}
          text={text}
          targetLetterIndex={targetLetterIndex}
        />
      </div>
    );
  },
);
