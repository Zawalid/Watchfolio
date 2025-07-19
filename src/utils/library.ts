import { profilesService } from '@/lib/api/appwrite-service';
import { getDetails } from '@/lib/api/TMDB';

/**
 * Generates a consistent key for a media item
 */
export const generateMediaKey = (mediaType: 'movie' | 'tv', id: number) => `${mediaType}-${id}`;

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
        const key = generateMediaKey(item.media_type as 'movie' | 'tv', item.id);
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
        const key = generateMediaKey(item.media_type as 'movie' | 'tv', item.id);
        mergedLibrary[key] = item;
        importCount++;
      });
    }
  } else {
    // For 'smart' or 'skip' strategies, process each imported item
    validItems.forEach((importedItem) => {
      const key = generateMediaKey(importedItem.media_type as 'movie' | 'tv', importedItem.id);
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
            addedToLibraryAt: existingItem.addedToLibraryAt || importedItem.addedToLibraryAt,
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
        JSON.stringify(localItem.watchDates) !== JSON.stringify(cloudItem.watchDates) ||
        localItem.notes !== cloudItem.notes ||
        localItem.lastWatchedEpisode !== cloudItem.lastWatchedEpisode;

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
    const key = generateMediaKey(item.media_type, item.id);
    mergedLibrary[key] = item;
    changes.push(`Added from cloud: ${item.title || `${item.media_type}-${item.id}`}`);
  });

  // Update items where cloud is newer
  diff.needsLocalUpdate.forEach((cloudItem) => {
    const key = generateMediaKey(cloudItem.media_type, cloudItem.id);
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

// Map Appwrite data back to LibraryMedia
export const mapFromAppwriteData = (libraryItem: LibraryItem, tmdbMedia?: TmdbMedia): LibraryMedia => {
  return {
    id: tmdbMedia?.id || 0,
    media_type: tmdbMedia?.mediaType || 'movie',
    title: tmdbMedia?.title,
    posterPath: tmdbMedia?.posterPath || undefined,
    releaseDate: tmdbMedia?.releaseDate || undefined,
    genres: tmdbMedia?.genres || [],
    rating: tmdbMedia?.rating || undefined,
    status: libraryItem.status,
    isFavorite: libraryItem.isFavorite,
    userRating: libraryItem.userRating || undefined,
    notes: libraryItem.notes || undefined,
    addedToLibraryAt: libraryItem.addedAt || new Date().toISOString(),
    lastUpdatedAt: libraryItem.$updatedAt,
    totalMinutesRuntime: tmdbMedia?.totalMinutesRuntime,
  };
};

// Map LibraryMedia to Appwrite LibraryItem + TmdbMedia
export const mapToAppwriteData = async (
  media: LibraryMedia
): Promise<{
  tmdbMedia: CreateTmdbMediaInput;
  libraryItem: Omit<CreateLibraryItemInput, 'libraryId' | 'mediaId'>;
}> => {
  let totalMinutesRuntime = 0;
  try {
    if (!media.totalMinutesRuntime) {
      const mediaDetails = await getDetails(media.media_type, String(media.id), false);

      if (!mediaDetails) throw new Error(`Failed to fetch details for ${media.media_type} with ID ${media.id}`);

      if (media.media_type === 'movie') {
        totalMinutesRuntime = (mediaDetails as Movie).runtime || 0;
      } else if (media.media_type === 'tv') {
        const show = mediaDetails as TvShow;
        const totalEpisodes = show.number_of_episodes || 0;
        let runtime = 0;

        // 1. Prioritize the runtime of the last aired episode
        if (show.last_episode_to_air?.runtime) runtime = show.last_episode_to_air.runtime;
        // 2. Fallback to the first value in the general episode_run_time array
        else if (show.episode_run_time && show.episode_run_time?.length > 0) runtime = show.episode_run_time[0];
        // 3. Final fallback to a sensible default if no data is available
        else runtime = 45;

        totalMinutesRuntime = Math.round(runtime * totalEpisodes);
      }
    }
  } catch (error) {
    console.log(error);
  }

  // TODO : use similar approach to get the networks

  return {
    tmdbMedia: {
      id: media.id,
      mediaType: media.media_type,
      title: media.title || `${media.media_type} ${media.id}`,
      overview: undefined,
      posterPath: media.posterPath || undefined,
      releaseDate: media.releaseDate || undefined,
      genres: media.genres || [],
      rating: media.rating || undefined,
      totalMinutesRuntime: media.totalMinutesRuntime || totalMinutesRuntime,
    },
    libraryItem: {
      status: media.status,
      isFavorite: media.isFavorite,
      userRating: media.userRating || undefined,
      notes: media.notes || undefined,
      addedAt: media.addedToLibraryAt,
    },
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
      mediaId: newItemData.id,
      mediaTitle: newItemData.title || 'Unknown Title',
      posterPath: newItemData.posterPath,
    });
  };

  // Condition 1: Log when a new item is added with meaningful data
  if (!existingItem && (newItemData.status !== 'none' || newItemData.isFavorite)) {
    console.log('ADDED');
    log('added');
  }

  // Condition 2: Log when an item is first marked as completed
  if (newItemData.status === 'completed' && existingItem?.status !== 'completed') {
    console.log('COMPLETED');
    log('completed');
  }
  // Condition 3: Log when a rating is added or changed
  if (newItemData.userRating && newItemData.userRating !== existingItem?.userRating) {
    console.log('RATED');
    log('rated', { rating: newItemData.userRating });
  }
};
