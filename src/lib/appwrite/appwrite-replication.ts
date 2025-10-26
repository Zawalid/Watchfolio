/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  RxCollection,
  WithDeleted,
  RxReplicationPullStreamItem,
  ReplicationOptions,
  ReplicationPullOptions,
  ReplicationPushOptions,
} from 'rxdb';
import { RxReplicationState, startReplicationOnLeaderShip } from 'rxdb/plugins/replication';
import { addRxPlugin } from 'rxdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { TablesDB, Query, type Client } from 'appwrite';
import { flatClone, lastOfArray } from 'rxdb/plugins/utils';
import { Subject } from 'rxjs';
import { setPermissions } from './api';

export type AppwriteCheckpointType = {
  updatedAt: string;
  id: string;
};

export type SyncOptionsAppwrite<RxDocType> = Omit<
  ReplicationOptions<RxDocType, any>,
  'pull' | 'push' | 'deletedField'
> & {
  databaseId: string;
  tableId: string;
  userId: string;
  client: Client;
  deletedField: string;
  pull?: {
    batchSize?: number;
    modifier?: (doc: any) => RxDocType | Promise<RxDocType>;
  };
  push?: {
    batchSize?: number;
    modifier?: (doc: WithDeleted<RxDocType>) => any | Promise<any>;
    debounceMs?: number; // Debounce time in milliseconds (0 = disabled)
  };
};

// Helper to transform Appwrite docs to RxDB format
async function appwriteDocToRxDB<RxDocType>(
  appwriteDoc: any,
  primaryKey: string,
  deletedField: string,
  modifier?: (doc: any) => RxDocType | Promise<RxDocType>
): Promise<WithDeleted<RxDocType>> {
  const cleanDoc: any = {};

  Object.keys(appwriteDoc).forEach((key) => {
    if (!key.startsWith('$')) cleanDoc[key] = appwriteDoc[key];
  });

  cleanDoc[primaryKey] = appwriteDoc.$id;
  cleanDoc._deleted = appwriteDoc[deletedField] === true;

  if (modifier) return modifier(cleanDoc) as WithDeleted<RxDocType>;

  return cleanDoc as WithDeleted<RxDocType>;
}

// Helper to transform RxDB docs to Appwrite format
async function rxdbDocToAppwrite<RxDocType>(
  rxdbDoc: WithDeleted<RxDocType>,
  primaryKey: string,
  modifier?: (doc: WithDeleted<RxDocType>) => any | Promise<any>
): Promise<any> {
  const writeDoc: any = flatClone(rxdbDoc);

  delete writeDoc._attachments;
  delete writeDoc._meta;
  delete writeDoc._rev;
  delete writeDoc[primaryKey];

  if (modifier) return modifier(writeDoc);

  return writeDoc;
}

