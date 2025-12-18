import { DATA_GRID } from '../model/constants';

interface CalculateItemsPerRowParams {
  containerWidth: number;
}

export const calculateItemsPerRow = ({ containerWidth }: CalculateItemsPerRowParams): number => {
  if (containerWidth <= DATA_GRID.GAP) return 0;

  const cardSize = DATA_GRID.ROW_HEIGHT - DATA_GRID.GAP * 2;
  if (cardSize <= 0) return 0;

  const totalPerItem = cardSize + DATA_GRID.GAP;
  const effectiveWidth = containerWidth - DATA_GRID.GAP;

  return Math.max(1, Math.floor(effectiveWidth / totalPerItem));
};
