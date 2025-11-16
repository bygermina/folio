import { motion } from 'framer-motion';

import styles from './battery-icon.module.scss';

const cyanColor = 'var(--color-cyan-400)';

interface BatteryIconProps {
  isCharging: boolean;
  isFull: boolean;
  level: number; // 0-4 (number of bars)
}

export const BatteryIcon = ({ isCharging, isFull, level }: BatteryIconProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={styles.icon}
      data-battery-icon="true"
    >
      {/* Battery outline */}
      <motion.rect
        x="1"
        y="3"
        width="12"
        height="10"
        rx="1.5"
        ry="1.5"
        fill="none"
        stroke={cyanColor}
        strokeWidth="1"
        opacity={0.6}
        animate={{
          opacity: isCharging ? [0.6, 0.8, 0.6] : 0.6,
        }}
        transition={{
          duration: 1,
          repeat: isCharging ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Battery terminal */}
      <motion.rect
        x="13"
        y="6"
        width="2"
        height="4"
        rx="0.5"
        ry="0.5"
        fill={cyanColor}
        opacity={0.6}
        animate={{
          opacity: isCharging ? [0.6, 0.8, 0.6] : 0.6,
        }}
        transition={{
          duration: 1,
          repeat: isCharging ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />

      {/* Charge level bars */}
      {[
        { x: 3, minLevel: 1 },
        { x: 5, minLevel: 2 },
        { x: 7, minLevel: 3 },
        { x: 9, minLevel: 4 },
      ].map((bar) => {
        const isActive = level >= bar.minLevel;
        return (
          <motion.rect
            key={bar.x}
            x={bar.x}
            y="5"
            width="1"
            height="6"
            fill={isActive ? cyanColor : 'transparent'}
            initial={{ opacity: 1 }}
            animate={{
              opacity: isCharging ? [0.6, 1, 0.6] : 1,
              fill: isCharging && isActive ? cyanColor : isActive ? cyanColor : 'transparent',
            }}
            transition={{
              duration: 0.8,
              repeat: isCharging ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        );
      })}

      {/* Glow effect during charging */}
      {isCharging && (
        <motion.rect
          x="1"
          y="3"
          width="12"
          height="10"
          rx="1.5"
          ry="1.5"
          fill={cyanColor}
          opacity={0.2}
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Full charge pulse effect */}
      {isFull && (
        <motion.rect
          x="1"
          y="3"
          width="12"
          height="10"
          rx="1.5"
          ry="1.5"
          fill={cyanColor}
          opacity={0.2}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </svg>
  );
};
