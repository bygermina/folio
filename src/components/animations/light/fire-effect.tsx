import type { CSSProperties } from 'react';

import { colorWithOpacity } from '@/utils/colors';
import { useScreenSizeContext } from '../../providers/use-context';
import { cn } from '@/utils/cn';

import styles from './fire-effect.module.scss';

interface FireEffectProps {
  style?: CSSProperties;
}

const colors = {
  blue: 'var(--color-blue-500)',
  cyan: 'var(--color-cyan-400)',
  purple: 'var(--color-purple-500)',
  indigo: 'var(--color-indigo-500)',
  white: 'var(--color-white)',
  lightBlue: 'var(--color-blue-300)',
  lightPurple: 'var(--color-purple-300)',
};

// Generate symmetric gradient for beams
const createBeamGradient = (color: string, direction: number, stops: number[]) => {
  const gradientStops = stops
    .map((opacity, index) => {
      const position = (index / (stops.length - 1)) * 100;
      return `${colorWithOpacity(color, opacity)} ${position}%`;
    })
    .join(', ');
  return `linear-gradient(${direction}deg, transparent 0%, ${gradientStops}, transparent 100%)`;
};

// Standard beam gradient stops (symmetric)
const standardStops = [
  0.005, 0.01, 0.02, 0.04, 0.08, 0.15, 0.25, 0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4, 0.25, 0.15, 0.08,
  0.04, 0.02, 0.01, 0.005,
];

// Diagonal beam gradient stops (symmetric)
const diagonalStops = [
  0.003, 0.008, 0.02, 0.05, 0.1, 0.2, 0.35, 0.55, 0.75, 1, 0.75, 0.55, 0.35, 0.2, 0.1, 0.05, 0.02,
  0.008, 0.003,
];

const FireEffect = ({ style }: FireEffectProps) => {
  const { screenWidth } = useScreenSizeContext();
  const pingDelay = Math.random() * 2;

  const scale = Math.max(0.9, Math.min(1.5, screenWidth / 500));

  const sizes = {
    container: 40 * scale,
    horizontalBeam: { height: 0.5 * scale, width: 48 * scale },
    verticalBeam: { height: 48 * scale, width: 0.5 * scale },
    diagonalBeam: { height: 0.5 * scale, width: 40 * scale },
    centralCircle: 12 * scale,
    innerCenter: 8 * scale,
    dropShadow: 12 * scale,
  };

  const beams = [
    {
      className: styles.beamHorizontal,
      color: colors.blue,
      direction: 90,
      stops: standardStops,
      size: sizes.horizontalBeam,
    },
    {
      className: styles.beamVertical,
      color: colors.cyan,
      direction: 180,
      stops: standardStops,
      size: sizes.verticalBeam,
    },
    {
      className: styles.beamDiagonal45,
      color: colors.purple,
      direction: 90,
      stops: diagonalStops,
      size: sizes.diagonalBeam,
    },
    {
      className: styles.beamDiagonal135,
      color: colors.indigo,
      direction: 90,
      stops: diagonalStops,
      size: sizes.diagonalBeam,
    },
  ];

  return (
    <div
      className={styles.container}
      style={{
        width: sizes.container,
        height: sizes.container,
        filter: `brightness(2) drop-shadow(0 0 ${sizes.dropShadow}px ${colors.white})`,
        ...style,
      }}
    >
      {beams.map((beam, index) => (
        <div
          key={index}
          className={cn(styles.beam, beam.className)}
          style={{
            height: beam.size.height,
            width: beam.size.width,
            background: createBeamGradient(beam.color, beam.direction, beam.stops),
          }}
        />
      ))}

      <div
        className={styles.centralCircle}
        style={{
          height: sizes.centralCircle,
          width: sizes.centralCircle,
          background: `radial-gradient(circle, ${colorWithOpacity(colors.white, 0.9)} 0%, ${colorWithOpacity(colors.cyan, 0.7)} 30%, ${colorWithOpacity(colors.purple, 0.5)} 60%, transparent 80%)`,
          animationDelay: `${pingDelay}s`,
        }}
      />

      <div
        className={styles.innerCenter}
        style={{
          height: sizes.innerCenter,
          width: sizes.innerCenter,
          background: `radial-gradient(circle, ${colorWithOpacity(colors.white, 0.95)} 0%, ${colorWithOpacity(colors.lightBlue, 0.8)} 50%, ${colorWithOpacity(colors.lightPurple, 0.6)} 80%, transparent 100%)`,
        }}
      />
    </div>
  );
};

export default FireEffect;
