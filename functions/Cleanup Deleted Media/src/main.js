import { Client, TablesDB, Query } from 'node-appwrite';

const DATABASE_ID = process.env.DB_ID;
const MEDIA_TABLE = process.env.LIBRARY_MEDIA_COLLECTION_ID;

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key']);

  const tablesDB = new TablesDB(client);

  try {
    log('Cleanup deleted media started');

    // Calculate cutoff date (30 days ago)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 30);
    const cutoffISOString = cutoffDate.toISOString();

    log('Cutoff date for cleanup:', cutoffISOString);

    // --- Core Logic: Fetch all deleted items older than cutoff date ---
    const deletedItems = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const page = await tablesDB.listRows(DATABASE_ID, MEDIA_TABLE, [
        Query.equal('deleted', true),
        Query.lessThan('lastUpdatedAt', cutoffISOString),
        Query.limit(limit),
        Query.offset(offset),
      ]);
      deletedItems.push(...page.rows);
      offset += limit;
      hasMore = deletedItems.length < page.total;
    }

    log(`Found ${deletedItems.length} items to permanently delete`);

    if (deletedItems.length === 0) {
      log('No items to cleanup. Exiting.');
      return res.json({ success: true, deletedCount: 0, message: 'No items to cleanup' });
    }

    // --- Delete items permanently ---
    let successCount = 0;
    let failureCount = 0;

    for (const item of deletedItems) {
      try {
        await tablesDB.deleteRow(DATABASE_ID, MEDIA_TABLE, item.$id);
        log(`Permanently deleted item: ${item.title} (${item.$id})`);
        successCount++;
      } catch (deleteError) {
        error(`Failed to delete item ${item.$id}: ${deleteError.message}`);
        failureCount++;
      }
    }

    log(`Cleanup completed. Success: ${successCount}, Failures: ${failureCount}`);

    return res.json({ 
      success: true, 
      deletedCount: successCount,
      failureCount: failureCount,
      totalProcessed: deletedItems.length
    });

  } catch (e) {
    error(`Error during cleanup: ${e.message}`);
    return res.json({ success: false, error: e.message }, 500);
  }
};