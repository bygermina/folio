import { Particles } from '@/shared/ui/animation/particles/particles';
import { Section } from './section';
import { Vignette } from './vignette';

export const MainWidget = () => {
  return (
    <>
      <Section />
      <Vignette />
      <Particles />
    </>
  );
};
