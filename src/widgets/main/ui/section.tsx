import { useMemo, useRef, useState, type RefObject } from 'react';

import { FireEffect } from '@/shared/ui/animation/light/fire-effect';
import { CSSPathMotion } from '@/shared/ui/animation/css-path-motion/css-path-motion';
import { createSvgArc, getLastPointFromSvgPath } from '@/shared/lib/svg';
import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { BREAKPOINTS } from '@/shared/lib/breakpoints';
import { cn } from '@/shared/lib/cn';

import { TreeSection, type TreeSectionRef } from './tree-section';
import { Content } from './content';

import styles from './section.module.scss';

const ARC_RADIUS = 100;
const BASE_SPEED = 250;
const LETTER_PART = 0.3;

const SPEED_MULTIPLIERS = {
  MOBILE: 0.6,
  TABLET: 0.9,
  DESKTOP: 1.2,
} as const;

export const Section = () => {
  const { screenMode, screenWidth, screenHeight } = useScreenSizeContext();

  const sectionRef = useRef<HTMLElement | null>(null);
  const treeRef = useRef<TreeSectionRef | null>(null);
  const letterIRef = useRef<HTMLSpanElement>(null);

  const [isContentReady, setIsContentReady] = useState(false);

  return (
    <section ref={sectionRef} className={cn(styles.root, styles[`root${screenMode}`])}>
      <TreeSection ref={treeRef} isContentReady={isContentReady} containerRef={sectionRef} />
      <Content
        key={`${screenWidth}-${screenHeight}`}
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
      />

      <PathEffectsSection
        letterIRef={letterIRef}
        isContentReady={isContentReady}
        targetElement={treeRef.current}
        containerRef={sectionRef}
      />
    </section>
  );
};

interface PathEffectsSectionProps {
  letterIRef: RefObject<HTMLSpanElement | null>;
  isContentReady: boolean;
  targetElement: TreeSectionRef | null;
  containerRef: RefObject<HTMLElement | null>;
}

const PathEffectsSection = ({
  letterIRef,
  isContentReady,
  targetElement,
  containerRef,
}: PathEffectsSectionProps) => {
  const letterIDimensions = useElementDimensions(
    letterIRef,
    isContentReady,
    0,
    LETTER_PART,
    containerRef,
  );
  const { isPortrait, screenWidth, isMobile } = useScreenSizeContext();
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

  if (!scaledPathTree || !isContentReady) return null;

  const path = `${scaledPathTree.path}${curve}`;

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
      {scaledPaths?.map((path) => (
        <CSSPathMotion
          key={path.path}
          {...commonMotionProps}
          path={path.path}
          delay={path.delay}
          containerRef={containerRef}
        >
          <FireEffect />
        </CSSPathMotion>
      ))}
    </>
  );
};
