import { create } from 'zustand';
import { GENRES } from '@/utils/constants/TMDB';
import { calculateTotalMinutesRuntime, getRating } from '@/utils/media';
import { mergeLibraryItems, getLibraryCount, logLibraryActivity } from '@/utils/library';
import { serializeToJSON, serializeToCSV } from '@/utils/export';
import { useAuthStore } from './useAuthStore';
import {
  getLibraryMedias,
  deleteLibraryMedia,
  addOrUpdateLibraryMedia,
  clearLibrary as clearRxDBLibrary,
  searchLibraryMedia,
  bulkUpdateLibraryMedia,
  LibraryError,
} from '@/lib/rxdb';
import { filterObject } from '@/utils';
import { getSyncStatus } from '@/lib/rxdb';

type Operation = {
  id: string;
  type: 'create' | 'update' | 'delete';
  data?: {
    item: Partial<LibraryMedia> & Pick<LibraryMedia, 'id'>;
    media?: Media;
  };
  timestamp?: string;
};

interface LibraryState {
  library: LibraryCollection;
  isLoading: boolean;
  error: string | null;
  lastUpdatedAt: string;

  // Enhanced offline support
  pendingOperations: Array<Operation>;

  // Actions
  getItem: (id: string) => LibraryMedia | undefined;
  addOrUpdateItem: (
    item: Partial<LibraryMedia> & Pick<LibraryMedia, 'id'>,
    media?: Media
  ) => Promise<LibraryMedia | null>;
  removeItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string, media?: Media) => Promise<LibraryMedia | null>;
  getAllItems: () => LibraryMedia[];
  getItemsByStatus: (status: LibraryFilterStatus, mediaType?: MediaType) => LibraryMedia[];
  getCount: (filter: LibraryFilterStatus, mediaType?: MediaType) => number;

  // Enhanced search and filtering
  searchItems: (
    query: string,
    options?: {
      mediaType?: MediaType;
      status?: LibraryFilterStatus;
      limit?: number;
    }
  ) => Promise<LibraryMedia[]>;

  // Bulk operations
  bulkUpdate: (updates: Array<{ id: string; data: Partial<LibraryMedia> }>) => Promise<{
    successful: number;
    failed: number;
    errors: Array<{ id: string; error: string }>;
  }>;

  // Export/Import
  exportLibrary: (items: LibraryMedia[], format: 'json' | 'csv') => string;
  importLibrary: (
    parsedItems: LibraryMedia[],
    options: { mergeStrategy: 'smart' | 'overwrite' | 'skip'; keepExistingFavorites: boolean }
  ) => Promise<number>;

  // Library management
  clearLibrary: () => Promise<void>;
  loadLibrary: () => Promise<void>;
  refreshLibrary: () => Promise<void>;

  // Offline support
  processPendingOperations: () => Promise<void>;
  clearError: () => void;

  // Sync status
  getSyncStatus: () => string;
}

// Enhanced helpers with better error handling
const shouldRemoveItem = (item: LibraryMedia): boolean => {
  return !item.isFavorite && (item.status === 'none' || !item.status) && !item.userRating && !item.notes?.trim();
};

const getCurrentLibrary = (): LibraryMedia['library'] => {
  const user = useAuthStore.getState().user;
  const library = user?.profile.library
    ? filterObject(user?.profile.library, ['$id', 'averageRating'], 'include')
    : null;
  return library;
};

const getMediaMetadata = (media: Media): Partial<LibraryMedia> => {
  try {
    const title = (media as Movie).title || (media as TvShow).name;
    const releaseDate = (media as Movie).release_date || (media as TvShow).first_air_date || undefined;

    return {
      tmdbId: media.id,
      title: title?.trim() || `${media.media_type} ${media.id}`,
      posterPath: media.poster_path?.trim() || undefined,
      releaseDate: releaseDate?.trim() || undefined,
      genres:
        (media.genres?.map((g: { id: number; name: string }) => g.name?.trim()).filter(Boolean) as string[]) ||
        (media.genre_ids?.map((id) => GENRES.find((g) => g.id === id)?.label?.trim()).filter(Boolean) as string[]) ||
        [],
      rating: media.vote_average ? +getRating(media.vote_average) : undefined,
      totalMinutesRuntime: calculateTotalMinutesRuntime(media) || undefined,
      networks: (media as TvShow).networks?.map((n) => n.id).filter((id) => typeof id === 'number') || [],
      media_type: media.media_type,
      overview: media.overview?.trim() || undefined,
    };
  } catch (error) {
    console.error('Failed to extract media metadata:', error);
    return {
      tmdbId: media.id,
      title: `${media.media_type} ${media.id}`,
      media_type: media.media_type,
    };
  }
};

