import { useScreenSizeContext } from '@/components/providers/use-context';

import styles from './copyright-footer.module.scss';

export const Footer = () => {
  const { isPortrait } = useScreenSizeContext();

  if (isPortrait) return null;

  return (
    <footer className={styles.footer}>
      <p className={styles.footerText}>
        © {new Date().getFullYear()} Xenia Liubachka. All rights reserved.
      </p>
    </footer>
  );
};
