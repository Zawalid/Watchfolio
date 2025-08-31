import { appwriteService } from '@/lib/appwrite/api';
import { Activity, ActivityAction } from '@/lib/appwrite/types';
import { isMedia } from './media';

/**
 * Generates a consistent key for a media item
 */
export const generateMediaId = (media?: Media | LibraryMedia) => {
  log(media);
  if (!media) return '';
  if (isMedia(media)) return `${media.media_type}-${media.id}`;
  return (media.id || media.tmdbId).toString();
};

export const getLibraryCount = ({
  items,
  filter,
  mediaType,
}: {
  items: LibraryMedia[];
  filter?: LibraryFilterStatus;
  mediaType?: MediaType;
}) => {
  const counts: Record<LibraryFilterStatus, number> = {
    all: 0,
    watching: 0,
    willWatch: 0,
    completed: 0,
    onHold: 0,
    dropped: 0,
    favorites: 0,
  };

  items.forEach((item) => {
    if (mediaType && item.media_type !== mediaType) return;

    counts.all++;
    if (item.status === 'watching') counts.watching++;
    else if (item.status === 'willWatch') counts['willWatch']++;
    else if (item.status === 'completed') counts.completed++;
    else if (item.status === 'onHold') counts['onHold']++;
    else if (item.status === 'dropped') counts.dropped++;
    if (item.isFavorite) counts.favorites++;
  });
  if (filter) return counts[filter] || 0;
  return counts;
};

export const logLibraryActivity = (
  newItemData: LibraryMedia,
  existingItem: LibraryMedia | undefined,
  profileId: string
) => {
  const log = (action: ActivityAction, props?: Partial<Activity>) => {
    appwriteService.profile.logActivity(profileId, {
      ...props,
      action,
      mediaType: newItemData.media_type,
      mediaId: newItemData.tmdbId,
      mediaTitle: newItemData.title || 'Unknown Title',
      posterPath: newItemData.posterPath,
    });
  };

  // Condition 1: Log when a new item is added with meaningful data
  if (!existingItem && (newItemData.status !== 'none' || newItemData.isFavorite)) log('added');

  // Condition 2: Log when an item is first marked as completed
  if (newItemData.status === 'completed' && existingItem?.status !== 'completed') log('completed');

  // Condition 3: Log when a rating is added or changed
  if (newItemData.userRating && newItemData.userRating !== existingItem?.userRating) {
    log('rated', { rating: newItemData.userRating });
  }
};

type ImportOptions = {
  mergeStrategy: 'smart' | 'overwrite' | 'skip';
  keepExistingFavorites: boolean;
};

/**
 * Merges imported items with the existing library based on selected options.
 */
export const mergeLibraryItems = (
  importedItems: LibraryMedia[],
  currentLibrary: LibraryCollection,
  options: ImportOptions
): { mergedLibrary: LibraryCollection; importCount: number } => {
  // Start with a clean slate for 'overwrite', otherwise start with the current library.
  const mergedLibrary: LibraryCollection = options.mergeStrategy === 'overwrite' ? {} : { ...currentLibrary };

  importedItems.forEach((importedItem) => {
    const key = generateMediaId(importedItem);
    const existingItem = currentLibrary[key];

    if (existingItem) {
      if (options.mergeStrategy === 'skip') return;

      if (options.mergeStrategy === 'overwrite') {
        mergedLibrary[key] = {
          ...importedItem,
          isFavorite: options.keepExistingFavorites ? existingItem.isFavorite : importedItem.isFavorite,
        };
      }
      if (options.mergeStrategy === 'smart') {
        mergedLibrary[key] = {
          ...existingItem,
          ...importedItem,
          isFavorite: options.keepExistingFavorites
            ? existingItem.isFavorite || importedItem.isFavorite
            : importedItem.isFavorite,
        };
      }
    } else {
      mergedLibrary[key] = importedItem;
    }
  });

  return {
    mergedLibrary,
    importCount: importedItems.length,
  };
};

export const libraryMediaToMedia = (item: LibraryMedia): Partial<Media> => {
  return {
    id: item.tmdbId,
    title: item.title,
    name: item.title,
    overview: item.overview || '',
    release_date: item.releaseDate || null,
    poster_path: item.posterPath || null,
    media_type: item.media_type,
    vote_average: item.rating || 0,
    genre_ids: item.genres ? item.genres : [],
  };
};
