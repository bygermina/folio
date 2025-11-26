import { memo, useCallback } from 'react';
import type { RowComponentProps } from 'react-window';

import Row from '@/components/virtualized-table/row';
import { DataCard } from '@/components/virtualized-table/data-card';

import { useStore } from './store';

const EMPTY_ARRAY: number[] = [];

const DataRowItem = memo(({ itemId }: { itemId: number }) => {
  const value = useStore((state) => state.entities[itemId]?.value);
  const toggleValue = useStore((state) => state.toggleValue);
  const isFlashing = useStore((state) => state.flashingItemIds[itemId] === true);

  const onToggle = useCallback(() => {
    toggleValue(itemId);
  }, [itemId, toggleValue]);

  if (value === undefined) return null;

  return <DataCard value={value} onToggle={onToggle} isFlashing={isFlashing} />;
});

DataRowItem.displayName = 'DataRowItem';

export const DataRow = memo(({ index, style }: RowComponentProps<object>) => {
  const itemIds = useStore((state) => state.rows[index]) || EMPTY_ARRAY;
  const gap = useStore((state) => state.gap);

  const renderItem = useCallback((itemId: number) => <DataRowItem itemId={itemId} />, []);

  if (!itemIds?.length) {
    return <div style={style} />;
  }

  return <Row items={itemIds} style={style} gap={gap} renderItem={renderItem} rowIndex={index} />;
});
