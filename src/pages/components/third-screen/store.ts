import { create } from 'zustand';

export interface DataItem {
  id: number;
  value: number;
}

let globalIdCounter = 0;

const generateData = (count: number): DataItem[] => {
  return Array.from({ length: count }, () => ({
    id: globalIdCounter++,
    value: Math.random() > 0.5 ? 1 : 0,
  }));
};

let normalizedEntities: Record<number, DataItem> | null = null;
let entityIds: number[] | null = null;
let rows: number[][] | null = null;
let initPromise: Promise<void> | null = null;
let currentItemsPerRow = 0;

const CHUNK_SIZE = 100;
const TOTAL_ITEMS = 10000;

const scheduleNext = (callback: () => void) => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback, { timeout: 5 });
  } else {
    setTimeout(callback, 0);
  }
};

const initializeData = async (itemsPerRow: number) => {
  if (itemsPerRow === 0) return Promise.resolve();
  if (normalizedEntities && entityIds && currentItemsPerRow === itemsPerRow) {
    return initPromise;
  }

  if (initPromise && currentItemsPerRow === itemsPerRow) return initPromise;

  currentItemsPerRow = itemsPerRow;
  normalizedEntities = null;
  entityIds = null;
  rows = null;
  initPromise = null;
  globalIdCounter = 0;

  const TOTAL_CHUNKS = Math.ceil(TOTAL_ITEMS / CHUNK_SIZE);

  initPromise = new Promise<void>((resolve) => {
    const dataArray: DataItem[] = [];
    let chunkIndex = 0;

    const processChunk = () => {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, TOTAL_ITEMS);

      const chunkSize = end - start;
      const chunkItems = generateData(chunkSize);
      dataArray.push(...chunkItems);

      chunkIndex++;

      if (chunkIndex < TOTAL_CHUNKS) {
        scheduleNext(processChunk);
      } else {
        normalizedEntities = Object.fromEntries(dataArray.map((item) => [item.id, item])) as Record<
          number,
          DataItem
        >;
        entityIds = dataArray.map((item) => item.id);

        rows = Array.from({ length: Math.ceil(entityIds.length / itemsPerRow) }, (_, i) =>
          entityIds!.slice(i * itemsPerRow, (i + 1) * itemsPerRow),
        );

        resolve();
      }
    };

    scheduleNext(processChunk);
  });

  return initPromise;
};

export interface StoreState {
  entities: Record<number, { id: number; value: number }>;
  entityIds: number[];
  rows: number[][];
  itemsPerRow: number;
  gap: number;
  toggleValue: (id: number) => void;
  setItemsPerRow: (itemsPerRow: number) => void;
  getRowItemIds: (rowIndex: number) => number[];
  getEntityValue: (itemId: number) => number | undefined;
}

export const useStore = create<StoreState>((set, get) => {
  const updateData = async (itemsPerRow: number) => {
    if (itemsPerRow === 0) return;

    await initializeData(itemsPerRow);

    if (normalizedEntities && entityIds && rows) {
      set({ entities: normalizedEntities, entityIds, rows, itemsPerRow });
    }
  };

  return {
    entities: normalizedEntities || {},
    entityIds: entityIds || [],
    rows: rows || [],
    itemsPerRow: currentItemsPerRow,
    gap: 8,
    toggleValue: (id) =>
      set((state) => {
        const entity = state.entities[id];
        if (!entity) return state;

        return {
          entities: {
            ...state.entities,
            [id]: {
              ...entity,
              value: entity.value === 0 ? 1 : 0,
            },
          },
        };
      }),
    setItemsPerRow: (itemsPerRow: number) => {
      const current = get().itemsPerRow;
      if (current !== itemsPerRow) {
        updateData(itemsPerRow);
      }
    },
    getRowItemIds: (rowIndex: number) => {
      const state = get();
      return state.rows[rowIndex] || [];
    },
    getEntityValue: (itemId: number) => {
      const state = get();
      return state.entities[itemId]?.value;
    },
  };
});
