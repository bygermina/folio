import { memo, useEffect, useRef, useDeferredValue } from 'react';

import { Card } from '@/shared/ui/card/card';
import { VirtualizedTable } from '@/shared/ui/virtualized-table/virtualized-table';
import { Typography } from '@/shared/ui/typography/typography';
import {
  DataRow,
  useDataIntenseStore,
  useRandomCardFlash,
  calculateItemsPerRow,
  DATA_GRID,
} from '@/features/data-intensive';
import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';
import { useScreenSize } from '@/shared/lib/hooks/use-screen-size';
import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import styles from './data-intensive.module.scss';

const DataIntensiveWidgetComponent = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useElementDimensions(containerRef, true).width;
  const deferredContainerWidth = useDeferredValue(containerWidth);
  const isInViewport = useIntersectionObserver(sectionRef, { threshold: 0 });
  const { screenHeight } = useScreenSize();
  const { isMobile } = useScreenSizeContext();
  const viewportHeight = screenHeight ?? 600;
  const rowCount = useDataIntenseStore((state) => state.rows.length);
  const itemsPerRow = useDataIntenseStore((state) => state.itemsPerRow);
  const setItemsPerRow = useDataIntenseStore((state) => state.setItemsPerRow);

  useRandomCardFlash({
    container: containerRef.current,
    isEnabled: rowCount > 0 && itemsPerRow > 0 && isInViewport,
  });

  useEffect(() => {
    const calculatedItemsPerRow = calculateItemsPerRow({ containerWidth: deferredContainerWidth });

    if (calculatedItemsPerRow && calculatedItemsPerRow !== itemsPerRow) {
      setItemsPerRow(calculatedItemsPerRow);
    }
  }, [deferredContainerWidth, itemsPerRow, setItemsPerRow]);

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
        <div ref={containerRef} className={styles.dataContainer}>
          {rowCount > 0 ? (
            <VirtualizedTable
              rowCount={rowCount}
              rowComponent={DataRow}
              rowHeight={DATA_GRID.ROW_HEIGHT}
              height={isMobile ? viewportHeight * 0.6 : 600}
            />
          ) : (
            <div className={styles.loading}>Loading data...</div>
          )}
        </div>
      </Card>
    </div>
  );
};

export const DataIntensiveWidget = memo(DataIntensiveWidgetComponent);
