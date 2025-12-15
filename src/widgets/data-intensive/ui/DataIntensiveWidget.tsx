import { memo, useEffect, useRef } from 'react';

import { Card } from '@/shared/ui/card/card';
import { VirtualizedTable } from '@/shared/ui/virtualized-table/virtualized-table';
import { Typography } from '@/shared/ui/typography/typography';
import { BREAKPOINTS } from '@/shared/lib/breakpoints';
import { cn } from '@/shared/lib/cn';
import { DataRow, useDataIntenseStore, useRandomCardFlash } from '@/features/data-intensive';
import { useElementDimensions } from '@/shared/lib/hooks/use-element-dimensions';
import { useIntersectionObserver } from '@/shared/lib/hooks/use-intersection-observer';
import { useScreenSize } from '@/shared/lib/hooks/use-screen-size';

import styles from './data-intensive.module.scss';

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

const DataIntensiveWidgetComponent = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useElementDimensions(containerRef, true).width;
  const isInViewport = useIntersectionObserver(sectionRef, { threshold: 0 });
  const { screenHeight, screenWidth } = useScreenSize();
  const viewportHeight = screenHeight || 600;
  const rowCount = useDataIntenseStore((state) => state.rows.length);
  const itemsPerRow = useDataIntenseStore((state) => state.itemsPerRow);
  const setItemsPerRow = useDataIntenseStore((state) => state.setItemsPerRow);

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
        <div ref={containerRef} className={cn(styles.dataContainer, styles.dataContainerWrapper)}>
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
};

export const DataIntensiveWidget = memo(DataIntensiveWidgetComponent);
