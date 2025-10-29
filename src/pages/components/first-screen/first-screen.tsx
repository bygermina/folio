import { Section } from './components/section';
import { Vignette } from './components/vignette';
import { Particles } from '@/components/animations/particles';

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
