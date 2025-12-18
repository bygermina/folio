import { memo, useCallback } from 'react';
import type { RowComponentProps } from 'react-window';

import { Row } from '@/shared/ui/virtualized-table/row';
import { DataCard } from '@/shared/ui/virtualized-table/data-card';
import { createReactWindowRowComparator } from '@/shared/lib/react-window-helpers';
import { EMPTY_ARRAY } from '@/shared/lib/constants';

import { useDataIntenseStore } from '../model/store';
import { DATA_GRID } from '../model/constants';

const DataRowItem = memo(
  ({ itemId }: { itemId: number }) => {
    const value = useDataIntenseStore((state) => state.entities[itemId]?.value);
    const toggleValue = useDataIntenseStore((state) => state.toggleValue);

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
  const rows = useDataIntenseStore((state) => state.rows);
  const itemIds = rows[index] ?? EMPTY_ARRAY;

  if (!itemIds?.length) {
    return <div style={style} />;
  }

  return (
    <Row
      items={itemIds}
      style={style}
      gap={DATA_GRID.GAP}
      renderItem={(itemId) => <DataRowItem itemId={itemId as number} />}
      rowIndex={index}
    />
  );
}, createReactWindowRowComparator());
