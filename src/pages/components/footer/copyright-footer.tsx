import { motion } from 'framer-motion';

import { useScreenSizeContext } from '@/components/providers/use-context';

export const Footer = () => {
  const { isPortrait } = useScreenSizeContext();

  if (isPortrait) {
    return null;
  }

  return (
    <div className="relative p-4 text-center overflow-hidden">
      <motion.p
        className="text-sm text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        © {new Date().getFullYear()} Xenia Liubachka. All rights reserved.
      </motion.p>
    </div>
  );
};
