import { useScreenSizeContext } from '@/shared/lib/providers/use-context';
import { GithubIcon, LinkedinIcon, EmailIcon } from '@/shared/ui/icons';

import styles from './footer.module.scss';

const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/bygermina',
    Icon: GithubIcon,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/kseniya-liubachka',
    Icon: LinkedinIcon,
  },
  {
    name: 'Email',
    url: 'bygermina@gmail.com',
    Icon: EmailIcon,
  },
];

export const FooterWidget = () => {
  const { isPortrait } = useScreenSizeContext();

  if (isPortrait) return null;

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <nav className={styles.socialLinks} aria-label="Social links">
          {SOCIAL_LINKS.map(({ name, url, Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={name}
            >
              <Icon className={styles.icon} />
            </a>
          ))}
        </nav>
        <p className={styles.footerText}>© {new Date().getFullYear()} Xenia Liubachka</p>
      </div>
    </footer>
  );
};
