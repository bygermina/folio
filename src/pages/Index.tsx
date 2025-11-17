import { lazy, Suspense } from 'react';

import { ScreenSizeProvider } from '@/components/providers/screen-size-provider';
import LightFollowCoursor from '@/components/animations/light/light-follow';
import CodeBackground from '@/components/basic/code-background/code-background';

import { Footer } from './components/footer/copyright-footer';
import { FirstScreen } from './components/first-screen/first-screen';

import styles from './index.module.scss';

const SecondScreen = lazy(() =>
  import('./components/second-screen/second-screen').then((module) => ({
    default: module.SecondScreen,
  })),
);

const Index = () => {
  return (
    <ScreenSizeProvider>
      <div className={styles.root}>
        <CodeBackground className={styles.codeBackground} />
        <LightFollowCoursor />
        <div className={styles.scrollContainer}>
          <div id="home">
            <FirstScreen />
          </div>
          <div id="js-animations">
            <Suspense fallback={null}>
              <SecondScreen />
            </Suspense>
          </div>
          <Footer />
        </div>
      </div>
    </ScreenSizeProvider>
  );
};

export default Index;
