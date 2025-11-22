import type { IconName } from './components/slide-content';

export interface LinkData {
  query: string;
  image: IconName;
}

export const LINKS: LinkData[] = [
  {
    query: 'Spin it up',
    image: 'reactlogo',
  },
  {
    query: 'Type it safe',
    image: 'typescript',
  },
  {
    query: 'Run it fast',
    image: 'nodejs',
  },
];

export const SLIDE_WIDTH = {
  MOBILE: 200,
  DESKTOP: 200,
} as const;
