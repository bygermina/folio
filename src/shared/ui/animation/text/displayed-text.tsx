import { forwardRef } from 'react';

interface TextWithTargetLetterProps {
  text: string;
  targetLetterIndex?: number; // Index of the letter to create a reference
  className?: string;
  opacity?: number;
}

export const TextWithTargetLetter = forwardRef<HTMLSpanElement, TextWithTargetLetterProps>(
  ({ text, targetLetterIndex, className = '', opacity = 60 }, ref) => {
    const opacityStyle = { opacity: opacity / 100 };

    if (
      targetLetterIndex === undefined ||
      targetLetterIndex < 0 ||
      targetLetterIndex >= text.length
    ) {
      return (
        <span className={className} style={opacityStyle}>
          {text}
        </span>
      );
    }

    const beforeTarget = text.slice(0, targetLetterIndex);
    const targetLetter = text[targetLetterIndex];
    const afterTarget = text.slice(targetLetterIndex + 1);

    return (
      <span className={className} style={opacityStyle}>
        {beforeTarget}
        <span ref={ref}>{targetLetter}</span>
        {afterTarget}
      </span>
    );
  },
);
