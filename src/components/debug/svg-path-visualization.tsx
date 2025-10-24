import React from 'react';

interface SVGPathVisualizationProps {
  paths?: string[];
  color?: string;
  strokeWidth?: number;
  opacity?: number;
  /** Custom viewBox (e.g., "0 0 863 1104") */
  viewBox?: string;
}

export const SVGPathVisualization: React.FC<SVGPathVisualizationProps> = ({
  paths,
  color = 'red',
  strokeWidth = 2,
  opacity = 0.5,
  viewBox,
}) => {
  if (!paths?.length) return null;

  const defaultViewBox = viewBox || `0 0 ${window.innerWidth} ${window.innerHeight}`;

  return (
    <svg
      className="absolute left-0 top-0 w-screen h-screen pointer-events-none z-20"
      viewBox={defaultViewBox}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={opacity}
        />
      ))}
    </svg>
  );
};
