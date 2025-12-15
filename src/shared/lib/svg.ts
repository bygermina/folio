import type { Dimensions } from '@/shared/lib/hooks/use-element-dimensions';

export const createSvgArc = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  height: number = 100,
) => {
  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - height;

  return `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;
};

export const getLastPointFromSvgPath = (svgPath: string): { x: number; y: number } | null => {
  if (!svgPath || typeof svgPath !== 'string') return null;

  const lastCoordinateMatch = svgPath.match(/([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)(?=\s*$)/);

  if (!lastCoordinateMatch) return null;

  const x = parseFloat(lastCoordinateMatch[1]);
  const y = parseFloat(lastCoordinateMatch[2]);

  return { x, y };
};

export const scaleSvgPath = (
  svgPath: string,
  startPoint: { x: number; y: number },
  scale: number = 1,
): string => {
  if (!svgPath || typeof svgPath !== 'string' || scale <= 0) return '';

  const firstPointMatch = svgPath.match(/M\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)/);
  if (!firstPointMatch) return svgPath;

  const firstX = parseFloat(firstPointMatch[1]);
  const firstY = parseFloat(firstPointMatch[2]);

  const offsetX = startPoint.x - firstX * scale;
  const offsetY = startPoint.y - firstY * scale;

  return svgPath.replace(/([+-]?\d+(?:\.\d+)?),([+-]?\d+(?:\.\d+)?)/g, (_, x, y) => {
    const scaledX = parseFloat(x) * scale + offsetX;
    const scaledY = parseFloat(y) * scale + offsetY;

    return `${Math.round(scaledX)},${Math.round(scaledY)}`;
  });
};

export const pointsToPath = (points: Array<[number, number]>): string => {
  if (points.length === 0) return '';

  return points
    .map((p, index) => {
      const x = Math.round(p[0]);
      const y = Math.round(p[1]);
      return index === 0 ? `M ${x},${y}` : `L ${x},${y}`;
    })
    .join(' ');
};

export const getImageOffset = (elDimensions: Dimensions, originalRation: number) => {
  const widthExpected = elDimensions.height / originalRation;
  const overflowX = elDimensions.width - widthExpected;

  return overflowX < 0 ? overflowX / 2 : 0;
};

export const getStartPoint = (elDimensions: Dimensions, offset: { x: number; y: number }) => {
  return {
    x: elDimensions.bottomLeft.x + offset.x * elDimensions.scale,
    y: elDimensions.bottomLeft.y - offset.y * elDimensions.scale,
  };
};

export const shiftXPoint = (point: { x: number; y: number }, dx: number) => {
  return {
    x: point.x + dx,
    y: point.y,
  };
};

export const getScaledPath = (
  elDimensions: Dimensions,
  dx: number,
  svgPath: { start: { x: number; y: number }; path: string },
) => {
  return scaleSvgPath(
    svgPath.path,
    shiftXPoint(getStartPoint(elDimensions, svgPath.start), dx),
    elDimensions.scale,
  );
};

export const getPathLength = (svgPath: string): number => {
  if (!svgPath || typeof svgPath !== 'string' || typeof document === 'undefined') return 0;

  try {
    const svg = 'http://www.w3.org/2000/svg';
    const pathEl = document.createElementNS(svg, 'path');
    pathEl.setAttribute('d', svgPath);

    return pathEl.getTotalLength();
  } catch {
    return 0;
  }
};
