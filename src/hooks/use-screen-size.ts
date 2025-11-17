import { useState, useEffect, useMemo, useCallback } from 'react';

export const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const isPortrait = screenHeight > screenWidth;
  const isSquare = isPortrait && screenHeight / screenWidth < 1.3;

  const updateScreenSize = useCallback(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    setScreenWidth((prev) => (prev !== newWidth ? newWidth : prev));
    setScreenHeight((prev) => (prev !== newHeight ? newHeight : prev));
  }, []);

  useEffect(() => {
    let timeoutId: number;
    let rafId: number | null = null;

    const throttledResize = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        clearTimeout(timeoutId);
        timeoutId = window.setTimeout(updateScreenSize, 100); // Оптимизированный throttle
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
      isMobile: screenWidth < 768,
      isTablet: screenWidth >= 768 && screenWidth < 1024,
      isDesktop: screenWidth >= 1024,
    }),
    [screenWidth],
  );

  const screenMode = isPortrait ? 'portrait' : 'landscape';
  const containerScreenMode = isSquare ? 'square' : screenMode;

  return {
    screenWidth,
    screenHeight,
    isPortrait,
    screenMode,
    containerScreenMode,
    ...deviceInfo,
  };
};
