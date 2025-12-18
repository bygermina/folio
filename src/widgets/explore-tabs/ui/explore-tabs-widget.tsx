import { Suspense, lazy, useState } from 'react';

import { Tabs, TabList, Tab, TabPanel } from '@/shared/ui/tabs/tabs';
import { Typography } from '@/shared/ui/typography/typography';
import { MainWidget } from '@/widgets/main';
import { FooterWidget } from '@/widgets/footer';

import styles from './explore-tabs.module.scss';

const AnimationsShowcaseWidget = lazy(() =>
  import('@/widgets/animations-showcase').then((module) => ({
    default: module.AnimationsShowcaseWidget,
  })),
);

const DataIntensiveWidget = lazy(() =>
  import('@/widgets/data-intensive').then((module) => ({
    default: module.DataIntensiveWidget,
  })),
);

interface TabData {
  title: string;
  description?: string;
  component?: React.ComponentType;
}

const TABS_DATA: TabData[] = [
  {
    title: 'Home',
  },
  {
    title: 'JS animations',
    description: 'JavaScript animations built for high performance, predictability, and control',
    component: AnimationsShowcaseWidget,
  },
  {
    title: 'Data intensive',
    description: 'Virtualized data tables designed for scale, performance, and control.',
    component: DataIntensiveWidget,
  },
  {
    title: 'Dynamic forms',
    description: 'Years of experience building modern web applications...',
  },
  {
    title: 'Charts',
    description: 'Charts custom and build with different libraries.',
  },
];

export const ExploreTabsWidget = () => {
  const [hasExplored, setHasExplored] = useState(false);

  const handleExploreClick = () => {
    setHasExplored(true);
  };

  return (
    <Tabs defaultValue={TABS_DATA[0].title} className={styles.tabs}>
      {hasExplored && (
        <TabList className={styles.tabList}>
          {TABS_DATA.map((tab) => (
            <Tab key={tab.title} value={tab.title}>
              {tab.title}
            </Tab>
          ))}
        </TabList>
      )}

      <TabPanel value="Home">
        <MainWidget animate={!hasExplored} onExploreClick={handleExploreClick} />
        <FooterWidget />
      </TabPanel>

      {TABS_DATA.filter((tab) => tab.component && tab.description).map((tab) => {
        const Component = tab.component!;
        return (
          <TabPanel key={tab.title} value={tab.title} className={styles.tabContent}>
            <Typography variant="body" className={styles.description}>
              {tab.description}
            </Typography>
            <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
              <Component />
            </Suspense>
          </TabPanel>
        );
      })}
    </Tabs>
  );
};
