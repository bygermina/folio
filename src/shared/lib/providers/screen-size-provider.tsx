import type { ReactNode } from 'react';

import { useScreenSize } from '@/shared/lib/hooks/use-screen-size';
import { ScreenSizeContext } from '@/shared/lib/providers/use-context';

export function ScreenSizeProvider({ children }: { children: ReactNode }) {
  const value = useScreenSize();

  return <ScreenSizeContext.Provider value={value}>{children}</ScreenSizeContext.Provider>;
}
