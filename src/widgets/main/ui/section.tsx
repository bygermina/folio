import { useCallback, useRef, useState } from 'react';

import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { cn } from '@/shared/lib/cn';

import { TreeSection, type TreeSectionRef } from './tree-section';
import { Content } from './content';
import { PathEffects } from './path-effects';

import styles from './section.module.scss';

interface SectionProps {
  onExploreClick?: () => void;
}

export const Section = ({ onExploreClick }: SectionProps) => {
  const { screenMode, screenWidth, screenHeight } = useScreenSizeContext();

  const sectionRef = useRef<HTMLElement | null>(null);
  const letterIRef = useRef<HTMLSpanElement>(null);

  const [treeElement, setTreeElement] = useState<TreeSectionRef | null>(null);
  const [isContentReady, setIsContentReady] = useState(false);

  const treeRefCallback = useCallback((node: TreeSectionRef | null) => {
    setTreeElement(node);
  }, []);

  return (
    <section ref={sectionRef} className={cn(styles.root, styles[`root${screenMode}`])}>
      <TreeSection
        ref={treeRefCallback}
        isContentReady={isContentReady}
        containerRef={sectionRef}
      />
      <Content
        key={`${screenWidth}-${screenHeight}`}
        letterRef={letterIRef}
        onContentReady={setIsContentReady}
        onExploreClick={onExploreClick}
      />

      <PathEffects
        key={`effects-${screenWidth}-${screenHeight}`}
        letterIRef={letterIRef}
        isContentReady={isContentReady}
        targetElement={treeElement}
        containerRef={sectionRef}
      />
    </section>
  );
};
