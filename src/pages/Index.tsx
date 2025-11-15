import { ScreenSizeProvider } from '@/components/providers/screen-size-provider';
import LightFollowCoursor from '@/components/animations/light/light-follow';
import CodeBackground from '@/components/basic/code-background';

import { Footer } from './components/footer/copyright-footer';
import { FirstScreen } from './components/first-screen/first-screen';
import { SecondScreen } from './components/second-screen/second-screen';

const Index = () => {
  return (
    <ScreenSizeProvider>
      <div className="relative 100dvh">
        <CodeBackground className="fixed inset-0 z-0" />
        <LightFollowCoursor />
        <div className="relative z-[1] h-full overflow-y-auto overflow-x-hidden [-webkit-overflow-scrolling:touch]">
          <div id="home">
            <FirstScreen />
          </div>
          <div id="js-animations">
            <SecondScreen />
          </div>
          <Footer />
        </div>
      </div>
    </ScreenSizeProvider>
  );
};

export default Index;
