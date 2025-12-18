import { useMemo } from 'react';

import { FireEffect } from '@/shared/ui/animation/light/fire-effect';
import { getLastPointFromSvgPath } from '@/shared/lib/svg';

import { usePathData } from './use-path-data';
import type { PathEffectsProps } from './types';

import styles from './static-path-effects.module.scss';

export const StaticPathEffects = (props: PathEffectsProps) => {
  const { isContentReady } = props;
  const { scaledPathTree, scaledPaths, path } = usePathData(props);

  const staticPositions = useMemo(() => {
    if (!path) return null;

    const mainPathLastPoint = getLastPointFromSvgPath(path);
    const pathsLastPoints =
      scaledPaths?.map((p) => ({
        path: p.path,
        lastPoint: getLastPointFromSvgPath(p.path),
      })) ?? [];

    return { mainPathLastPoint, pathsLastPoints };
  }, [path, scaledPaths]);

  if (!scaledPathTree || !isContentReady || !staticPositions) return null;

  const { mainPathLastPoint, pathsLastPoints } = staticPositions;

  return (
    <>
      {mainPathLastPoint && (
        <div
          className={styles.staticFireEffect}
          style={{ left: mainPathLastPoint.x, top: mainPathLastPoint.y }}
        >
          <FireEffect />
        </div>
      )}
      {pathsLastPoints.map(
        (item) =>
          item.lastPoint && (
            <div
              key={item.path}
              className={styles.staticFireEffect}
              style={{ left: item.lastPoint.x, top: item.lastPoint.y }}
            >
              <FireEffect />
            </div>
          ),
      )}
    </>
  );
};
