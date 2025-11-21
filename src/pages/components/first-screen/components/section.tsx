import { useMemo, useRef, useState } from 'react';

import FireEffect from '@/components/animations/light/fire-effect';
import { CSSPathMotion } from '@/components/animations/css-path-motion/css-path-motion';
import { createSvgArc, getLastPointFromSvgPath } from '@/utils/svg';
import { useElementDimensions } from '@/hooks/use-element-dimensions';
import { useScreenSizeContext } from '@/components/providers/use-context';
import { cn } from '@/utils/cn';

import { TreeSection, type TreeSectionRef } from './tree-section';
import { Content } from './content';

import styles from './section.module.scss';

const ARC_RADIUS = 100;
const BASE_SPEED = 250;
const LETTER_PART = 0.3;
const TABLET_BREAKPOINT = 1024;

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
        key={screenWidth + screenHeight}
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
  letterIRef: React.RefObject<HTMLSpanElement | null>;
  isContentReady: boolean;
  targetElement: TreeSectionRef | null;
  containerRef: React.RefObject<HTMLElement | null>;
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

  const path = scaledPathTree?.path ? scaledPathTree.path + curve : '';

  const screenSpeedMultiplier = useMemo(() => {
    if (isMobile) return SPEED_MULTIPLIERS.MOBILE;
    if (screenWidth < TABLET_BREAKPOINT) return SPEED_MULTIPLIERS.TABLET;
    return SPEED_MULTIPLIERS.DESKTOP;
  }, [isMobile, screenWidth]);

  if (!scaledPathTree || !isContentReady) {
    return null;
  }

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
      >
        <FireEffect />
      </CSSPathMotion>
      {scaledPaths?.map((path) => (
        <CSSPathMotion key={path.path} {...commonMotionProps} path={path.path} delay={path.delay}>
          <FireEffect />
        </CSSPathMotion>
      ))}
    </>
  );
};
