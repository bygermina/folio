import { useRef, useImperativeHandle, forwardRef } from 'react';

import { useElementDimensions } from '@/hooks/use-element-dimensions';
import { pathTree, paths } from '@/constants/svg-paths';
import treeImage from '@/assets/blue circuit tree-small.jpg';
import { ImageMask } from '@/components/animations/image/image-mask';
import { useScreenSizeContext } from '@/components/providers/use-context';
import { getImageOffset, getScaledPath } from '@/utils/svg';

const BASE_HEIGHT = 932; // Original tree image height
const BASE_WIDTH = 720;
const ORIGINAL_RATIO = BASE_HEIGHT / BASE_WIDTH;

export interface TreeSectionProps {
  isContentReady: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
}

type Path = { path: string; start: { x: number; y: number }; delay: number; duration: number };

export interface TreeSectionRef {
  getPath: () => Path;
  getPaths: () => Path[];
}

export const TreeSection = forwardRef<TreeSectionRef, TreeSectionProps>(
  ({ isContentReady, containerRef }, ref) => {
    const imageRef = useRef<HTMLImageElement>(null);

    const imageDimensions = useElementDimensions(
      imageRef,
      isContentReady,
      BASE_HEIGHT,
      0.5,
      containerRef,
    );

    const dx = getImageOffset(imageDimensions, ORIGINAL_RATIO);

    useImperativeHandle(
      ref,
      () => ({
        getPath: () => ({ ...pathTree, path: getScaledPath(imageDimensions, dx, pathTree) }),
        getPaths: () => paths.map((p) => ({ ...p, path: getScaledPath(imageDimensions, dx, p) })),
      }),
      [dx, imageDimensions],
    );

    return <TreeImage ref={imageRef} />;
  },
);

export const TreeImage = forwardRef<HTMLImageElement>((_props, ref) => {
  const { isPortrait } = useScreenSizeContext();

  const currentClassName = isPortrait
    ? 'w-full md:-translate-y-24 md:basis-[40%] md:self-center'
    : 'w-[50vw] max-w-[220px] max-h-[220px] mx-auto md:max-w-none md:max-h-none';

  return (
    <ImageMask
      ref={ref}
      className={`absolute left-0 will-change-transform flex flex-col justify-center items-center md:h-full md:top-0 ${currentClassName}`}
      src={treeImage}
      isPortrait={isPortrait}
    />
  );
});
