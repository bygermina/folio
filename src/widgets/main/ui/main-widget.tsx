import { Particles } from '@/shared/ui/animation/particles/particles';

import { MainWidgetProvider } from '../model/context';
import { Section } from './section';
import { Vignette } from './vignette';

interface MainWidgetProps {
  onExploreClick?: () => void;
  animate?: boolean;
}

export const MainWidget = ({ onExploreClick, animate = true }: MainWidgetProps) => {
  return (
    <MainWidgetProvider animate={animate}>
      <Section onExploreClick={onExploreClick} />
      <Vignette />
      <Particles />
    </MainWidgetProvider>
  );
};
