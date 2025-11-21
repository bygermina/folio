import { motion } from 'framer-motion';

import { Typography } from '@/components/basic/typography/typography';

import { DataRow } from './data-row';
import VirtualizedTable from '../../../components/virtualized-table/virtualized-table';
import { useStore } from './store';

import styles from './third-screen.module.scss';

const DEFAULT_DATA_COUNT = 10000;

export const ThirdScreen = () => {
  const rows = useStore((state) => state?.rows);

  if (!rows?.length) {
    return (
      <section className={styles.section}>
        <div className={styles.loading}>Loading data...</div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.contentWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Typography variant="h1" className={styles.heading}>
              Data intensive
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.5 }}
          >
            <Typography variant="subheading" className={styles.subheading} color="muted">
              <Typography as="span" variant="body" color="primary" weight="medium">
                Issue:
              </Typography>{' '}
              Rendering {DEFAULT_DATA_COUNT} data points
            </Typography>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.dataContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <VirtualizedTable
            rows={rows}
            rowComponent={DataRow}
            rowHeight={56}
            height={600}
            gap={8}
          />
        </motion.div>
      </div>
    </section>
  );
};
