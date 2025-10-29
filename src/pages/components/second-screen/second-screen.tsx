import { Slider } from "@/components/basic/slider/slider";
import { useScreenSize } from "@/hooks/use-screen-size";
import { useCallback } from "react";
import CodeBackground from "@/components/basic/code-background";
import reactLogo from "@/assets/react-logo-filled.svg";

import { SlideContent } from "./components/slide-content";

const LINKS: LinkData[] = [
  {
    query: "this is a JS animation",
    image: reactLogo,
  },
  {
    query: "made without any libraries",
    image: reactLogo,
  },
  {
    query: "Spin it up",
    image: reactLogo,
  },
  {
    query: "made without any libraries",
    image: reactLogo,
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
      <CodeBackground />
      <Slider<LinkData>
        slides={LINKS}
        speed={0.6}
        slideWidth={slideWidth}
        renderSlide={renderSlide}
      />
    </div>
  );
};
