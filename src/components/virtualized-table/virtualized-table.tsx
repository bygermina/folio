import { useCallback } from 'react';
import { List } from 'react-window';

import { cn } from '@/utils/cn';

import styles from './virtualized-table.module.scss';

export interface RowComponentProps {
  item: unknown;
  style: React.CSSProperties;
  gap?: number;
}

interface VirtualizedTableProps {
  rows: unknown[][];
  rowComponent: React.ComponentType<RowComponentProps>;
  rowHeight?: number;
  height?: number;
  gap?: number;
  className?: string;
}

const VirtualizedTable = ({
  rows,
  rowComponent: RowComponent,
  rowHeight = 48,
  height = 600,
  gap = 8,
  className = '',
}: VirtualizedTableProps) => {
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
      return <RowComponent item={rows[index] || []} style={style} gap={rowProps.gap ?? gap} />;
    },
    [rows, RowComponent, gap],
  );

  if (rows.length === 0) {
    return <div className={styles.virtualizedTableEmpty}>No items to display</div>;
  }

  return (
    <div className={cn(styles.virtualizedTable, className)} style={{ height }}>
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
