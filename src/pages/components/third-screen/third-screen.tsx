import { memo, useEffect, useRef } from 'react';

import { Typography } from '@/components/basic/typography/typography';
import VirtualizedTable from '@//components/virtualized-table/virtualized-table';
import { useElementDimensions } from '@/hooks/use-element-dimensions';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useScreenSize } from '@/hooks/use-screen-size';
import { Card } from '@/components/basic/card/card';
import { BREAKPOINTS } from '@/constants/breakpoints';

import { DataRow } from './data-row';
import { useStore } from './store';
import { useRandomCardFlash } from './use-random-card-flash';

import styles from './third-screen.module.scss';

const ROW_HEIGHT = 56;
const GAP = 8;

interface ItemsPerRowParams {
  containerWidth: number;
}

const calculateItemsPerRow = ({ containerWidth }: ItemsPerRowParams): number => {
  if (containerWidth <= GAP) return 0;

  const cardSize = ROW_HEIGHT - GAP * 2;
  if (cardSize <= 0) return 0;

  const totalPerItem = cardSize + GAP;
  const effectiveWidth = containerWidth - GAP;

  return Math.max(1, Math.floor(effectiveWidth / totalPerItem));
};

export const ThirdScreen = memo(() => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementDimensions(containerRef, true).width;
  const isInViewport = useIntersectionObserver(sectionRef, { threshold: 0 });
  const { screenHeight, screenWidth } = useScreenSize();
  const viewportHeight = screenHeight || 600;
  const rowCount = useStore((state) => state.rows.length);
  const itemsPerRow = useStore((state) => state.itemsPerRow);
  const setItemsPerRow = useStore((state) => state.setItemsPerRow);

  useRandomCardFlash({
    container: containerRef.current,
    isEnabled: rowCount > 0 && itemsPerRow > 0 && isInViewport,
  });

  useEffect(() => {
    const calculatedItemsPerRow = calculateItemsPerRow({
      containerWidth,
    });

    if (!calculatedItemsPerRow || calculatedItemsPerRow === itemsPerRow) return;

    setItemsPerRow(calculatedItemsPerRow);
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
        <div
          ref={containerRef}
          className={`${styles.dataContainer} ${styles.dataContainerWrapper}`}
        >
          {rowCount > 0 ? (
            <VirtualizedTable
              rowCount={rowCount}
              rowComponent={DataRow}
              rowHeight={ROW_HEIGHT}
              height={screenWidth < BREAKPOINTS.MOBILE ? viewportHeight * 0.6 : 600}
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
