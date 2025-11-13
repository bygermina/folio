import type { CSSProperties } from 'react';

import { rgba, commonColors } from '../../../utils/colors';
import { useScreenSizeContext } from '../../providers/use-context';

interface FireEffectProps {
  style?: CSSProperties;
}

const colors = commonColors.fire;
const whiteColor = commonColors.white;

const FireEffect = ({ style }: FireEffectProps) => {
  const { screenWidth } = useScreenSizeContext();
  const pingDelay = Math.random() * 2;

  const scale = Math.max(0.7, Math.min(1.5, screenWidth / 500));

  const containerSize = 40 * scale;
  const horizontalBeamHeight = 0.5 * scale;
  const horizontalBeamWidth = 48 * scale;
  const verticalBeamHeight = 48 * scale;
  const verticalBeamWidth = 0.5 * scale;
  const diagonalBeamHeight = 0.5 * scale;
  const diagonalBeamWidth = 40 * scale;
  const centralCircleSize = 12 * scale;
  const innerCenterSize = 8 * scale;
  const dropShadowSize = 12 * scale;

  return (
    <div
      className="relative flex rotate-[30deg] transform items-center justify-center overflow-visible z-100"
      style={{
        width: containerSize,
        height: containerSize,
        filter: `brightness(2) drop-shadow(0 0 ${dropShadowSize}px ${whiteColor})`,
        ...style,
      }}
    >
      {/* Horizontal beam */}
      <div
        className="absolute animate-pulse blur-[0.2px]"
        style={{
          height: horizontalBeamHeight,
          width: horizontalBeamWidth,
          background: `linear-gradient(90deg, transparent 0%, ${rgba(colors.blue, 0.005)} 3%, ${rgba(colors.blue, 0.01)} 6%, ${rgba(colors.blue, 0.02)} 10%, ${rgba(colors.blue, 0.04)} 14%, ${rgba(colors.blue, 0.08)} 18%, ${rgba(colors.blue, 0.15)} 22%, ${rgba(colors.blue, 0.25)} 28%, ${rgba(colors.blue, 0.4)} 35%, ${rgba(colors.blue, 0.6)} 42%, ${rgba(colors.blue, 0.8)} 46%, ${rgba(colors.blue, 1)} 50%, ${rgba(colors.blue, 0.8)} 54%, ${rgba(colors.blue, 0.6)} 58%, ${rgba(colors.blue, 0.4)} 65%, ${rgba(colors.blue, 0.25)} 72%, ${rgba(colors.blue, 0.15)} 78%, ${rgba(colors.blue, 0.08)} 82%, ${rgba(colors.blue, 0.04)} 86%, ${rgba(colors.blue, 0.02)} 90%, ${rgba(colors.blue, 0.01)} 94%, ${rgba(colors.blue, 0.005)} 97%, transparent 100%)`,
        }}
      />

      {/* Vertical beam */}
      <div
        className="absolute animate-pulse blur-[0.2px]"
        style={{
          height: verticalBeamHeight,
          width: verticalBeamWidth,
          background: `linear-gradient(180deg, transparent 0%, ${rgba(colors.cyan, 0.005)} 3%, ${rgba(colors.cyan, 0.01)} 6%, ${rgba(colors.cyan, 0.02)} 10%, ${rgba(colors.cyan, 0.04)} 14%, ${rgba(colors.cyan, 0.08)} 18%, ${rgba(colors.cyan, 0.15)} 22%, ${rgba(colors.cyan, 0.25)} 28%, ${rgba(colors.cyan, 0.4)} 35%, ${rgba(colors.cyan, 0.6)} 42%, ${rgba(colors.cyan, 0.8)} 46%, ${rgba(colors.cyan, 1)} 50%, ${rgba(colors.cyan, 0.8)} 54%, ${rgba(colors.cyan, 0.6)} 58%, ${rgba(colors.cyan, 0.4)} 65%, ${rgba(colors.cyan, 0.25)} 72%, ${rgba(colors.cyan, 0.15)} 78%, ${rgba(colors.cyan, 0.08)} 82%, ${rgba(colors.cyan, 0.04)} 86%, ${rgba(colors.cyan, 0.02)} 90%, ${rgba(colors.cyan, 0.01)} 94%, ${rgba(colors.cyan, 0.005)} 97%, transparent 100%)`,
          animationDelay: '0.2s',
        }}
      />

      {/* Diagonal beam 45° */}
      <div
        className="absolute rotate-45 transform animate-pulse blur-[0.15px]"
        style={{
          height: diagonalBeamHeight,
          width: diagonalBeamWidth,
          background: `linear-gradient(90deg, transparent 0%, ${rgba(colors.purple, 0.003)} 4%, ${rgba(colors.purple, 0.008)} 8%, ${rgba(colors.purple, 0.02)} 12%, ${rgba(colors.purple, 0.05)} 16%, ${rgba(colors.purple, 0.1)} 20%, ${rgba(colors.purple, 0.2)} 25%, ${rgba(colors.purple, 0.35)} 32%, ${rgba(colors.purple, 0.55)} 40%, ${rgba(colors.purple, 0.75)} 45%, ${rgba(colors.purple, 1)} 50%, ${rgba(colors.purple, 0.75)} 55%, ${rgba(colors.purple, 0.55)} 60%, ${rgba(colors.purple, 0.35)} 68%, ${rgba(colors.purple, 0.2)} 75%, ${rgba(colors.purple, 0.1)} 80%, ${rgba(colors.purple, 0.05)} 84%, ${rgba(colors.purple, 0.02)} 88%, ${rgba(colors.purple, 0.008)} 92%, ${rgba(colors.purple, 0.003)} 96%, transparent 100%)`,
          animationDelay: '0.4s',
        }}
      />

      {/* Diagonal beam 135° */}
      <div
        className="absolute rotate-[135deg] transform animate-pulse blur-[0.15px]"
        style={{
          height: diagonalBeamHeight,
          width: diagonalBeamWidth,
          background: `linear-gradient(90deg, transparent 0%, ${rgba(colors.indigo, 0.003)} 4%, ${rgba(colors.indigo, 0.008)} 8%, ${rgba(colors.indigo, 0.02)} 12%, ${rgba(colors.indigo, 0.05)} 16%, ${rgba(colors.indigo, 0.1)} 20%, ${rgba(colors.indigo, 0.2)} 25%, ${rgba(colors.indigo, 0.35)} 32%, ${rgba(colors.indigo, 0.55)} 40%, ${rgba(colors.indigo, 0.75)} 45%, ${rgba(colors.indigo, 1)} 50%, ${rgba(colors.indigo, 0.75)} 55%, ${rgba(colors.indigo, 0.55)} 60%, ${rgba(colors.indigo, 0.35)} 68%, ${rgba(colors.indigo, 0.2)} 75%, ${rgba(colors.indigo, 0.1)} 80%, ${rgba(colors.indigo, 0.05)} 84%, ${rgba(colors.indigo, 0.02)} 88%, ${rgba(colors.indigo, 0.008)} 92%, ${rgba(colors.indigo, 0.003)} 96%, transparent 100%)`,
          animationDelay: '0.6s',
        }}
      />

      {/* Central fading circle */}
      <div
        className="absolute animate-ping rounded-full"
        style={{
          height: centralCircleSize,
          width: centralCircleSize,
          background: `radial-gradient(circle, ${rgba(colors.white, 0.9)} 0%, ${rgba(colors.cyan, 0.7)} 30%, ${rgba(colors.purple, 0.5)} 60%, transparent 80%)`,
          animationDelay: `${pingDelay}s`,
        }}
      />

      {/* Inner glowing center */}
      <div
        className="absolute animate-pulse rounded-full blur-[1px]"
        style={{
          height: innerCenterSize,
          width: innerCenterSize,
          background: `radial-gradient(circle, ${rgba(colors.white, 0.95)} 0%, ${rgba(colors.lightBlue, 0.8)} 50%, ${rgba(colors.lightPurple, 0.6)} 80%, transparent 100%)`,
          animationDelay: '0.25s',
        }}
      />
    </div>
  );
};

export default FireEffect;
