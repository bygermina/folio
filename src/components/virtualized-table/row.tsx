import { AnimatePresence, motion, useAnimation } from 'framer-motion';

import { useStore } from '../../pages/components/third-screen/store';

import styles from './row.module.scss';

interface DataItem {
  id: number;
  value: number;
}

interface DataCardProps {
  item: DataItem;
  onToggle: (id: number) => void;
  style?: React.CSSProperties;
}

const DataCard = ({ item, onToggle, style }: DataCardProps) => {
  const controls = useAnimation();

  const handleClick = async () => {
    const tilt = Math.random() > 0.5 ? 6 : -6;

    await controls.start({
      scale: 0.85,
      rotateZ: tilt,
      filter: 'brightness(1.35)',
      transition: { duration: 0.12 },
    });

    onToggle(item.id);

    await controls.start({
      scale: 1.1,
      rotateZ: -tilt,
      boxShadow: '0 0 1.5rem rgba(6, 182, 212, 0.35)',
      transition: { type: 'spring', stiffness: 240, damping: 18 },
    });

    controls.start({
      scale: 1,
      rotateZ: 0,
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      filter: 'brightness(1)',
      transition: { duration: 0.25 },
    });
  };

  return (
    <motion.div
      className={styles.dataCard}
      onClick={handleClick}
      animate={controls}
      whileTap={{ scale: 0.92 }}
      style={style}
    >
      <div className={styles.cardValueWrapper}>
        <AnimatePresence>
          <motion.span
            key={`${item.id}-${item.value}`}
            className={styles.cardValue}
            initial={{ opacity: 0, y: -6, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 6, rotateX: -90 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {item.value}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

interface ItemProps {
  item: number[];
  style?: React.CSSProperties;
  gap?: number;
}

const Item = ({ item: itemIds, style, gap = 8 }: ItemProps) => {
  const toggleSelected = useStore((state) => state?.toggleSelected);
  const entities = useStore((state) => state?.entities);

  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return null;
  }

  if (!entities || typeof entities !== 'object') {
    return null;
  }

  if (!toggleSelected || typeof toggleSelected !== 'function') {
    return null;
  }

  const rowHeight = Number(style?.height) || 48;
  const cardSize = rowHeight - gap * 2;

  return (
    <div
      style={{
        ...style,
        gap: `${gap}px`,
        padding: `${gap}px`,
      }}
      className={styles.row}
    >
      {itemIds.map((itemId) => {
        const item = entities[itemId];
        if (!item) return null;

        return (
          <DataCard
            key={itemId}
            item={item}
            onToggle={toggleSelected}
            style={{
              width: `${cardSize}px`,
              height: `${cardSize}px`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Item;
