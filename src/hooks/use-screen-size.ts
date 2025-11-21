import { useState, useEffect, useMemo, useCallback } from 'react';

import { BREAKPOINTS } from '@/constants/breakpoints';

export const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const isPortrait = screenHeight > screenWidth;
  const isSquare = isPortrait && screenHeight / screenWidth < 1.3;

  const updateScreenSize = useCallback(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (newWidth === screenWidth && newHeight === screenHeight) return;

    setScreenWidth(newWidth);
    setScreenHeight(newHeight);
  }, [screenWidth, screenHeight]);

  useEffect(() => {
    let timeoutId: number;
    let rafId: number | null = null;

    const throttledResize = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(updateScreenSize, 100);
        rafId = null;
      });
    };

    window.addEventListener('resize', throttledResize, { passive: true });

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateScreenSize]);

  const deviceInfo = useMemo(
    () => ({
      isMobile: screenWidth < BREAKPOINTS.MOBILE,
      isTablet: screenWidth >= BREAKPOINTS.MOBILE && screenWidth < BREAKPOINTS.TABLET,
      isDesktop: screenWidth >= BREAKPOINTS.TABLET,
    }),
    [screenWidth],
  );

  const screenMode = isPortrait ? 'Portrait' : 'Landscape';
  const containerScreenMode = isSquare ? 'Square' : screenMode;

  return {
    screenWidth,
    screenHeight,
    isPortrait,
    screenMode,
    containerScreenMode,
    ...deviceInfo,
  };
};
