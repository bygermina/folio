import { forwardRef } from "react";

interface SlideContentProps {
  query: string;
  image: string;
}

export const SlideContent = forwardRef<HTMLDivElement, SlideContentProps>(({ query, image }, ref) => {
  return (
    <div ref={ref} className="flex flex-row will-change-transform">
      <div
        aria-label={query}
        className={
          `surface-transparent gap-1 w-[244px] max-w-full bg-transparent text-[color:var(--button-color-one)]
          transition-transform duration-300 ease-in-out hover:scale-105
          max-md:mr-[30px] max-md:max-w-[200px] max-md:text-justify max-md:gap-2`
        }
      >
        <img
          width={20}
          height={20}
          src={image}
          alt={query}
          className="max-md:hidden"
        />
        {query}
      </div>
    </div>
  );
});

SlideContent.displayName = "SlideContent";
