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
import { setPermissions } from './api';

// Types for our implementation
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
        initialCheckpoint?: AppwriteCheckpointType;
        modifier?: (doc: any) => RxDocType | Promise<RxDocType>;
    };
    push?: {
        batchSize?: number;
        modifier?: (doc: WithDeleted<RxDocType>) => any | Promise<any>;
    };
};

// Enhanced error handling
class AppwriteReplicationError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'AppwriteReplicationError';
    }
}

// Helper functions with improved error handling and data transformation
async function appwriteDocToRxDB<RxDocType>(
    appwriteDoc: any,
    primaryKey: string,
    deletedField: string,
    modifier?: (doc: any) => RxDocType | Promise<RxDocType>
): Promise<WithDeleted<RxDocType>> {
    try {
        // Create a clean document object
        const cleanDoc: any = {};
        
        // Copy all non-meta fields
        Object.keys(appwriteDoc).forEach(key => {
            if (!key.startsWith('$')) {
                cleanDoc[key] = appwriteDoc[key];
            }
        });
        
        // Set the primary key to Appwrite's $id
        cleanDoc[primaryKey] = appwriteDoc.$id;
        
        // Handle deletion field
        const isDeleted = appwriteDoc[deletedField] === true || appwriteDoc[deletedField] === 1;
        cleanDoc._deleted = isDeleted;
        
        // Remove the original deleted field if it's different from _deleted
        if (deletedField !== '_deleted') {
            delete cleanDoc[deletedField];
        }

        // Apply modifier if provided
        let finalDoc = cleanDoc;
        if (modifier) {
            finalDoc = await modifier(cleanDoc);
            // Ensure the modifier preserves essential fields
            if (!finalDoc[primaryKey]) {
                finalDoc[primaryKey] = appwriteDoc.$id;
            }
            finalDoc._deleted = isDeleted;
        }

        return finalDoc as WithDeleted<RxDocType>;
    } catch (error) {
        throw new AppwriteReplicationError(
            `Failed to transform Appwrite document to RxDB: ${error}`,
            error
        );
    }
}

async function rxdbDocToAppwrite<RxDocType>(
    rxdbDoc: WithDeletedAndAttachments<RxDocType>,
    primaryKey: string,
    deletedField: string,
    modifier?: (doc: WithDeleted<RxDocType>) => any | Promise<any>
): Promise<any> {
    try {
        // Clone the document to avoid mutations
        const writeDoc: any = flatClone(rxdbDoc);
        
        // Remove RxDB-specific fields
        delete writeDoc._attachments;
        delete writeDoc._meta;
        delete writeDoc._rev;
        
        // Remove the primary key as Appwrite uses $id
        const docId = writeDoc[primaryKey];
        delete writeDoc[primaryKey];
        
        // Handle deletion field
        const isDeleted = writeDoc._deleted === true;
        writeDoc[deletedField] = isDeleted;
        
        // Remove _deleted field if using custom deletion field
        if (deletedField !== '_deleted') {
            delete writeDoc._deleted;
        }

        // Apply modifier if provided
        if (modifier) {
            const modifiedDoc = await modifier(writeDoc as WithDeleted<RxDocType>);
            // Ensure the modifier preserves the deletion state
            if (deletedField !== '_deleted') {
                modifiedDoc[deletedField] = isDeleted;
            } else {
                modifiedDoc._deleted = isDeleted;
            }
            return { docId, data: modifiedDoc };
        }

        return { docId, data: writeDoc };
    } catch (error) {
        throw new AppwriteReplicationError(
            `Failed to transform RxDB document to Appwrite: ${error}`,
            error
        );
    }
}

export class RxAppwriteReplicationState<RxDocType> extends RxReplicationState<RxDocType, AppwriteCheckpointType> {
    private unsubscribe: (() => void) | null = null;

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

    // Override cancel to properly cleanup subscriptions
    async cancel(): Promise<void> {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
        return super.cancel();
    }
}

