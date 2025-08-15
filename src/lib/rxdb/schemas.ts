import type { RxJsonSchema } from 'rxdb';
import { RxDBLibraryMedia } from './types';



export const libraryItemSchema: RxJsonSchema<RxDBLibraryMedia> = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    additionalProperties: false,
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
            type: ['integer', 'null'],
            minimum: 1,
            maximum: 10,
            multipleOf: 1
        },
        notes: {
            type: ['string', 'null'],
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
        library: {
            type: 'object',
            additionalProperties: true,
            properties: {
                
            },
        },
        media: {
            type: 'object',
            additionalProperties: true,
            properties: {
                id: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 999999999,
                    multipleOf: 1
                },
                title: {
                    type: 'string',
                    maxLength: 255
                },
                mediaType: {
                    type: 'string',
                    enum: ['movie', 'tv'],
                    maxLength: 10
                },
                posterPath: {
                    type: 'string',
                    maxLength: 200
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
                    maximum: 10
                },
                totalMinutesRuntime: {
                    type: 'integer',
                    minimum: 0,
                    maximum: 99999,
                    multipleOf: 1
                },
                networks: {
                    type: 'array',
                    items: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 2147483647,
                        multipleOf: 1
                    }
                }
            },
            required: ['id', 'title', 'mediaType']
        }
    },
    required: [
        'id',
        'status',
        'isFavorite',
        'addedAt',
        'library',
        'media'
    ],
    indexes: [
        // ['library._id', 'id'],
        // ['media._id', 'id'],
        ['media.id', 'media.mediaType', 'id'],
        ['status', 'id'],
        ['isFavorite', 'id'],
        ['addedAt', 'id'],
    ]
};