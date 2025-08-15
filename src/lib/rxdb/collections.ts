import { ID } from 'appwrite';
import { getWatchfolioDB } from './database';
import type { LibraryStats, RxDBLibraryMedia } from './types';
import { mapFromAppwriteData, mapToAppwriteData } from '@/utils/library';
import { LibraryItem, TmdbMedia } from '../appwrite/types';
import { RxDocument } from 'rxdb';


const mapper = (d: RxDocument<RxDBLibraryMedia>) => {
    const doc = d.toJSON();
    return mapFromAppwriteData(doc as unknown as LibraryItem, doc.media as unknown as TmdbMedia);
}


// ===== LIBRARY ITEM CRUD OPERATIONS =====

export const getLibraryItems = async (
    libraryId: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            'library.$id': libraryId
        }
    }).exec();
    return docs.map(mapper);
};

export const getLibraryItem = async (
    id: string
) => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryItems.findOne({
        selector: { id }
    }).exec();
    return doc ? mapper(doc) : null;
};

export const createLibraryItem = async (
    itemData: Omit<LibraryMedia, 'id'>,
    library: RxDBLibraryMedia['library']
) => {
    const db = await getWatchfolioDB();
    const { libraryItem, tmdbMedia } = mapToAppwriteData(itemData);

    // Transform the data to RxDB format (with _id instead of $id)
    const rxdbData: RxDBLibraryMedia = {
        id: ID.unique(),
        status: libraryItem.status,
        isFavorite: libraryItem.isFavorite,
        userRating: libraryItem.userRating,
        notes: libraryItem.notes,
        addedAt: libraryItem.addedAt,
        lastUpdatedAt: new Date().toISOString(),
        library,
        media: { ...tmdbMedia, $id: ID.unique() }
    };

    const doc = await db.libraryItems.insert(rxdbData);
    return mapper(doc);
};

export const updateLibraryItem = async (
    id: string,
    itemData: Partial<LibraryMedia>
) => {
    const db = await getWatchfolioDB();
    let doc = await db.libraryItems.findOne({ selector: { id } }).exec();

    if (!doc) throw new Error('Library item not found');

    // Transform any $id properties to _id for RxDB storage
    const updateData: Partial<RxDBLibraryMedia> = {
        ...itemData,
        lastUpdatedAt: new Date().toISOString()
    };

    doc = await doc.update({
        $set: updateData
    });

    return mapper(doc);
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
    item: LibraryMedia,
    library: RxDBLibraryMedia['library']
): Promise<LibraryMedia | null> => {
    const existingItem = await getLibraryItem(item.id);
    let newOrUpdatedItem: LibraryMedia | null = null;

    if (existingItem) {
        newOrUpdatedItem = await updateLibraryItem(existingItem.id, {
            ...item,
            lastUpdatedAt: new Date().toISOString()
        });
    } else {
        newOrUpdatedItem = await createLibraryItem(item, library);
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
            'library.$id': libraryId,
            status
        }
    }).exec();
    return docs.map(mapper);
};

export const getFavoriteLibraryItems = async (
    libraryId: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            'library.$id': libraryId,
            isFavorite: true
        }
    }).sort({ addedAt: 'desc' }).exec();
    return docs.map(mapper);
};

export const getLibraryItemsByMediaType = async (
    libraryId: string,
    mediaType: 'movie' | 'tv'
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            'library.$id': libraryId,
            'media.mediaType': mediaType
        }
    }).exec();
    return docs.map(mapper);
};

export const searchLibraryItems = async (
    libraryId: string,
    query: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryItems.find({
        selector: {
            'library.$id': libraryId,
            'media.title': { $regex: query, $options: 'i' }
        }
    }).exec();
    return docs.map(mapper);
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