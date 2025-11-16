import { motion } from 'framer-motion';

import styles from './section-divider.module.scss';

interface SectionDividerProps {
  text?: string;
}

export const SectionDivider = ({ text }: SectionDividerProps) => {
  return (
    <div className={styles.divider}>
      {text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={styles.label}
        >
          <span className={styles.labelText}>{text}</span>
        </motion.div>
      )}
    </div>
  );
};