export function replicateAppwrite<RxDocType>(
    options: SyncOptionsAppwrite<RxDocType>
): RxAppwriteReplicationState<RxDocType> {
    const collection: RxCollection<RxDocType> = options.collection;
    const primaryKey = collection.schema.primaryPath;
    const pullStream$: Subject<RxReplicationPullStreamItem<RxDocType, AppwriteCheckpointType>> = new Subject();

    addRxPlugin(RxDBLeaderElectionPlugin);
    
    // Set defaults
    options.live = options.live !== false;
    options.deletedField = options.deletedField || '_deleted';
    options.waitForLeadership = options.waitForLeadership !== false;

    const databases = new Databases(options.client);

    // Enhanced pull replication with better error handling
    const replicationPrimitivesPull: ReplicationPullOptions<RxDocType, AppwriteCheckpointType> | undefined = options.pull ? {
        batchSize: options.pull.batchSize || 25,
        stream$: pullStream$.asObservable(),
        initialCheckpoint: options.pull.initialCheckpoint,
        handler: async (
            lastPulledCheckpoint: AppwriteCheckpointType | undefined,
            batchSize: number
        ) => {
            try {
                const queries: string[] = [];
                
                // Build checkpoint query
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
                
                // Add ordering and limit
                queries.push(Query.orderAsc('$updatedAt'));
                queries.push(Query.orderAsc('$id'));
                queries.push(Query.limit(batchSize));

                const result = await databases.listDocuments(
                    options.databaseId,
                    options.collectionId,
                    queries
                );

                // Calculate new checkpoint
                const lastDoc = lastOfArray(result.documents);
                const newCheckpoint: AppwriteCheckpointType | null = lastDoc ? {
                    id: lastDoc.$id,
                    updatedAt: lastDoc.$updatedAt
                } : null;

                // Transform documents with better error handling
                const resultDocs: WithDeleted<RxDocType>[] = [];
                for (const doc of result.documents) {
                    try {
                        const transformedDoc = await appwriteDocToRxDB<RxDocType>(
                            doc,
                            primaryKey,
                            options.deletedField,
                            options.pull?.modifier
                        );
                        resultDocs.push(transformedDoc);
                    } catch (error) {
                        console.error(`Failed to transform document ${doc.$id}:`, error);
                        // Continue with other documents instead of failing completely
                    }
                }

                return {
                    checkpoint: newCheckpoint,
                    documents: resultDocs
                };
            } catch (error) {
                throw new AppwriteReplicationError(`Pull replication failed: ${error}`, error);
            }
        }
    } : undefined;

    // Enhanced push replication with improved conflict resolution
    const replicationPrimitivesPush: ReplicationPushOptions<RxDocType> | undefined = options.push ? {
        batchSize: options.push.batchSize || 25,
        async handler(rows: RxReplicationWriteToMasterRow<RxDocType>[]) {
            try {
                const nonInsertRows = rows.filter(row => row.assumedMasterState);
                const updateDocsInDbById = new Map<string, RxDocType>();

                // Fetch existing documents for conflict detection
                if (nonInsertRows.length > 0) {
                    const docIds = nonInsertRows.map(row => {
                        return (row.newDocumentState as any)[primaryKey];
                    });

                    // Build query for existing documents
                    const query = docIds.length === 1 
                        ? Query.equal('$id', docIds[0])
                        : Query.or(docIds.map(id => Query.equal('$id', id)));

                    try {
                        const updateDocsOnServer = await databases.listDocuments(
                            options.databaseId,
                            options.collectionId,
                            [query]
                        );

                        // Transform server documents
                        for (const doc of updateDocsOnServer.documents) {
                            try {
                                const docDataInDb = await appwriteDocToRxDB<RxDocType>(
                                    doc, 
                                    primaryKey, 
                                    options.deletedField,
                                    options.pull?.modifier
                                );
                                updateDocsInDbById.set(doc.$id, docDataInDb);
                            } catch (error) {
                                console.error(`Failed to transform server document ${doc.$id}:`, error);
                            }
                        }
                    } catch (error) {
                        console.error('Failed to fetch existing documents:', error);
                    }
                }

                const conflicts: WithDeleted<RxDocType>[] = [];

                // Process each row
                for (const writeRow of rows) {
                    const docId = (writeRow.newDocumentState as any)[primaryKey];

                    try {
                        if (!writeRow.assumedMasterState) {
                            // INSERT operation
                            const { data: insertDoc } = await rxdbDocToAppwrite<RxDocType>(
                                writeRow.newDocumentState,
                                primaryKey,
                                options.deletedField,
                                options.push?.modifier
                            );

                            try {
                                const permissions = setPermissions(options.userId);
                                await databases.createDocument(
                                    options.databaseId,
                                    options.collectionId,
                                    docId,
                                    insertDoc,
                                    permissions
                                );
                            } catch (err: any) {
                                // Handle document already exists conflict
                                if (err.code === 409) {
                                    try {
                                        const docOnServer = await databases.getDocument(
                                            options.databaseId,
                                            options.collectionId,
                                            docId
                                        );
                                        const conflictDoc = await appwriteDocToRxDB<RxDocType>(
                                            docOnServer,
                                            primaryKey,
                                            options.deletedField,
                                            options.pull?.modifier
                                        );
                                        conflicts.push(conflictDoc);
                                    } catch (fetchError) {
                                        console.error(`Failed to fetch conflicted document ${docId}:`, fetchError);
                                    }
                                } else {
                                    throw err;
                                }
                            }
                        } else {
                            // UPDATE operation
                            const docInDb = updateDocsInDbById.get(docId);
                            
                            if (!docInDb || !collection.conflictHandler.isEqual(
                                docInDb as any, 
                                writeRow.assumedMasterState, 
                                'appwrite-push'
                            )) {
                                // Conflict detected
                                if (docInDb) {
                                    conflicts.push(docInDb as any);
                                }
                            } else {
                                // No conflict, proceed with update
                                const { data: updateDoc } = await rxdbDocToAppwrite<RxDocType>(
                                    writeRow.newDocumentState,
                                    primaryKey,
                                    options.deletedField,
                                    options.push?.modifier
                                );

                                await databases.updateDocument(
                                    options.databaseId,
                                    options.collectionId,
                                    docId,
                                    updateDoc
                                );
                            }
                        }
                    } catch (error) {
                        console.error(`Failed to process document ${docId}:`, error);
                        // Add the local document as conflict to prevent data loss
                        conflicts.push(writeRow.newDocumentState as WithDeleted<RxDocType>);
                    }
                }

                return conflicts;
            } catch (error) {
                throw new AppwriteReplicationError(`Push replication failed: ${error}`, error);
            }
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

    // Enhanced live subscription with better error handling
    if (options.live && options.pull) {
        const originalStart = replicationState.start.bind(replicationState);
        const originalCancel = replicationState.cancel.bind(replicationState);

        replicationState.start = () => {
            const channel = `databases.${options.databaseId}.collections.${options.collectionId}.documents`;

            try {
                const unsubscribe = options.client.subscribe(
                    channel,
                    async (response) => {
                        try {
                            const payload = response.payload as any;
                            const docData = await appwriteDocToRxDB<RxDocType>(
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
                        } catch (error) {
                            console.error('Real-time sync error:', error);
                            // Don't break the subscription on individual document errors
                        }
                    }
                );

                // Store unsubscribe function for proper cleanup
                (replicationState as any).unsubscribe = unsubscribe;

                // Override cancel to include subscription cleanup
                replicationState.cancel = async () => {
                    unsubscribe();
                    return originalCancel();
                };

                return originalStart();
            } catch (error) {
                console.error('Failed to start real-time subscription:', error);
                // Fall back to original start without real-time
                return originalStart();
            }
        };
    }

    startReplicationOnLeaderShip(options.waitForLeadership, replicationState);
    return replicationState;
}