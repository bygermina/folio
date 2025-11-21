import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { Typography } from '@/components/basic/typography/typography';
import VirtualizedTable from '@//components/virtualized-table/virtualized-table';
import { useElementDimensions } from '@/hooks/use-element-dimensions';

import { DataRow } from './data-row';
import { useStore } from './store';

import styles from './third-screen.module.scss';

const ROW_HEIGHT = 56;
const GAP = 8;

export const ThirdScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useElementDimensions(containerRef, true);
  const rows = useStore((state) => state?.rows);
  const itemsPerRow = useStore((state) => state?.itemsPerRow);
  const setItemsPerRow = useStore((state) => state?.setItemsPerRow);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const containerWidth = container.clientWidth;
    if (containerWidth <= 0) return;

    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

    const rowWidth = containerWidth - paddingLeft - paddingRight;
    const availableWidth = rowWidth - GAP * 2;
    const cardSize = ROW_HEIGHT - GAP * 2;

    const calculatedItemsPerRow = Math.max(
      1,
      Math.floor((availableWidth + GAP) / (cardSize + GAP)),
    );

    if (calculatedItemsPerRow !== itemsPerRow) setItemsPerRow(calculatedItemsPerRow);
  }, [dimensions.width, itemsPerRow, setItemsPerRow]);

  return (
    <section className={styles.section}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
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
          Rendering {rows.length * itemsPerRow} data points
        </Typography>
      </motion.div>

      <motion.div
        ref={containerRef}
        className={styles.dataContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {rows?.length ? (
          <VirtualizedTable
            rows={rows}
            rowComponent={DataRow}
            rowHeight={ROW_HEIGHT}
            height={600}
            gap={GAP}
          />
        ) : (
          <div className={styles.loading}>Loading data...</div>
        )}
      </motion.div>
    </section>
  );
};
