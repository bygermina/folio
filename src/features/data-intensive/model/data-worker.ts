interface DataItem {
  id: number;
  value: number;
}

interface InitMessage {
  type: 'INIT';
  payload: {
    itemsPerRow: number;
    totalItems?: number;
    chunkSize?: number;
  };
}

interface InitCompleteMessage {
  type: 'INIT_COMPLETE';
  payload: {
    entities: Record<number, DataItem>;
    entityIds: number[];
    rows: number[][];
    itemsPerRow: number;
  };
}

type WorkerMessage = InitMessage;

const DEFAULT_TOTAL_ITEMS = 10000;

const generateData = (count: number): DataItem[] => {
  if (count <= 0) return [];

  const items: DataItem[] = [];

  for (let index = 0; index < count; index++) {
    items.push({
      id: index,
      value: Math.random() > 0.5 ? 1 : 0,
    });
  }

  return items;
};

const partitionIntoRows = (entityIds: number[], itemsPerRow: number): number[][] => {
  if (!itemsPerRow || itemsPerRow <= 0) return [];
  if (!entityIds.length) return [];

  const rows: number[][] = [];
  const totalRows = Math.ceil(entityIds.length / itemsPerRow);

  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const start = rowIndex * itemsPerRow;
    const end = start + itemsPerRow;
    rows.push(entityIds.slice(start, end));
  }

  return rows;
};

const handleInit = (message: InitMessage) => {
  const { itemsPerRow, totalItems = DEFAULT_TOTAL_ITEMS } = message.payload;

  if (!itemsPerRow || itemsPerRow <= 0) {
    (self as unknown as Worker).postMessage({
      type: 'INIT_COMPLETE',
      payload: {
        entities: {},
        entityIds: [],
        rows: [],
        itemsPerRow,
      },
    } satisfies InitCompleteMessage);

    return;
  }

  const dataArray = generateData(totalItems);

  const entities = Object.fromEntries(dataArray.map((item) => [item.id, item])) as Record<
    number,
    DataItem
  >;

  const entityIds = dataArray.map((item) => item.id);
  const rows = partitionIntoRows(entityIds, itemsPerRow);

  (self as unknown as Worker).postMessage({
    type: 'INIT_COMPLETE',
    payload: {
      entities,
      entityIds,
      rows,
      itemsPerRow,
    },
  } satisfies InitCompleteMessage);
};

self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  if (!event?.data) return;

  if (event.data.type === 'INIT') handleInit(event.data);
});
