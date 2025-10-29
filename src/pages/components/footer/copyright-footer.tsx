import { motion } from 'framer-motion';

import { useScreenSizeContext } from '@/components/providers/use-context';

export const Footer = () => {
  const { isPortrait } = useScreenSizeContext();

  if (isPortrait) {
    return null;
  }

  return (
    <motion.div
      className="relative bottom-4 left-1/2 mt-16 -translate-x-1/2 transform text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.0 }}
    >
      <p className="text-sm text-slate-500">
        © {new Date().getFullYear()} Xenia Liubachka. All rights reserved.
      </p>
    </motion.div>
  );
};
