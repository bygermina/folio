import { cn } from '@/shared/lib/cn';

import { useTabsContext } from './tabs-context';
import { type TabPanelProps } from './tabs.types';

import styles from './tabs.module.scss';

export const TabPanel = ({ value, children, className }: TabPanelProps) => {
  const { activeTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      id={`${baseId}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${value}`}
      className={cn(styles.tabPanel, className)}
    >
      {children}
    </div>
  );
};
