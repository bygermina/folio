import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { ScreenSizeProvider } from '@/shared/lib/providers/screen-size-provider';
import { CodeBackground } from '@/shared/ui/code-background/code-background';
import { LoadingFallback } from '@/shared/ui/loading-fallback';
import { Navigation } from '@/widgets/navigation';

import styles from './layout.module.scss';

export const Layout = () => {
  return (
    <ScreenSizeProvider>
      <div className={styles.root}>
        <a href="#main-content" className={styles.skipLink}>
          Skip to main content
        </a>
        <div aria-hidden="true">
          <CodeBackground />
        </div>
        <Navigation>
          <main id="main-content" className={styles.scrollContainer}>
            <Suspense fallback={<LoadingFallback />}>
              <Outlet />
            </Suspense>
          </main>
        </Navigation>
      </div>
    </ScreenSizeProvider>
  );
};
