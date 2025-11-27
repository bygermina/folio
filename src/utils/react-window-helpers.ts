import type { CSSProperties } from 'react';
import type { RowComponentProps } from 'react-window';

/**
 * Compares style objects by value (not reference) for react-window memo optimization
 * Used to prevent unnecessary re-renders when style object reference changes but values are the same
 */
export const compareReactWindowStyle = (
  prevStyle: CSSProperties,
  nextStyle: CSSProperties,
): boolean => {
  return (
    prevStyle.position === nextStyle.position &&
    prevStyle.top === nextStyle.top &&
    prevStyle.left === nextStyle.left &&
    prevStyle.width === nextStyle.width &&
    prevStyle.height === nextStyle.height
  );
};

/**
 * Creates a memo comparison function for react-window RowComponentProps
 * Compares index and style values to prevent unnecessary re-renders
 */
export const createReactWindowRowComparator = <T extends object = object>() => {
  return (prevProps: RowComponentProps<T>, nextProps: RowComponentProps<T>): boolean => {
    if (prevProps.index !== nextProps.index) return false;

    const prevStyle = prevProps.style as CSSProperties;
    const nextStyle = nextProps.style as CSSProperties;

    return compareReactWindowStyle(prevStyle, nextStyle);
  };
};
