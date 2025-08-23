import { create } from 'zustand';
import { GENRES } from '@/utils/constants/TMDB';
import { calculateTotalMinutesRuntime, getRating } from '@/utils/media';
import { mergeLibraryItems, getLibraryCount, logLibraryActivity } from '@/utils/library';
import { serializeToJSON, serializeToCSV } from '@/utils/export';
import { useAuthStore } from './useAuthStore';
import {
  getAllLibraryMedias,
  deleteLibraryMedia,
  addOrUpdateLibraryMedia,
  clearLibrary as clearRxDBLibrary,
  searchLibraryMedia,
  bulkUpdateLibraryMedia,
  LibraryError,
} from '@/lib/rxdb';
import { filterObject } from '@/utils';
import { getSyncStatus } from '@/lib/rxdb';

interface LibraryState {
  library: LibraryCollection;
  isLoading: boolean;
  error: string | null;
  lastUpdatedAt: string;

  // Actions
  getItem: (id: string) => LibraryMedia | undefined;
  addOrUpdateItem: (
    item: Partial<LibraryMedia> & Pick<LibraryMedia, 'id'>,
    media?: Media
  ) => Promise<LibraryMedia | null>;
  addOrUpdateItemLocally: (item: LibraryMedia) => void;
  removeItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string, media?: Media) => Promise<LibraryMedia | null>;
  getAllItems: () => LibraryMedia[];
  getItemsByStatus: (status: LibraryFilterStatus, mediaType?: MediaType) => LibraryMedia[];
  getCount: (filter: LibraryFilterStatus, mediaType?: MediaType) => number;

  // Search and filtering
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
  clearLibraryLocally: () => void;
  loadLibrary: () => Promise<void>;
  refreshLibrary: () => Promise<void>;
  clearError: () => void;
  getSyncStatus: () => string;
}

const shouldRemoveItem = (item: LibraryMedia): boolean => {
  return !item.isFavorite && (item.status === 'none' || !item.status) && !item.userRating && !item.notes?.trim();
};

const getCurrentLibrary = (): LibraryMedia['library'] => {
  const user = useAuthStore.getState().user;
  return user?.profile.library ? filterObject(user.profile.library, ['$id', 'averageRating'], 'include') : null;
};

const getMediaMetadata = (media: Media): Partial<LibraryMedia> => {
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
};

