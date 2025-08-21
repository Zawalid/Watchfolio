import { ID } from 'appwrite';
import { getWatchfolioDB } from './database';
import { MangoQuerySelector } from 'rxdb';

class LibraryError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'LibraryError';
  }
}

// Enhanced query builder for better performance
const buildQuerySelector = (conditions: Record<string, unknown>) => {
  const selector: MangoQuerySelector<LibraryMedia> = {};
  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      selector[key as keyof LibraryMedia] = value;
    }
  });
  return selector;
};

// Retry mechanism for database operations
const withRetry = async <T>(operation: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw new LibraryError(`Operation failed after ${maxRetries} retries`, 'MAX_RETRIES_EXCEEDED', error);
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`Operation failed (attempt ${attempt + 1}), retrying in ${delay}ms:`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export const getLibraryMedias = async (
  libraryId?: string,
  options: {
    limit?: number;
    offset?: number;
    sortBy?: 'addedAt' | 'lastUpdatedAt' | 'title' | 'rating';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<LibraryMedia[]> => {
  try {
    const db = await getWatchfolioDB();

    return await withRetry(async () => {
      const selector = buildQuerySelector({
        'library.$id': libraryId,
      });

      let query = db.libraryMedia.find({ selector });

      // Apply sorting
      if (options.sortBy) {
        const sortDirection = options.sortOrder === 'desc' ? 'desc' : 'asc';
        query = query.sort({ [options.sortBy]: sortDirection });
      }

      // Apply pagination
      if (options.offset) {
        query = query.skip(options.offset);
      }
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const docs = await query.exec();
      return docs.map((d) => d.toJSON() as LibraryMedia);
    });
  } catch (error) {
    throw new LibraryError('Failed to retrieve library media items', 'FETCH_ERROR', error);
  }
};

export const getLibraryMedia = async (id: string): Promise<LibraryMedia | null> => {
  if (!id?.trim()) {
    return null;
  }

  try {
    const db = await getWatchfolioDB();

    return await withRetry(async () => {
      const doc = await db.libraryMedia
        .findOne({
          selector: { id: id.trim() },
        })
        .exec();

      return doc ? (doc.toJSON() as LibraryMedia) : null;
    });
  } catch (error) {
    throw new LibraryError(`Failed to retrieve library media item: ${id}`, 'FETCH_ERROR', error);
  }
};

export const createLibraryMedia = async (
  mediaData: LibraryMedia,
  library: LibraryMedia['library'] | null
): Promise<LibraryMedia> => {
  console.log('CREATING...', mediaData);

  if (!mediaData) {
    throw new LibraryError('Media data is required', 'INVALID_INPUT');
  }

  try {
    const db = await getWatchfolioDB();

    return await withRetry(async () => {
      const now = new Date().toISOString();

      // Transform LibraryMedia to RxDB unified structure
      const rxdbData: LibraryMedia = {
        id: ID.unique(),
        // Library media fields with proper defaults
        status: mediaData.status || 'none',
        isFavorite: Boolean(mediaData.isFavorite),
        userRating: mediaData.userRating || undefined,
        notes: mediaData.notes?.trim() || undefined,
        addedAt: mediaData.addedAt || now,
        lastUpdatedAt: now,
        // TMDB media fields (flattened) with validation
        tmdbId: mediaData.tmdbId,
        media_type: mediaData.media_type,
        title: mediaData.title?.trim() || `${mediaData.media_type} ${mediaData.tmdbId}`,
        overview: mediaData.overview?.trim() || undefined,
        posterPath: mediaData.posterPath?.trim() || undefined,
        releaseDate: mediaData.releaseDate?.trim() || undefined,
        genres: Array.isArray(mediaData.genres) ? mediaData.genres.filter((g) => g?.trim()) : [],
        rating: typeof mediaData.rating === 'number' ? mediaData.rating : undefined,
        totalMinutesRuntime:
          typeof mediaData.totalMinutesRuntime === 'number' ? mediaData.totalMinutesRuntime : undefined,
        networks: Array.isArray(mediaData.networks) ? mediaData.networks : [],
        // Library reference with validation
        library: library && library.$id ? library : null,
      };

      // Validate required fields
      if (!rxdbData.tmdbId || !rxdbData.media_type || !rxdbData.title) {
        throw new LibraryError(
          'Missing required fields: tmdbId, media_type, and title are required',
          'VALIDATION_ERROR'
        );
      }

      const doc = await db.libraryMedia.insert(rxdbData);
      return doc.toJSON() as LibraryMedia;
    });
  } catch (error) {
    if (error instanceof LibraryError) {
      throw error;
    }

    // Handle duplicate key errors
    if ((error as Error).message?.includes('duplicate')) {
      throw new LibraryError(`Media item with ID ${mediaData.id} already exists`, 'DUPLICATE_ERROR', error);
    }

    throw new LibraryError('Failed to create library media item', 'CREATE_ERROR', error);
  }
};

export const updateLibraryMedia = async (id: string, mediaData: Partial<LibraryMedia>): Promise<LibraryMedia> => {
  console.log('UPDATING...', id, mediaData);
  if (!id?.trim()) {
    throw new LibraryError('Media ID is required', 'INVALID_INPUT');
  }

  if (!mediaData || Object.keys(mediaData).length === 0) {
    throw new LibraryError('Update data is required', 'INVALID_INPUT');
  }

  try {
    const db = await getWatchfolioDB();

    return await withRetry(async () => {
      let doc = await db.libraryMedia
        .findOne({
          selector: { id: id.trim() },
        })
        .exec();

      if (!doc) {
        throw new LibraryError(`Library media item not found: ${id}`, 'NOT_FOUND');
      }

      const now = new Date().toISOString();
      const updateData: Partial<LibraryMedia> = {
        lastUpdatedAt: now,
      };

      // Safely map and validate update fields
      if (mediaData.status !== undefined) {
        const validStatuses = ['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'];
        if (!validStatuses.includes(mediaData.status)) {
          throw new LibraryError(`Invalid status: ${mediaData.status}`, 'VALIDATION_ERROR');
        }
        updateData.status = mediaData.status;
      }

      if (mediaData.isFavorite !== undefined) {
        updateData.isFavorite = Boolean(mediaData.isFavorite);
      }

      if (mediaData.userRating !== undefined) {
        if (
          mediaData.userRating !== null &&
          (typeof mediaData.userRating !== 'number' || mediaData.userRating < 1 || mediaData.userRating > 10)
        ) {
          throw new LibraryError('User rating must be between 1 and 10 or null', 'VALIDATION_ERROR');
        }
        updateData.userRating = mediaData.userRating;
      }

      if (mediaData.notes !== undefined) {
        updateData.notes = mediaData.notes?.trim() || undefined;
        if (updateData.notes && updateData.notes.length > 2000) {
          throw new LibraryError('Notes cannot exceed 2000 characters', 'VALIDATION_ERROR');
        }
      }

      if (mediaData.title !== undefined) {
        const trimmedTitle = mediaData.title?.trim();
        if (!trimmedTitle) {
          throw new LibraryError('Title cannot be empty', 'VALIDATION_ERROR');
        }
        updateData.title = trimmedTitle;
      }

      if (mediaData.posterPath !== undefined) {
        updateData.posterPath = mediaData.posterPath?.trim() || undefined;
      }

      if (mediaData.releaseDate !== undefined) {
        updateData.releaseDate = mediaData.releaseDate?.trim() || undefined;
      }

      if (mediaData.genres !== undefined) {
        updateData.genres = Array.isArray(mediaData.genres) ? mediaData.genres.filter((g) => g?.trim()) : [];
      }

      if (mediaData.rating !== undefined) {
        if (typeof mediaData.rating === 'number' && (mediaData.rating < 0 || mediaData.rating > 10)) {
          throw new LibraryError('Rating must be between 0 and 10', 'VALIDATION_ERROR');
        }
        updateData.rating = mediaData.rating;
      }

      if (mediaData.totalMinutesRuntime !== undefined) {
        if (typeof mediaData.totalMinutesRuntime === 'number' && mediaData.totalMinutesRuntime < 0) {
          throw new LibraryError('Runtime cannot be negative', 'VALIDATION_ERROR');
        }
        updateData.totalMinutesRuntime = mediaData.totalMinutesRuntime;
      }

      if (mediaData.networks !== undefined) {
        updateData.networks = Array.isArray(mediaData.networks)
          ? mediaData.networks.filter((n) => typeof n === 'number')
          : [];
      }

      doc = await doc.update({
        $set: updateData,
      });

      return doc.toJSON() as LibraryMedia;
    });
  } catch (error) {
    if (error instanceof LibraryError) {
      throw error;
    }

    throw new LibraryError(`Failed to update library media item: ${id}`, 'UPDATE_ERROR', error);
  }
};

export const deleteLibraryMedia = async (id: string): Promise<void> => {
  if (!id?.trim()) {
    throw new LibraryError('Media ID is required', 'INVALID_INPUT');
  }

  try {
    const db = await getWatchfolioDB();

    await withRetry(async () => {
      const doc = await db.libraryMedia
        .findOne({
          selector: { id: id.trim() },
        })
        .exec();

      if (!doc) {
        throw new LibraryError(`Library media item not found: ${id}`, 'NOT_FOUND');
      }

      await doc.remove();
    });
  } catch (error) {
    if (error instanceof LibraryError) {
      throw error;
    }

    throw new LibraryError(`Failed to delete library media item: ${id}`, 'DELETE_ERROR', error);
  }
};

export const addOrUpdateLibraryMedia = async (
  media: LibraryMedia,
  library: LibraryMedia['library'] | null
): Promise<LibraryMedia | null> => {
  try {
    const existingMedia = await getLibraryMedia(media.id);
    let result: LibraryMedia | null = null;

    if (existingMedia) {
      result = await updateLibraryMedia(existingMedia.id, {
        ...media,
        lastUpdatedAt: new Date().toISOString(),
      });
    } else {
      result = await createLibraryMedia(media, library);
    }

    return result;
  } catch (error) {
    if (error instanceof LibraryError) {
      throw error;
    }

    throw new LibraryError(`Failed to add or update library media item: ${media.id}`, 'UPSERT_ERROR', error);
  }
};

export const clearLibrary = async (
  libraryId?: string,
  options: {
    batchSize?: number;
    onProgress?: (processed: number, total: number) => void;
  } = {}
): Promise<void> => {
  try {
    const { batchSize = 50, onProgress } = options;
    console.log('🗑️ Starting library clear operation...');

    await withRetry(async () => {
      // Get all medias in batches for better performance
      let allMedias: LibraryMedia[] = [];
      let offset = 0;
      let batch: LibraryMedia[];

      do {
        batch = await getLibraryMedias(libraryId, {
          limit: batchSize,
          offset,
        });
        allMedias = allMedias.concat(batch);
        offset += batchSize;
      } while (batch.length === batchSize);

      console.log(`📊 Found ${allMedias.length} items to delete`);

      // Delete in batches to avoid overwhelming the system
      const totalItems = allMedias.length;
      let processed = 0;

      for (let i = 0; i < allMedias.length; i += batchSize) {
        const batch = allMedias.slice(i, i + batchSize);

        await Promise.allSettled(
          batch.map(async (media) => {
            try {
              await deleteLibraryMedia(media.id);
              processed++;
              if (onProgress) {
                onProgress(processed, totalItems);
              }
            } catch (error) {
              console.error(`Failed to delete media ${media.id}:`, error);
            }
          })
        );

        // Small delay between batches to prevent overwhelming the system
        if (i + batchSize < allMedias.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      console.log(`✅ Library cleared: ${processed}/${totalItems} items deleted`);
    });
  } catch (error) {
    throw new LibraryError('Failed to clear library', 'CLEAR_ERROR', error);
  }
};

export const searchLibraryMedia = async (
  query: string,
  options: {
    libraryId?: string;
    mediaType?: 'movie' | 'tv';
    status?: LibraryFilterStatus;
    limit?: number;
  } = {}
): Promise<LibraryMedia[]> => {
  if (!query?.trim()) {
    return [];
  }

  try {
    const db = await getWatchfolioDB();
    const searchTerm = query.trim().toLowerCase();

    return await withRetry(async () => {
      const selector = buildQuerySelector({
        'library.$id': options.libraryId,
        media_type: options.mediaType,
        status: options.status,
      });

      let queryBuilder = db.libraryMedia.find({ selector });

      if (options.limit) queryBuilder = queryBuilder.limit(options.limit);

      const docs = await queryBuilder.exec();
      const results = docs.map((d) => d.toJSON() as LibraryMedia);

      return results.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm) ||
          item.overview?.toLowerCase().includes(searchTerm) ||
          item.genres?.some((genre) => genre.toLowerCase().includes(searchTerm))
      );
    });
  } catch (error) {
    throw new LibraryError('Failed to search library media', 'SEARCH_ERROR', error);
  }
};

export const bulkUpdateLibraryMedia = async (
  updates: Array<{ id: string; data: Partial<LibraryMedia> }>,
  options: {
    batchSize?: number;
    onProgress?: (processed: number, total: number) => void;
  } = {}
): Promise<{ successful: number; failed: number; errors: Array<{ id: string; error: string }> }> => {
  const { batchSize = 25, onProgress } = options;
  const results = { successful: 0, failed: 0, errors: [] as Array<{ id: string; error: string }> };

  try {
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(batch.map((update) => updateLibraryMedia(update.id, update.data)));

      batchResults.forEach((result, index) => {
        const update = batch[index];
        if (result.status === 'fulfilled') {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push({
            id: update.id,
            error: result.reason.message || 'Unknown error',
          });
        }
      });

      if (onProgress) {
        onProgress(Math.min(i + batchSize, updates.length), updates.length);
      }
    }

    return results;
  } catch (error) {
    throw new LibraryError('Bulk update operation failed', 'BULK_UPDATE_ERROR', error);
  }
};

export { LibraryError };
