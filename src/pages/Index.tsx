import { lazy, Suspense } from 'react';

import { ScreenSizeProvider } from '@/components/providers/screen-size-provider';
import LightFollowCoursor from '@/components/animations/light/light-follow';
import CodeBackground from '@/components/basic/code-background/code-background';
import SvgScrollDraw from '@/components/animations/scroll-path/scroll-path';

import { Footer } from './components/footer/copyright-footer';
import { FirstScreen } from './components/first-screen/first-screen';

import styles from './index.module.scss';

const SecondScreen = lazy(() =>
  import('./components/second-screen/second-screen').then((module) => ({
    default: module.SecondScreen,
  })),
);

const ThirdScreen = lazy(() =>
  import('./components/third-screen/third-screen').then((module) => ({
    default: module.ThirdScreen,
  })),
);

const rawPath =
  'm 209.58944,143.23578 h -28.892 l -10.28359,10.28359 h -26.19868 l -10.2836,10.2836 -10.40602,10.40601 H 88.634788 L 76.576051,186.26772 H 0';

const Index = () => {
  return (
    <ScreenSizeProvider>
      <div className={styles.root}>
        <CodeBackground className={styles.codeBackground} />
        <LightFollowCoursor />
        <main className={styles.scrollContainer}>
          <SvgScrollDraw
            path={rawPath}
            scrollStart={0}
            scrollEnd={0.3}
            fixAxis="x"
            offsetYPercent={0.27}
            strokeWidth={0.5}
            strokeColor="var(--color-blue-400)"
            showSparkle
          />
          <section id="home">
            <FirstScreen />
          </section>
          <section id="js-animations">
            <Suspense fallback={null}>
              <SecondScreen />
            </Suspense>
          </section>
          <section id="data-intensive">
            <Suspense fallback={null}>
              <ThirdScreen />
            </Suspense>
          </section>
          <Footer />
        </main>
      </div>
    </ScreenSizeProvider>
  );
};

export default Index;
