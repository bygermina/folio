import { useRef, useImperativeHandle, forwardRef } from 'react';

import { useElementDimensions } from '@/hooks/use-element-dimensions';
import { pathTree, paths } from '@/constants/svg-paths';
import desktop from '@/assets/blue circuit tree-large.jpg';
import mobile from '@/assets/blue circuit tree-500.jpg';
import tablet from '@/assets/blue circuit tree-932 .jpg';
import { ImageMask } from '@/components/animations/image/image-mask';
import { createResponsiveSources } from '@/components/basic/picture/picture.utils';
import { useScreenSizeContext } from '@/components/providers/use-context';
import { getImageOffset, getScaledPath } from '@/utils/svg';
import { cn } from '@/utils/cn';

import styles from './tree-section.module.scss';

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
  const { containerScreenMode, screenWidth } = useScreenSizeContext();

  const sources = createResponsiveSources({
    mobile,
    tablet,
    desktop,
  });

  const fallbackSrc = screenWidth >= 1024 ? desktop : screenWidth >= 768 ? tablet : mobile;

  return (
    <ImageMask
      key={screenWidth}
      ref={ref}
      className={cn(styles.treeImage, styles[`treeImage${containerScreenMode}`])}
      imageClassName={cn(styles.image, styles[`image${containerScreenMode}`])}
      src={fallbackSrc}
      sources={sources}
      alt="Circuit tree"
    />
  );
});
