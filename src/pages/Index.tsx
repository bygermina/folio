import { ScreenSizeProvider } from '@/components/providers/screen-size-provider';
import { Footer } from './components/first-screen/components/copyright-footer';
import { FirstScreen } from './components/first-screen/first-screen';
import { SecondScreen } from './components/second-screen/second-screen';
import LightFollowCoursor from '@/components/animations/light/light-follow';

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
