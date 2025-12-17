import { useScreenSizeContext } from '@/shared/lib/providers/use-context';

import styles from './footer.module.scss';

export const FooterWidget = () => {
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

