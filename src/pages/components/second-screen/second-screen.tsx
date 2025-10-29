import { Slider } from "@/components/basic/slider/Slider";
import { useScreenSize } from "@/hooks/use-screen-size";
import { useCallback } from "react";

import { SlideContent } from "./components/slide-content";

const LINKS: LinkData[] = [
  {
    query: "React Hooks",
    image: "/icon.svg",
  },
  {
    query: "React Router",
    image: "/icon.svg",
  },
];

const SLIDE_WIDTH = {
  DESKTOP: 288,
  MOBILE: 220,
} as const;

type LinkData = {
  query: string;
  image: string;
};

export const SecondScreen = () => {
  const { screenWidth } = useScreenSize();
  const slideWidth = screenWidth > 700 ? SLIDE_WIDTH.DESKTOP : SLIDE_WIDTH.MOBILE;

  const renderSlide = useCallback(
    (item: LinkData, index: number, setRef: (el: HTMLElement | null) => void) => (
      <SlideContent key={index} ref={setRef} {...item} />
    ),
    []
  );

  return (
    <div className="relative z-[1] pt-0">
      <Slider<LinkData>
        slides={LINKS}
        speed={0.6}
        slideWidth={slideWidth}
        renderSlide={renderSlide}
      />
    </div>
  );
};
