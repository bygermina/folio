import { forwardRef } from 'react';

interface SlideContentProps {
  query: string;
  image: string;
}

export const SlideContent = forwardRef<HTMLDivElement, SlideContentProps>(
  ({ query, image }, ref) => {
    return (
      <div ref={ref} className="will-change-transform">
        <div
          aria-label={query}
          className={`flex flex-row gap-1 items-center surface-transparent w-[244px] transition-transform p-1
          hover:scale-105 max-md:mr-[30px] max-md:max-w-[200px] max-md:gap-2 cursor-grab`}
        >
          <img
            width={20}
            height={20}
            src={image}
            alt={query}
            className="max-md:hidden flex-basis-[50px] text-blue-500 opacity-80 mr-2"
          />
          <div className="flex-basis-[200px] text-blue-500">{query}</div>
        </div>
      </div>
    );
  },
);

SlideContent.displayName = 'SlideContent';
