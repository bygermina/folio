import { createContext, useContext } from 'react';

interface AnimationContextValue {
  animate: boolean;
}

export const AnimationContext = createContext<AnimationContextValue | null>(null);

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider');
  }
  return context;
};
