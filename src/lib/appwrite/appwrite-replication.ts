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
import { Databases, Query, type Client } from 'appwrite';
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
  collectionId: string;
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
    if (!key.startsWith('$')) {
      cleanDoc[key] = appwriteDoc[key];
    }
  });

  cleanDoc[primaryKey] = appwriteDoc.$id;
  cleanDoc._deleted = appwriteDoc[deletedField] === true;

  if (deletedField !== '_deleted') {
    delete cleanDoc[deletedField];
  }

  if (modifier) return modifier(cleanDoc) as WithDeleted<RxDocType>;

  return cleanDoc as WithDeleted<RxDocType>;
}

// Helper to transform RxDB docs to Appwrite format
async function rxdbDocToAppwrite<RxDocType>(
  rxdbDoc: WithDeleted<RxDocType>,
  primaryKey: string,
  deletedField: string,
  modifier?: (doc: WithDeleted<RxDocType>) => any | Promise<any>
): Promise<any> {
  const writeDoc: any = flatClone(rxdbDoc);

  delete writeDoc._attachments;
  delete writeDoc._meta;
  delete writeDoc._rev;

  // The docId is implicitly used by Appwrite in the URL, not in the body.
  // We can remove it from the body to avoid confusion.
  delete writeDoc[primaryKey];

  writeDoc[deletedField] = writeDoc._deleted;
  if (deletedField !== '_deleted') {
    delete writeDoc._deleted;
  }

  if (modifier) {
    return modifier(writeDoc);
  }
  return writeDoc;
}

export function replicateAppwrite<RxDocType>(
  options: SyncOptionsAppwrite<RxDocType>
): RxReplicationState<RxDocType, AppwriteCheckpointType> {
  addRxPlugin(RxDBLeaderElectionPlugin);

  const pullStream$ = new Subject<RxReplicationPullStreamItem<RxDocType, AppwriteCheckpointType>>();
  const collection: RxCollection<RxDocType> = options.collection;
  const primaryKey = collection.schema.primaryPath;
  const databases = new Databases(options.client);

  const pullOptions: ReplicationPullOptions<RxDocType, AppwriteCheckpointType> | undefined = options.pull
    ? {
        batchSize: options.pull.batchSize || 25,
        stream$: pullStream$.asObservable(),
        async handler(lastPulledCheckpoint, batchSize) {
          const queries: string[] = [Query.orderAsc('$updatedAt'), Query.orderAsc('$id'), Query.limit(batchSize)];

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

          const result = await databases.listDocuments(options.databaseId, options.collectionId, queries);
          const lastDoc = lastOfArray(result.documents);
          const newCheckpoint = lastDoc ? { id: lastDoc.$id, updatedAt: lastDoc.$updatedAt } : null;

          const documents = await Promise.all(
            result.documents.map((doc) =>
              appwriteDocToRxDB(doc, primaryKey, options.deletedField, options.pull?.modifier)
            )
          );

          return { checkpoint: newCheckpoint, documents };
        },
      }
    : undefined;

  const pushOptions: ReplicationPushOptions<RxDocType> | undefined = options.push
    ? {
        batchSize: options.push.batchSize || 25,
        async handler(rows) {
          const conflicts: WithDeleted<RxDocType>[] = [];
          for (const row of rows) {
            const docId = (row.newDocumentState as any)[primaryKey];
            const docToPush = await rxdbDocToAppwrite(
              row.newDocumentState,
              primaryKey,
              options.deletedField,
              options.push?.modifier
            );

            try {
              if (row.assumedMasterState) {
                // UPDATE
                await databases.updateDocument(options.databaseId, options.collectionId, docId, docToPush);
              } else {
                // INSERT
                const permissions = setPermissions(options.userId);
                await databases.createDocument(options.databaseId, options.collectionId, docId, docToPush, permissions);
              }
            } catch (error: any) {
              if (error.code === 409) {
                // Conflict
                const serverDoc = await databases.getDocument(options.databaseId, options.collectionId, docId);
                const conflictDoc = await appwriteDocToRxDB(
                  serverDoc,
                  primaryKey,
                  options.deletedField,
                  options.pull?.modifier
                );
                conflicts.push(conflictDoc);
              } else {
                console.error('Push failed for doc:', docId, error);
                conflicts.push(row.newDocumentState); // Treat as conflict to retry
              }
            }
          }
          return conflicts;
        },
      }
    : undefined;

  const replicationState = new RxReplicationState<RxDocType, AppwriteCheckpointType>(
    options.replicationIdentifier,
    collection,
    options.deletedField, // Reverted to use your specified deleted field
    pullOptions,
    pushOptions,
    options.live,
    options.retryTime,
    options.autoStart
  );

  if (options.live && pullOptions) {
    const channel = `databases.${options.databaseId}.collections.${options.collectionId}.documents`;

    const unsubscribe = options.client.subscribe(channel, async (response) => {
      const payload = response.payload as any;

      console.log('✅ Appwrite real-time event received:', payload);
      const doc = await appwriteDocToRxDB(payload, primaryKey, options.deletedField, options.pull?.modifier);

      pullStream$.next({
        documents: [doc],
        checkpoint: { id: payload.$id, updatedAt: payload.$updatedAt },
      });
    });

    // FIX: Changed .canceled to .canceled$
    replicationState.canceled$.subscribe(() => {
      console.log('Replication canceled, unsubscribing from Appwrite.');
      unsubscribe();
    });
  }

  startReplicationOnLeaderShip(options.waitForLeadership !== false, replicationState);
  return replicationState;
}
