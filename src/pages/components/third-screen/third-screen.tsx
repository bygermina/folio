import { memo, useEffect, useRef } from 'react';

import { Typography } from '@/components/basic/typography/typography';
import VirtualizedTable from '@//components/virtualized-table/virtualized-table';
import { useElementDimensions } from '@/hooks/use-element-dimensions';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { Card } from '@/components/basic/card/card';

import { DataRow } from './data-row';
import { useStore } from './store';

import styles from './third-screen.module.scss';

const ROW_HEIGHT = 56;
const GAP = 8;

export const ThirdScreen = memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0 });
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

  useEffect(() => {
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

  const headingId = 'data-intensive-heading';

  return (
    <div className={styles.section} ref={sectionRef} aria-labelledby={headingId}>
      <div className={styles.headingWrapper}>
        <Typography id={headingId} variant="h1" className={styles.heading}>
          Data intensive
        </Typography>
      </div>

      <div className={styles.subheadingWrapper}>
        <Typography variant="subheading" className={styles.subheading} color="muted">
          <Typography as="span" variant="body" color="primary" weight="medium">
            Issue:
          </Typography>{' '}
          Rendering {rowCount * itemsPerRow} data points
        </Typography>
      </div>

      <Card>
        <div ref={containerRef} className={`${styles.dataContainer} ${styles.dataContainerWrapper}`}>
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
        </div>
      </Card>
    </div>
  );
});

ThirdScreen.displayName = 'ThirdScreen';
