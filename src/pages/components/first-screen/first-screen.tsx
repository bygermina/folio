import { Particles } from '@/components/animations/particles/particles';

import { Section } from './components/section';
import { Vignette } from './components/vignette';

export const FirstScreen = () => {
  return (
    <>
      <Section />
      <Vignette />
      <Particles />
      {/* <RouteDrawer /> */}
    </>
  );
};
