import styles from './row.module.scss';

export interface RowProps<T = unknown> {
  items: T[];
  style: React.CSSProperties;
  gap?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  getItemKey?: (item: T, index: number) => string | number;
}

const Row = <T,>({ items, style, gap = 8, renderItem, getItemKey }: RowProps<T>) => {
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
        <div key={getItemKey ? getItemKey(item, index) : index}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
};

Row.displayName = 'Row';

export default Row;
