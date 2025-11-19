import { useCallback, useMemo } from 'react';
import { List } from 'react-window';

import styles from './virtualized-table.module.scss';

interface RowComponentProps {
  index: number;
  item: number[];
  style: React.CSSProperties;
  gap?: number;
}

interface VirtualizedTableProps {
  items: number[];
  rowComponent: React.ComponentType<RowComponentProps>;
  rowHeight?: number;
  height?: number;
  columnCount?: number;
  gap?: number;
  className?: string;
}

const VirtualizedTable = ({
  items,
  rowComponent: RowComponent,
  rowHeight = 48,
  height = 600,
  columnCount = 20,
  gap = 8,
  className = '',
}: VirtualizedTableProps) => {
  const rows = useMemo(
    () =>
      Array.from({ length: Math.ceil(items.length / columnCount) }, (_, i) =>
        items.slice(i * columnCount, (i + 1) * columnCount),
      ),
    [items, columnCount],
  );

  const RowWrapper = useCallback(
    ({
      index,
      style,
      ...rowProps
    }: {
      index: number;
      style: React.CSSProperties;
      gap?: number;
    }) => {
      const row = rows[index];
      if (!row || !Array.isArray(row) || row.length === 0) {
        return <div style={style} />;
      }
      return <RowComponent index={index} item={row} style={style} gap={rowProps.gap ?? gap} />;
    },
    [rows, RowComponent, gap],
  );

  if (items.length === 0) {
    return <div className={styles['virtualized-table-empty']}>No items to display</div>;
  }

  return (
    <div
      className={`${styles['virtualized-table']} ${className}`.trim()}
      style={{ height, width: '100%' }}
    >
      <List<{ gap?: number }>
        rowComponent={RowWrapper}
        rowCount={rows.length}
        rowHeight={rowHeight}
        rowProps={{ gap }}
        style={{ width: '100%', height }}
      />
    </div>
  );
};

export default VirtualizedTable;
