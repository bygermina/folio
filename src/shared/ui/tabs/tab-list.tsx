import { useRef, type KeyboardEvent } from 'react';

import { cn } from '@/shared/lib/cn';

import { useTabsContext } from './tabs-context';
import { type TabListProps } from './tabs.types';

import styles from './tabs.module.scss';

export const TabList = ({ children, className }: TabListProps) => {
  const { tabs, activeTab, setActiveTab } = useTabsContext();
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (tabs.length === 0) return;

    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    const nextTab = tabs[nextIndex];
    if (nextTab) {
      setActiveTab(nextTab);
      requestAnimationFrame(() => {
        const nextTabElement = tabListRef.current?.querySelector(
          `[id*="-tab-${nextTab}"]`,
        ) as HTMLElement;
        nextTabElement?.focus();
      });
    }
  };

  return (
    <div
      ref={tabListRef}
      className={cn(styles.tabList, className)}
      role="tablist"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      aria-orientation="horizontal"
    >
      {children}
    </div>
  );
};
