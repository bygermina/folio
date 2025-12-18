import type { ReactNode } from 'react';

import { MainWidgetContext } from './main-widget-context';

interface MainWidgetProviderProps {
  children: ReactNode;
  animate?: boolean;
}

export const MainWidgetProvider = ({ children, animate = true }: MainWidgetProviderProps) => {
  return <MainWidgetContext.Provider value={{ animate }}>{children}</MainWidgetContext.Provider>;
};
