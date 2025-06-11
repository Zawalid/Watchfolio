const MY_LIBRARY_KEY = 'watchfolio_library';

// ----- HELPER FUNCTIONS -----
const getLibraryCollection = (): LibraryCollection => {
  try {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(MY_LIBRARY_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading MyLibrary from localStorage:', error);
    return {};
  }
};

const saveLibraryCollection = (collection: LibraryCollection): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MY_LIBRARY_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error('Error writing MyLibrary to localStorage:', error);
  }
};

const generateMediaKey = (mediaType: 'movie' | 'tv', id: number): string => `${mediaType}-${id}`;

// ----- PUBLIC API FUNCTIONS -----

export const getMyLibrary = (): LibraryMediaData[] => {
  const collection = getLibraryCollection();
  return Object.values(collection);
};

export const getItemFromLibrary = (mediaType: 'movie' | 'tv', id: number): LibraryMediaData | undefined => {
  const collection = getLibraryCollection();
  return collection[generateMediaKey(mediaType, id)];
};

export const upsertItemInLibrary = (
  itemProps: Pick<LibraryMediaData, 'id' | 'mediaType'> & Partial<Omit<LibraryMediaData, 'id' | 'mediaType'>>
): LibraryMediaData => {
  const collection = getLibraryCollection();
  const key = generateMediaKey(itemProps.mediaType, itemProps.id);
  const now = new Date().toISOString();
  const existingItem = collection[key];

  const defaultItemData: LibraryMediaData = {
    status: 'none',
    isFavorite: false,
    addedToLibraryAt: now,
    id: itemProps.id,
    mediaType: itemProps.mediaType,
    lastUpdatedAt: now,
  };

  const newItemData: LibraryMediaData = { ...defaultItemData, ...(existingItem || {}), ...itemProps };

  if (!existingItem && (newItemData.isFavorite || newItemData.userRating)) newItemData.addedToLibraryAt = now;

  collection[key] = newItemData;
  saveLibraryCollection(collection);
  return newItemData;
};
export const removeItemFromLibrary = (mediaType: 'movie' | 'tv', id: number): void => {
  const collection = getLibraryCollection();
  const key = generateMediaKey(mediaType, id);
  // Only truly remove if it's not favorited and has no rating and status is 'none'
  // Otherwise, just reset its status to 'none' to keep favorite/rating data
  const item = collection[key];
  if (item) {
    if (!item.isFavorite && item.userRating === undefined && item.status === 'none') {
      delete collection[key];
    } else {
      // If it's favorited or rated, just mark its status as 'none' effectively removing it from active lists
      // but keeping the favorite/rating. Or, you could have a separate function to fully clear.
      item.status = 'none';
      item.lastUpdatedAt = new Date().toISOString();
      collection[key] = item;
    }
  }
  saveLibraryCollection(collection);
};

// --- Specific Action Wrappers ---
// These use upsertItemInLibrary to ensure consistency

export const setItemStatus = (mediaType: 'movie' | 'tv', id: number, status: LibraryMediaStatus): LibraryMediaData => {
  return upsertItemInLibrary({ id, mediaType, status });
};

export const toggleItemFavorite = (mediaType: 'movie' | 'tv', id: number): LibraryMediaData => {
  const currentItem = getItemFromLibrary(mediaType, id);
  return upsertItemInLibrary({
    id,
    mediaType,
    isFavorite: !(currentItem?.isFavorite || false),
  });
};

export const setItemUserRating = (mediaType: 'movie' | 'tv', id: number, rating?: number): LibraryMediaData => {
  // rating can be undefined to clear it
  return upsertItemInLibrary({ id, mediaType, userRating: rating });
};

export const setItemNotes = (mediaType: 'movie' | 'tv', id: number, notes: string): LibraryMediaData => {
  return upsertItemInLibrary({ id, mediaType, notes });
};

export const addWatchDate = (mediaType: 'movie' | 'tv', id: number, date?: string): LibraryMediaData => {
  const watchDate = date || new Date().toISOString();
  const currentItem = getItemFromLibrary(mediaType, id);
  const watchDates = [...(currentItem?.watchDates || []), watchDate];
  return upsertItemInLibrary({ id, mediaType, watchDates, status: 'watched' }); // Auto-set to watched
};

export const updateTvShowProgress = (
  tvShowId: number,
  seasonNumber: number,
  episodeNumber: number
): LibraryMediaData => {
  return upsertItemInLibrary({
    id: tvShowId,
    mediaType: 'tv',
    lastWatchedEpisode: {
      seasonNumber,
      episodeNumber,
      watchedAt: new Date().toISOString(),
    },
    status: 'watching', // Auto-set to watching
  });
};
