/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    RxCollection,
    WithDeleted,
    WithDeletedAndAttachments,
    RxReplicationPullStreamItem,
    RxReplicationWriteToMasterRow,
    ReplicationOptions,
    ReplicationPullOptions,
    ReplicationPushOptions
} from 'rxdb';
import { RxReplicationState, startReplicationOnLeaderShip } from 'rxdb/plugins/replication';
import { addRxPlugin } from 'rxdb';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { Databases, Query, type Client } from 'appwrite';
import { flatClone } from 'rxdb/plugins/utils';
import { Subject } from 'rxjs';
import { lastOfArray } from 'rxdb/plugins/utils';
import { getFromMapOrThrow } from 'rxdb/plugins/utils';

//  types for our implementation
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
    client: Client;
    deletedField: string;
    pull?: {
        batchSize?: number;
        initialCheckpoint?: AppwriteCheckpointType;
        modifier?: (doc: any) => RxDocType;
    };
    push?: {
        batchSize?: number;
        modifier?: (doc: WithDeleted<RxDocType>) => any;
    };
};

// Helper functions
function appwriteDocToRxDB<RxDocType>(
    appwriteDoc: any,
    primaryKey: string,
    deletedField: string,
    modifier?: (doc: any) => RxDocType
): WithDeleted<RxDocType> {
    // Apply modifier first if provided
    if (modifier) {
        const modifiedDoc = modifier(appwriteDoc);
        return {
            ...modifiedDoc,
            _deleted: appwriteDoc[deletedField] || false
        } as WithDeleted<RxDocType>;
    }

    // Default transformation
    const useDoc: any = {};
    Object.keys(appwriteDoc).forEach(key => {
        if (!key.startsWith('$')) {
            useDoc[key] = appwriteDoc[key];
        }
    });
    useDoc[primaryKey] = appwriteDoc.$id;
    useDoc._deleted = appwriteDoc[deletedField] || false;
    if (deletedField !== '_deleted') {
        delete useDoc[deletedField];
    }
    return useDoc;
}

function rxdbDocToAppwrite<RxDocType>(
    rxdbDoc: WithDeletedAndAttachments<RxDocType>,
    primaryKey: string,
    deletedField: string,
    modifier?: (doc: WithDeleted<RxDocType>) => any
) {
    // Apply modifier first if provided
    if (modifier) {
        console.log('🔄 Applying push modifier to doc:', rxdbDoc);
        const modifiedDoc = modifier(rxdbDoc as WithDeleted<RxDocType>);
        console.log('✅ Modified doc result:', modifiedDoc);
        return modifiedDoc;
    }

    // Default transformation
    const writeDoc: any = flatClone(rxdbDoc);
    delete (writeDoc as WithDeletedAndAttachments<RxDocType>)._attachments;
    delete writeDoc[primaryKey];
    writeDoc[deletedField] = writeDoc._deleted;
    if (deletedField !== '_deleted') {
        delete writeDoc._deleted;
    }
    return writeDoc;
}

export class RxAppwriteReplicationState<RxDocType> extends RxReplicationState<RxDocType, AppwriteCheckpointType> {
    constructor(
        public readonly replicationIdentifierHash: string,
        public readonly collection: RxCollection<RxDocType>,
        public readonly pull?: ReplicationPullOptions<RxDocType, AppwriteCheckpointType>,
        public readonly push?: ReplicationPushOptions<RxDocType>,
        public readonly live: boolean = true,
        public retryTime: number = 1000 * 5,
        public autoStart: boolean = true
    ) {
        super(
            replicationIdentifierHash,
            collection,
            '_deleted',
            pull,
            push,
            live,
            retryTime,
            autoStart
        );
    }
}

