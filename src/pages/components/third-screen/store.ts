import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { DataItem } from './types';

interface InitCompletePayload {
  entities: Record<number, DataItem>;
  entityIds: number[];
  rows: number[][];
  itemsPerRow: number;
}

let normalizedEntities: Record<number, DataItem> | null = null;
let entityIds: number[] | null = null;
let rows: number[][] | null = null;
let initPromise: Promise<void> | null = null;
let currentItemsPerRow = 0;

const TOTAL_ITEMS = 10000;

const createDataWorker = () => {
  if (typeof window === 'undefined') return null;
  if (typeof Worker === 'undefined') return null;

  try {
    return new Worker(new URL('./data-worker.ts', import.meta.url), { type: 'module' });
  } catch {
    return null;
  }
};

const dataWorker = createDataWorker();

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

  if (!dataWorker) {
    return Promise.resolve();
  }

  initPromise = new Promise<void>((resolve) => {
    const handleMessage = (event: MessageEvent<{ type: string; payload: InitCompletePayload }>) => {
      if (!event?.data || event.data.type !== 'INIT_COMPLETE') return;

      const {
        entities,
        entityIds: ids,
        rows: workerRows,
        itemsPerRow: returnedItemsPerRow,
      } = event.data.payload;

      if (returnedItemsPerRow !== currentItemsPerRow) return;

      normalizedEntities = entities;
      entityIds = ids;
      rows = workerRows;

      dataWorker.removeEventListener('message', handleMessage);
      resolve();
    };

    dataWorker.addEventListener('message', handleMessage);

    dataWorker.postMessage({
      type: 'INIT',
      payload: {
        itemsPerRow,
        totalItems: TOTAL_ITEMS,
      },
    });
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

export const useStore = create<StoreState>()(
  subscribeWithSelector((set, get) => {
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
  }),
);
