import { useRef, useImperativeHandle, forwardRef, type RefObject } from 'react';

import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { pathTree, paths } from '@/shared/lib/svg-paths';
import desktop from '../../assets/blue circuit tree-large.webp';
import mobile from '../../assets/blue circuit tree-500.webp';
import tablet from '../../assets/blue circuit tree-932.webp';
import { ImageMask } from '@/shared/ui/animation/image/image-mask';
import { createResponsiveSources } from '@/shared/ui/picture/picture.utils';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { getImageOffset, getScaledPath } from '@/shared/lib/svg';
import { cn } from '@/shared/lib/cn';

import styles from './tree-section.module.scss';

const BASE_HEIGHT = 932;
const BASE_WIDTH = 720;
const ORIGINAL_RATIO = BASE_HEIGHT / BASE_WIDTH;

export interface TreeSectionProps {
  isContentReady: boolean;
  containerRef?: RefObject<HTMLElement | null>;
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

