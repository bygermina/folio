import { create } from 'zustand';

interface DataItem {
  id: number;
  value: number;
}

const generateData = (count: number): DataItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    value: Math.random() > 0.5 ? 1 : 0,
  }));
};

const dataArray = Array.from({ length: 10000 }, () => generateData(30));

const normalizedEntities = Object.fromEntries(
  dataArray.flat().map((item) => [item.id, item]),
) as Record<number, DataItem>;

const entityIds = dataArray.flatMap((items) => items.map((item) => item.id));

export interface StoreState {
  entities: Record<number, { id: number; value: number }>;
  entityIds: number[];
  selected: Record<number, boolean>;
  toggleSelected: (id: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  entities: normalizedEntities,
  entityIds: entityIds,
  selected: {},
  toggleSelected: (id) =>
    set((state) => ({
      selected: { ...state.selected, [id]: !state.selected[id] },
    })),
}));
