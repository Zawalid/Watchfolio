import { ID } from 'appwrite';
import { getWatchfolioDB } from '../database';
import type {
    WatchfolioLibraryItem,
    LibraryStats,
    TMDBMediaInput,
    LibraryItemUpdate
} from '../types';

// ===== LIBRARY ITEM CRUD OPERATIONS =====

export const getLibraryItems = async (
    libraryId: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: { libraryId }
    }).exec();
    return docs.map(doc => doc.toJSON());
};

export const getLibraryItem = async (
    libraryId: string,
    tmdbId: number,
    mediaType: 'movie' | 'tv'
) => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.findOne({
        selector: {
            libraryId,
            tmdbId,
            mediaType
        }
    }).exec();
    return doc ? doc.toJSON() : null;
};

export const createLibraryItem = async (
    itemData: Omit<WatchfolioLibraryItem, 'id'>
) => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.insert({
        id: ID.unique(),
        ...itemData
    });
    return doc.toJSON();
};

export const updateLibraryItem = async (
    id: string,
    itemData: Partial<WatchfolioLibraryItem>
) => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.findOne({ selector: { id } }).exec();
    if (!doc) throw new Error('Library item not found');

    await doc.update({
        $set: itemData
    });
    return doc.toJSON();
};

export const deleteLibraryItem = async (
    id: string
): Promise<void> => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.findOne({ selector: { id } }).exec();
    if (!doc) throw new Error('Library item not found');

    await doc.remove();
};

// ===== QUERY OPERATIONS =====

export const getLibraryItemsByStatus = async (
    libraryId: string,
    status: WatchfolioLibraryItem['status'] | 'all' | 'favorites'
) => {
    if (status === 'all') {
        return getLibraryItems(libraryId);
    }

    if (status === 'favorites') {
        return getFavoriteLibraryItems(libraryId);
    }

    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            libraryId,
            status
        }
    }).exec();
    return docs.map(doc => doc.toJSON());
};

export const getFavoriteLibraryItems = async (
    libraryId: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            libraryId, isFavorite: true
        }
    }).sort({ addedAt: 'desc' }).exec();
    return docs.map(doc => doc.toJSON());
};

export const getLibraryItemsByMediaType = async (
    libraryId: string,
    mediaType: 'movie' | 'tv'
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            libraryId,
            mediaType
        }
    }).exec();
    return docs.map(doc => doc.toJSON());
};

export const searchLibraryItems = async (
    libraryId: string,
    query: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            libraryId,
            title: { $regex: query, $options: 'i' }
        }
    }).exec();
    return docs.map(doc => doc.toJSON());
};

// ===== UTILITY OPERATIONS =====

export const toggleLibraryItemFavorite = async (
    libraryId: string,
    tmdbId: number,
    mediaType: 'movie' | 'tv'
) => {
    const item = await getLibraryItem(libraryId, tmdbId, mediaType);
    if (!item) return null;

    return updateLibraryItem(item.id, {
        isFavorite: !item.isFavorite
    });
};

export const addOrUpdateLibraryItem = async (
    libraryId: string,
    tmdbId: number,
    mediaType: 'movie' | 'tv',
    updates: LibraryItemUpdate,
    mediaData?: {
        title: string;
        posterPath?: string;
        releaseDate?: string;
        genres?: string[];
        rating?: number;
        totalMinutesRuntime?: number;
        networks?: number[];
    }
) => {
    // Check if item already exists
    const existingItem = await getLibraryItem(libraryId, tmdbId, mediaType);

    if (existingItem) {
        // Update existing item
        return updateLibraryItem(existingItem.id, updates);
    } else {
        // Create new item
        const now = new Date().toISOString();
        return createLibraryItem({
            libraryId,
            tmdbId,
            mediaType,
            status: 'none',
            isFavorite: false,
            addedAt: now,
            title: mediaData?.title || `${mediaType} ${tmdbId}`,
            posterPath: mediaData?.posterPath,
            releaseDate: mediaData?.releaseDate,
            genres: mediaData?.genres,
            rating: mediaData?.rating,
            totalMinutesRuntime: mediaData?.totalMinutesRuntime,
            networks: mediaData?.networks,
            ...updates
        });
    }
};

export const getLibraryStats = async (
    libraryId: string
): Promise<LibraryStats> => {
    const items = await getLibraryItems(libraryId);

    const stats: LibraryStats = {
        totalItems: items.length,
        movieCount: items.filter(item => item.mediaType === 'movie').length,
        tvCount: items.filter(item => item.mediaType === 'tv').length,
        favoriteCount: items.filter(item => item.isFavorite).length,
        statusCounts: {} as Record<string, number>
    };

    // Count by status
    items.forEach(item => {
        stats.statusCounts[item.status] = (stats.statusCounts[item.status] || 0) + 1;
    });

    return stats;
};

export const clearLibrary = async (
    libraryId: string
): Promise<void> => {
    const items = await getLibraryItems(libraryId);

    // Delete all items
    await Promise.all(
        items.map(item => deleteLibraryItem(item.id))
    );

    console.log('🗑️ Library cleared from RxDB');
};

// ===== TMDB INTEGRATION HELPERS =====

export const transformTMDBMediaData = (media: TMDBMediaInput) => ({
    title: media.title || `${media.media_type} ${media.id}`,
    posterPath: media.poster_path,
    releaseDate: media.release_date || media.first_air_date,
    genres: media.genres?.map(g => g.name) || [],
    rating: media.vote_average ? +media.vote_average.toFixed(1) : undefined,
    totalMinutesRuntime: media.runtime || (media.episode_run_time?.[0] ? media.episode_run_time[0] : undefined),
    networks: media.networks?.map(n => n.id) || []
});

export const addMediaToLibrary = async (
    libraryId: string,
    media: TMDBMediaInput,
    updates: LibraryItemUpdate
) => {
    const mediaData = transformTMDBMediaData(media);

    return addOrUpdateLibraryItem(
        libraryId,
        media.id,
        media.media_type,
        updates,
        mediaData
    );
};