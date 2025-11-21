import { forwardRef } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';
import { Picture } from '@/components/basic/picture/picture';
import { type PictureSource } from '@/components/basic/picture/picture.utils';

import styles from './image-mask.module.scss';

const ANIMATION_DURATION = {
  container: 0.5,
  image: 0.8,
};

const ANIMATION_DELAY = {
  image: 0.2,
};

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
      <motion.div
        className={className}
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION.container }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATION.image, delay: ANIMATION_DELAY.image }}
          className={cn(styles.imageWrapper, styles[`imageWrapper${variant}`], imageClassName)}
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
        </motion.div>
      </motion.div>
    );
  },
);
