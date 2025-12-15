export interface PictureSource {
  srcSet: string;
  media?: string;
  type?: string;
  sizes?: string;
}

export const createResponsiveSources = (
  images: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  },
  options?: {
    mobileBreakpoint?: string;
    tabletBreakpoint?: string;
  },
): PictureSource[] => {
  const {
    mobileBreakpoint = '(max-width: 767px)',
    tabletBreakpoint = '(min-width: 768px) and (max-width: 1023px)',
  } = options || {};

  const sources: PictureSource[] = [];

  if (images.desktop) {
    sources.push({
      srcSet: images.desktop,
      media: '(min-width: 1024px)',
    });
  }

  if (images.tablet) {
    sources.push({
      srcSet: images.tablet,
      media: tabletBreakpoint,
    });
  }

  if (images.mobile) {
    sources.push({
      srcSet: images.mobile,
      media: mobileBreakpoint,
    });
  }

  return sources;
};


