import type { ReactNode } from 'react';

import { useScreenSize } from '../../hooks/use-screen-size';
import { ScreenSizeContext } from './use-context';

export function ScreenSizeProvider({ children }: { children: ReactNode }) {
  const value = useScreenSize();

  return <ScreenSizeContext.Provider value={value}>{children}</ScreenSizeContext.Provider>;
}
