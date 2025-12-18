import { Suspense, lazy, useState } from 'react';

import { Tabs, TabList, Tab, TabPanel } from '@/shared/ui/tabs/tabs';
import { MainWidget } from '@/widgets/main';
import { FooterWidget } from '@/widgets/footer';
import { cn } from '@/shared/lib/cn';

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
  // {
  //   title: 'Dynamic forms',
  //   description: '',
  // },
  {
    title: 'Charts',
    description: 'Charts custom and build with different libraries.',
  },
  // {
  //   title: 'Actions on scroll',
  //   description: '',
  //   component: ,
  // },
];

export const ExploreTabsWidget = () => {
  const [hasExplored, setHasExplored] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const handleExploreClick = () => {
    setHasExplored(true);
  };

  const hoveredDescription = TABS_DATA.find((tab) => tab.title === hoveredTab)?.description;

  return (
    <Tabs defaultValue={TABS_DATA[0].title} className={styles.tabs}>
      {hasExplored && (
        <div className={styles.tabListWrapper}>
          <TabList className={styles.tabList}>
            {TABS_DATA.map((tab) => (
              <Tab
                key={tab.title}
                value={tab.title}
                onMouseEnter={() => setHoveredTab(tab.title)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {tab.title}
              </Tab>
            ))}
          </TabList>
          <div className={cn(styles.tooltip, hoveredDescription && styles.tooltipVisible)}>
            {hoveredDescription}
          </div>
        </div>
      )}

      <TabPanel value="Home">
        <MainWidget animate={!hasExplored} onExploreClick={handleExploreClick} />
        <FooterWidget />
      </TabPanel>

      {TABS_DATA.filter((tab) => tab.component).map((tab) => {
        const Component = tab.component!;
        return (
          <TabPanel key={tab.title} value={tab.title} className={styles.tabContent}>
            <Suspense
              fallback={
                <div className={styles.loading}>
                  <div className={styles.spinner} />
                  <span className={styles.loadingText}>Loading...</span>
                </div>
              }
            >
              <Component />
            </Suspense>
          </TabPanel>
        );
      })}
    </Tabs>
  );
};
