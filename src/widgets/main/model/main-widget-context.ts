import { createContext } from 'react';

interface MainWidgetContextValue {
  animate: boolean;
}

export const MainWidgetContext = createContext<MainWidgetContextValue | null>(null);
