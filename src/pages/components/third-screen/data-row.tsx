import { memo, useCallback } from 'react';

import Row from '../../../components/virtualized-table/row';
import { DataCard } from '../../../components/virtualized-table/data-card';
import { type RowComponentProps } from '../../../components/virtualized-table/virtualized-table';
import { useStore } from './store';

const DataRowItem = memo(
  ({ itemId }: { itemId: number }) => {
    const value = useStore((state) => state?.entities[itemId]?.value);
    const toggleValue = useStore((state) => state?.toggleValue);

    if (value === undefined) return null;

    return <DataCard value={value} onToggle={() => toggleValue?.(itemId)} />;
  },
  (prevProps, nextProps) => prevProps.itemId === nextProps.itemId,
);

DataRowItem.displayName = 'DataRowItem';

export const DataRow = memo(({ item, style, gap = 8 }: RowComponentProps) => {
  const itemIds = item as number[];
  const toggleValue = useStore((state) => state?.toggleValue);

  const renderItem = useCallback((itemId: number) => {
    return <DataRowItem key={itemId} itemId={itemId} />;
  }, []);

  if (!itemIds?.length || !toggleValue) {
    return <div style={style} />;
  }

  return (
    <Row
      items={itemIds}
      style={style}
      gap={gap}
      renderItem={renderItem}
      getItemKey={(itemId) => itemId}
    />
  );
});
