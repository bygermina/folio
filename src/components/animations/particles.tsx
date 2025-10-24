import { useRef } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <>
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {particlesRef.current.map((p, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-blue-500/30"
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
      )}
    </>
  );
};
