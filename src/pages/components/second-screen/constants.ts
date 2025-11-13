import type { IconName } from './components/slide-content';

export type LinkData = {
  query: string;
  image: IconName;
};

export const LINKS: LinkData[] = [
  {
    query: 'This is a JS animation',
    image: 'reactlogo',
  },
  {
    query: 'made without any libraries',
    image: 'reactlogo',
  },
  {
    query: 'Spin it up',
    image: 'reactlogo',
  },
];
