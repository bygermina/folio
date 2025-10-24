import LightFollowCoursor from '@/components/animations/light-follow';
import { Particles } from '@/components/animations/particles';
import { Vignette } from '@/pages/components/vignette';

import { Footer } from './components/copyright-footer';
import CodeBackground from './components/code-background';
import { Section } from './components/section';
import { ScreenSizeProvider } from '../components/providers/screen-size-provider';

const Index = () => {
  return (
    <>
      <CodeBackground />
      <ScreenSizeProvider>
        <LightFollowCoursor />
        <Section />
        <Footer />
      </ScreenSizeProvider>
      <Vignette />
      <Particles />
      {/* <RouteDrawer /> */}
    </>
  );
};

export default Index;
