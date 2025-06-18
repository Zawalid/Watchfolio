import { useState, useEffect } from 'react';

/**
 * A hook that persists state to localStorage
 * @param key The key to store the value under in localStorage
 * @param initialValue The initial value to use if no value is found in localStorage
 * @returns A stateful value, and a function to update it
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const KEY = `watchfolio-${key}`;
  // Get initial value from localStorage or use provided initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(KEY);
      return item ? JSON.parse(item) : initialValue instanceof Function ? initialValue() : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue instanceof Function ? initialValue() : initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [KEY, state]);

  return [state, setState];
}

