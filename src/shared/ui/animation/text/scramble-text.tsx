import { useEffect, useState } from 'react';

import { Typography, type TypographyProps } from '@/shared/ui/typography/typography';

const CHARS = '-_~=+*&^%$#@!/|\\';

const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

interface ScrambleTextProps extends Omit<TypographyProps, 'children'> {
  text: string;
  speed?: number;
  delay?: number;
  start?: boolean;
}

export const ScrambleText = ({
  text,
  speed = 30, // Update speed (ms)
  delay = 0,
  start = true,
  className,
  ...props
}: ScrambleTextProps) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!start) return;

    let iteration = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        const revealedLength = Math.floor(iteration);
        const newText =
          revealedLength >= text.length
            ? text
            : text
                .split('')
                .map((char, index) => (index < revealedLength ? char : getRandomChar()))
                .join('');

        setDisplayedText(newText);

        if (revealedLength >= text.length) {
          if (intervalId) clearInterval(intervalId);
          return;
        }

        iteration += 1 / 3; // Letter reveal speed (the smaller the divisor, the faster)
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay, start]);

  const fallbackText = '\u00A0'.repeat(text.length);

  return (
    <Typography className={className} {...props}>
      {displayedText || fallbackText}
    </Typography>
  );
};
