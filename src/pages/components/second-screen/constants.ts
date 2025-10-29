import reactLogo from '@/assets/react-logo-filled.svg';

export type LinkData = {
  query: string;
  image: string;
};

export const LINKS: LinkData[] = [
  {
    query: 'This is a JS animation',
    image: reactLogo,
  },
  {
    query: 'made without any libraries',
    image: reactLogo,
  },
  {
    query: 'Spin it up',
    image: reactLogo,
  },
];
