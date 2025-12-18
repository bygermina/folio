import { useState } from 'react';

import { ScreenSizeProvider } from '@/shared/lib/providers/screen-size-provider';
import { LightFollowCoursor } from '@/shared/ui/animation/light/light-follow';
import { CodeBackground } from '@/shared/ui/code-background/code-background';
//import { SvgScrollDraw } from '@/shared/ui/animation/scroll-path/scroll-path';
import { MainWidget } from '@/widgets/main';
import { FooterWidget } from '@/widgets/footer';
import { ExploreTabsWidget } from '@/widgets/explore-tabs';

import styles from './index.module.scss';

// const rawPath =
//   'm 209.58944,143.23578 h -28.892 l -10.28359,10.28359 h -26.19868 l -10.2836,10.2836 -10.40602,10.40601 H 88.634788 L 76.576051,186.26772 H 0';

const Index = () => {
  const [showTabs, setShowTabs] = useState(false);

  return (
    <ScreenSizeProvider>
      <div className={styles.root}>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
        <div aria-hidden="true">
          <CodeBackground />
          <LightFollowCoursor />
        </div>
        <main id="main-content" className={styles.scrollContainer}>
          {showTabs && (
            <div className={styles.tabsContainer}>
              <ExploreTabsWidget />
            </div>
          )}
          {/* <SvgScrollDraw
            path={rawPath}
            scrollStart={0}
            scrollEnd={0.3}
            fixAxis="x"
            offsetYPercent={0.27}
            strokeWidth={0.5}
            strokeColor="var(--color-blue-400)"
            showSparkle
          /> */}
          <MainWidget onExploreClick={() => setShowTabs(true)} />
          <FooterWidget />
        </main>
      </div>
    </ScreenSizeProvider>
  );
};

export default Index;
