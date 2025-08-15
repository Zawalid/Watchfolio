import { Library, LibraryItem, META_FIELDS, TmdbMedia } from "@/lib/appwrite/types";
import { filterObject } from "@/utils";
import { RxDBLibraryMedia } from "./types";

// Enhanced deduplication with document state tracking
const pendingOperations = new Map<string, Promise<LibraryItem>>();
const processedDocuments = new Set<string>();

export async function localToServer(doc: RxDBLibraryMedia): Promise<LibraryItem> {
    // Create unique key based on document content, not just ID
    const contentHash = `${doc.id}-${doc.lastUpdatedAt}-${doc.status}-${doc.isFavorite}`;
    
    // Skip if we've already processed this exact document state
    if (processedDocuments.has(contentHash)) {
        console.log('🚫 Document already processed:', doc.id);
        // Create minimal response to avoid errors
        return {
            status: doc.status,
            isFavorite: doc.isFavorite,
            userRating: doc.userRating,
            notes: doc.notes,
            addedAt: doc.addedAt,
            library: filterObject(doc.library, ['$id'], 'exclude'),
            media: filterObject(doc.media, ['$id'], 'exclude')
        } as LibraryItem;
    }

    // If operation is in progress, wait for it
    if (pendingOperations.has(doc.id)) {
        console.log('⏳ Waiting for operation to complete:', doc.id);
        return await pendingOperations.get(doc.id)!;
    }

    const operationPromise = (async (): Promise<LibraryItem> => {
        try {
            console.log('📤 Processing document:', doc.id);

            const libraryItem: LibraryItem = {
                status: doc.status,
                isFavorite: doc.isFavorite,
                userRating: doc.userRating,
                notes: doc.notes,
                addedAt: doc.addedAt,
                $updatedAt: doc.lastUpdatedAt || doc.addedAt,
                $createdAt: doc.addedAt,
                library: filterObject(doc.library, ['$id'], 'exclude'),
                media: filterObject(doc.media, ['$id'], 'exclude')
            } as LibraryItem;

            // Mark this document state as processed
            processedDocuments.add(contentHash);

            return libraryItem;
        } finally {
            // Cleanup after processing
            setTimeout(() => {
                pendingOperations.delete(doc.id);
                console.log('🧹 Cleaned up operation:', doc.id);
            }, 2000);
        }
    })();

    pendingOperations.set(doc.id, operationPromise);
    return await operationPromise;
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
        library: filterObject(item.library!, META_FIELDS as (keyof Library)[], 'exclude'),
        media: filterObject(item.media!, META_FIELDS as (keyof TmdbMedia)[], 'exclude'),
    };
}

// Cleanup function for memory management
export function clearMapperCache() {
    pendingOperations.clear();
    processedDocuments.clear();
    console.log('🧹 Cleared mapper cache');
}