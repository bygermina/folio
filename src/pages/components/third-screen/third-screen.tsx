import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';
import { TypeText } from '@/components/animations/text/type-text';
import { useScreenSizeContext } from '@/components/providers/use-context';

import Row from '../../../components/virtualized-table/Row';
import VirtualizedTable from '../../../components/virtualized-table/virtualized-table';
import { useStore } from './store';

import styles from './third-screen.module.scss';

const DEFAULT_DATA_COUNT = 10000;

export const ThirdScreen = () => {
  const { screenMode } = useScreenSizeContext();

  const entityIds = useStore((state) => state?.entityIds);

  if (!entityIds || !Array.isArray(entityIds) || entityIds.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h2
            className={cn('glass-text-shine', styles.heading, `heading-${screenMode}`)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <TypeText
              text="data intensive"
              className={cn('glass-text-shine', `heading-${screenMode}`)}
              speed={0.08}
              delay={0.6}
            />
          </motion.h2>

          <motion.p
            className={cn(styles.subheading, `subheading-${screenMode}`)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.5 }}
          >
            <span className={styles.issueLabel}>Issue:</span> Rendering{' '}
            {DEFAULT_DATA_COUNT.toLocaleString()} data points without optimization
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.dataContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <VirtualizedTable
            items={entityIds}
            rowComponent={Row}
            rowHeight={56}
            height={600}
            columnCount={20}
            gap={8}
          />
        </motion.div>
      </div>
    </section>
  );
};
