import { profilesService } from '@/lib/appwrite/api';
import { Activity, ActivityAction } from '@/lib/appwrite/types';
import { isMedia } from './media';

/**
 * Generates a consistent key for a media item
 */
export const generateMediaId = (media?: Media | LibraryMedia) => {
  if (!media) return '';
  if (isMedia(media)) return `${media.media_type}-${media.id}`;
  return media.id.toString();
};

type ImportOptions = {
  mergeStrategy: 'smart' | 'overwrite' | 'skip';
  keepExistingFavorites: boolean;
};

/**
 * Merges imported items with existing library
 */
export const mergeLibraryItems = (
  importedItems: LibraryMedia[],
  currentLibrary: LibraryCollection,
  options: ImportOptions
): { mergedLibrary: LibraryCollection; importCount: number } => {
  // Create a new merged library object to avoid mutation
  const mergedLibrary: LibraryCollection = {};
  let importCount = 0;

  // Filter out invalid items before processing
  const validItems = importedItems.filter(
    (item) =>
      item &&
      typeof item.id === 'number' &&
      (item.media_type === 'movie' || item.media_type === 'tv') &&
      typeof item.isFavorite === 'boolean'
  );

  if (validItems.length < importedItems.length) {
    console.warn(`Filtered out ${importedItems.length - validItems.length} invalid items during import`);
  }

  // Handle different merge strategies
  if (options.mergeStrategy === 'overwrite') {
    // For overwrite, start with a clean slate
    if (options.keepExistingFavorites) {
      // First map all existing favorites to preserve them
      const existingFavorites: Record<string, boolean> = {};
      Object.entries(currentLibrary).forEach(([key, item]) => {
        if (item.isFavorite) {
          existingFavorites[key] = true;
        }
      });

      // Then add all imported items, preserving favorite status if needed
      validItems.forEach((item) => {
        const key = generateMediaId(item);
        if (existingFavorites[key]) {
          mergedLibrary[key] = { ...item, isFavorite: true };
        } else {
          mergedLibrary[key] = item;
        }
        importCount++;
      });
    } else {
      // Simple overwrite - just use imported items
      validItems.forEach((item) => {
        const key = generateMediaId(item);
        mergedLibrary[key] = item;
        importCount++;
      });
    }
  } else {
    // For 'smart' or 'skip' strategies, process each imported item
    validItems.forEach((importedItem) => {
      const key = generateMediaId(importedItem);
      const existingItem = currentLibrary[key];

      // Handle item based on existence and merge strategy
      if (!existingItem) {
        // New item - always add regardless of strategy
        mergedLibrary[key] = importedItem;
        importCount++;
      } else {
        // Item exists, apply strategy
        if (options.mergeStrategy === 'skip') {
          // Skip - keep existing item unchanged
          mergedLibrary[key] = existingItem;
        } else {
          // Smart merge: combine both with preference for newer data
          const mergedItem = {
            ...existingItem,
            ...importedItem,
            // Keep existing favorites if option is enabled
            isFavorite: options.keepExistingFavorites
              ? existingItem.isFavorite || importedItem.isFavorite
              : importedItem.isFavorite,
            // For dates, keep the more recent one
            addedAt: existingItem.addedAt || importedItem.addedAt,
            // Use the more recent lastUpdatedAt
            lastUpdatedAt: new Date(
              Math.max(new Date(existingItem.lastUpdatedAt).getTime(), new Date(importedItem.lastUpdatedAt).getTime())
            ).toISOString(),
          };
          mergedLibrary[key] = mergedItem;
          importCount++;
        }
      }
    });
  }

  // Add any existing items that weren't in the import (if not overwriting everything)
  if (options.mergeStrategy !== 'overwrite') {
    Object.entries(currentLibrary).forEach(([key, item]) => {
      if (!mergedLibrary[key]) {
        mergedLibrary[key] = item;
      }
    });
  }

  return { mergedLibrary, importCount };
};

/**
 * Compare local and cloud libraries to determine sync differences
 */
export interface LibrarySyncDiff {
  localOnly: LibraryMedia[];
  cloudOnly: LibraryMedia[];
  conflicts: { local: LibraryMedia; cloud: LibraryMedia; key: string }[];
  identical: LibraryMedia[];
  needsLocalUpdate: LibraryMedia[];
  needsCloudUpdate: LibraryMedia[];
}

