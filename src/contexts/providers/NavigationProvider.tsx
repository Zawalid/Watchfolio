import { useState, ReactNode } from 'react';
import { NavigationContext } from '../NavigationContext';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeNavigator, setActiveNavigator] = useState<string | null>(null);

  const registerNavigation = (id: string) => {
    setActiveNavigator(id);
  };

  const unregisterNavigation = (id: string) => {
    if (activeNavigator === id) {
      setActiveNavigator(null);
    }
  };

  const isActive = (id: string) => {
    return activeNavigator === id || activeNavigator === null;
  };

  return (
    <NavigationContext.Provider value={{ activeNavigator, registerNavigation, unregisterNavigation, isActive }}>
      {children}
    </NavigationContext.Provider>
  );
}
