import { memo, useCallback, useMemo } from 'react';
import type { RowComponentProps } from 'react-window';

import Row from '@/components/virtualized-table/row';
import { DataCard } from '@/components/virtualized-table/data-card';

import { useStore } from './store';

const EMPTY_ARRAY: number[] = [];
const GAP = 8; // Constant gap value

const DataRowItem = memo(
  ({ itemId }: { itemId: number }) => {
    const value = useStore((state) => state.entities[itemId]?.value);
    const toggleValue = useStore((state) => state.toggleValue);
    const isFlashing = useStore((state) => state.flashingItemIds[itemId] === true);

    const onToggle = useCallback(() => {
      toggleValue(itemId);
    }, [itemId, toggleValue]);

    if (value === undefined) return null;

    return <DataCard value={value} onToggle={onToggle} isFlashing={isFlashing} />;
  },
  (prevProps, nextProps) => prevProps.itemId === nextProps.itemId,
);

DataRowItem.displayName = 'DataRowItem';

export const DataRow = memo(
  ({ index, style }: RowComponentProps<object>) => {
    const rows = useStore((state) => state.rows);
    const itemIds = useMemo(() => rows[index] || EMPTY_ARRAY, [rows, index]);

    const renderItem = useCallback((itemId: number) => <DataRowItem itemId={itemId} />, []);

    if (!itemIds?.length) {
      return <div style={style} />;
    }

    return <Row items={itemIds} style={style} gap={GAP} renderItem={renderItem} rowIndex={index} />;
  },
  (prevProps, nextProps) => {
    if (prevProps.index !== nextProps.index) return false;

    const prevStyle = prevProps.style as React.CSSProperties;
    const nextStyle = nextProps.style as React.CSSProperties;

    return (
      prevStyle.position === nextStyle.position &&
      prevStyle.top === nextStyle.top &&
      prevStyle.left === nextStyle.left &&
      prevStyle.width === nextStyle.width &&
      prevStyle.height === nextStyle.height
    );
  },
);
