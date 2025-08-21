import client, { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { replicateAppwrite, RxAppwriteReplicationState } from '@/lib/appwrite/replication';
import { getWatchfolioDB } from './database';

type SyncStatus = 'offline' | 'connecting' | 'online' | 'syncing' | 'error' | 'conflict';

// ===== REPLICATION STATE =====

export let syncStatus: SyncStatus = 'offline';
const replicationStates = new Map<string, RxAppwriteReplicationState<LibraryMedia>>();
const currentActiveStates = new Map<string, boolean>();

// Enhanced state management
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;
let currentUserId: string | null = null;
let isDestroyed = false;

// Error retry mechanism
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // Progressive backoff

// ===== ENHANCED REPLICATION SETUP =====

export const startReplication = async (userId: string, library: LibraryMedia['library']): Promise<void> => {
    // Validate inputs
    if (!userId?.trim()) {
        throw new Error('User ID is required to start replication');
    }

    if (isDestroyed) {
        throw new Error('Replication has been destroyed');
    }

    // Quick return if same user and already active
    if (currentUserId === userId && replicationStates.size > 0 && !isInitializing) {
        console.log('✅ Replication already active for user:', userId);
        return;
    }

    // If different user, stop existing replication first
    if (currentUserId && currentUserId !== userId && replicationStates.size > 0) {
        console.log('🔄 Switching user, stopping existing replication');
        await stopReplication();
    }

    // If already initializing for this user, wait for it
    if (isInitializing && initializationPromise && currentUserId === userId) {
        console.log('⏳ Replication initialization in progress, waiting...');
        return initializationPromise;
    }

    // Set initialization state
    isInitializing = true;
    currentUserId = userId;
    syncStatus = 'connecting';

    initializationPromise = initializeReplication(userId, library);

    try {
        await initializationPromise;
    } catch (error) {
        currentUserId = null;
        syncStatus = 'error';
        throw error;
    } finally {
        isInitializing = false;
        initializationPromise = null;
    }
};

const initializeReplication = async (userId: string, library: LibraryMedia['library']): Promise<void> => {
    let retryCount = 0;

    while (retryCount <= MAX_RETRIES) {
        try {
            console.log(`🔄 Starting Watchfolio replication for user: ${userId} (attempt ${retryCount + 1})`);

            const db = await getWatchfolioDB();

            const libraryItemsReplication = replicateAppwrite({
                replicationIdentifier: `watchfolio-library-items-${userId}`,
                client,
                databaseId: DATABASE_ID,
                collectionId: COLLECTIONS.LIBRARY_MEDIA,
                userId,
                deletedField: 'deleted',
                collection: db.libraryMedia,
                waitForLeadership: true,
                retryTime: 5000,
                autoStart: true,
                pull: {
                    batchSize: 25,
                    modifier: (doc) => {
                        // Ensure proper data structure for local storage
                        return {
                            ...doc,
                            // Ensure required fields are present
                            status: doc.status || 'none',
                            isFavorite: doc.isFavorite || false,
                            addedAt: doc.addedAt || new Date().toISOString(),
                            lastUpdatedAt: doc.lastUpdatedAt || new Date().toISOString(),
                        };
                    }
                },
                push: {
                    batchSize: 25,
                    modifier: (doc) => {
                        // Ensure library relationship is included when pushing
                        const cleanDoc = {
                            ...doc,
                            library: library?.$id || null,
                            // Ensure dates are properly formatted
                            lastUpdatedAt: new Date().toISOString()
                        };

                        // Remove any undefined values that might cause issues
                        Object.keys(cleanDoc).forEach(key => {
                            if (cleanDoc[key] === undefined) {
                                delete cleanDoc[key];
                            }
                        });

                        return cleanDoc;
                    },
                },
            });

            // Enhanced error handling
            libraryItemsReplication.error$.subscribe((error) => {
                console.error('🚨 Library items replication error:', error);
                syncStatus = 'error';

                // Attempt auto-recovery for certain types of errors
                if (isRecoverableError(error)) {
                    console.log('🔧 Attempting auto-recovery...');
                    setTimeout(() => {
                        if (replicationStates.has('libraryItems')) {
                            libraryItemsReplication.reSync()
                        }
                    }, 10000);
                }
            });

            // Enhanced activity monitoring
            libraryItemsReplication.active$.subscribe((active) => {
                console.log(`🔄 Library items replication ${active ? 'active' : 'inactive'}`);
                currentActiveStates.set('libraryItems', active);
                updateSyncStatus();
            });

            // Monitor replication events for better status tracking
            libraryItemsReplication.received$.subscribe((received) => {
                console.log(`📥 Received ${received} documents from server`);
            });

            libraryItemsReplication.sent$.subscribe((sent) => {
                console.log(`📤 Sent ${sent} documents to server`);
            });

           

            // Store replication state
            replicationStates.set('libraryItems', libraryItemsReplication);

            syncStatus = 'online';
            console.log('✅ Watchfolio replication started successfully');
            return; // Success, exit retry loop

        } catch (error) {
            console.error(`❌ Replication setup error (attempt ${retryCount + 1}):`, error);

            retryCount++;
            if (retryCount <= MAX_RETRIES) {
                const delay = RETRY_DELAYS[Math.min(retryCount - 1, RETRY_DELAYS.length - 1)];
                console.log(`⏳ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                syncStatus = 'error';
                throw new Error(`Failed to initialize replication after ${MAX_RETRIES} attempts: ${error}`);
            }
        }
    }
};

// Helper function to determine if an error is recoverable
const isRecoverableError = (error: Error): boolean => {
    if (!error) return false;

    const recoverableErrorTypes = [
        'network',
        'timeout',
        'connection',
        'rate_limit'
    ];

    const errorMessage = error.message?.toLowerCase() || '';
    return recoverableErrorTypes.some(type => errorMessage.includes(type));
};

export const stopReplication = async (): Promise<void> => {
    try {
        // Wait for any ongoing initialization
        if (isInitializing && initializationPromise) {
            console.log('⏳ Waiting for initialization to complete before stopping...');
            try {
                await initializationPromise;
            } catch {
                // Ignore initialization errors when stopping
            }
        }

        if (replicationStates.size === 0) {
            console.log('✅ Replication already stopped');
            return;
        }

        console.log('🛑 Stopping Watchfolio replication...');

        const stopPromises = Array.from(replicationStates.entries()).map(async ([name, replication]) => {
            try {
                await replication.cancel();
                console.log(`🛑 Stopped ${name} replication`);
            } catch (error) {
                console.error(`❌ Error stopping ${name} replication:`, error);
            }
        });

        await Promise.all(stopPromises);

        // Clear state
        replicationStates.clear();
        currentActiveStates.clear();
        currentUserId = null;
        syncStatus = 'offline';

        console.log('✅ All replications stopped');
    } catch (error) {
        console.error('❌ Stop replication error:', error);
        // Force clear state even if stopping failed
        replicationStates.clear();
        currentActiveStates.clear();
        currentUserId = null;
        syncStatus = 'error';
        throw error;
    }
};

export const triggerSync = async (): Promise<void> => {
    if (replicationStates.size === 0) {
        throw new Error('Replication not initialized');
    }

    try {
        console.log('🔄 Triggering manual sync...');
        const previousStatus = syncStatus;
        syncStatus = 'syncing';

        const syncPromises = Array.from(replicationStates.values()).map(async (replication) => {
            try {
                await replication.reSync();
            } catch (error) {
                console.error('❌ Manual sync error for replication:', error);
                throw error;
            }
        });

        await Promise.all(syncPromises);

        // Restore previous status or set to online if it was offline
        syncStatus = previousStatus === 'offline' ? 'online' : previousStatus;
        console.log('✅ Manual sync completed');
    } catch (error) {
        console.error('❌ Manual sync failed:', error);
        syncStatus = 'error';
        throw error;
    }
};

export const destroyReplication = async (): Promise<void> => {
    isDestroyed = true;
    await stopReplication();
    console.log('🗑️ Replication system destroyed');
};

// ===== UTILITY FUNCTIONS =====

const updateSyncStatus = (): void => {
    if (syncStatus === 'error' || syncStatus === 'conflict') {
        return; // Don't override error/conflict states
    }

    const hasActiveReplication = Array.from(currentActiveStates.values())
        .some(isActive => isActive);

    syncStatus = hasActiveReplication ? 'syncing' : 'online';
};

// ===== ENHANCED GETTERS =====

export const getSyncStatus = (): SyncStatus => syncStatus;

export const getActiveReplications = (): number => replicationStates.size;

export const isReplicationActive = (): boolean => {
    return Array.from(currentActiveStates.values()).some(isActive => isActive);
};

export const isReplicationInitializing = (): boolean => isInitializing;

export const getCurrentUserId = (): string | null => currentUserId;

export const getReplicationHealth = () => {
    return {
        status: syncStatus,
        activeReplications: getActiveReplications(),
        isInitializing: isInitializing,
        currentUserId: currentUserId,
        isDestroyed: isDestroyed,
        hasActiveSync: isReplicationActive()
    };
};

// ===== SYNC RECOVERY =====

export const recoverSync = async (): Promise<void> => {
    if (!currentUserId) {
        throw new Error('No user to recover sync for');
    }

    console.log('🔧 Attempting sync recovery...');

    try {
        await stopReplication();
        // Get current library from auth store - you might need to adjust this
        // const library = getCurrentLibrary(); 
        // await startReplication(currentUserId, library);
    } catch (error) {
        console.error('❌ Sync recovery failed:', error);
        throw error;
    }
};