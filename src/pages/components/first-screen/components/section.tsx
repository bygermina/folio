import { useMemo, useRef, useState } from 'react';

import FireEffect from '@/components/animations/light/fire-effect';
import { CSSPathMotion } from '@/components/animations/css-path-motion/css-path-motion';
import { createSvgArc, getLastPointFromSvgPath } from '@/utils/svg';
import { useElementDimensions } from '@/hooks/use-element-dimensions';
import { useScreenSizeContext } from '@/components/providers/use-context';

import { TreeSection, type TreeSectionRef } from './tree-section';
import { Content } from './content';

export const Section = () => {
  const { isPortrait, screenWidth, screenHeight } = useScreenSizeContext();

  const treeRef = useRef<TreeSectionRef | null>(null);
  const letterIRef = useRef<HTMLSpanElement>(null);

  const [isContentReady, setIsContentReady] = useState(false);

  return (
    <section
      className={`relative min-h-screen w-full overflow-hidden flex ${isPortrait ? 'h-screen flex-col justify-between' : 'flex-row'}`}
    >
      <TreeSection ref={treeRef} isContentReady={isContentReady} />
      <Content
        key={screenWidth + screenHeight}
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
      />

      <PathEffectsSection
        letterIRef={letterIRef}
        isContentReady={isContentReady}
        targetElement={treeRef.current}
      />
    </section>
  );
};

interface PathEffectsSectionProps {
  letterIRef: React.RefObject<HTMLSpanElement | null>;
  isContentReady: boolean;
  targetElement: TreeSectionRef | null;
}

const PathEffectsSection = ({
  letterIRef,
  isContentReady,
  targetElement,
}: PathEffectsSectionProps) => {
  const letterIDimensions = useElementDimensions(letterIRef, isContentReady, 0, 0.3);
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

    return createSvgArc(lastPoint.x, lastPoint.y, targetPosition.x, targetPosition.y, 100);
  }, [scaledPathTree, letterIDimensions, isPortrait]);

  const path = scaledPathTree?.path + curve;

  if (!scaledPathTree || !isContentReady) {
    return null;
  }

  const speed = 250;

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
