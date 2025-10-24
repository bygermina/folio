import tailwindConfig, { baseColors } from '../../tailwind.config';

export const rgba = (rgbStr: string, alpha: number): string => {
  const match = rgbStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return rgbStr;

  return `rgba(${match[1]},${match[2]},${match[3]},${alpha})`;
};

export const rgbStringToArray = (rgbStr: string): [number, number, number] => {
  const match = rgbStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return [0, 0, 0];

  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
};

export const colors = {
  ...tailwindConfig.theme.extend.colors,
};

export { baseColors };

export const commonColors = {
  white: colors.white.DEFAULT,
  dark: colors.dark.DEFAULT,
  fire: colors.fire,
  code: colors.code,
  light: colors.light,
  lamp: colors.lamp,
  glass: colors.glass,
  cyan: colors.cyan,
  blue: colors.blue,
  purple: colors.purple,
  indigo: colors.indigo,
  slate: colors.slate,
};
