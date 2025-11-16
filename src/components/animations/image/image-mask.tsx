import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

import styles from './image-mask.module.scss';

const DEFAULT_MASK =
  'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.5) 20%, white 30%, white 70%, rgba(255,255,255,0.5) 80%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(255,255,255,0.5) 20%, white 30%, white 70%, rgba(255,255,255,0.5) 80%, transparent 100%)';

const ANIMATION_DURATION = {
  container: 0.5,
  image: 0.8,
};

const ANIMATION_DELAY = {
  image: 0.2,
};

interface ImageMaskProps {
  src: string;
  mask?: string;
  className?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
}

export const ImageMask = forwardRef<HTMLImageElement, ImageMaskProps>(
  ({ src, mask = DEFAULT_MASK, className, imageClassName, style }, ref) => {
    const maskStyle = {
      WebkitMaskImage: mask,
      maskImage: mask,
    };

    return (
      <motion.div
        className={cn(styles.container, className)}
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION.container }}
      >
        <motion.img
          ref={ref}
          src={src}
          alt="masked"
          className={cn(styles.image, imageClassName)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATION.image, delay: ANIMATION_DELAY.image }}
          style={maskStyle}
        />
      </motion.div>
    );
  },
);
