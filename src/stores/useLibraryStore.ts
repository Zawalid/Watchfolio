import { GENRES } from '@/lib/api/TMDB/values';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LibraryState {
  library: LibraryCollection;

  // Actions
  getItem: (mediaType: 'movie' | 'tv', id: number) => LibraryMediaData | undefined;
  addOrUpdateItem: (
    mediaData: Partial<LibraryMediaData> & Pick<LibraryMediaData, 'id' | 'mediaType'>,
    metadata?: Media
  ) => LibraryMediaData | null;
  removeItem: (mediaType: 'movie' | 'tv', id: number) => void;
  toggleFavorite: (
    mediaData: Partial<LibraryMediaData> & Pick<LibraryMediaData, 'id' | 'mediaType'>,
    metadata?: Media
  ) => LibraryMediaData | null;
  getAllItems: () => LibraryMediaData[];
  getItemsByStatus: (status: LibraryMediaStatus) => LibraryMediaData[];
  getFavorites: () => LibraryMediaData[];
  getCount: (filter: LibraryFilterStatus) => number;
}

const generateMediaKey = (mediaType: 'movie' | 'tv', id: number): string => `${mediaType}-${id}`;

// Helper function to check if item should be removed
const shouldRemoveItem = (item: LibraryMediaData): boolean => {
  return (
    !item.isFavorite &&
    !item.userRating &&
    (item.status === 'none' || !item.status) &&
    !item.notes &&
    (!item.watchDates || item.watchDates.length === 0) &&
    !item.lastWatchedEpisode
  );
};

// Helper to transform TMDB Media to LibraryMediaData fields
const transformMediaToUserData = (media: Media): Partial<LibraryMediaData> => {
  const title = (media as Movie).title || (media as TvShow).name;
  const releaseDate = (media as Movie).release_date || (media as TvShow).first_air_date || undefined;

  return {
    title,
    posterPath: media.poster_path,
    releaseDate,
    genres:
      media.genres?.map((g: { id: number; name: string }) => g.name) || media.genre_ids?.map((id) => GENRES[id]) || [],
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
        const transformedData = metadata && metadata ? transformMediaToUserData(metadata) : {};

        const defaultItemData: LibraryMediaData = {
          id: mediaData.id,
          mediaType: mediaData.mediaType,
          status: 'none',
          isFavorite: false,
          addedToLibraryAt: existingItem?.addedToLibraryAt || now,
          lastUpdatedAt: now,
        };

        const newItemData: LibraryMediaData = {
          ...defaultItemData,
          ...existingItem,
          ...transformedData,
          ...mediaData,
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

      toggleFavorite: (mediaData, metadata) => {
        const currentItem = get().getItem(mediaData.mediaType, mediaData.id);
        return get().addOrUpdateItem(
          {
            mediaType: mediaData.mediaType,
            id: mediaData.id,
            isFavorite: !(currentItem?.isFavorite || false),
          },
          metadata
        );
      },

      removeItem: (mediaType, id) => {
        const { library } = get();
        const key = generateMediaKey(mediaType, id);
        const item = library[key];

        if (item) {
          const updatedItem = { ...item, status: 'none' as LibraryMediaStatus };

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

      getCount: (filter: LibraryFilterStatus) => {
        const { library } = get();
        const counts: Record<LibraryFilterStatus, number> = {
          all: 0,
          watching: 0,
          willWatch: 0,
          watched: 0,
          onHold: 0,
          dropped: 0,
          favorites: 0,
        };

        Object.values(library).forEach((item) => {
          counts.all++;
          if (item.status === 'watching') counts.watching++;
          else if (item.status === 'willWatch') counts['willWatch']++;
          else if (item.status === 'watched') counts.watched++;
          else if (item.status === 'onHold') counts['onHold']++;
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
