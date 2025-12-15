import { memo, useEffect, useState, type ReactNode, type CSSProperties, type ComponentType } from 'react';

import { compareReactWindowStyle } from '@/shared/lib/react-window-helpers';
import { setDisplayName } from '@/shared/lib/react-helpers';
import { cn } from '@/shared/lib/cn';

import styles from './row.module.scss';

export interface RowProps {
  items: unknown[];
  style: CSSProperties;
  gap?: number;
  renderItem: (item: unknown) => ReactNode;
  rowIndex: number;
}

const RowComponent = ({ items, style, gap = 8, renderItem, rowIndex }: RowProps) => {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    setHasEntered(true);
  }, []);

  if (!items?.length) {
    return <div className={cn(styles.row, hasEntered && styles.rowEntered)} style={style} />;
  }

  const rowHeight = Number(style.height) || 48;
  const cardSize = rowHeight - gap * 2;

  return (
    <div
      className={cn(styles.row, hasEntered && styles.rowEntered)}
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

setDisplayName(Row as ComponentType<unknown>, 'Row');

export { Row };
