import type { RxJsonSchema } from 'rxdb';


export const libraryItemSchema: RxJsonSchema<LibraryMedia> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        status: {
            type: 'string',
            enum: ['watching', 'willWatch', 'onHold', 'dropped', 'none', 'completed'],
            maxLength: 20
        },
        isFavorite: {
            type: 'boolean'
        },
        userRating: {
            type: 'integer',
            minimum: 1,
            maximum: 10,
            multipleOf: 1
        },
        notes: {
            type: 'string',
            maxLength: 2000
        },
        addedAt: {
            type: 'string',
            format: 'date-time',
            maxLength: 50
        },
        lastUpdatedAt: {
            type: 'string',
            format: 'date-time',
            maxLength: 50
        },
        libraryId: {
            type: 'string',
            maxLength: 100
        },
        tmdbId: {
            type: 'integer',
            minimum: 1,
            maximum: 999999999,
            multipleOf: 1  // Required for indexed integer fields
        },
        title: {
            type: 'string',
            maxLength: 255
        },
        media_type: {
            type: 'string',
            enum: ['movie', 'tv'],
            maxLength: 10
        },
        posterPath: {
            type: 'string',
            maxLength: 200  // Increased for full poster URLs
        },
        releaseDate: {
            type: 'string',
            maxLength: 50
        },
        genres: {
            type: 'array',
            items: {
                type: 'string',
                maxLength: 50
            }
        },
        rating: {
            type: 'number',
            minimum: 0,
            maximum: 10,
        },
        totalMinutesRuntime: {
            type: 'integer',
            minimum: 0,
            maximum: 99999, // Reasonable upper limit for runtime in minutes
            multipleOf: 1  // Add this since it might be indexed later
        },
        networks: {
            type: 'array',
            items: {
                type: 'integer',
                minimum: 0,
                maximum: 2147483647, // 32-bit signed integer limit
                multipleOf: 1  // Required for integer array items
            }
        }
    },
    required: ['id', 'status', 'isFavorite', 'addedAt', 'libraryId', 'tmdbId', 'title', 'media_type'],
    indexes: [
        ['libraryId'],           // Query by user's library
        ['tmdbId', 'media_type'], // Find specific media
        ['status'],              // Filter by watch status
        ['isFavorite'],          // Get favorites
        ['addedAt']              // Sort by date added
    ]
};


