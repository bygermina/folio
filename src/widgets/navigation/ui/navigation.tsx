import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/shared/lib/cn';

import styles from './navigation.module.scss';

interface NavItem {
  path: string;
  title: string;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    title: 'Home',
  },
  {
    path: '/animations',
    title: 'JS animations',
    description: 'JavaScript animations built for high performance, predictability, and control',
  },
  {
    path: '/data-intensive',
    title: 'Data intensive',
    description: 'Virtualized data tables designed for scale, performance, and control.',
  },
  {
    path: '/charts',
    title: 'Charts',
    description: 'Charts custom and build with different libraries.',
  },
];

export const Navigation = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    return location.pathname === path;
  };

  const hoveredDescription = NAV_ITEMS.find((item) => item.title === hoveredItem)?.description;

  return (
    <nav className={styles.nav}>
      <div className={styles.navWrapper}>
        <div className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(styles.navLink, isActive(item.path) && styles.navLinkActive)}
              onMouseEnter={() => setHoveredItem(item.title)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.title}
            </Link>
          ))}
        </div>
        <div className={cn(styles.tooltip, hoveredDescription && styles.tooltipVisible)}>
          {hoveredDescription}
        </div>
      </div>
    </nav>
  );
};
