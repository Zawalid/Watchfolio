import { ID } from 'appwrite';
import { getWatchfolioDB } from './database';
import { MangoQuerySelector } from 'rxdb';

class LibraryError extends Error {
    constructor(message: string, public code?: string, public originalError?: unknown) {
        super(message);
        this.name = 'LibraryError';
    }
}

const buildSelector = (conditions: Record<string, unknown>): MangoQuerySelector<LibraryMedia> => {
    const selector: MangoQuerySelector<LibraryMedia> = {};
    Object.entries(conditions).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            selector[key as keyof LibraryMedia] = value;
        }
    });
    return selector;
};

export const getAllLibraryMedias = async (
    libraryId?: string,
    options: {
        limit?: number;
        offset?: number;
        sortBy?: 'addedAt' | 'lastUpdatedAt' | 'title' | 'rating';
        sortOrder?: 'asc' | 'desc';
    } = {}
): Promise<LibraryMedia[]> => {
    const db = await getWatchfolioDB();

    const selector = buildSelector({ 'library.$id': libraryId });
    let query = db.libraryMedia.find({ selector });

    if (options.sortBy) {
        const direction = options.sortOrder === 'desc' ? 'desc' : 'asc';
        query = query.sort({ [options.sortBy]: direction });
    }

    if (options.offset) query = query.skip(options.offset);
    if (options.limit) query = query.limit(options.limit);

    const docs = await query.exec();
    return docs.map(d => d.toJSON() as LibraryMedia);
};

export const getLibraryMedia = async (id: string): Promise<LibraryMedia | null> => {
    if (!id?.trim()) return null;

    const db = await getWatchfolioDB();
    const doc = await db.libraryMedia.findOne({
        selector: { id: id.trim() },
    }).exec();

    return doc ? doc.toJSON() as LibraryMedia : null;
};

export const createLibraryMedia = async (
    mediaData: LibraryMedia,
    library: LibraryMedia['library'] | null
): Promise<LibraryMedia> => {
    if (!mediaData) {
        throw new LibraryError('Media data is required', 'INVALID_INPUT');
    }

    const db = await getWatchfolioDB();
    const now = new Date().toISOString();

    const rxdbData: LibraryMedia = {
        id: ID.unique(),
        status: mediaData.status || 'none',
        isFavorite: Boolean(mediaData.isFavorite),
        userRating: mediaData.userRating || undefined,
        notes: mediaData.notes?.trim() || undefined,
        addedAt: mediaData.addedAt || now,
        lastUpdatedAt: now,
        tmdbId: mediaData.tmdbId,
        media_type: mediaData.media_type,
        title: mediaData.title?.trim() || `${mediaData.media_type} ${mediaData.tmdbId}`,
        overview: mediaData.overview?.trim() || undefined,
        posterPath: mediaData.posterPath?.trim() || undefined,
        releaseDate: mediaData.releaseDate?.trim() || undefined,
        genres: Array.isArray(mediaData.genres) ? mediaData.genres.filter(g => g?.trim()) : [],
        rating: typeof mediaData.rating === 'number' ? mediaData.rating : undefined,
        totalMinutesRuntime: typeof mediaData.totalMinutesRuntime === 'number' ? mediaData.totalMinutesRuntime : undefined,
        networks: Array.isArray(mediaData.networks) ? mediaData.networks : [],
        library: library && library.$id ? library : null,
    };

    if (!rxdbData.tmdbId || !rxdbData.media_type || !rxdbData.title) {
        throw new LibraryError('Missing required fields: tmdbId, media_type, and title are required', 'VALIDATION_ERROR');
    }

    const doc = await db.libraryMedia.insert(rxdbData);
    return doc.toJSON() as LibraryMedia;
};

export const updateLibraryMedia = async (id: string, mediaData: Partial<LibraryMedia>): Promise<LibraryMedia> => {
    if (!id?.trim()) {
        throw new LibraryError('Media ID is required', 'INVALID_INPUT');
    }

    if (!mediaData || Object.keys(mediaData).length === 0) {
        throw new LibraryError('Update data is required', 'INVALID_INPUT');
    }

    const db = await getWatchfolioDB();

    let doc = await db.libraryMedia.findOne({
        selector: { id: id.trim() },
    }).exec();

    if (!doc) {
        throw new LibraryError(`Library media item not found: ${id}`, 'NOT_FOUND');
    }

    const updateData: Partial<LibraryMedia> = {
        lastUpdatedAt: new Date().toISOString(),
        ...mediaData
    };

    // Basic validation
    if (mediaData.status && !['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'].includes(mediaData.status)) {
        throw new LibraryError(`Invalid status: ${mediaData.status}`, 'VALIDATION_ERROR');
    }

    if (mediaData.userRating !== undefined && mediaData.userRating !== null) {
        if (typeof mediaData.userRating !== 'number' || mediaData.userRating < 1 || mediaData.userRating > 10) {
            throw new LibraryError('User rating must be between 1 and 10 or null', 'VALIDATION_ERROR');
        }
    }

    if (mediaData.title !== undefined) {
        const trimmedTitle = mediaData.title?.trim();
        if (!trimmedTitle) {
            throw new LibraryError('Title cannot be empty', 'VALIDATION_ERROR');
        }
        updateData.title = trimmedTitle;
    }

    doc = await doc.update({ $set: updateData });
    return doc.toJSON() as LibraryMedia;
};

export const deleteLibraryMedia = async (id: string): Promise<void> => {
    if (!id?.trim()) {
        throw new LibraryError('Media ID is required', 'INVALID_INPUT');
    }

    const db = await getWatchfolioDB();

    const doc = await db.libraryMedia.findOne({
        selector: { id: id.trim() },
    }).exec();

    if (!doc) {
        throw new LibraryError(`Library media item not found: ${id}`, 'NOT_FOUND');
    }

    await doc.remove();
};

export const addOrUpdateLibraryMedia = async (
    media: LibraryMedia,
    library: LibraryMedia['library'] | null
): Promise<LibraryMedia | null> => {
    const existingMedia = await getLibraryMedia(media.id);

    if (existingMedia) {
        return await updateLibraryMedia(existingMedia.id, {
            ...media,
            lastUpdatedAt: new Date().toISOString(),
        });
    } else {
        return await createLibraryMedia(media, library);
    }
};

export const clearLibrary = async (libraryId?: string): Promise<void> => {
    const db = await getWatchfolioDB();
    const items = await getAllLibraryMedias(libraryId);
    await db.libraryMedia.bulkRemove(items.map(item => item.id));
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
    if (!query?.trim()) return [];

    const db = await getWatchfolioDB();
    const searchTerm = query.trim().toLowerCase();

    const selector = buildSelector({
        'library.$id': options.libraryId,
        media_type: options.mediaType,
        status: options.status,
    });

    let queryBuilder = db.libraryMedia.find({ selector });
    if (options.limit) queryBuilder = queryBuilder.limit(options.limit);

    const docs = await queryBuilder.exec();
    const results = docs.map(d => d.toJSON() as LibraryMedia);

    return results.filter(item =>
        item.title?.toLowerCase().includes(searchTerm) ||
        item.overview?.toLowerCase().includes(searchTerm) ||
        item.genres?.some(genre => genre.toLowerCase().includes(searchTerm))
    );
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

    for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(
            batch.map(update => updateLibraryMedia(update.id, update.data))
        );

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
};

export { LibraryError };