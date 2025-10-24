import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

import tailwindConfig, { rgba } from '../../../tailwind.config';

const cyan400 = tailwindConfig.theme.extend.colors.cyan[400];
const cyan300 = tailwindConfig.theme.extend.colors.cyan[300];
const slate500 = tailwindConfig.theme.extend.colors.slate[500];
const slate700 = tailwindConfig.theme.extend.colors.slate[700];

export interface ProgressProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
  animated?: boolean;
  delay?: number;
  children?: ReactNode;
}

interface ChainLinkProps {
  isActive: boolean;
  index: number;
  delay: number;
}

const ChainLink = ({ isActive, index, delay }: ChainLinkProps) => {
  return (
    <motion.div
      className="relative flex items-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: delay + index * 0.1,
        ease: 'easeOut',
      }}
    >
      {/* Chain link (donut) */}
      <motion.div
        className="relative h-5 w-5 flex-shrink-0"
        transition={{
          duration: 0.6,
          delay: delay + index * 0.1 + 0.2,
          repeat: isActive ? Infinity : 0,
          repeatType: 'loop',
        }}
      >
        {/* Outer ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
            isActive
              ? 'border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-400/50'
              : 'border-slate-600 bg-slate-800/50'
          }`}
          animate={{
            borderColor: isActive ? [cyan400, cyan300, cyan400] : slate500,
            boxShadow: isActive
              ? [
                  `0 0 10px ${rgba(cyan400, 0.5)}`,
                  `0 0 20px ${rgba(cyan400, 0.8)}`,
                  `0 0 10px ${rgba(cyan400, 0.5)}`,
                ]
              : `0 0 0px ${rgba(cyan400, 0)}`,
          }}
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
            repeatType: 'reverse',
          }}
        />

        {/* Inner hole */}
        <motion.div
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-900"
          animate={{
            borderColor: isActive ? slate700 : slate500,
          }}
        />

        {/* Glowing dot in center of active link */}
        {isActive && (
          <motion.div
            className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        )}
      </motion.div>

      {/* Connection between links */}
      {index < 9 && (
        <motion.div
          className={`h-0.5 w-4 transition-all duration-300 ${
            isActive ? 'bg-gradient-to-r from-cyan-400 to-cyan-300' : 'bg-slate-600'
          }`}
          initial={{ scaleX: 0 }}
          animate={{
            scaleX: 1,
            backgroundColor: isActive ? [cyan400, cyan300, cyan400] : slate500,
          }}
          transition={{
            scaleX: {
              duration: 0.2,
              delay: delay + index * 0.1 + 0.1,
            },
            backgroundColor: {
              duration: 1.5,
              repeat: isActive ? Infinity : 0,
              repeatType: 'reverse',
            },
          }}
        />
      )}
    </motion.div>
  );
};

const sizeClasses = {
  sm: 'scale-75',
  md: 'scale-100',
  lg: 'scale-125',
};

export const ChainProgress = ({
  value,
  size = 'md',
  className = '',
  showValue = true,
  delay = 0,
}: ProgressProps) => {
  const filledLinks = Math.round((value / 100) * 10);

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 10 }, (_, index) => (
          <ChainLink key={index} isActive={index < filledLinks} index={index} delay={delay} />
        ))}
      </div>

      {showValue && (
        <motion.span
          className="ml-2 min-w-[3rem] text-right text-sm font-medium text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          {value}%
        </motion.span>
      )}
    </div>
  );
};
