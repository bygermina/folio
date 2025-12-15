import { type ComponentType } from 'react';

/**
 * Sets displayName for a component (useful for debugging)
 * Handles both regular components and memoized components
 */
export const setDisplayName = <T extends ComponentType<unknown>>(
  component: T,
  displayName: string,
): T => {
  if (component.displayName === undefined) {
    // For memo components, use Object.assign
    if ('$$typeof' in component && component.$$typeof?.toString().includes('Memo')) {
      Object.assign(component, { displayName });
    } else {
      component.displayName = displayName;
    }
  }
  return component;
};
