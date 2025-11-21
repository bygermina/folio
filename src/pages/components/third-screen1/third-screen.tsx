import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/utils/cn';

import { WaterEffect } from '@/components/animations/water-effect';
import { ClickableDots } from '@/components/animations/clickable-dots/clickable-dots';
import { TypeText } from '@/components/animations/text/type-text';
import { useScreenSizeContext } from '@/components/providers/use-context';

import styles from './third-screen.module.scss';

export const ThirdScreen = () => {
  const { screenMode } = useScreenSizeContext();

  useEffect(() => {
    // Collect Three.js and WebGL skills when user interacts with water
    const handleWaterClick = () => {
      if ((window as any).collectSkill) {
        (window as any).collectSkill({
          id: 'threejs',
          name: 'Three.js',
          category: '3D/WebGL',
          description: 'Creating immersive 3D experiences in the browser',
        });
        (window as any).collectSkill({
          id: 'webgl',
          name: 'WebGL Shaders',
          category: 'Graphics',
          description: 'Custom shaders for advanced visual effects',
        });
      }
    };

    // Listen for clicks on water effect
    const waterContainer = document.querySelector('[data-water-effect]');
    if (waterContainer) {
      waterContainer.addEventListener('click', handleWaterClick, { once: true });
    }

    return () => {
      if (waterContainer) {
        waterContainer.removeEventListener('click', handleWaterClick);
      }
    };
  }, []);

  return (
    <section className={styles.section}>
      <WaterEffect className={styles.waterEffect} data-water-effect />
      <ClickableDots className={styles.clickableDots} />

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.h2
            className={cn('glass-text-shine', styles.heading, `heading-${screenMode}`)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <TypeText
              text="3d animations"
              className={cn('glass-text-shine', `heading-${screenMode}`)}
              speed={0.08}
              delay={0.6}
            />
          </motion.h2>

          <motion.p
            className={cn(styles.subheading, `subheading-${screenMode}`)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 3.5 }}
          >
            <span style={{ color: 'var(--color-cyan-400)' }}>Challenge:</span> Click on the
            highleghted spots to create ripples
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
