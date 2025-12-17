interface DataItem {
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
    rows: number[][];
    itemsPerRow: number;
  };
}

type WorkerMessage = InitMessage;

const DEFAULT_TOTAL_ITEMS = 10000;

const handleInit = (message: InitMessage) => {
  const { itemsPerRow, totalItems = DEFAULT_TOTAL_ITEMS } = message.payload;

  if (!itemsPerRow || itemsPerRow <= 0) {
    (self as unknown as Worker).postMessage({
      type: 'INIT_COMPLETE',
      payload: {
        entities: {},
        rows: [],
        itemsPerRow,
      },
    } satisfies InitCompleteMessage);

    return;
  }

  const entities: Record<number, DataItem> = {};
  const rows: number[][] = [];

  let currentRow: number[] = [];

  for (let id = 0; id < totalItems; id++) {
    const value = Math.random() > 0.5 ? 1 : 0;
    entities[id] = { value };

    currentRow.push(id);

    if (currentRow.length === itemsPerRow) {
      rows.push(currentRow);
      currentRow = [];
    }
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  (self as unknown as Worker).postMessage({
    type: 'INIT_COMPLETE',
    payload: {
      entities,
      rows,
      itemsPerRow,
    },
  } satisfies InitCompleteMessage);
};

self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  if (!event?.data) return;

  if (event.data.type === 'INIT') handleInit(event.data);
});