// Enhanced operation queue for offline support
const addPendingOperation = (state: LibraryState, operation: Operation) => {
  const pendingOp = {
    ...operation,
    timestamp: new Date().toISOString(),
  };

  // Remove any existing operations for the same item and type
  const filteredOps = state.pendingOperations.filter((op) => !(op.id === operation.id && op.type === operation.type));

  return [...filteredOps, pendingOp];
};

export const useLibraryStore = create<LibraryState>()((set, get) => ({
  library: {},
  lastUpdatedAt: new Date().toISOString(),
  isLoading: false,
  error: null,
  pendingOperations: [],

  getItem: (id) => {
    const { library } = get();

    // First try direct ID lookup
    if (library[id]) return library[id];

    // If ID contains a dash, try parsing as mediaType-tmdbId format
    if (String(id).includes('-')) {
      const [mediaType, tmdbId] = id.split('-');
      const foundItem = Object.values(library).find(
        (item) => item.tmdbId === parseInt(tmdbId) && item.media_type === mediaType
      );
      return foundItem;
    }

    return undefined;
  },

  addOrUpdateItem: async (item, media) => {
    try {
      set({ isLoading: true, error: null });

      const currentItem = get().getItem(item.id) || {};
      const metadata = media ? getMediaMetadata(media) : {};
      const newItemData = { ...currentItem, ...item, ...metadata } as LibraryMedia;

      if (shouldRemoveItem(newItemData)) {
        await get().removeItem(newItemData.id);
        return null;
      }

      const newOrUpdatedItem = await addOrUpdateLibraryMedia(newItemData, getCurrentLibrary());

      if (newOrUpdatedItem) {
        set((state) => ({
          library: {
            ...state.library,
            [newOrUpdatedItem.id]: newOrUpdatedItem,
          },
          lastUpdatedAt: new Date().toISOString(),
          error: null,
        }));

        const profileId = useAuthStore.getState().user?.profile?.$id;
        if (profileId) {
          try {
            logLibraryActivity(newOrUpdatedItem, undefined, profileId);
          } catch (error) {
            console.warn('Failed to log library activity:', error);
          }
        }

        return newOrUpdatedItem;
      }

      return null;
    } catch (error) {
      console.error('Failed to add or update library item:', error);

      const errorMessage = error instanceof LibraryError ? error.message : 'Failed to save item';

      set({ error: errorMessage });

      // Add to pending operations if it's a network error
      if (getSyncStatus() === 'offline' || getSyncStatus() === 'error') {
        set((state) => ({
          pendingOperations: addPendingOperation(state, {
            id: item.id,
            type: get().getItem(item.id) ? 'update' : 'create',
            data: { item, media },
          }),
        }));
      }

      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (id, media) => {
    try {
      set({ isLoading: true, error: null });
      const currentItem = get().getItem(id);
      const isFavorite = !currentItem?.isFavorite;

      return await get().addOrUpdateItem({ id, isFavorite }, media);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      set({ error: 'Failed to toggle favorite' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (id) => {
    try {
      set({ isLoading: true, error: null });

      await deleteLibraryMedia(id);

      set((state) => {
        const newLibrary = { ...state.library };
        delete newLibrary[id];
        return {
          library: newLibrary,
          lastUpdatedAt: new Date().toISOString(),
          error: null,
        };
      });
    } catch (error) {
      console.error('Failed to remove item:', error);

      const errorMessage = error instanceof LibraryError ? error.message : 'Failed to remove item';

      set({ error: errorMessage });

      // Add to pending operations if offline
      if (getSyncStatus() === 'offline' || getSyncStatus() === 'error') {
        set((state) => ({
          pendingOperations: addPendingOperation(state, {
            id,
            type: 'delete',
          }),
        }));
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getAllItems: () => {
    const { library } = get();
    return Object.values(library);
  },

  getItemsByStatus: (status, mediaType) => {
    const { library } = get();
    return Object.values(library).filter((item) => {
      if (mediaType && item.media_type !== mediaType) return false;
      if (status === 'all') return true;
      if (status === 'favorites') return item.isFavorite;
      return item.status === status;
    });
  },

  getCount: (filter, mediaType) => {
    const { library } = get();
    return getLibraryCount({ items: Object.values(library), filter, mediaType }) as number;
  },

  searchItems: async (query, options = {}) => {
    try {
      if (!query?.trim()) return [];

      const library = getCurrentLibrary();
      return await searchLibraryMedia(query, { libraryId: library?.$id, ...options });
    } catch (error) {
      console.error('Search failed:', error);
      set({ error: 'Search failed' });
      return [];
    }
  },

  bulkUpdate: async (updates) => {
    try {
      set({ isLoading: true, error: null });

      const result = await bulkUpdateLibraryMedia(updates, {
        batchSize: 25,
        onProgress: (processed, total) => {
          console.log(`Bulk update progress: ${processed}/${total}`);
        },
      });

      // Refresh library after bulk update
      await get().loadLibrary();

      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('Bulk update failed:', error);
      set({ error: 'Bulk update failed', isLoading: false });
      throw error;
    }
  },

  exportLibrary: (items, format = 'json') => {
    const libraryItems = items.length > 0 ? items : Object.values(get().library);
    return format === 'csv' ? serializeToCSV(libraryItems) : serializeToJSON(libraryItems);
  },

  importLibrary: async (parsedItems, options = { mergeStrategy: 'smart', keepExistingFavorites: true }) => {
    try {
      set({ isLoading: true, error: null });

      // Validate options
      if (!options.mergeStrategy || !['smart', 'overwrite', 'skip'].includes(options.mergeStrategy)) {
        throw new LibraryError('Invalid merge strategy');
      }
      if (typeof options.keepExistingFavorites !== 'boolean') {
        options.keepExistingFavorites = true;
      }

      // Validate parsedItems
      if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
        set({ isLoading: false });
        return 0;
      }

      // Get current library, ensure it's not null
      const currentLibrary = get().library || {};

      // Merge the libraries using already parsed items
      const { mergedLibrary, importCount } = mergeLibraryItems(parsedItems, currentLibrary, options);

      // Process items in batches
      const batchSize = 25;
      let processed = 0;

      for (let i = 0; i < Object.values(mergedLibrary).length; i += batchSize) {
        const batch = Object.values(mergedLibrary).slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (item) => {
            try {
              await get().addOrUpdateItem(item);
              processed++;
            } catch (error) {
              console.error(`Failed to import item ${item.id}:`, error);
            }
          })
        );
      }

      set({ isLoading: false });
      console.log(`✅ Import completed: ${processed} items processed`);
      return importCount;
    } catch (error) {
      console.error('Import error:', error);
      set({ isLoading: false, error: 'Import failed' });
      throw new LibraryError(`Failed to import library: ${error instanceof Error ? error.message : String(error)}`);
    }
  },

  clearLibrary: async () => {
    try {
      set({ isLoading: true, error: null });

      const library = getCurrentLibrary();
      await clearRxDBLibrary(library?.$id, {
        batchSize: 50,
        onProgress: (processed, total) => {
          console.log(`Clear progress: ${processed}/${total}`);
        },
      });

      set({ library: {}, lastUpdatedAt: new Date().toISOString() });
      console.log('🗑️ Library cleared successfully');
    } catch (error) {
      console.error('Failed to clear library:', error);
      set({ error: 'Failed to clear library' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  loadLibrary: async () => {
    try {
      set({ isLoading: true, error: null });

      const library = getCurrentLibrary();
      const items = await getLibraryMedias(library?.$id);

      const libraryMap = items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as LibraryCollection);

      set({
        library: libraryMap,
        lastUpdatedAt: new Date().toISOString(),
        isLoading: false,
        error: null,
      });

      console.log(`📚 Library loaded: ${items.length} items`);
    } catch (error) {
      console.error('Failed to load library:', error);
      set({
        error: 'Failed to load library',
        isLoading: false,
      });
    }
  },

  refreshLibrary: async () => {
    try {
      await get().loadLibrary();
      // Process any pending operations after refresh
      await get().processPendingOperations();
    } catch (error) {
      console.error('Failed to refresh library:', error);
      throw error;
    }
  },

  processPendingOperations: async () => {
    const { pendingOperations } = get();

    if (pendingOperations.length === 0) return;

    console.log(`📝 Processing ${pendingOperations.length} pending operations`);

    const processedOps: string[] = [];

    for (const op of pendingOperations) {
      try {
        switch (op.type) {
          case 'create':
          case 'update':
            if (op.data?.item) {
              await get().addOrUpdateItem(op.data.item, op.data.media);
            }
            break;
          case 'delete':
            await get().removeItem(op.id);
            break;
        }
        processedOps.push(op.id);
      } catch (error) {
        console.error(`Failed to process pending operation for ${op.id}:`, error);
      }
    }

    // Remove processed operations
    set((state) => ({
      pendingOperations: state.pendingOperations.filter((op) => !processedOps.includes(op.id)),
    }));

    console.log(`✅ Processed ${processedOps.length} pending operations`);
  },

  clearError: () => {
    set({ error: null });
  },

  getSyncStatus: () => {
    return getSyncStatus();
  },
}));
