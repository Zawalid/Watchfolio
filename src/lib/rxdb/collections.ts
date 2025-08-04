import { ID } from 'appwrite';
import { getWatchfolioDB } from './database';
import type { LibraryStats } from './types';

// ===== LIBRARY ITEM CRUD OPERATIONS =====

export const getLibraryItems = async (
    libraryId: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: { libraryId }
    }).exec();
    return docs.map(doc => doc.toJSON() as LibraryMedia);
};

export const getLibraryItem = async (
    id: string
) => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.findOne({
        selector: { id }
    }).exec();
    return doc ? doc.toJSON() as LibraryMedia : null;
};

export const createLibraryItem = async (
    itemData: Omit<LibraryMedia, 'id'>
) => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.insert({
        ...itemData,
        id: ID.unique(),
    });

    // create the media item in the tmdb collection
    try {
        // await tmdbMediaService.createMediaItem(itemData);
    } catch (error) {
        console.error('Error creating media item in tmdb collection:', error);
    }
    return doc.toJSON() as LibraryMedia;
};

export const updateLibraryItem = async (
    id: string,
    itemData: Partial<LibraryMedia>
) => {
    const db = await getWatchfolioDB();
    let doc = await db.libraryItems.findOne({ selector: { id } }).exec();
    if (!doc) throw new Error('Library item not found');

    doc = await doc.update({
        $set: {
            ...itemData,
            lastUpdatedAt: new Date().toISOString()
        }
    });

    return doc.toJSON() as LibraryMedia;
};

export const deleteLibraryItem = async (
    id: string
): Promise<void> => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.findOne({ selector: { id } }).exec();
    if (!doc) throw new Error('Library item not found');

    await doc.remove();
};

export const addOrUpdateLibraryItem = async (
    item: LibraryMedia
): Promise<LibraryMedia | null> => {
    const existingItem = await getLibraryItem(item.id);
    let newOrUpdatedItem: LibraryMedia | null = null;

    if (existingItem) {
        newOrUpdatedItem = await updateLibraryItem(existingItem.id, {
            ...item,
            lastUpdatedAt: new Date().toISOString()
        });
    } else {
        newOrUpdatedItem = await createLibraryItem(item);
    }

    return newOrUpdatedItem;
};

// ===== QUERY OPERATIONS =====

export const getLibraryItemsByStatus = async (
    libraryId: string,
    status: LibraryFilterStatus
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
    media_type: MediaType
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            libraryId,
            media_type
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





export const getLibraryStats = async (
    libraryId: string
): Promise<LibraryStats> => {
    const items = await getLibraryItems(libraryId);

    const stats: LibraryStats = {
        totalItems: items.length,
        movieCount: items.filter(item => item.media_type === 'movie').length,
        tvCount: items.filter(item => item.media_type === 'tv').length,
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