// Debounced push handler factory
function createDebouncedPushHandler<RxDocType>(
  handler: (rows: any[]) => Promise<WithDeleted<RxDocType>[]>,
  debounceMs: number,
  onPendingChanges?: (count: number) => void
) {
  let debounceTimer: NodeJS.Timeout | null = null;
  let pendingRows: any[] = [];
  let resolvers: Array<(value: WithDeleted<RxDocType>[]) => void> = [];
  let isFlushing = false;

  const flush = async () => {
    // Prevent concurrent flushes
    if (isFlushing || pendingRows.length === 0) return;

    isFlushing = true;
    const rowsToProcess = [...pendingRows];
    const currentResolvers = [...resolvers];

    pendingRows = [];
    resolvers = [];
    onPendingChanges?.(0);

    try {
      const conflicts = await handler(rowsToProcess);
      currentResolvers.forEach(resolve => resolve(conflicts));
    } catch (error: any) {
      log('ERR', 'Debounced push failed:', error);

      // Check if it's a network error (transient) vs application error (permanent)
      const isNetworkError = !navigator.onLine || error?.message?.includes('fetch') || error?.message?.includes('network');

      if (isNetworkError) {
        log('Network error detected, items will retry automatically');
      }

      // Return all items as conflicts so RxDB retries them
      currentResolvers.forEach(resolve => resolve(rowsToProcess.map(r => r.newDocumentState)));
    } finally {
      isFlushing = false;
    }
  };

  const debouncedHandler = async (rows: any[]): Promise<WithDeleted<RxDocType>[]> => {
    log(`📥 Debounce handler received ${rows.length} change(s), debouncing for ${debounceMs}ms...`);
    return new Promise((resolve) => {
      // Add rows to pending queue, merging updates for the same document
      rows.forEach(newRow => {
        const docId = (newRow.newDocumentState as any)?.id;
        if (!docId) {
          log('ERR', 'Document missing ID, skipping:', newRow);
          return;
        }

        const existingIndex = pendingRows.findIndex(
          r => (r.newDocumentState as any)?.id === docId
        );
        if (existingIndex >= 0) {
          // Replace with latest state for this document
          log(`🔄 Merging update for document ${docId}`);
          pendingRows[existingIndex] = newRow;
        } else {
          pendingRows.push(newRow);
        }
      });

      resolvers.push(resolve);
      log(`📊 Total pending: ${pendingRows.length} document(s)`);
      onPendingChanges?.(pendingRows.length);

      // Clear existing timer
      if (debounceTimer) {
        log('⏰ Resetting debounce timer');
        clearTimeout(debounceTimer);
      }

      // Schedule flush
      debounceTimer = setTimeout(() => {
        log(`⚡ Debounce timer fired, flushing ${pendingRows.length} document(s)`);
        flush();
        debounceTimer = null;
      }, debounceMs);
    });
  };

  // Cleanup function to clear pending timers
  const cleanup = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    // Flush any pending changes before cleanup
    if (pendingRows.length > 0 && !isFlushing) {
      flush();
    }
  };

  // Attach methods to handler for external access
  (debouncedHandler as any).forceFlush = flush;
  (debouncedHandler as any).cleanup = cleanup;

  // Emit flush and cleanup functions for external access via custom event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sync-flush-ready', {
      detail: { flush, cleanup }
    }));
  }

  return debouncedHandler;
}

