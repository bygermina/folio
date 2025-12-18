import { useMainWidgetContext } from '../../model/use-main-widget-context';

import { AnimatedPathEffects } from './animated-path-effects';
import { StaticPathEffects } from './static-path-effects';
import type { PathEffectsProps } from './types';

export const PathEffects = (props: PathEffectsProps) => {
  const { animate } = useMainWidgetContext();

  return animate ? <AnimatedPathEffects {...props} /> : <StaticPathEffects {...props} />;
};
