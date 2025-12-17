import { createContext, useContext, useState, useId, useTransition, type ReactNode } from 'react';

import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button/button';

import styles from './tabs.module.scss';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
  isPending: boolean;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
};

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = ({ children, defaultValue, className, onValueChange }: TabsProps) => {
  const [activeTab, setActiveTabState] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const baseId = useId();

  const setActiveTab = (value: string) => {
    startTransition(() => {
      setActiveTabState(value);
      onValueChange?.(value);
    });
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId, isPending }}>
      <div className={cn(styles.root, className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export const TabList = ({ children, className }: TabListProps) => {
  return (
    <div className={cn(styles.tabList, className)} role="tablist">
      {children}
    </div>
  );
};

interface TabProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const Tab = ({ value, children, className, disabled }: TabProps) => {
  const { activeTab, setActiveTab, baseId } = useTabsContext();
  const isActive = activeTab === value;

  const handleClick = () => {
    if (!disabled) setActiveTab(value);
  };

  return (
    <Button
      id={`${baseId}-tab-${value}`}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      aria-disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      variant="tab"
      size="sm"
      isActive={isActive}
      className={className}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

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