export const useLibraryStore = create<LibraryState>()((set, get) => ({
  library: {},
  lastUpdatedAt: new Date().toISOString(),
  isLoading: false,
  error: null,

  getItem: (id) => {
    const { library } = get();
    if (library[id]) return library[id];

    // Handle mediaType-tmdbId format
    if (String(id).includes('-')) {
      const [mediaType, tmdbId] = id.split('-');
      return Object.values(library).find((item) => item.tmdbId === parseInt(tmdbId) && item.media_type === mediaType);
    }

    return undefined;
  },

  addOrUpdateItem: async (item, media) => {
    set({ isLoading: true, error: null });

    try {
      const currentItem = get().getItem(item.id) || {};
      const metadata = media ? getMediaMetadata(media) : {};
      const newItemData = { ...currentItem, ...item, ...metadata } as LibraryMedia;

      if (shouldRemoveItem(newItemData)) {
        await get().removeItem(newItemData.id);
        return null;
      }

      const result = await addOrUpdateLibraryMedia(newItemData, getCurrentLibrary());

      if (result) {
        set((state) => ({
          library: { ...state.library, [result.id]: result },
          lastUpdatedAt: new Date().toISOString(),
        }));

        // Log activity
        const profileId = useAuthStore.getState().user?.profile?.$id;
        if (profileId) {
          try {
            logLibraryActivity(result, undefined, profileId);
          } catch (error) {
            console.warn('Failed to log library activity:', error);
          }
        }
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof LibraryError ? error.message : 'Failed to save item';
      set({ error: errorMessage });
      console.error('Failed to add or update library item:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  addOrUpdateItemLocally: (item) => {
    set((state) => ({
      library: { ...state.library, [item.id]: { ...state.library[item.id], ...item } },
      lastUpdatedAt: new Date().toISOString(),
    }));
  },

  toggleFavorite: async (id, media) => {
    const currentItem = get().getItem(id);
    const isFavorite = !currentItem?.isFavorite;
    return await get().addOrUpdateItem({ id, isFavorite }, media);
  },

  removeItem: async (id) => {
    set({ isLoading: true, error: null });

    try {
      await deleteLibraryMedia(id);

      set((state) => {
        const newLibrary = { ...state.library };
        delete newLibrary[id];
        return {
          library: newLibrary,
          lastUpdatedAt: new Date().toISOString(),
        };
      });
    } catch (error) {
      const errorMessage = error instanceof LibraryError ? error.message : 'Failed to remove item';
      set({ error: errorMessage });
      console.error('Failed to remove item:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  getAllItems: () => Object.values(get().library),

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
    if (!query?.trim()) return [];

    try {
      const library = getCurrentLibrary();
      return await searchLibraryMedia(query, { libraryId: library?.$id, ...options });
    } catch (error) {
      console.error('Search failed:', error);
      set({ error: 'Search failed' });
      return [];
    }
  },

  bulkUpdate: async (updates) => {
    set({ isLoading: true, error: null });

    try {
      const result = await bulkUpdateLibraryMedia(updates, {
        batchSize: 25,
        onProgress: (processed, total) => {
          console.log(`Bulk update progress: ${processed}/${total}`);
        },
      });

      await get().loadLibrary();
      return result;
    } catch (error) {
      console.error('Bulk update failed:', error);
      set({ error: 'Bulk update failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  exportLibrary: (items, format = 'json') => {
    const libraryItems = items.length > 0 ? items : Object.values(get().library);
    return format === 'csv' ? serializeToCSV(libraryItems) : serializeToJSON(libraryItems);
  },

  importLibrary: async (parsedItems, options = { mergeStrategy: 'smart', keepExistingFavorites: true }) => {
    set({ isLoading: true, error: null });

    try {
      if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
        return 0;
      }

      const currentLibrary = get().library || {};
      const { mergedLibrary, importCount } = mergeLibraryItems(parsedItems, currentLibrary, options);

      // Process in batches
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

      console.log(`Import completed: ${processed} items processed`);
      return importCount;
    } catch (error) {
      console.error('Import error:', error);
      set({ error: 'Import failed' });
      throw new LibraryError(`Failed to import library: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      set({ isLoading: false });
    }
  },

  clearLibrary: async () => {
    set({ isLoading: true, error: null });

    try {
      const library = getCurrentLibrary();
      await clearRxDBLibrary(library?.$id);
      set({ library: {}, lastUpdatedAt: new Date().toISOString() });
      console.log('Library cleared successfully');
    } catch (error) {
      console.error('Failed to clear library:', error);
      set({ error: 'Failed to clear library' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearLibraryLocally: () => {
    set({ library: {}, lastUpdatedAt: new Date().toISOString() });
    console.log('Library cleared locally');
  },

  loadLibrary: async () => {
    set({ isLoading: true, error: null });

    try {
      const library = getCurrentLibrary();
      const items = await getAllLibraryMedias(library?.$id);

      const libraryMap = items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as LibraryCollection);

      set({
        library: libraryMap,
        lastUpdatedAt: new Date().toISOString(),
        error: null,
      });

      console.log(`Library loaded: ${items.length} items`);
    } catch (error) {
      console.error('Failed to load library:', error);
      set({ error: 'Failed to load library' });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshLibrary: async () => {
    await get().loadLibrary();
  },

  clearError: () => {
    set({ error: null });
  },

  getSyncStatus: () => {
    return getSyncStatus();
  },
}));
