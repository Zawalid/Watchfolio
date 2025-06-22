import { StateCreator, StoreMutatorIdentifier } from 'zustand';

// Storage interface to support different storage types
interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// Cookie storage implementation
const createCookieStorage = (): Storage => ({
  getItem: (key: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    return null;
  },
  setItem: (key: string, value: string) => {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString(); // 1 year
    document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },
  removeItem: (key: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  },
});

// Storage factory
const createStorage = (type: 'localStorage' | 'sessionStorage' | 'cookie'): Storage => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  switch (type) {
    case 'localStorage':
      return localStorage;
    case 'sessionStorage':
      return sessionStorage;
    case 'cookie':
      return createCookieStorage();
    default:
      return localStorage;
  }
};

type PersistAndSyncOptions<T> = {
  name: string;
  include?: (keyof T)[];
  partialize?: (state: T) => Partial<T>;
  debounceMs?: number;
  storage?: 'localStorage' | 'sessionStorage' | 'cookie';
  onRehydrate?: (state: T, store: T, set: (partial: Partial<T>) => void) => Promise<void> | void;
};

type PersistAndSync = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: StateCreator<T, Mps, Mcs>,
  options: PersistAndSyncOptions<T>
) => StateCreator<T, Mps, Mcs>;

export const persistAndSync: PersistAndSync = (f, options) => (set, get, api) => {
  const { name, include, partialize, debounceMs = 30, storage: storageType = 'localStorage', onRehydrate } = options;
  const storage = createStorage(storageType);
  let saveTimeout: NodeJS.Timeout | null = null;

  // Helper to get the state to persist
  const getPersistedState = () => {
    const state = get();

    if (partialize) {
      return partialize(state);
    }

    if (include) {
      const filtered: Record<string, unknown> = {};
      include.forEach((key) => {
        if (key in (state as Record<string, unknown>)) {
          filtered[key as string] = (state as Record<string, unknown>)[key as string];
        }
      });
      return filtered;
    }

    return state;
  }; // Save to storage
  const saveToStorage = () => {
    try {
      const stateToSave = getPersistedState();
      storage.setItem(name, JSON.stringify(stateToSave));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  };

  // Debounced save
  const debouncedSave = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(saveToStorage, debounceMs);
  }; // Load from storage
  const loadFromStorage = async () => {
    try {
      const stored = storage.getItem(name);
      if (stored) {
        const parsedState = JSON.parse(stored);
        set((currentState) => ({ ...currentState, ...parsedState }));
      }
      // Always call onRehydrate callback if provided (for both cached and fresh states)
      if (onRehydrate) {
        const currentStore = get();
        await onRehydrate(currentStore, currentStore, set);
      }
    } catch (error) {
      console.warn('Failed to load from storage:', error);
    }
  };
  // Handle storage events (cross-tab sync) - only works with localStorage
  const handleStorageChange = async (e: StorageEvent) => {
    if (e.key === name && e.newValue && storageType === 'localStorage') {
      try {
        const newState = JSON.parse(e.newValue);
        set(newState, false);
        // Call onRehydrate callback if provided (for cross-tab validation)
        if (onRehydrate) {
          const currentStore = get();
          await onRehydrate(currentStore, currentStore, set);
        }
      } catch (error) {
        console.warn('Failed to sync from storage event:', error);
      }
    }
  }; // Create wrapped set function that saves after each update
  const wrappedSet = (partial: unknown, replace?: boolean) => {
    if (replace === true) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (set as any)(partial, true);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (set as any)(partial);
    }
    debouncedSave();
  };
  // Create the store with persistence wrapper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = f(wrappedSet as any, get, api);
  // Add immediate sync function to the store for critical actions
  (store as Record<string, unknown>).syncImmediately = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      saveTimeout = null;
    }
    saveToStorage();
  }; // Set up cross-tab sync (only for localStorage)
  if (typeof window !== 'undefined') {
    // Load initial state after a microtask to ensure store is fully initialized
    Promise.resolve().then(() => {
      loadFromStorage();
    });

    // Listen for changes from other tabs (only localStorage supports this)
    if (storageType === 'localStorage') {
      window.addEventListener('storage', handleStorageChange);
    }

    // Cleanup function
    const cleanup = () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      if (storageType === 'localStorage') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };

    // Store cleanup function on the api
    (api as Record<string, unknown>)._persistCleanup = cleanup;
  }

  return store;
};
