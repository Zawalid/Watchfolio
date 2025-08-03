import { create } from 'zustand';
import { GENRES } from '@/utils/constants/TMDB';
import { calculateTotalMinutesRuntime, getRating } from '@/utils/media';
import { mergeLibraryItems, generateMediaKey, getLibraryCount, logLibraryActivity } from '@/utils/library';
import { serializeToJSON, serializeToCSV } from '@/utils/export';
import { LOCAL_STORAGE_PREFIX } from '@/utils/constants';
import { persistAndSync } from '@/utils/persistAndSync';
import { useAuthStore } from './useAuthStore';
import { addOrUpdateLibraryItem, createLibraryItem } from '@/lib/rxdb';

interface LibraryState {
  library: LibraryCollection;

  // Actions
  getItem: (mediaType: MediaType, id: number) => LibraryMedia | undefined;
  addOrUpdateItem: (
    media: Partial<LibraryMedia> & Pick<LibraryMedia, 'id' | 'media_type'>,
    metadata?: Media
  ) => LibraryMedia | null;
  removeItem: (mediaType: MediaType, id: number) => void;
  toggleFavorite: (
    media: Partial<LibraryMedia> & Pick<LibraryMedia, 'id' | 'media_type'>,
    metadata?: Media
  ) => LibraryMedia | null;
  getAllItems: () => LibraryMedia[];
  getItemsByStatus: (status: LibraryFilterStatus, mediaType?: MediaType) => LibraryMedia[];
  getCount: (filter: LibraryFilterStatus, mediaType?: MediaType) => number;
  exportLibrary: (items: LibraryMedia[], format: 'json' | 'csv') => string;
  importLibrary: (
    parsedItems: LibraryMedia[],
    options: { mergeStrategy: 'smart' | 'overwrite' | 'skip'; keepExistingFavorites: boolean }
  ) => number;
  clearLibrary: () => void;
}

const shouldRemoveItem = (item: LibraryMedia): boolean => {
  return (
    !item.isFavorite && (item.status === 'none' || !item.status) && !item.userRating
  );
};

// Helper to get current user's library ID (guest or authenticated)
const getCurrentLibraryId = (): string => {
  const { user } = useAuthStore.getState();
  return user?.profile?.$id || 'guest-library';
};

// Helper to transform LibraryMedia to RxDB format and vice versa
const transformToRxDBFormat = (item: LibraryMedia) => ({
  libraryId: getCurrentLibraryId(),
  tmdbId: item.id,
  mediaType: item.media_type,
  status: item.status || 'none',
  isFavorite: item.isFavorite || false,
  userRating: item.userRating,
  notes: item.notes,
  addedAt: item.addedToLibraryAt || new Date().toISOString(),
  title: item.title || `${item.media_type} ${item.id}`,
  posterPath: item.posterPath,
  releaseDate: item.releaseDate,
  genres: item.genres || [],
  rating: item.rating,
  totalMinutesRuntime: item.totalMinutesRuntime,
  networks: item.networks || [],
});

const transformFromRxDBFormat = (rxdbItem: any): LibraryMedia => ({
  id: rxdbItem.tmdbId,
  media_type: rxdbItem.mediaType,
  status: rxdbItem.status,
  isFavorite: rxdbItem.isFavorite,
  userRating: rxdbItem.userRating,
  notes: rxdbItem.notes,
  addedToLibraryAt: rxdbItem.addedAt,
  lastUpdatedAt: rxdbItem.updatedAt || rxdbItem.addedAt,
  title: rxdbItem.title,
  posterPath: rxdbItem.posterPath,
  releaseDate: rxdbItem.releaseDate,
  genres: rxdbItem.genres,
  rating: rxdbItem.rating,
  totalMinutesRuntime: rxdbItem.totalMinutesRuntime,
  networks: rxdbItem.networks,
});

// Helper to transform TMDB Media to LibraryMedia fields
const transformMediaToUserData = (media: Media): Partial<LibraryMedia> => {
  const title = (media as Movie).title || (media as TvShow).name;
  const releaseDate = (media as Movie).release_date || (media as TvShow).first_air_date || undefined;

  return {
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
  };
};

export const useLibraryStore = create<LibraryState>()(
  (set, get) => ({
    library: {},

    getItem: (mediaType, id) => {
      const { library } = get();
      return library[generateMediaKey(mediaType, id)];
    },
    addOrUpdateItem: (media, metadata) => {
      const { library } = get();
      const key = generateMediaKey(media.media_type, media.id);
      const now = new Date().toISOString();
      const existingItem = library[key];

      // Transform any TMDB data that might be passed
      const transformedData = metadata && metadata ? transformMediaToUserData(metadata) : {};

      const defaultItemData: LibraryMedia = {
        id: media.id,
        media_type: media.media_type,
        status: 'none',
        isFavorite: false,
        addedAt: existingItem?.addedAt || now,
        lastUpdatedAt: now,
      };

      const newItemData: LibraryMedia = {
        ...defaultItemData,
        ...existingItem,
        ...transformedData,
        ...media,
        lastUpdatedAt: now,
      };

      const profileId = useAuthStore.getState().user?.profile?.$id;
      if (profileId) logLibraryActivity(newItemData, existingItem, profileId);

      // Only set addedAt for truly new meaningful additions
      if (!existingItem && (newItemData.isFavorite || newItemData.userRating || newItemData.status !== 'none')) {
        newItemData.addedAt = now;
      } // Check if item should be removed after update
      if (shouldRemoveItem(newItemData)) {
        get().removeItem(media.media_type, media.id);
        return null;
      }


      createLibraryItem(transformToRxDBFormat(newItemData))
        .then(() => {
          set((state) => ({
            library: {
              ...state.library,
              [key]: newItemData,
            },
          }));

          return newItemData;
        },
          (error) => {
            console.error('Failed to add or update library item:', error);
            return null;
          }
        );

      return newItemData;
    },

    toggleFavorite: (media, metadata) => {
      const currentItem = get().getItem(media.media_type, media.id);
      return get().addOrUpdateItem(
        {
          media_type: media.media_type,
          id: media.id,
          isFavorite: !(currentItem?.isFavorite || false),
        },
        metadata
      );
    },
    removeItem: (mediaType, id) => {
      const key = generateMediaKey(mediaType, id);

      set((state) => {
        const newLibrary = { ...state.library };
        delete newLibrary[key];
        return { library: newLibrary };
      });
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
    importLibrary: (parsedItems, options = { mergeStrategy: 'smart', keepExistingFavorites: true }) => {
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
        if (importCount > 0) set({ library: mergedLibrary });

        return importCount;
      } catch (error) {
        console.error('Import error:', error);
        throw new Error(`Failed to import library: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    clearLibrary: () => {
      set({ library: {} });
      console.log('🗑️ Library cleared - will auto-sync via hook');
    },
  })
);