export function compareLibraries(localLibrary: LibraryCollection, cloudLibrary: LibraryCollection): LibrarySyncDiff {
  const diff: LibrarySyncDiff = {
    localOnly: [],
    cloudOnly: [],
    conflicts: [],
    identical: [],
    needsLocalUpdate: [],
    needsCloudUpdate: [],
  };

  const allKeys = new Set([...Object.keys(localLibrary), ...Object.keys(cloudLibrary)]);

  allKeys.forEach((key) => {
    const localItem = localLibrary[key];
    const cloudItem = cloudLibrary[key];

    if (!localItem && cloudItem) {
      // Only in cloud
      diff.cloudOnly.push(cloudItem);
    } else if (localItem && !cloudItem) {
      // Only local
      diff.localOnly.push(localItem);
    } else if (localItem && cloudItem) {
      // Both exist - compare timestamps and content
      const localTime = new Date(localItem.lastUpdatedAt).getTime();
      const cloudTime = new Date(cloudItem.lastUpdatedAt).getTime();

      // Check if content is meaningfully different
      const isDifferent =
        localItem.status !== cloudItem.status ||
        localItem.isFavorite !== cloudItem.isFavorite ||
        localItem.userRating !== cloudItem.userRating ||
        localItem.notes !== cloudItem.notes;

      if (!isDifferent) {
        diff.identical.push(localItem);
      } else if (Math.abs(localTime - cloudTime) < 1000) {
        // Very close timestamps - treat as conflict
        diff.conflicts.push({ local: localItem, cloud: cloudItem, key });
      } else if (localTime > cloudTime) {
        // Local is newer
        diff.needsCloudUpdate.push(localItem);
      } else {
        // Cloud is newer
        diff.needsLocalUpdate.push(cloudItem);
      }
    }
  });

  return diff;
}

/**
 * Smart merge strategy that preserves user intent and newer data
 */
export function smartMergeLibraries(
  localLibrary: LibraryCollection,
  cloudLibrary: LibraryCollection,
  options: {
    preserveLocalFavorites?: boolean;
    preserveCloudFavorites?: boolean;
    conflictResolution?: 'newer' | 'local' | 'cloud';
  } = {}
): { mergedLibrary: LibraryCollection; changes: string[] } {
  const { preserveLocalFavorites = true, conflictResolution = 'newer' } = options;

  const diff = compareLibraries(localLibrary, cloudLibrary);
  const mergedLibrary: LibraryCollection = { ...localLibrary };
  const changes: string[] = [];

  // Add cloud-only items
  diff.cloudOnly.forEach((item) => {
    const key = generateMediaId(item);
    mergedLibrary[key] = item;
    changes.push(`Added from cloud: ${item.title || `${item.media_type}-${item.id}`}`);
  });

  // Update items where cloud is newer
  diff.needsLocalUpdate.forEach((cloudItem) => {
    const key = generateMediaId(cloudItem);
    const localItem = localLibrary[key];

    // Smart merge preserving certain local preferences
    const mergedItem: LibraryMedia = {
      ...cloudItem,
      // Preserve local favorites if option is enabled
      isFavorite: preserveLocalFavorites && localItem?.isFavorite ? true : cloudItem.isFavorite,
    };

    mergedLibrary[key] = mergedItem;
    changes.push(`Updated from cloud: ${cloudItem.title || `${cloudItem.media_type}-${cloudItem.id}`}`);
  });

  // Handle conflicts based on resolution strategy
  diff.conflicts.forEach(({ local, cloud, key }) => {
    let resolvedItem: LibraryMedia;

    switch (conflictResolution) {
      case 'local':
        resolvedItem = local;
        break;
      case 'cloud':
        resolvedItem = cloud;
        break;
      case 'newer':
      default: {
        const localTime = new Date(local.lastUpdatedAt).getTime();
        const cloudTime = new Date(cloud.lastUpdatedAt).getTime();

        if (localTime >= cloudTime) {
          resolvedItem = local;
        } else {
          resolvedItem = cloud;
          // Still preserve certain local preferences
          if (preserveLocalFavorites && local.isFavorite) {
            resolvedItem = { ...cloud, isFavorite: true };
          }
        }
        break;
      }
    }

    mergedLibrary[key] = resolvedItem;
    changes.push(`Resolved conflict: ${resolvedItem.title || `${resolvedItem.media_type}-${resolvedItem.id}`}`);
  });

  return { mergedLibrary, changes };
}



export const mapToAppwriteLibraryMedia = (
  media: LibraryMedia
): Record<string, unknown> => {
  return {
    // Library item fields
    status: media.status ?? 'none',
    isFavorite: !!media.isFavorite,
    userRating: media.userRating != null
      ? Math.max(1, Math.min(10, Math.round(Number(media.userRating))))
      : undefined,
    notes: media.notes || undefined,
    addedAt: media.addedAt,
    // TMDB media fields (flattened)
    tmdbId: media.tmdbId,
    mediaType: media.media_type,
    title: media.title || `${media.media_type} ${media.tmdbId}`,
    overview: undefined, // Not available in current LibraryMedia type
    posterPath: media.posterPath || undefined,
    releaseDate: media.releaseDate || undefined,
    genres: Array.isArray(media.genres) ? media.genres : [],
    rating: typeof media.rating === 'number' ? media.rating : undefined,
    totalMinutesRuntime: Number.isFinite(media.totalMinutesRuntime)
      ? media.totalMinutesRuntime
      : undefined,
    networks: Array.isArray(media.networks) ? media.networks : [],
  };
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
    profilesService.logActivity(profileId, {
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
