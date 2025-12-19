import { createContext, useContext, useState, useId, useTransition, useCallback, type ReactNode } from 'react';

export interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  baseId: string;
  isPending: boolean;
  tabs: string[];
  registerTab: (value: string) => void;
  unregisterTab: (value: string) => void;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
};

interface TabsProviderProps {
  children: ReactNode;
  defaultValue: string;
  onValueChange?: (value: string) => void;
}

export const TabsProvider = ({ children, defaultValue, onValueChange }: TabsProviderProps) => {
  const [activeTab, setActiveTabState] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const [tabs, setTabs] = useState<string[]>([]);
  const baseId = useId();

  const setActiveTab = useCallback(
    (value: string) => {
      startTransition(() => {
        setActiveTabState(value);
        onValueChange?.(value);
      });
    },
    [onValueChange],
  );

  const registerTab = useCallback((value: string) => {
    setTabs((prev) => {
      if (!prev.includes(value)) {
        return [...prev, value];
      }
      return prev;
    });
  }, []);

  const unregisterTab = useCallback((value: string) => {
    setTabs((prev) => prev.filter((tab) => tab !== value));
  }, []);

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab, baseId, isPending, tabs, registerTab, unregisterTab }}
    >
      {children}
    </TabsContext.Provider>
  );
};

