import { useState, useEffect, useRef, useMemo } from 'react';

import { SVGPathVisualization } from '@/components/debug/svg-path-visualization';
import { PathControls } from '@/components/debug/path-controls';
import { pointsToPath } from '@/utils/svg';

export type RouteDrawerProps = {
  onRouteDrawn?: (points: Array<[number, number]>) => void;
  predefinedPath?: string;
};

export const RouteDrawer = ({ predefinedPath, onRouteDrawn }: RouteDrawerProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [points, setPoints] = useState<Array<[number, number]>>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isCtrlPressed = e.ctrlKey || e.metaKey;
      setIsDrawMode(isCtrlPressed);
      if (!isCtrlPressed) setIsDrawing(false);
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  const prevIsDrawing = useRef(false);

  useEffect(() => {
    if (prevIsDrawing.current && !isDrawing && points.length > 0 && onRouteDrawn) {
      onRouteDrawn(points);
    }
    prevIsDrawing.current = isDrawing;
  }, [isDrawing, points, onRouteDrawn]);

  const getSvgCoords = (e: React.MouseEvent<SVGSVGElement>): [number, number] => {
    const svg = svgRef.current;
    if (!svg) return [e.clientX, e.clientY];

    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;

    const x = ((e.clientX - rect.left) / rect.width) * viewBox.width + viewBox.x;
    const y = ((e.clientY - rect.top) / rect.height) * viewBox.height + viewBox.y;

    return [x, y];
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDrawing(true);
    setPoints([getSvgCoords(e)]);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawing) {
      setPoints((prev) => [...prev, getSvgCoords(e)]);
    }
  };

  const handleMouseUp = () => setIsDrawing(false);

  const polylinePoints = useMemo(() => pointsToPath(points), [points]);
  const viewBox = `0 0 ${window.innerWidth} ${window.innerHeight}`;

  return (
    <div className="pointer-events-none fixed inset-0 z-100 select-none">
      <SVGPathVisualization
        paths={predefinedPath ? [predefinedPath] : undefined}
        viewBox={viewBox}
      />
      <SVGPathVisualization
        paths={polylinePoints ? [polylinePoints] : undefined}
        viewBox={viewBox}
      />

      {points.length > 0 && (
        <PathControls
          path={polylinePoints}
          pointsCount={points.length}
          onClear={() => setPoints([])}
          position="top-right"
          infoText="Path in screen pixels - use scaleSvgPath()"
        />
      )}

      {isDrawMode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg pointer-events-none z-[9999]">
          Drawing mode active (hold Ctrl/Cmd)
        </div>
      )}

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full z-50"
        style={{
          pointerEvents: isDrawMode ? 'auto' : 'none',
          cursor: isDrawMode ? 'crosshair' : 'default',
        }}
        viewBox={viewBox}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {predefinedPath && (
          <path
            d={predefinedPath}
            stroke="blue"
            strokeWidth={2}
            fill="none"
            opacity={0.7}
            strokeDasharray="6 6"
          />
        )}
      </svg>
    </div>
  );
};