export function replicateAppwrite<RxDocType>(
    options: SyncOptionsAppwrite<RxDocType>
): RxAppwriteReplicationState<RxDocType> {
    const collection: RxCollection<RxDocType> = options.collection;
    const primaryKey = collection.schema.primaryPath;
    const pullStream$: Subject<RxReplicationPullStreamItem<RxDocType, AppwriteCheckpointType>> = new Subject();

    addRxPlugin(RxDBLeaderElectionPlugin);
    options.live = typeof options.live === 'undefined' ? true : options.live;
    options.deletedField = options.deletedField ? options.deletedField : '_deleted';
    options.waitForLeadership = typeof options.waitForLeadership === 'undefined' ? true : options.waitForLeadership;

    const databases = new Databases(options.client);

    // Pull replication setup
    const replicationPrimitivesPull: ReplicationPullOptions<RxDocType, AppwriteCheckpointType> | undefined = options.pull ? {
        batchSize: options.pull.batchSize || 25,
        stream$: pullStream$.asObservable(),
        initialCheckpoint: options.pull.initialCheckpoint,
        handler: async (
            lastPulledCheckpoint: AppwriteCheckpointType | undefined,
            batchSize: number
        ) => {
            console.log('🔄 Pull handler called with checkpoint:', lastPulledCheckpoint);

            const queries: string[] = [];
            if (lastPulledCheckpoint) {
                queries.push(
                    Query.or([
                        Query.greaterThan('$updatedAt', lastPulledCheckpoint.updatedAt),
                        Query.and([
                            Query.equal('$updatedAt', lastPulledCheckpoint.updatedAt),
                            Query.greaterThan('$id', lastPulledCheckpoint.id)
                        ])
                    ])
                );
            }
            queries.push(Query.orderAsc('$updatedAt'));
            queries.push(Query.orderAsc('$id'));
            queries.push(Query.limit(batchSize));

            const result = await databases.listDocuments(
                options.databaseId,
                options.collectionId,
                queries
            );

            console.log('📥 Pulled documents from Appwrite:', result.documents.length);

            const lastDoc = lastOfArray(result.documents);
            const newCheckpoint: AppwriteCheckpointType | null = lastDoc ? {
                id: lastDoc.$id,
                updatedAt: lastDoc.$updatedAt
            } : null;

            const resultDocs: WithDeleted<RxDocType>[] = result.documents.map(doc => {
                console.log('🔄 Processing pulled doc:', doc.$id);
                return appwriteDocToRxDB<RxDocType>(
                    doc,
                    primaryKey,
                    options.deletedField,
                    options.pull?.modifier
                );
            });

            console.log('✅ Transformed docs for RxDB:', resultDocs);

            return {
                checkpoint: newCheckpoint,
                documents: resultDocs
            };
        }
    } : undefined;

    // Push replication setup
    const replicationPrimitivesPush: ReplicationPushOptions<RxDocType> | undefined = options.push ? {
        batchSize: options.push.batchSize || 25,
        async handler(rows: RxReplicationWriteToMasterRow<RxDocType>[]) {
            console.log('📤 Push handler called with rows:', rows.length);

            const nonInsertRows = rows.filter(row => row.assumedMasterState);
            const updateDocsInDbById = new Map<string, RxDocType>();

            // Pre-fetch documents for updates to check conflicts
            if (nonInsertRows.length > 0) {
                let query: string;
                if (nonInsertRows.length > 1) {
                    query = Query.or(
                        nonInsertRows.map(row => {
                            const id: string = (row.newDocumentState as any)[primaryKey];
                            return Query.equal('$id', id);
                        })
                    );
                } else {
                    const id: string = (nonInsertRows[0].newDocumentState as any)[primaryKey];
                    query = Query.equal('$id', id);
                }

                const updateDocsOnServer = await databases.listDocuments(
                    options.databaseId,
                    options.collectionId,
                    [query]
                );

                updateDocsOnServer.documents.forEach(doc => {
                    const docDataInDb = appwriteDocToRxDB<RxDocType>(doc, primaryKey, options.deletedField);
                    const docId: string = doc.$id;
                    (docDataInDb as any)[primaryKey] = docId;
                    updateDocsInDbById.set(docId, docDataInDb);
                });
            }

            const conflicts: WithDeleted<RxDocType>[] = [];

            await Promise.all(
                rows.map(async (writeRow) => {
                    const docId = (writeRow.newDocumentState as any)[primaryKey];
                    console.log(`🔄 Processing ${writeRow.assumedMasterState ? 'UPDATE' : 'INSERT'} for doc:`, docId);

                    if (!writeRow.assumedMasterState) {
                        // INSERT
                        const insertDoc = rxdbDocToAppwrite<RxDocType>(
                            writeRow.newDocumentState,
                            primaryKey,
                            options.deletedField,
                            options.push?.modifier
                        );

                        console.log('📤 Inserting doc to Appwrite:', insertDoc);

                        try {
                            await databases.createDocument(
                                options.databaseId,
                                options.collectionId,
                                docId,
                                insertDoc
                            );
                            console.log('✅ Insert successful for doc:', docId);
                        } catch (err: any) {
                            if (err.code === 409 && err.name === 'AppwriteException') {
                                console.log('⚠️ Insert conflict detected for doc:', docId);
                                const docOnServer = await databases.getDocument(
                                    options.databaseId,
                                    options.collectionId,
                                    docId
                                );
                                const docOnServerData = appwriteDocToRxDB<RxDocType>(
                                    docOnServer,
                                    primaryKey,
                                    options.deletedField,
                                    options.pull?.modifier
                                );
                                conflicts.push(docOnServerData);
                            } else {
                                throw err;
                            }
                        }
                    } else {
                        // UPDATE
                        const docInDb: RxDocType = getFromMapOrThrow(updateDocsInDbById, docId);
                        if (
                            !writeRow.assumedMasterState ||
                            collection.conflictHandler.isEqual(docInDb as any, writeRow.assumedMasterState, '-appwrite-push') === false
                        ) {
                            console.log('⚠️ Update conflict detected for doc:', docId);
                            conflicts.push(docInDb as any);
                        } else {
                            const updateDoc = rxdbDocToAppwrite<RxDocType>(
                                writeRow.newDocumentState,
                                primaryKey,
                                options.deletedField,
                                options.push?.modifier
                            );

                            console.log('📤 Updating doc in Appwrite:', updateDoc);

                            await databases.updateDocument(
                                options.databaseId,
                                options.collectionId,
                                docId,
                                updateDoc
                            );
                            console.log('✅ Update successful for doc:', docId);
                        }
                    }
                })
            );

            console.log('📤 Push completed. Conflicts:', conflicts.length);
            return conflicts;
        }
    } : undefined;

    const replicationState = new RxAppwriteReplicationState<RxDocType>(
        options.replicationIdentifier,
        collection,
        replicationPrimitivesPull,
        replicationPrimitivesPush,
        options.live,
        options.retryTime,
        options.autoStart
    );

    // Live subscription for real-time updates
    if (options.live && options.pull) {
        const startBefore = replicationState.start.bind(replicationState);
        const cancelBefore = replicationState.cancel.bind(replicationState);

        replicationState.start = () => {
            const channel = 'databases.' + options.databaseId + '.collections.' + options.collectionId + '.documents';
            console.log('🔔 Setting up live subscription for channel:', channel);

            const unsubscribe = options.client.subscribe(
                channel,
                (response) => {
                    const payload = response.payload as any;
                    console.log('🔔 Live update received:', payload.$id);
                    const docData = appwriteDocToRxDB<RxDocType>(
                        payload,
                        primaryKey,
                        options.deletedField,
                        options.pull?.modifier
                    );
                    pullStream$.next({
                        checkpoint: {
                            id: (docData as any)[primaryKey],
                            updatedAt: payload.$updatedAt
                        },
                        documents: [docData]
                    });
                }
            );

            replicationState.cancel = () => {
                console.log('🛑 Cancelling live subscription');
                unsubscribe();
                return cancelBefore();
            };

            return startBefore();
        };
    }

    startReplicationOnLeaderShip(options.waitForLeadership, replicationState);
    return replicationState;
}