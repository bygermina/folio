import { memo } from 'react';
import type { RowComponentProps } from 'react-window';

import Row from '../../../components/virtualized-table/row';
import { DataCard } from '../../../components/virtualized-table/data-card';
import { useStore } from './store';

const DataRowItem = memo(({ itemId }: { itemId: number }) => {
  const value = useStore((state) => state.getEntityValue(itemId));
  const toggleValue = useStore((state) => state.toggleValue);

  if (value === undefined) return null;

  return <DataCard value={value} onToggle={() => toggleValue(itemId)} />;
});

DataRowItem.displayName = 'DataRowItem';

export const DataRow = memo(({ index, style }: RowComponentProps<object>) => {
  const itemIds = useStore((state) => state.getRowItemIds(index));
  const gap = useStore((state) => state.gap);

  if (!itemIds?.length) {
    return <div style={style} />;
  }

  const renderItem = (itemId: number) => <DataRowItem itemId={itemId} />;
  const getItemKey = (itemId: number) => itemId;

  return (
    <Row items={itemIds} style={style} gap={gap} renderItem={renderItem} getItemKey={getItemKey} />
  );
});
