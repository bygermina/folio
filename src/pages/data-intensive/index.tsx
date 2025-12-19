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

import styles from './index.module.scss';
import widgetStyles from '@/widgets/data-intensive/ui/data-intensive.module.scss';

const DataIntensivePageComponent = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerWidth = useElementDimensions(containerRef, true).width;
  const deferredContainerWidth = useDeferredValue(containerWidth);
  const isInViewport = useIntersectionObserver(sectionRef, { threshold: 0 });
  const { screenHeight } = useScreenSize();
  const viewportHeight = screenHeight ?? 600;
  const rowCount = useDataIntenseStore((state) => state.rows.length);
  const itemsPerRow = useDataIntenseStore((state) => state.itemsPerRow);
  const setItemsPerRow = useDataIntenseStore((state) => state.setItemsPerRow);

  useRandomCardFlash({
    container: containerRef.current,
    isEnabled: rowCount > 0 && itemsPerRow > 0 && isInViewport,
  });

  useEffect(() => {
    const width =
      deferredContainerWidth || (containerRef.current?.getBoundingClientRect().width ?? 0);

    if (width > 0) {
      const calculatedItemsPerRow = calculateItemsPerRow({ containerWidth: width });

      if (calculatedItemsPerRow > 0 && calculatedItemsPerRow !== itemsPerRow) {
        setItemsPerRow(calculatedItemsPerRow);
      }
    }
  }, [deferredContainerWidth, itemsPerRow, setItemsPerRow]);

  const headingId = 'data-intensive-heading';

  return (
    <div className={styles.content}>
      <div className={widgetStyles.section} ref={sectionRef} aria-labelledby={headingId}>
        <div className={widgetStyles.headingWrapper}>
          <Typography id={headingId} variant="h1" className={widgetStyles.heading}>
            Data intensive
          </Typography>
        </div>

        <div className={widgetStyles.subheadingWrapper}>
          <Typography variant="subheading" className={widgetStyles.subheading} color="muted">
            <Typography as="span" variant="body" color="primary" weight="medium">
              Issue:
            </Typography>{' '}
            Rendering {rowCount * itemsPerRow} data points
          </Typography>
        </div>

        <Card>
          <div ref={containerRef} className={widgetStyles.dataContainer}>
            {rowCount > 0 ? (
              <VirtualizedTable
                rowCount={rowCount}
                rowComponent={DataRow}
                rowHeight={DATA_GRID.ROW_HEIGHT}
                height={viewportHeight * 0.55}
              />
            ) : (
              <div className={widgetStyles.loading}>Loading data...</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

const DataIntensivePage = memo(DataIntensivePageComponent);

export default DataIntensivePage;
