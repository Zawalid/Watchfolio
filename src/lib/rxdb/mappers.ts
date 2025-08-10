type AnyDoc = Record<string, unknown>;

export function getMediaId(local: AnyDoc) {
    return `${local.media_type}-${local.tmdbId}`;
}

export function localToServer(local: AnyDoc, userLibraryId: string) {
    const mediaId = getMediaId(local);

    // server media doc (only fields that exist in your media collection)
    const mediaDoc = {
        // ID is set in create/update calls; the payload holds attributes
        tmdbId: local.tmdbId,
        type: local.media_type, // or 'media_type' depending on your media schema
        title: local.title,
        posterPath: local.posterPath ?? null,
        releaseDate: local.releaseDate ?? null,
        genres: Array.isArray(local.genres) ? local.genres : [],
        rating: typeof local.rating === 'number' ? local.rating : null,
        totalMinutesRuntime: Number.isFinite(local.totalMinutesRuntime)
            ? local.totalMinutesRuntime
            : null,
        networks: Array.isArray(local.networks) ? local.networks : [],
        // add more fields only if defined in the media collection schema
    };

    // server library_items doc
    const itemDoc = {
        status: local.status ?? 'none',
        isFavorite: !!local.isFavorite,
        userRating:
            local.userRating != null
                ? Math.max(1, Math.min(10, Math.round(Number(local.userRating))))
                : null, // library_items expects integer 1..10
        notes: local.notes ?? null,
        addedAt: local.addedAt ?? null, // must be ISO datetime if set
        deleted: !!local.deleted,
        library: userLibraryId,
        media: mediaId
    };

    return { mediaId, mediaDoc, itemId: local.id, itemDoc };
}

export function serverToLocal(item: AnyDoc, media: AnyDoc) {
    return {
        // primary key: use the library_items id
        id: item.$id,
        libraryId: item.library || "guest-library",
        media_type: media?.type ?? null,
        tmdbId: media?.tmdbId ?? null,
        title: media?.title ?? null,
        posterPath: media?.posterPath ?? null,
        releaseDate: media?.releaseDate ?? null,
        genres: Array.isArray(media?.genres) ? media.genres : [],
        rating: typeof media?.rating === 'number' ? media.rating : null,
        totalMinutesRuntime: Number.isFinite(media?.totalMinutesRuntime)
            ? media.totalMinutesRuntime
            : null,
        networks: Array.isArray(media?.networks) ? media.networks : [],
        status: item.status ?? 'none',
        isFavorite: !!item.isFavorite,
        userRating:
            item.userRating != null
                ? Math.max(1, Math.min(10, Math.round(Number(item.userRating))))
                : null,
        notes: item.notes ?? null,
        addedAt: item.addedAt ?? null,
        // Use server clock for a checkpoint; you can also copy $updatedAt
        lastUpdatedAt: item.$updatedAt ?? new Date().toISOString()
    };
}
