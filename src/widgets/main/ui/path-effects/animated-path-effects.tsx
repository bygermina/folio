import { FireEffect } from '@/shared/ui/animation/light/fire-effect';
import { CSSPathMotion } from '@/shared/ui/animation/css-path-motion/css-path-motion';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { BREAKPOINTS } from '@/shared/lib/breakpoints';

import { usePathData } from './use-path-data';
import { BASE_SPEED, SPEED_MULTIPLIERS } from './constants';
import type { PathEffectsProps, ScaledPath } from './types';

export const AnimatedPathEffects = (props: PathEffectsProps) => {
  const { containerRef, isContentReady } = props;
  const { scaledPathTree, scaledPaths, path } = usePathData(props);
  const { screenWidth, isMobile } = useScreenSizeContext();

  if (!scaledPathTree || !isContentReady) return null;

  const screenSpeedMultiplier = isMobile
    ? SPEED_MULTIPLIERS.MOBILE
    : screenWidth < BREAKPOINTS.TABLET
      ? SPEED_MULTIPLIERS.TABLET
      : SPEED_MULTIPLIERS.DESKTOP;

  const speed = BASE_SPEED * screenSpeedMultiplier;
  const commonMotionProps = {
    speed,
    enableRotation: true,
  };

  return (
    <>
      <CSSPathMotion
        {...commonMotionProps}
        path={path}
        delay={scaledPathTree.delay}
        onCompleteEvent="starAnimationComplete"
        containerRef={containerRef}
      >
        <FireEffect />
      </CSSPathMotion>
      {scaledPaths?.map((p: ScaledPath) => (
        <CSSPathMotion
          key={p.path}
          {...commonMotionProps}
          path={p.path}
          delay={p.delay}
          containerRef={containerRef}
        >
          <FireEffect />
        </CSSPathMotion>
      ))}
    </>
  );
};
