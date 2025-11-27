import { memo, type ReactNode, type CSSProperties } from 'react';

import { compareReactWindowStyle } from '@/utils/react-window-helpers';
import { setDisplayName } from '@/utils/react-helpers';

import styles from './row.module.scss';

export interface RowProps {
  items: unknown[];
  style: CSSProperties;
  gap?: number;
  renderItem: (item: unknown) => ReactNode;
  rowIndex: number;
}

const RowComponent = ({ items, style, gap = 8, renderItem, rowIndex }: RowProps) => {
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
        } as CSSProperties
      }
    >
      {items.map((item, index) => (
        <div key={index + rowIndex}>{renderItem(item)}</div>
      ))}
    </div>
  );
};

const Row = memo<RowProps>(RowComponent, (prevProps, nextProps) => {
  if (prevProps.rowIndex !== nextProps.rowIndex) return false;
  if (prevProps.gap !== nextProps.gap) return false;
  if (prevProps.items !== nextProps.items) return false;
  if (prevProps.renderItem !== nextProps.renderItem) return false;

  return compareReactWindowStyle(prevProps.style, nextProps.style);
});

setDisplayName(Row as React.ComponentType<unknown>, 'Row');

export default Row;
