/**
 * Convert RGB string to RGBA with opacity
 * @deprecated Use colorWithOpacity() for CSS variables instead
 */
export const rgba = (rgbStr: string, alpha: number): string => {
  const match = rgbStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return rgbStr;

  return `rgba(${match[1]},${match[2]},${match[3]},${alpha})`;
};

/**
 * Convert RGB string to array of numbers
 */
export const rgbStringToArray = (rgbStr: string): [number, number, number] => {
  const match = rgbStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
  if (!match) return [0, 0, 0];

  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
};

export const colorWithOpacity = (colorVar: string, opacity: number): string => {
  return `rgba(from ${colorVar} r g b / ${opacity})`;
};

/**
 * Get RGB values from a CSS variable (for cases where rgba() syntax is not supported)
 * Note: This requires the color to be available at runtime
 */
export const getRgbFromVar = (colorVar: string): string => {
  if (typeof window === 'undefined') return colorVar;
  const value = getComputedStyle(document.documentElement).getPropertyValue(
    colorVar.trim().replace('var(', '').replace(')', ''),
  );

  return value.trim() || colorVar;
};
