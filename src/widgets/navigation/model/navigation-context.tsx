import { createContext, useContext } from 'react';

interface NavigationContextValue {
  onExploreClick: () => void;
}

export const NavigationContext = createContext<NavigationContextValue | null>(null);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
};

