import { Particles } from '@/shared/ui/animation/particles/particles';

import { Section } from './section';
import { Vignette } from './vignette';

interface MainWidgetProps {
  onExploreClick?: () => void;
}

export const MainWidget = ({ onExploreClick }: MainWidgetProps) => {
  return (
    <>
      <Section onExploreClick={onExploreClick} />
      <Vignette />
      <Particles />
    </>
  );
};
