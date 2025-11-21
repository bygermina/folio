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
  const letterIDimensions = useElementDimensions(letterIRef, isContentReady, 0, 0.3, containerRef);
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

    return createSvgArc(lastPoint.x, lastPoint.y, targetPosition.x, targetPosition.y, 100);
  }, [scaledPathTree, letterIDimensions, isPortrait]);

  const path = scaledPathTree?.path ? scaledPathTree.path + curve : '';

  const screenSpeedMultiplier = useMemo(() => {
    if (isMobile) return 0.6;
    if (screenWidth < 1024) return 0.9;
    return 1.2;
  }, [isMobile, screenWidth]);

  if (!scaledPathTree || !isContentReady) {
    return null;
  }

  const speed = 250 * screenSpeedMultiplier;

  return (
    <>
      {/* <SVGPathVisualization paths={scaledPaths?.map((item) => item.path)} /> */}
      <CSSPathMotion
        path={path}
        speed={speed}
        delay={scaledPathTree.delay}
        enableRotation={true}
        onCompleteEvent="starAnimationComplete"
      >
        <FireEffect />
      </CSSPathMotion>
      {scaledPaths?.map((path) => (
        <CSSPathMotion
          key={path.path}
          path={path.path}
          speed={speed}
          delay={path.delay}
          enableRotation={true}
        >
          <FireEffect />
        </CSSPathMotion>
      ))}
    </>
  );
};
