import { createContext, useContext } from 'react';

import type { useScreenSize } from '@/shared/lib/hooks/use-screen-size';

export const ScreenSizeContext = createContext<ReturnType<typeof useScreenSize> | undefined>(
  undefined,
);

export function useScreenSizeContext() {
  const context = useContext(ScreenSizeContext);

  if (!context) {
    throw new Error('useScreenSizeContext must be used within a ScreenSizeProvider');
  }

  return context;
}
