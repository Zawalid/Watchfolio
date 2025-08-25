import { ID } from 'appwrite';
import { getWatchfolioDB } from './database';
import { MangoQuery, MangoQuerySelector } from 'rxdb';

class LibraryError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'LibraryError';
  }
}

const buildQuery = (conditions: Record<string, unknown>): MangoQuery<LibraryMedia> => {
  const selector: MangoQuerySelector<LibraryMedia> = {};
  const andConditions: MangoQuerySelector<LibraryMedia>[] = [];

  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      if (key === 'query' && value) {
        selector.title = { $regex: String(value), $options: 'i' };
      } else if (key === 'status' && value === 'favorites') {
        selector.isFavorite = true;
      } else if (key === 'genres' && Array.isArray(value) && value.length > 0) {
        // For an AND condition on genres, we build an $and query
        const genreConditions = value.map((genre) => ({ genres: { $elemMatch: { $eq: genre } } }));
        andConditions.push(...genreConditions);
      } else if (key === 'networks' && Array.isArray(value) && value.length > 0) {
        selector.networks = { $in: value };
      } else if (key !== 'genres' && key !== 'networks') {
        selector[key as keyof LibraryMedia] = value;
      }
    }
  });

  if (andConditions.length > 0) {
    selector.$and = andConditions;
  }

  return { selector };
};

export const getAllLibraryItems = async (
  userId?: string,
  options: {
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    status?: LibraryFilterStatus;
    query?: string;
    mediaType?: MediaType | 'all';
    genres?: string[];
    networks?: number[];
  } = {}
): Promise<LibraryMedia[]> => {
  const db = await getWatchfolioDB();
  const { selector } = buildQuery({
    userId,
    status: options.status,
    query: options.query,
    media_type: options.mediaType,
    genres: options.genres,
    networks: options.networks,
  });

  let queryBuilder = db.libraryMedia.find({ selector });

  if (options.sortBy) {
    queryBuilder = queryBuilder.sort({ [options.sortBy]: options.sortDir || 'asc' });
  }
  if (options.offset) queryBuilder = queryBuilder.skip(options.offset);
  if (options.limit) queryBuilder = queryBuilder.limit(options.limit);

  const docs = await queryBuilder.exec();
  return docs.map((d) => d.toJSON() as LibraryMedia);
};

export const getLibraryItemsByIds = async (ids: string[]): Promise<LibraryMedia[]> => {
  if (!ids || ids.length === 0) return [];
  const db = await getWatchfolioDB();
  const docs = await db.libraryMedia.find({ selector: { id: { $in: ids } } }).exec();
  return docs.map((doc) => doc.toJSON() as LibraryMedia);
};

export const countLibraryItems = async (userId?: string, status?: LibraryFilterStatus): Promise<number> => {
  const db = await getWatchfolioDB();
  const { selector } = buildQuery({ userId, status });
  return await db.libraryMedia.count({ selector }).exec();
};

export const getLibraryItem = async (id: string): Promise<LibraryMedia | null> => {
  if (!id?.trim()) return null;
  const db = await getWatchfolioDB();
  const doc = await db.libraryMedia.findOne({ selector: { id: id.trim() } }).exec();
  return doc ? (doc.toJSON() as LibraryMedia) : null;
};

export const getLibraryItemByTmdbId = async (tmdbId: number, media_type: MediaType): Promise<LibraryMedia | null> => {
  if (!tmdbId || !media_type) return null;
  const db = await getWatchfolioDB();
  const doc = await db.libraryMedia.findOne({ selector: { tmdbId, media_type } }).exec();
  return doc ? (doc.toJSON() as LibraryMedia) : null;
};

export const addOrUpdateLibraryItem = async (
  media: Partial<LibraryMedia> & Pick<LibraryMedia, 'id'>,
  library: LibraryMedia['library'] | null
): Promise<LibraryMedia> => {
  const db = await getWatchfolioDB();
  const now = new Date().toISOString();

  let doc = await db.libraryMedia.findOne(media.id).exec();
  if(!doc && media.media_type && media.tmdbId) {
    doc = await db.libraryMedia.findOne({ selector: { tmdbId: media.tmdbId, media_type: media.media_type } }).exec();
  }

  if (doc) {
    const updatedDoc = await doc.update({ $set: { ...media, lastUpdatedAt: now } });
    return updatedDoc.toJSON() as LibraryMedia;
  } else {
    const data: LibraryMedia = {
      id: ID.unique(),
      status: media.status || 'none',
      isFavorite: Boolean(media.isFavorite),
      userRating: media.userRating || undefined,
      notes: media.notes?.trim() || undefined,
      addedAt: media.addedAt || now,
      lastUpdatedAt: now,
      tmdbId: media.tmdbId!,
      media_type: media.media_type!,
      title: media.title?.trim() || `${media.media_type} ${media.tmdbId}`,
      overview: media.overview?.trim() || undefined,
      posterPath: media.posterPath?.trim() || undefined,
      releaseDate: media.releaseDate?.trim() || undefined,
      genres: Array.isArray(media.genres) ? media.genres.filter((g) => g?.trim()) : [],
      rating: typeof media.rating === 'number' ? media.rating : undefined,
      totalMinutesRuntime: typeof media.totalMinutesRuntime === 'number' ? media.totalMinutesRuntime : undefined,
      networks: Array.isArray(media.networks) ? media.networks : [],
      library: library && library.$id ? library : null,
    };

    const newDoc = await db.libraryMedia.insert(data);
    return newDoc.toJSON() as LibraryMedia;
  }
};

export const deleteLibraryItem = async (id: string): Promise<void> => {
  if (!id?.trim()) throw new LibraryError('Media ID is required', 'INVALID_INPUT');
  const db = await getWatchfolioDB();
  const doc = await db.libraryMedia.findOne({ selector: { id: id.trim() } }).exec();
  if (!doc) throw new LibraryError(`Library media item not found: ${id}`, 'NOT_FOUND');
  await doc.remove();
};

export const bulkaddOrUpdateLibraryItem = async (
  items: LibraryMedia[]
): Promise<{ successful: number; failed: number }> => {
  if (!Array.isArray(items) || items.length === 0) return { successful: 0, failed: 0 };
  const db = await getWatchfolioDB();
  const result = await db.libraryMedia.bulkUpsert(items);
  return { successful: result.success.length, failed: result.error.length };
};

export { LibraryError };
