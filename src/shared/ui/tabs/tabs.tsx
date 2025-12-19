import { cn } from '@/shared/lib/cn';

import { TabsProvider } from './tabs-context';
import { type TabsProps } from './tabs.types';

import styles from './tabs.module.scss';

export const Tabs = ({ children, defaultValue, className, onValueChange }: TabsProps) => {
  return (
    <TabsProvider defaultValue={defaultValue} onValueChange={onValueChange}>
      <div className={cn(styles.root, className)}>{children}</div>
    </TabsProvider>
  );
};
