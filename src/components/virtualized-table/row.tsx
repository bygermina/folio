import styles from './row.module.scss';

export interface RowProps<T = unknown> {
  items: T[];
  style: React.CSSProperties;
  gap?: number;
  renderItem: (item: T) => React.ReactNode;
  rowIndex: number;
}

const Row = <T,>({ items, style, gap = 8, renderItem, rowIndex }: RowProps<T>) => {
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

Row.displayName = 'Row';

export default Row;
