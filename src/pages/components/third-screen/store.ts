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

const CHUNK_SIZE = 100;
const TOTAL_ITEMS = 10000;
const ITEMS_PER_ROW = 20;
const TOTAL_CHUNKS = Math.ceil(TOTAL_ITEMS / CHUNK_SIZE);

const scheduleNext = (callback: () => void) => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(callback, { timeout: 5 });
  } else {
    setTimeout(callback, 0);
  }
};

const initializeData = async () => {
  if (normalizedEntities && entityIds) return initPromise;
  if (initPromise) return initPromise;

  initPromise = new Promise<void>((resolve) => {
    const dataArray: DataItem[][] = [];
    let chunkIndex = 0;

    const processChunk = () => {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, TOTAL_ITEMS);

      for (let i = start; i < end; i++) {
        dataArray[i] = generateData(ITEMS_PER_ROW);
      }

      chunkIndex++;

      if (chunkIndex < TOTAL_CHUNKS) {
        scheduleNext(processChunk);
      } else {
        normalizedEntities = Object.fromEntries(
          dataArray.flat().map((item) => [item.id, item]),
        ) as Record<number, DataItem>;
        entityIds = dataArray.flatMap((items) => items.map((item) => item.id));

        rows = Array.from({ length: Math.ceil(entityIds.length / ITEMS_PER_ROW) }, (_, i) =>
          entityIds!.slice(i * ITEMS_PER_ROW, (i + 1) * ITEMS_PER_ROW),
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
  toggleValue: (id: number) => void;
}

export const useStore = create<StoreState>((set) => {
  initializeData().then(() => {
    if (normalizedEntities && entityIds && rows) {
      set({ entities: normalizedEntities, entityIds, rows });
    }
  });

  return {
    entities: normalizedEntities || {},
    entityIds: entityIds || [],
    rows: rows || [],
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
  };
});
