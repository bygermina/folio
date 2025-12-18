import { useContext } from 'react';

import { MainWidgetContext } from './main-widget-context';

export const useMainWidgetContext = () => {
  const context = useContext(MainWidgetContext);
  if (!context) throw new Error('useMainWidgetContext must be used within MainWidgetProvider');
  return context;
};
