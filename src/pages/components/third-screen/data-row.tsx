import { useCallback } from 'react';

import Row from '../../../components/virtualized-table/row';
import { DataCard } from '../../../components/virtualized-table/data-card';
import { type RowComponentProps } from '../../../components/virtualized-table/virtualized-table';
import { useStore } from './store';

export const DataRow = ({ item, style, gap = 8 }: RowComponentProps) => {
  const itemIds = item as number[];
  const entities = useStore((state) => state?.entities);
  const toggleValue = useStore((state) => state?.toggleValue);

  const renderItem = useCallback(
    (itemId: number) => {
      const entity = entities?.[itemId];
      if (!entity) return null;
      return <DataCard value={entity.value} onToggle={() => toggleValue?.(itemId)} />;
    },
    [entities, toggleValue],
  );

  if (!itemIds?.length || !entities || !toggleValue) {
    return <div style={style} />;
  }

  return (
    <Row
      items={itemIds}
      style={style}
      gap={gap}
      renderItem={renderItem}
      getItemKey={(itemId) => itemId}
    />
  );
};
