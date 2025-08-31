import { Client, TablesDB, Query } from 'node-appwrite';

const DATABASE_ID = process.env.DB_ID;
const LIBRARIES_TABLE = process.env.LIBRARIES_COLLECTION_ID;
const MEDIA_TABLE = process.env.LIBRARY_MEDIA_COLLECTION_ID;

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);

  const tablesDB = new TablesDB(client);

  try {
    log('Stats calculation started');

    if (
      req.body.$tableId !== MEDIA_TABLE ||
      req.body.$databaseId !== DATABASE_ID
    ) {
      log('Event not related to media or database. Exiting.');
      return res.empty();
    }
    // Appwrite triggers send event data in the request body
    const libraryId = req.body.averageRating
      ? req.body.$id
      : req.body.library.$id;

    log('LIBRARY id.', libraryId);

    if (!libraryId) {
      log('No libraryId found in event data. Exiting.');
      return res.empty();
    }

    // --- Core Logic: Fetch all items for the library and recalculate stats ---
    // Note: For extreme scale, you would incrementally update the stats
    // instead of recalculating, but this is a robust starting point.

    const allItems = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const page = await tablesDB.listRows(DATABASE_ID, MEDIA_TABLE, [
        Query.equal('library', libraryId),
        Query.limit(limit),
        Query.offset(offset),
      ]);
      allItems.push(...page.rows);
      offset += limit;
      hasMore = allItems.length < page.total;
    }

    // --- Calculate All Stats ---
    const stats = {
      all: allItems.length,
      watching: 0,
      willWatch: 0,
      onHold: 0,
      dropped: 0,
      completed: 0,
      favorites: 0,
      movies: 0,
      tvShows: 0,
      totalHoursWatched: 0,
      averageRating: 0,
      topGenres: [],
    };

    const ratedItems = [];
    const genreCounts = {};
    let totalMinutesRuntime = 0;

    for (const item of allItems) {
      // Status counts
      if (item.status && item.status !== 'none') stats[item.status]++;
      if (item.isFavorite) stats.favorites++;
      if (item.media_type === 'movie') stats.movies++;
      if (item.media_type === 'tv') stats.tvShows++;

      // Other stats
      if (item.userRating) ratedItems.push(item.userRating);
      item.genres?.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
      totalMinutesRuntime += item.totalMinutesRuntime || 0;
    }

    stats.totalHoursWatched = Math.round(totalMinutesRuntime / 60);
    stats.averageRating =
      ratedItems.length > 0
        ? ratedItems.reduce((a, b) => a + b, 0) / ratedItems.length
        : 0;
    stats.topGenres = Object.entries(genreCounts)
      .map(([id, count]) => ({ id : Number(id), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    log('Updated stats', stats);

    await tablesDB.updateRow(DATABASE_ID, LIBRARIES_TABLE, libraryId, {
      stats: JSON.stringify(stats),
    });

    log(`Successfully updated stats for library: ${libraryId}`);
    return res.json({ success: true, stats });
  } catch (e) {
    error(`Error updating library stats: ${e.message}`);
    return res.json({ success: false, error: e.message }, 500);
  }
};
