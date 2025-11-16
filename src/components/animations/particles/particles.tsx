import { useRef } from 'react';
import { motion } from 'framer-motion';

import styles from './particles.module.scss';

export const Particles = () => {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const particlesRef = useRef(
    Array.from({ length: 30 }).map(() => ({
      initialX: Math.random() * 1200,
      initialY: Math.random() * 800,
      targetX: Math.random() * 1200,
      targetY: Math.random() * 800,
      duration: Math.random() * 10 + 10,
    })),
  );

  if (prefersReducedMotion) return null;

  return (
    <div className={styles.container}>
      {particlesRef.current.map((p, i) => (
        <motion.div
          key={i}
          className={styles.particle}
          initial={{ x: p.initialX, y: p.initialY }}
          animate={{ x: p.targetX, y: p.targetY }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
