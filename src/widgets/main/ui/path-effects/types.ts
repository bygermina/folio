import type { RefObject } from 'react';

import type { TreeSectionRef } from '../tree-section';

export interface PathEffectsProps {
  letterIRef: RefObject<HTMLSpanElement | null>;
  isContentReady: boolean;
  targetElement: TreeSectionRef | null;
  containerRef: RefObject<HTMLElement | null>;
}

export interface ScaledPath {
  path: string;
  delay: number;
}
