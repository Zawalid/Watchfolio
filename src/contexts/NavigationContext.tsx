import { createContext, useContext  } from 'react';

interface NavigationContextType {
  activeNavigator: string | null;
  registerNavigator: (id: string) => void;
  unregisterNavigator: (id: string) => void;
  isActive: (id: string) => boolean;
}

export const NavigationContext = createContext<NavigationContextType | null>(null);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
  