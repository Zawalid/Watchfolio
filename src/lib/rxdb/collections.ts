import { ID } from 'appwrite';
import { getWatchfolioDB } from './database';


export const getLibraryMedias = async (
    libraryId?: string
) => {
    const db = await getWatchfolioDB();
    const docs = await db.libraryMedia.find({
        selector: {
            'library.$id': libraryId
        }
    }).exec();
    return docs.map(d => d.toJSON() as LibraryMedia);
};

export const getLibraryMedia = async (
    id: string
) => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryMedia.findOne({
        selector: { id }
    }).exec();
    return doc ? doc.toJSON() as LibraryMedia : null;
};

export const createLibraryMedia = async (
    mediaData: LibraryMedia,
    library: LibraryMedia['library'] | null
) => {
    const db = await getWatchfolioDB();

    // Transform LibraryMedia to RxDB unified structure
    const rxdbData: LibraryMedia = {
        id: mediaData.id || ID.unique(),
        // Library media fields
        status: mediaData.status || 'none',
        isFavorite: mediaData.isFavorite || false,
        userRating: mediaData.userRating,
        notes: mediaData.notes,
        addedAt: mediaData.addedAt || new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
        // TMDB media fields (flattened)
        tmdbId: mediaData.tmdbId,
        media_type: mediaData.media_type,
        title: mediaData.title || `${mediaData.media_type} ${mediaData.tmdbId}`,
        overview: undefined, // Not available in current LibraryMedia type
        posterPath: mediaData.posterPath || undefined,
        releaseDate: mediaData.releaseDate || undefined,
        genres: mediaData.genres || [],
        rating: mediaData.rating,
        totalMinutesRuntime: mediaData.totalMinutesRuntime,
        networks: mediaData.networks || [],
        // Library reference
        library,
    };

    const doc = await db.libraryMedia.insert(rxdbData);
    return doc.toJSON() as LibraryMedia;
};

export const updateLibraryMedia = async (
    id: string,
    mediaData: Partial<LibraryMedia>
) => {
    const db = await getWatchfolioDB();
    let doc = await db.libraryMedia.findOne({ selector: { id } }).exec();

    if (!doc) throw new Error('Library media not found');

    // Transform LibraryMedia update to RxDB format
    const updateData: Partial<LibraryMedia> = {
        lastUpdatedAt: new Date().toISOString()
    };

    // Map relevant fields that might be updated
    if (mediaData.status !== undefined) updateData.status = mediaData.status;
    if (mediaData.isFavorite !== undefined) updateData.isFavorite = mediaData.isFavorite;
    if (mediaData.userRating !== undefined) updateData.userRating = mediaData.userRating;
    if (mediaData.notes !== undefined) updateData.notes = mediaData.notes;
    if (mediaData.title !== undefined) updateData.title = mediaData.title;
    if (mediaData.posterPath !== undefined) updateData.posterPath = mediaData.posterPath || undefined;
    if (mediaData.releaseDate !== undefined) updateData.releaseDate = mediaData.releaseDate || undefined;
    if (mediaData.genres !== undefined) updateData.genres = mediaData.genres;
    if (mediaData.rating !== undefined) updateData.rating = mediaData.rating;
    if (mediaData.totalMinutesRuntime !== undefined) updateData.totalMinutesRuntime = mediaData.totalMinutesRuntime;
    if (mediaData.networks !== undefined) updateData.networks = mediaData.networks;

    doc = await doc.update({
        $set: updateData
    });

    return doc.toJSON() as LibraryMedia;
};

export const deleteLibraryMedia = async (
    id: string
): Promise<void> => {
    const db = await getWatchfolioDB();
    const doc = await db.libraryMedia.findOne({ selector: { id } }).exec();
    if (!doc) throw new Error('Library media not found');

    await doc.remove();
};

export const addOrUpdateLibraryMedia = async (
    media: LibraryMedia,
    library: LibraryMedia['library'] | null
): Promise<LibraryMedia | null> => {
    const existingMedia = await getLibraryMedia(media.id);
    let newOrUpdatedMedia: LibraryMedia | null = null;

    if (existingMedia) {
        newOrUpdatedMedia = await updateLibraryMedia(existingMedia.id, {
            ...media,
            lastUpdatedAt: new Date().toISOString()
        });
    } else {
        newOrUpdatedMedia = await createLibraryMedia(media, library);
    }

    return newOrUpdatedMedia;
};




export const clearLibrary = async (
    libraryId?: string
): Promise<void> => {
    const medias = await getLibraryMedias(libraryId);

    // Delete all medias
    await Promise.all(
        medias.map(media => deleteLibraryMedia(media.id))
    );

    console.log('🗑️ Library cleared from RxDB');
};