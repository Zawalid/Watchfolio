import { useState, ReactNode } from 'react';
import { NavigationContext } from '../NavigationContext';

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeNavigator, setActiveNavigator] = useState<string | null>(null);

  const registerNavigator = (id: string) => {
    setActiveNavigator(id);
  };

  const unregisterNavigator = (id: string) => {
    if (activeNavigator === id) {
      setActiveNavigator(null);
    }
  };

  const isActive = (id: string) => {
    return activeNavigator === id || activeNavigator === null;
  };

  return (
    <NavigationContext.Provider value={{ activeNavigator, registerNavigator, unregisterNavigator, isActive }}>
      {children}
    </NavigationContext.Provider>
  );
}
