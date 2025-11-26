import { motion, MotionValue } from 'framer-motion';

interface SparkleDefsProps {
  strokeColor: string;
  gradientId: string;
  filterId: string;
}

export const SparkleDefs = ({ strokeColor, gradientId, filterId }: SparkleDefsProps) => {
  return (
    <defs>
      <radialGradient id={gradientId}>
        <stop offset="0%" stopColor={strokeColor} stopOpacity="1" />
        <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
      </radialGradient>
      <filter id={filterId}>
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
};

interface SparkleProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  strokeColor: string;
  radius: number;
  gradientId: string;
  filterId: string;
}

export const Sparkle = ({ x, y, strokeColor, radius, gradientId, filterId }: SparkleProps) => {
  return (
    <motion.g
      style={{
        x,
        y,
      }}
    >
      <circle
        cx={0}
        cy={0}
        r={radius * 2}
        fill={`url(#${gradientId})`}
        filter={`url(#${filterId})`}
        style={{
          filter: `drop-shadow(0 0 ${radius * 1}px ${strokeColor}) drop-shadow(0 0 ${radius * 3}px ${strokeColor}) drop-shadow(0 0 ${radius * 5}px ${strokeColor})`,
          opacity: 0.5,
        }}
      />
    </motion.g>
  );
};
