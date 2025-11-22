import { List, type RowComponentProps } from 'react-window';

import { cn } from '@/utils/cn';

import styles from './virtualized-table.module.scss';

export type CustomRowComponentProps = RowComponentProps<object>;

interface VirtualizedTableProps {
  rowCount: number;
  rowComponent: React.ComponentType<CustomRowComponentProps>;
  rowHeight?: number;
  height?: number;
  className?: string;
}

const VirtualizedTable = ({
  rowCount,
  rowComponent: RowComponent,
  rowHeight = 48,
  height = 600,
  className = '',
}: VirtualizedTableProps) => {
  const rowComponent = (props: CustomRowComponentProps) => <RowComponent {...props} />;

  return (
    <div className={cn(styles.virtualizedTable, className)} style={{ height }}>
      <List
        rowComponent={rowComponent}
        rowCount={rowCount}
        rowHeight={rowHeight}
        rowProps={{}}
        style={{ width: '100%', height }}
      />
    </div>
  );
};

export default VirtualizedTable;
