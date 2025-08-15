import { create } from 'zustand';
import { GENRES } from '@/utils/constants/TMDB';
import { calculateTotalMinutesRuntime, getRating } from '@/utils/media';
import { mergeLibraryItems, getLibraryCount, logLibraryActivity } from '@/utils/library';
import { serializeToJSON, serializeToCSV } from '@/utils/export';
import { useAuthStore } from './useAuthStore';
import { getLibraryItems, deleteLibraryItem, addOrUpdateLibraryItem, clearLibrary as clearRxDBLibrary, } from '@/lib/rxdb/collections';
import { filterObject } from '@/utils';
import { RxDBLibraryMedia } from '@/lib/rxdb';

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
  removeItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string, media?: Media) => Promise<LibraryMedia | null>;
  getAllItems: () => LibraryMedia[];
  getItemsByStatus: (status: LibraryFilterStatus, mediaType?: MediaType) => LibraryMedia[];
  getCount: (filter: LibraryFilterStatus, mediaType?: MediaType) => number;
  exportLibrary: (items: LibraryMedia[], format: 'json' | 'csv') => string;
  importLibrary: (
    parsedItems: LibraryMedia[],
    options: { mergeStrategy: 'smart' | 'overwrite' | 'skip'; keepExistingFavorites: boolean }
  ) => Promise<number>;
  clearLibrary: () => Promise<void>;
  loadLibrary: () => Promise<void>;
  refreshLibrary: () => Promise<void>;
}

// Helper to check if item should be removed
const shouldRemoveItem = (item: LibraryMedia): boolean => {
  return (
    !item.isFavorite && (item.status === 'none' || !item.status) && !item.userRating
  );
};

// Helper to get current user's library
const getCurrentLibrary = (): RxDBLibraryMedia['library'] => {
  const user = useAuthStore.getState().user;
  const library = user?.profile.library ? filterObject(user?.profile.library, ["$id", "averageRating", "$updatedAt"], 'include') : null;
  return library || { $id: 'guest-library' };
};

// Helper to transform TMDB Media to LibraryMedia fields
const getMediaMetadata = (media: Media): Partial<LibraryMedia> => {
  const title = (media as Movie).title || (media as TvShow).name;
  const releaseDate = (media as Movie).release_date || (media as TvShow).first_air_date || undefined;

  return {
    id: media.id,
    title,
    posterPath: media.poster_path,
    releaseDate,
    genres:
      media.genres?.map((g: { id: number; name: string }) => g.name) ||
      media.genre_ids?.map((id) => GENRES.find((g) => g.id === id)?.label || '') ||
      [],
    rating: +getRating(media.vote_average),
    totalMinutesRuntime: calculateTotalMinutesRuntime(media),
    networks: (media as TvShow).networks?.map((n) => n.id) || [],
    media_type: media.media_type,
  };
};

