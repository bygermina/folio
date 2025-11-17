/// <reference types="vite-plugin-svgr/client" />
import ReactLogo from '@/assets/react-logo-filled.svg?react';
import TypeScriptLogo from '@/assets/typescript-logo.svg?react';
import NodeJsLogo from '@/assets/nodejs-logo.svg?react';
import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

import styles from './slide-content.module.scss';

const icons = {
  reactlogo: ReactLogo,
  typescript: TypeScriptLogo,
  nodejs: NodeJsLogo,
} as const;

export type IconName = keyof typeof icons;

interface SlideContentProps {
  query: string;
  image: IconName;
  width?: number;
  height?: number;
  color?: string;
}

export const SlideContent = forwardRef<HTMLDivElement, SlideContentProps>(
  ({ query, image, width = 20, height = 20, ...props }, ref) => {
    const Icon = icons[image];

    if (!Icon) {
      console.warn(`Icon not found for: ${image}`);
      return null;
    }

    return (
      <div ref={ref} className={styles.root}>
        <div aria-label={query} className={cn(styles.content, 'surface-transparent')}>
          <Icon
            {...props}
            width={width}
            height={height}
            viewBox="0 0 256 256"
            className={styles.icon}
          />
          <div className={styles.text}>{query}</div>
        </div>
      </div>
    );
  },
);

SlideContent.displayName = 'SlideContent';
