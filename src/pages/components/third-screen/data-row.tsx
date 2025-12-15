import { memo, useCallback, useMemo } from 'react';
import type { RowComponentProps } from 'react-window';

import Row from '@/components/virtualized-table/row';
import { DataCard } from '@/components/virtualized-table/data-card';
import { createReactWindowRowComparator } from '@/utils/react-window-helpers';
import { EMPTY_ARRAY } from '@/utils/constants';

import { useStore } from './store';

const GAP = 8; // Constant gap value

const DataRowItem = memo(
  ({ itemId }: { itemId: number }) => {
    const value = useStore((state) => state.entities[itemId]?.value);
    const toggleValue = useStore((state) => state.toggleValue);

    const onToggle = useCallback(() => {
      toggleValue(itemId);
    }, [itemId, toggleValue]);

    if (value === undefined) return null;

    return <DataCard value={value} onToggle={onToggle} />;
  },
  (prevProps, nextProps) => prevProps.itemId === nextProps.itemId,
);

DataRowItem.displayName = 'DataRowItem';

export const DataRow = memo(({ index, style }: RowComponentProps<object>) => {
  const rows = useStore((state) => state.rows);
  const itemIds = useMemo(() => rows[index] ?? EMPTY_ARRAY, [rows, index]);

  const renderItem = useCallback(
    (itemId: unknown) => <DataRowItem itemId={itemId as number} />,
    [],
  );

  if (!itemIds?.length) {
    return <div style={style} />;
  }

  return <Row items={itemIds} style={style} gap={GAP} renderItem={renderItem} rowIndex={index} />;
}, createReactWindowRowComparator());
