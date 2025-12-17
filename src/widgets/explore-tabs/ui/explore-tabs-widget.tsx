import { Suspense, lazy } from 'react';

import { Tabs, TabList, Tab, TabPanel } from '@/shared/ui/tabs/tabs';
import { Typography } from '@/shared/ui/typography/typography';

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
    title: 'Data intensive tables with virtualized rendering',
    description: 'Virtualized data tables designed for scale, performance, and control.',
    component: DataIntensiveWidget,
  },
  {
    title: 'Huge Dynamic forms',
    description: 'Years of experience building modern web applications...',
  },
  {
    title: 'Real time charts and diagrams',
    description: 'Charts custom and  build with different libraries.',
  },
];

export const ExploreTabsWidget = () => {
  return (
    <Tabs defaultValue={TABS_DATA[0].title} className={styles.tabs}>
      <TabList>
        {TABS_DATA.map((tab) => (
          <Tab key={tab.title} value={tab.title}>
            {tab.title}
          </Tab>
        ))}
      </TabList>
      {TABS_DATA.map((tab) =>
        tab.component && tab.description ? (
          <TabPanel key={tab.title} value={tab.title}>
            <div className={styles.tabContent}>
              <Typography variant="body" className={styles.description}>
                {tab.description}
              </Typography>
            </div>
            <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
              <tab.component />
            </Suspense>
          </TabPanel>
        ) : null,
      )}
    </Tabs>
  );
};
