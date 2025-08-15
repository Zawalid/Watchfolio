import { appwriteService } from "@/lib/appwrite/api";
import { LibraryItem, META_FIELDS, TmdbMedia } from "@/lib/appwrite/types";
import { removeObjectProperties } from "@/utils";
import { RxDBLibraryMedia } from "./types";

export async function localToServer(doc: RxDBLibraryMedia): Promise<LibraryItem> {
    // Ensure media exists in server
    let mediaDoc: TmdbMedia;
    const existingTmdb = await appwriteService.tmdbMedia.getByTmdbId(doc.media.id, doc.media.mediaType);
    if (existingTmdb) {
        mediaDoc = await appwriteService.tmdbMedia.update(existingTmdb.$id, removeObjectProperties(doc.media, ['_id']));
    } else {
        mediaDoc = await appwriteService.tmdbMedia.create(removeObjectProperties(doc.media, ['_id']));
    }

    // Transform RxDB format to Appwrite format
    const libraryItem: LibraryItem = {
        $id: doc.id,
        status: doc.status,
        isFavorite: doc.isFavorite,
        userRating: doc.userRating,
        notes: doc.notes,
        addedAt: doc.addedAt,
        $updatedAt: doc.lastUpdatedAt || doc.addedAt,
        $createdAt: doc.addedAt,
        // Transform library._id back to library.$id
        library: doc.library,
        media: mediaDoc
    } as LibraryItem;

    return libraryItem;
}

export function serverToLocal(item: LibraryItem): RxDBLibraryMedia {
    return {
        id: item.$id,
        status: item.status,
        isFavorite: item.isFavorite,
        userRating: item.userRating,
        notes: item.notes,
        addedAt: item.addedAt,
        lastUpdatedAt: item.$updatedAt,
        // Transform $id to _id for RxDB storage
        library: removeObjectProperties(item.library!, META_FIELDS),
        media: removeObjectProperties(item.media!, META_FIELDS),
    };
}
