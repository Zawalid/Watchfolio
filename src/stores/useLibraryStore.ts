import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


interface LibraryState {
  library: LibraryCollection;

  // Actions
  getItem: (mediaType: 'movie' | 'tv', id: number) => UserMediaData | undefined;
  addOrUpdateItem: (mediaData: Partial<UserMediaData> & Pick<UserMediaData, 'id' | 'mediaType'>, metadata?: Media) => UserMediaData | null;
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
  getCount: (filter: UserMediaFilter) => number;
}

const generateMediaKey = (mediaType: 'movie' | 'tv', id: number): string => `${mediaType}-${id}`;

// Helper function to check if item should be removed
const shouldRemoveItem = (item: UserMediaData): boolean => {
  return (
    !item.isFavorite &&
    !item.userRating &&
    (item.status === 'none' || !item.status) &&
    !item.notes &&
    (!item.watchDates || item.watchDates.length === 0) &&
    !item.lastWatchedEpisode
  );
};

// Helper to transform TMDB Media to UserMediaData fields
const transformMediaToUserData = (media: Media): Partial<UserMediaData> => {
  const title = (media as Movie).title || (media as TvShow).name;
  const releaseDate = ((media as Movie).release_date || (media as TvShow).first_air_date) || undefined;

  return {
    title,
    posterPath: media.poster_path,
    releaseDate,
    genres: media.genres?.map((g: { id: number; name: string }) => g.name) || media.genre_ids?.map(String) || [],
  };
};

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      library: {},

      getItem: (mediaType, id) => {
        const { library } = get();
        return library[generateMediaKey(mediaType, id)];
      },

      addOrUpdateItem: (mediaData, metadata) => {
        const { library } = get();
        const key = generateMediaKey(mediaData.mediaType, mediaData.id);
        const now = new Date().toISOString();
        const existingItem = library[key];

        // Transform any TMDB data that might be passed
        const transformedData = metadata && metadata ? transformMediaToUserData(metadata) : {}

        const defaultItemData: UserMediaData = {
          id: mediaData.id,
          mediaType: mediaData.mediaType,
          status: 'none',
          isFavorite: false,
          addedToLibraryAt: existingItem?.addedToLibraryAt || now,
          lastUpdatedAt: now,
        };

        const newItemData: UserMediaData = {
          ...defaultItemData,
          ...existingItem,
          ...transformedData,
          lastUpdatedAt: now,
        };

        // Only set addedToLibraryAt for truly new meaningful additions
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
          return null;
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
          const updatedItem = { ...item, status: 'none' as UserMediaStatus };

          if (shouldRemoveItem(updatedItem)) {
            set((state) => {
              const newLibrary = { ...state.library };
              delete newLibrary[key];
              return { library: newLibrary };
            });
          } else {
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
        return get().addOrUpdateItem({ mediaType, id, status });
      },

      setItemRating: (mediaType, id, rating) => {
        return get().addOrUpdateItem({ mediaType, id, userRating: rating });
      },

      toggleFavorite: (mediaType, id) => {
        const currentItem = get().getItem(mediaType, id);
        return get().addOrUpdateItem({
          mediaType,
          id,
          isFavorite: !(currentItem?.isFavorite || false)
        }
        );
      },

      setItemNotes: (mediaType, id, notes) => {
        return get().addOrUpdateItem({ mediaType, id, notes });
      },

      addWatchDate: (mediaType, id, date) => {
        const watchDate = date || new Date().toISOString();
        const currentItem = get().getItem(mediaType, id);
        const watchDates = [...(currentItem?.watchDates || []), watchDate];
        return get().addOrUpdateItem({ mediaType, id, watchDates, status: 'watched' });
      },

      updateTvProgress: (tvShowId, seasonNumber, episodeNumber) => {
        return get().addOrUpdateItem({
          mediaType: 'tv',
          id: tvShowId,
          lastWatchedEpisode: { seasonNumber, episodeNumber, watchedAt: new Date().toISOString(), }, status: 'watching',
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

      getCount: (filter: UserMediaFilter) => {
        const { library } = get();
        const counts: Record<UserMediaFilter, number> = {
          all: 0,
          watching: 0,
          'will-watch': 0,
          watched: 0,
          'on-hold': 0,
          dropped: 0,
          favorites: 0,
        };

        Object.values(library).forEach((item) => {
          counts.all++;
          if (item.status === 'watching') counts.watching++;
          else if (item.status === 'will-watch') counts['will-watch']++;
          else if (item.status === 'watched') counts.watched++;
          else if (item.status === 'on-hold') counts['on-hold']++;
          else if (item.status === 'dropped') counts.dropped++;
          if (item.isFavorite) counts.favorites++;
        });

        return counts[filter] || 0;
      },
    }),
    {
      name: 'watchfolio-library',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useIsLibraryHydrated = () => {
  const library = useLibraryStore((state) => state.library);
  return Object.keys(library).length > 0;
};
