import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_MASK =
  'linear-gradient(to bottom, transparent 0%, white 30%, white 70%, transparent 100%), linear-gradient(to right, transparent 0%, white 30%, white 70%, transparent 100%)';

interface ImageMaskProps {
  src: string;
  mask?: string;
  className?: string;
  style?: React.CSSProperties;
  isPortrait?: boolean;
}

export const ImageMask = forwardRef<HTMLImageElement, ImageMaskProps>(
  ({ src, mask, className = '', style = {}, isPortrait }, ref) => {
    const activeMask = mask || DEFAULT_MASK;

    return (
      <motion.div
        className={className}
        style={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          ref={ref}
          src={src}
          alt="masked"
          className={`h-auto object-cover ${isPortrait ? 'max-h-[80vh]' : 'h-full w-auto'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            WebkitMaskImage: activeMask,
            maskImage: activeMask,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in',
          }}
        />
      </motion.div>
    );
  },
);
