/// <reference types="vite-plugin-svgr/client" />
import ReactLogo from '@/assets/react-logo-filled.svg?react';
import { forwardRef } from 'react';

const icons = {
  reactlogo: ReactLogo,
} as const;

export type IconName = keyof typeof icons;

interface SlideContentProps {
  query: string;
  image: IconName;
}

export const SlideContent = forwardRef<HTMLDivElement, SlideContentProps>(
  ({ query, image }, ref) => {
    const Icon = icons[image];

    return (
      <div ref={ref} className="will-change-transform">
        <div
          aria-label={query}
          className={`flex flex-row gap-1 items-center surface-transparent w-[244px] transition-transform p-1
          hover:scale-105 max-md:max-w-[200px] max-md:gap-2 cursor-grab`}
        >
          <Icon
            width={20}
            height={20}
            fill="red"
            className="max-md:hidden flex-basis-[50px] text-blue-500 opacity-80 mr-2"
          />
          <div className="flex-basis-[200px] text-blue-500">{query}</div>
        </div>
      </div>
    );
  },
);

SlideContent.displayName = 'SlideContent';