export function replicateAppwrite<RxDocType>(
  options: SyncOptionsAppwrite<RxDocType>
): RxReplicationState<RxDocType, AppwriteCheckpointType> {
  addRxPlugin(RxDBLeaderElectionPlugin);

  const pullStream$ = new Subject<RxReplicationPullStreamItem<RxDocType, AppwriteCheckpointType>>();
  const collection: RxCollection<RxDocType> = options.collection;
  const primaryKey = collection.schema.primaryPath;
  const tablesDB = new TablesDB(options.client);

  const pullOptions: ReplicationPullOptions<RxDocType, AppwriteCheckpointType> | undefined = options.pull
    ? {
        batchSize: options.pull.batchSize || 25,
        stream$: pullStream$.asObservable(),
        async handler(lastPulledCheckpoint, batchSize) {
          const queries: string[] = [
            Query.equal('userId', options.userId),
            Query.orderAsc('$updatedAt'),
            Query.orderAsc('$id'),
            Query.limit(batchSize),
          ];

          if (lastPulledCheckpoint) {
            queries.unshift(
              Query.or([
                Query.greaterThan('$updatedAt', lastPulledCheckpoint.updatedAt),
                Query.and([
                  Query.equal('$updatedAt', lastPulledCheckpoint.updatedAt),
                  Query.greaterThan('$id', lastPulledCheckpoint.id),
                ]),
              ])
            );
          }

          const result = await tablesDB.listRows({
            databaseId: options.databaseId,
            tableId: options.tableId,
            queries,
          });

          const lastDoc = lastOfArray(result.rows);
          const newCheckpoint = lastDoc ? { id: lastDoc.$id, updatedAt: lastDoc.$updatedAt } : null;

          const documents = await Promise.all(
            result.rows.map((doc) => appwriteDocToRxDB(doc, primaryKey, options.deletedField, options.pull?.modifier))
          );

          return { checkpoint: newCheckpoint, documents };
        },
      }
    : undefined;

  // Create the base push handler
  const basePushHandler = async (rows: any[]): Promise<WithDeleted<RxDocType>[]> => {
    const conflicts: WithDeleted<RxDocType>[] = [];

    log(`🔄 Pushing ${rows.length} document(s) to server...`);

    for (const row of rows) {
      const docId = (row.newDocumentState as any)[primaryKey];
      const docToPush = await rxdbDocToAppwrite(
        row.newDocumentState,
        primaryKey,
        options.push?.modifier
      );

      try {
        if (row.assumedMasterState) {
          // UPDATE
          await tablesDB.updateRow({
            databaseId: options.databaseId,
            tableId: options.tableId,
            rowId: docId,
            data: docToPush,
          });
        } else {
          // INSERT
          const permissions = setPermissions(options.userId);
          await tablesDB.createRow({
            databaseId: options.databaseId,
            tableId: options.tableId,
            rowId: docId,
            data: docToPush,
            permissions,
          });
        }
      } catch (error: any) {
        if (error.code === 409) {
          // Conflict
          const serverDoc = await tablesDB.getRow({
            databaseId: options.databaseId,
            tableId: options.tableId,
            rowId: docId,
          });
          const conflictDoc = await appwriteDocToRxDB(
            serverDoc,
            primaryKey,
            options.deletedField,
            options.pull?.modifier
          );
          conflicts.push(conflictDoc);
        } else {
          log('ERR', 'Push failed for doc:', docId, error);
          conflicts.push(row.newDocumentState); // Treat as conflict to retry
        }
      }
    }

    log(`✅ Pushed ${rows.length - conflicts.length} document(s), ${conflicts.length} conflict(s)`);
    return conflicts;
  };

  const pushOptions: ReplicationPushOptions<RxDocType> | undefined = options.push
    ? {
        batchSize: options.push.batchSize || 25,
        handler:
          options.push.debounceMs && options.push.debounceMs > 0
            ? (() => {
                log(`✨ Creating debounced push handler with ${options.push.debounceMs}ms delay`);
                return createDebouncedPushHandler(
                  basePushHandler,
                  options.push.debounceMs,
                  (count) => {
                    log(`⏳ Pending changes: ${count}`);
                    // Emit pending count for UI
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(new CustomEvent('sync-pending-changes', { detail: count }));
                    }
                  }
                );
              })()
            : (() => {
                log('⚠️ Using immediate push handler (no debounce)');
                return basePushHandler;
              })(),
      }
    : undefined;

  const replicationState = new RxReplicationState<RxDocType, AppwriteCheckpointType>(
    options.replicationIdentifier,
    collection,
    options.deletedField,
    pullOptions,
    pushOptions,
    options.live,
    options.retryTime,
    options.autoStart
  );

  if (options.live && pullOptions) {
    const channel = `databases.${options.databaseId}.tables.${options.tableId}.rows`;

    const unsubscribe = options.client.subscribe(channel, async (response) => {
      const payload = response.payload as any;

      log('✅ Appwrite real-time event received:', payload);
      const doc = await appwriteDocToRxDB(payload, primaryKey, options.deletedField, options.pull?.modifier);

      pullStream$.next({
        documents: [doc],
        checkpoint: { id: payload.$id, updatedAt: payload.$updatedAt },
      });
    });

    replicationState.canceled$.subscribe(() => {
      log('Replication canceled, unsubscribing from Appwrite.');
      unsubscribe();
    });
  }

  startReplicationOnLeaderShip(options.waitForLeadership !== false, replicationState);
  return replicationState;
}
