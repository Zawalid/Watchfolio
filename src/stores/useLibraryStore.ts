import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LibraryState {
  library: LibraryCollection;

  // Actions
  getItem: (mediaType: 'movie' | 'tv', id: number) => UserMediaData | undefined;
  upsertItem: (
    itemProps: Pick<UserMediaData, 'id' | 'mediaType'> & Partial<Omit<UserMediaData, 'id' | 'mediaType'>>
  ) => UserMediaData | null; // Return null if item was removed
  removeItem: (mediaType: 'movie' | 'tv', id: number) => void;
  setItemStatus: (mediaType: 'movie' | 'tv', id: number, status: UserMediaStatus) => UserMediaData | null;
  setItemRating: (mediaType: 'movie' | 'tv', id: number, rating?: number) => UserMediaData | null;
  toggleFavorite: (mediaType: 'movie' | 'tv', id: number) => UserMediaData | null;
  setItemNotes: (mediaType: 'movie' | 'tv', id: number, notes: string) => UserMediaData | null;
  addWatchDate: (mediaType: 'movie' | 'tv', id: number, date?: string) => UserMediaData | null;
  updateTvProgress: (tvShowId: number, seasonNumber: number, episodeNumber: number) => UserMediaData | null;
  getAllItems: () => UserMediaData[];
  getItemsByStatus: (status: UserMediaStatus) => UserMediaData[];
  getFavorites: () => UserMediaData[];
}

const generateMediaKey = (mediaType: 'movie' | 'tv', id: number): string => `${mediaType}-${id}`;

// Helper function to check if item should be removed
const shouldRemoveItem = (item: UserMediaData): boolean => {
  return (
    !item.isFavorite && 
    item.userRating === undefined && 
    (item.status === 'none' || item.status === undefined) &&
    !item.notes &&
    (!item.watchDates || item.watchDates.length === 0)
  );
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      library: {},

      getItem: (mediaType, id) => {
        const { library } = get();
        return library[generateMediaKey(mediaType, id)];
      },

      upsertItem: (itemProps) => {
        const { library } = get();
        const key = generateMediaKey(itemProps.mediaType, itemProps.id);
        const now = new Date().toISOString();
        const existingItem = library[key];

        const defaultItemData: UserMediaData = {
          status: 'none',
          isFavorite: false,
          addedToLibraryAt: now,
          id: itemProps.id,
          mediaType: itemProps.mediaType,
          lastUpdatedAt: now,
        };

        const newItemData: UserMediaData = {
          ...defaultItemData,
          ...(existingItem || {}),
          ...itemProps,
          lastUpdatedAt: now,
        };

        if (!existingItem && (newItemData.isFavorite || newItemData.userRating || newItemData.status !== 'none')) {
          newItemData.addedToLibraryAt = now;
        }

        // Check if item should be removed after update
        if (shouldRemoveItem(newItemData)) {
          set((state) => {
            const newLibrary = { ...state.library };
            delete newLibrary[key];
            return { library: newLibrary };
          });
          return null; // Item was removed
        }

        set((state) => ({
          library: {
            ...state.library,
            [key]: newItemData,
          },
        }));

        return newItemData;
      },

      removeItem: (mediaType, id) => {
        const { library } = get();
        const key = generateMediaKey(mediaType, id);
        const item = library[key];

        if (item) {
          if (shouldRemoveItem({ ...item, status: 'none' })) {
            // Completely remove the item
            set((state) => {
              const newLibrary = { ...state.library };
              delete newLibrary[key];
              return { library: newLibrary };
            });
          } else {
            // Keep the item but reset status to 'none'
            set((state) => ({
              library: {
                ...state.library,
                [key]: {
                  ...item,
                  status: 'none',
                  lastUpdatedAt: new Date().toISOString(),
                },
              },
            }));
          }
        }
      },

      setItemStatus: (mediaType, id, status) => {
        return get().upsertItem({ id, mediaType, status });
      },

      setItemRating: (mediaType, id, rating) => {
        return get().upsertItem({ id, mediaType, userRating: rating });
      },

      toggleFavorite: (mediaType, id) => {
        const currentItem = get().getItem(mediaType, id);

        return get().upsertItem({
          id,
          mediaType,
          isFavorite: !(currentItem?.isFavorite || false),
        });
      },

      setItemNotes: (mediaType, id, notes) => {
        return get().upsertItem({ id, mediaType, notes });
      },

      addWatchDate: (mediaType, id, date) => {
        const watchDate = date || new Date().toISOString();
        const currentItem = get().getItem(mediaType, id);
        const watchDates = [...(currentItem?.watchDates || []), watchDate];
        return get().upsertItem({ id, mediaType, watchDates, status: 'watched' });
      },

      updateTvProgress: (tvShowId, seasonNumber, episodeNumber) => {
        return get().upsertItem({
          id: tvShowId,
          mediaType: 'tv',
          lastWatchedEpisode: {
            seasonNumber,
            episodeNumber,
            watchedAt: new Date().toISOString(),
          },
          status: 'watching',
        });
      },

      getAllItems: () => {
        const { library } = get();
        return Object.values(library);
      },

      getItemsByStatus: (status) => {
        const { library } = get();
        return Object.values(library).filter((item) => item.status === status);
      },

      getFavorites: () => {
        const { library } = get();
        return Object.values(library).filter((item) => item.isFavorite);
      },
    }),
    {
      name: 'watchfolio-library',
      storage: createJSONStorage(() => localStorage),
    }
  )
);