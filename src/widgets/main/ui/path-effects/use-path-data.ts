import { useMemo } from 'react';

import { createSvgArc, getLastPointFromSvgPath } from '@/shared/lib/svg';
import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import { ARC_RADIUS, LETTER_PART } from './constants';
import type { PathEffectsProps } from './types';

export const usePathData = ({
  letterIRef,
  isContentReady,
  targetElement,
  containerRef,
}: PathEffectsProps) => {
  const letterIDimensions = useElementDimensions(
    letterIRef,
    isContentReady,
    0,
    LETTER_PART,
    containerRef,
  );
  const { isPortrait } = useScreenSizeContext();

  const scaledPathTree = targetElement?.getPath();
  const scaledPaths = targetElement?.getPaths();

  const curve = useMemo(() => {
    if (!scaledPathTree || isPortrait) return '';

    const lastPoint = getLastPointFromSvgPath(scaledPathTree.path);
    const targetPosition = letterIDimensions?.center;

    if (!lastPoint || !targetPosition || targetPosition.x === 0 || targetPosition.y === 0) {
      return '';
    }

    return createSvgArc(lastPoint.x, lastPoint.y, targetPosition.x, targetPosition.y, ARC_RADIUS);
  }, [scaledPathTree, letterIDimensions, isPortrait]);

  const path = scaledPathTree ? `${scaledPathTree.path}${curve}` : '';

  return { scaledPathTree, scaledPaths, path };
};
