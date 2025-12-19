import { forwardRef } from 'react';

import { cn } from '@/shared/lib/cn';

import { type PictureSource } from './picture.utils';

import styles from './picture.module.scss';

export interface PictureProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  src: string;
  alt: string;
  sources?: PictureSource[];
  srcSet?: string;
  sizes?: string;
}

export const Picture = forwardRef<HTMLImageElement, PictureProps>(
  ({ src, alt, sources = [], srcSet, sizes, className, ...imgProps }, ref) => {
    const imgCommonProps = {
      ref,
      src,
      alt,
      className: cn(styles.image, className),
      ...imgProps,
    };

    if (sources.length > 0) {
      return (
        <picture className={cn(styles.picture, className)}>
          {sources.map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              media={source.media}
              type={source.type}
              sizes={source.sizes}
            />
          ))}
          <img {...imgCommonProps} alt={alt} />
        </picture>
      );
    }

    return <img {...imgCommonProps} alt={alt} srcSet={srcSet} sizes={sizes} />;
  },
);

Picture.displayName = 'Picture';
