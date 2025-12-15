import { type ComponentType } from 'react';
import { List, type RowComponentProps } from 'react-window';

import { cn } from '@/shared/lib/cn';

import styles from './virtualized-table.module.scss';

export type CustomRowComponentProps = RowComponentProps<object>;

interface VirtualizedTableProps {
  rowCount: number;
  rowComponent: ComponentType<CustomRowComponentProps>;
  rowHeight?: number;
  height?: number;
  className?: string;
  onVisibleRowsChange?: (startIndex: number, stopIndex: number) => void;
  overscanCount?: number;
}

const VirtualizedTable = ({
  rowCount,
  rowComponent: RowComponent,
  rowHeight = 48,
  height = 600,
  className = '',
  onVisibleRowsChange,
  overscanCount = 20,
}: VirtualizedTableProps) => {
  const rowComponent = (props: CustomRowComponentProps) => <RowComponent {...props} />;

  return (
    <div className={cn(styles.virtualizedTable, className)} style={{ height }}>
      <List
        rowComponent={rowComponent}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowProps={{}}
        overscanCount={overscanCount}
        onRowsRendered={({ startIndex, stopIndex }) => {
          if (!onVisibleRowsChange) return;

          onVisibleRowsChange(startIndex, stopIndex);
        }}
        {...{ role: 'presentation' }}
        style={{ width: '100%', height }}
      />
    </div>
  );
};

export { VirtualizedTable };


