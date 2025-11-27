import { memo } from 'react';

import { compareReactWindowStyle } from '@/utils/react-window-helpers';
import { setDisplayName } from '@/utils/react-helpers';

import styles from './row.module.scss';

export interface RowProps<T = unknown> {
  items: T[];
  style: React.CSSProperties;
  gap?: number;
  renderItem: (item: T) => React.ReactNode;
  rowIndex: number;
}

const RowComponent = <T,>({ items, style, gap = 8, renderItem, rowIndex }: RowProps<T>) => {
  if (!items?.length) {
    return <div className={styles.row} style={style} />;
  }

  const rowHeight = Number(style.height) || 48;
  const cardSize = rowHeight - gap * 2;

  return (
    <div
      className={styles.row}
      style={
        {
          ...style,
          '--row-gap': `${gap}px`,
          '--card-size': `${cardSize}px`,
        } as React.CSSProperties
      }
    >
      {items.map((item, index) => (
        <div key={index + rowIndex}>{renderItem(item)}</div>
      ))}
    </div>
  );
};

const Row = memo(RowComponent, (prevProps, nextProps) => {
  // Compare props to prevent unnecessary re-renders
  if (prevProps.rowIndex !== nextProps.rowIndex) return false;
  if (prevProps.gap !== nextProps.gap) return false;
  if (prevProps.items !== nextProps.items) return false;
  if (prevProps.renderItem !== nextProps.renderItem) return false;

  // Compare style values (not object reference)
  return compareReactWindowStyle(prevProps.style, nextProps.style);
}) as typeof RowComponent;

setDisplayName(Row, 'Row');

export default Row;
