import { memo, useEffect, useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { Typography } from '@/components/basic/typography/typography';
import VirtualizedTable from '@//components/virtualized-table/virtualized-table';
import { useElementDimensions } from '@/hooks/use-element-dimensions';
import { useElementVisible } from '@/hooks/use-element-visible';

import { DataRow } from './data-row';
import { useStore } from './store';

import styles from './third-screen.module.scss';

const ROW_HEIGHT = 56;
const GAP = 8;

export const ThirdScreen = memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useElementVisible(sectionRef);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementDimensions(containerRef, true).width;
  const rowCount = useStore((state) => state.rows.length);
  const itemsPerRow = useStore((state) => state.itemsPerRow);
  const setItemsPerRow = useStore((state) => state.setItemsPerRow);
  const triggerRandomFlash = useStore((state) => state.triggerRandomFlash);

  useEffect(() => {
    if (!isVisible) return;

    const flashInterval = setInterval(() => {
      triggerRandomFlash(3);
    }, 150);

    return () => {
      clearInterval(flashInterval);
    };
  }, [isVisible, triggerRandomFlash]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container || containerWidth <= 0) return;

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
  }, [containerWidth, itemsPerRow, setItemsPerRow]);

  return (
    <section className={styles.section} ref={sectionRef}>
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
          Rendering {rowCount * itemsPerRow} data points
        </Typography>
      </motion.div>

      <motion.div
        ref={containerRef}
        className={styles.dataContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {rowCount > 0 ? (
          <VirtualizedTable
            rowCount={rowCount}
            rowComponent={DataRow}
            rowHeight={ROW_HEIGHT}
            height={600}
          />
        ) : (
          <div className={styles.loading}>Loading data...</div>
        )}
      </motion.div>
    </section>
  );
});

ThirdScreen.displayName = 'ThirdScreen';
