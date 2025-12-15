import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';
import { Picture } from '@/shared/ui/picture/picture';
import { type PictureSource } from '@/shared/ui/picture/picture.utils';

import styles from './image-mask.module.scss';

export type ImageMaskVariant = 'Gradient' | 'None';

interface ImageMaskProps {
  src: string;
  variant?: ImageMaskVariant;
  className?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
  sources?: PictureSource[];
  srcSet?: string;
  sizes?: string;
  alt?: string;
}

export const ImageMask = forwardRef<HTMLImageElement, ImageMaskProps>(
  (
    {
      src,
      variant = 'Gradient',
      className,
      imageClassName,
      style,
      sources,
      srcSet,
      sizes,
      alt = 'masked',
    },
    ref,
  ) => {
    return (
      <div className={cn(styles.container, className)} style={style}>
        <div
          className={cn(
            styles.imageWrapper,
            styles.imageWrapperAnimated,
            styles[`imageWrapper${variant}`],
            imageClassName,
          )}
        >
          <Picture
            ref={ref}
            src={src}
            alt={alt}
            sources={sources}
            srcSet={srcSet}
            sizes={sizes}
            className={styles.picture}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    );
  },
);
