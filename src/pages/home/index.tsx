import { ScreenSizeProvider } from '@/shared/lib/providers/screen-size-provider';
import { CodeBackground } from '@/shared/ui/code-background/code-background';
import { ExploreTabsWidget } from '@/widgets/explore-tabs';

import styles from './index.module.scss';

const Index = () => {
  return (
    <ScreenSizeProvider>
      <div className={styles.root}>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
        <div aria-hidden="true">
          <CodeBackground />
        </div>
        <main id="main-content" className={styles.scrollContainer}>
          <div className={styles.tabsContainer}>
            <ExploreTabsWidget />
          </div>
        </main>
      </div>
    </ScreenSizeProvider>
  );
};

export default Index;