export const useLibraryStore = create<LibraryState>()(
  (set, get) => ({
    library: {},
    lastUpdatedAt: new Date().toISOString(),
    isLoading: false,
    error: null,

    getItem: (id) => {
      const { library } = get();

      if (!String(id).includes('-')) return library[id];

      const [mediaType, tmdbId] = id.split('-');

      // console.log('Searching for:', { tmdbId, mediaType });
      // console.log('Library items:', Object.values(library).map(item => ({
      //   id: item.id,
      //   tmdbId: item.tmdbId,
      //   media_type: item.media_type,
      //   title: item.title
      // })));

      const foundItem = Object.values(library).find(item =>
        item.tmdbId === parseInt(tmdbId) && item.media_type === mediaType
      );

      //   console.log('Found item:', foundItem);
      //   console.log('Search criteria:', {
      //     searchTmdbId: parseInt(tmdbId),
      //     searchMediaType: mediaType
      // });

      return foundItem;
    },

    addOrUpdateItem: async (item, media) => {
      try {
        set({ isLoading: true, error: null });

        const now = new Date().toISOString();
        const defaultItemData = get().getItem(item.id) || {
          media_type: item.media_type,
          status: 'none',
          isFavorite: false,
          addedAt: now,
        }

        const metadata = media ? getMediaMetadata(media) : {};

        const newItemData: LibraryMedia = {
          ...defaultItemData,
          ...item,
          ...metadata,
          lastUpdatedAt: now,
        } as LibraryMedia;

        console.log("LIBRARY", getCurrentLibrary())
        console.log("ITEM", item)
        console.log("NEW ITEM", newItemData)
        console.log("METADA", metadata)


        if (shouldRemoveItem(newItemData)) {
          await get().removeItem(newItemData.id);
          return null;
        }


        const newOrUpdatedItem = await addOrUpdateLibraryItem(newItemData, getCurrentLibrary());

        if (newOrUpdatedItem) {
          set((state) => ({
            library: {
              ...state.library,
              [newOrUpdatedItem.id]: newOrUpdatedItem,
            },
            lastUpdatedAt: now,
          }));


          const profileId = useAuthStore.getState().user?.profile?.$id;
          if (profileId) logLibraryActivity(newOrUpdatedItem, undefined, profileId);

          return newOrUpdatedItem;
        }

        return null;
      } catch (error) {
        console.error('Failed to add or update library item:', error);
        set({ error: error instanceof Error ? error.message : 'Unknown error' });
        return null;
      } finally {
        set({ isLoading: false });
      }
    },

    toggleFavorite: async (id, media) => {
      try {
        set({ isLoading: true, error: null });
        const isFavorite = !get().getItem(id)?.isFavorite;
        return get().addOrUpdateItem({ id, isFavorite }, media);
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        set({ error: error instanceof Error ? error.message : 'Unknown error' });
        return null;
      } finally {
        set({ isLoading: false });
      }
    },

    removeItem: async (id) => {
      try {
        set({ isLoading: true, error: null });

        await deleteLibraryItem(id);

        set((state) => {
          const newLibrary = { ...state.library };
          delete newLibrary[id];
          return { library: newLibrary, lastUpdatedAt: new Date().toISOString() };
        });
      } catch (error) {
        console.error('Failed to remove item:', error);
        set({ error: error instanceof Error ? error.message : 'Unknown error' });
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

    exportLibrary: (items, format = 'json') => {
      const libraryItems = items.length > 0 ? items : Object.values(get().library);
      return format === 'csv' ? serializeToCSV(libraryItems) : serializeToJSON(libraryItems);
    },

    importLibrary: async (parsedItems, options = { mergeStrategy: 'smart', keepExistingFavorites: true }) => {
      try {
        // Validate options
        if (!options.mergeStrategy || !['smart', 'overwrite', 'skip'].includes(options.mergeStrategy)) {
          throw new Error('Invalid merge strategy');
        }
        if (typeof options.keepExistingFavorites !== 'boolean') options.keepExistingFavorites = true;

        // Validate parsedItems
        if (!Array.isArray(parsedItems) || parsedItems.length === 0) return 0;

        // Get current library, ensure it's not null
        const currentLibrary = get().library || {};

        // Merge the libraries using already parsed items
        const { mergedLibrary, importCount } = mergeLibraryItems(parsedItems, currentLibrary, options);

        // addOrUpdateItem for each item in the mergedLibrary
        for (const item of Object.values(mergedLibrary)) {
          await get().addOrUpdateItem(item);
        }

        return importCount;
      } catch (error) {
        console.error('Import error:', error);
        throw new Error(`Failed to import library: ${error instanceof Error ? error.message : String(error)}`);
      }
    },

    clearLibrary: async () => {
      try {
        set({ isLoading: true, error: null });

        const library = getCurrentLibrary();
        await clearRxDBLibrary(library.$id);

        set({ library: {} });
        console.log('🗑️ Library cleared from RxDB');
      } catch (error) {
        console.error('Failed to clear library:', error);
        set({ error: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        set({ isLoading: false });
      }
    },

    loadLibrary: async () => {
      const library = getCurrentLibrary();
      const items = await getLibraryItems(library.$id);
      set({
        library: items.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {} as LibraryCollection),
      });
    },

    refreshLibrary: async () => {
      await get().loadLibrary();
    }
  })
);

