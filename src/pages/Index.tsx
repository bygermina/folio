import { ScreenSizeProvider } from '@/components/providers/screen-size-provider';
import LightFollowCoursor from '@/components/animations/light/light-follow';

import { Footer } from './components/footer/copyright-footer';
import { FirstScreen } from './components/first-screen/first-screen';
import { SecondScreen } from './components/second-screen/second-screen';

const Index = () => {
  return (
    <ScreenSizeProvider>
      <FirstScreen />
      <SecondScreen />
      <Footer />
      <LightFollowCoursor />
    </ScreenSizeProvider>
  );
};

export default Index;
