import { motion } from 'framer-motion';

import { useScreenSizeContext } from '@/components/providers/use-context';

import styles from './copyright-footer.module.scss';

export const Footer = () => {
  const { isPortrait } = useScreenSizeContext();

  if (isPortrait) return null;

  return (
    <div className={styles.footer}>
      <motion.p
        className={styles.footerText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        © {new Date().getFullYear()} Xenia Liubachka. All rights reserved.
      </motion.p>
    </div>
  );
};
