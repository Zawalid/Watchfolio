import { Query } from 'appwrite';
import { appwriteService } from './appwrite';

// Types for mapping between local and cloud data
export type SyncOperation = {
  type: 'create' | 'update' | 'delete';
  key: string; // media key like "movie-123"
  data?: LibraryMedia;
  timestamp: string;
};

export type SyncQueue = SyncOperation[];

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingOperations: number;
  error: string | null;
}

// Map LibraryMedia to Appwrite LibraryItem + TmdbMedia
const mapToAppwriteData = async (
  media: LibraryMedia
): Promise<{
  tmdbMedia: CreateTmdbMediaInput;
  libraryItem: Omit<CreateLibraryItemInput, 'libraryId' | 'mediaId'>;
}> => {
  return {
    tmdbMedia: {
      id: media.id,
      mediaType: media.media_type,
      title: media.title || '',
      overview: undefined,
      posterPath: media.posterPath || undefined,
      releaseDate: media.releaseDate || undefined,
      genres: media.genres || [],
      rating: media.rating || undefined,
    },
    libraryItem: {
      status: media.status,
      isFavorite: media.isFavorite,
      userRating: media.userRating || undefined,
      notes: media.notes || undefined,
      addedAt: media.addedToLibraryAt,
    },
  };
};

// Map Appwrite data back to LibraryMedia
const mapFromAppwriteData = (libraryItem: LibraryItem, tmdbMedia?: TmdbMedia): LibraryMedia => {
  return {
    id: tmdbMedia?.id || 0,
    media_type: tmdbMedia?.mediaType || 'movie',
    title: tmdbMedia?.title,
    posterPath: tmdbMedia?.posterPath || undefined,
    releaseDate: tmdbMedia?.releaseDate || undefined,
    genres: tmdbMedia?.genres || [],
    rating: tmdbMedia?.rating || undefined,
    status: libraryItem.status,
    isFavorite: libraryItem.isFavorite,
    userRating: libraryItem.userRating || undefined,
    notes: libraryItem.notes || undefined,
    addedToLibraryAt: libraryItem.addedAt || new Date().toISOString(),
    lastUpdatedAt: libraryItem.$updatedAt,
  };
};

/**
 * Sync API Class - handles all cloud sync operations using Appwrite Service
 * Integrated with user authentication (no anonymous sessions)
 */
export class LibrarySyncAPI {
  private libraryId: string | null = null;

  /**
   * Get or create library for authenticated user
   * Returns null if user is not authenticated (local-only mode)
   */
  private async getOrCreateLibrary(): Promise<string | null> {
    try {
      // Get current authenticated user
      const currentUser = await appwriteService.auth.getCurrentUser();
      if (!currentUser) {
        // No authenticated user - local-only mode
        return null;
      }

      // Check if we already have the library ID cached
      if (this.libraryId) return this.libraryId;

      // Look for existing library for this user
      const libraries = await appwriteService.libraries.list([Query.equal('user', currentUser.$id), Query.limit(1)]);

      if (libraries.documents.length > 0) {
        this.libraryId = libraries.documents[0].$id;
        return this.libraryId;
      } // Create new library for user
      const library = await appwriteService.libraries.create({
        user: currentUser.$id,
      } as CreateLibraryInput & { user: string });

      this.libraryId = library.$id;
      return this.libraryId;
    } catch (error) {
      console.error('Failed to get or create library:', error);
      // Return null for local-only mode on error
      return null;
    }
  }
  /**
   * Sync single item to cloud (only if user is authenticated)
   */
  async syncItemToCloud(media: LibraryMedia): Promise<void> {
    try {
      const libraryId = await this.getOrCreateLibrary();

      // If no library ID, user is not authenticated - skip sync
      if (!libraryId) {
        console.log(`Skipping sync for ${media.media_type}-${media.id} - no authenticated user`);
        return;
      }

      const { tmdbMedia, libraryItem } = await mapToAppwriteData(media);

      // Create or update TMDB media cache
      let tmdbDoc: TmdbMedia;
      const existingTmdb = await appwriteService.tmdbMedia.getByTmdbId(media.id, media.media_type);

      if (existingTmdb) {
        tmdbDoc = await appwriteService.tmdbMedia.update(existingTmdb.$id, tmdbMedia);
      } else {
        tmdbDoc = await appwriteService.tmdbMedia.create(tmdbMedia);
      }

      // Create or update library item
      const existingItem = await appwriteService.libraryItems.getByLibraryAndMedia(libraryId, tmdbDoc.$id);

      if (existingItem) {
        await appwriteService.libraryItems.update(existingItem.$id, libraryItem);
      } else {
        await appwriteService.libraryItems.create({
          ...libraryItem,
          libraryId,
          mediaId: tmdbDoc.$id,
        });
      }

      console.log(`Synced ${media.media_type}-${media.id} to cloud`);
    } catch (error) {
      console.error('Failed to sync item to cloud:', error);
      throw error;
    }
  }
  /**
   * Sync entire library to cloud (only if user is authenticated)
   */
  async syncToCloud(library: LibraryCollection): Promise<void> {
    try {
      const libraryId = await this.getOrCreateLibrary();

      // If no library ID, user is not authenticated - skip sync
      if (!libraryId) {
        console.log('Skipping library sync - no authenticated user');
        return;
      }

      for (const [key, media] of Object.entries(library)) {
        try {
          await this.syncItemToCloud(media);
        } catch (error) {
          console.error(`Failed to sync ${key}:`, error);
          // Continue with other items even if one fails
        }
      }

      console.log('Library sync to cloud completed');
    } catch (error) {
      console.error('Failed to sync library to cloud:', error);
      throw error;
    }
  }

  /**
   * Get library from cloud (returns empty if user is not authenticated)
   */
  async getLibraryFromCloud(): Promise<LibraryCollection> {
    try {
      const libraryId = await this.getOrCreateLibrary();

      // If no library ID, user is not authenticated - return empty library
      if (!libraryId) {
        console.log('Skipping cloud library fetch - no authenticated user');
        return {};
      }

      const response = await appwriteService.libraryItems.getByLibrary(libraryId, [
        Query.limit(1000), // Adjust based on expected library size
      ]);

      const cloudLibrary: LibraryCollection = {};

      for (const libraryItem of response.documents) {
        try {
          // Get the associated TMDB media
          const tmdbMedia = libraryItem.media as TmdbMedia;

          if (tmdbMedia) {
            const media = mapFromAppwriteData(libraryItem, tmdbMedia);
            const key = `${media.media_type}-${media.id}`;
            cloudLibrary[key] = media;
          }
        } catch (error) {
          console.error('Failed to map library item:', error);
          // Continue with other items
        }
      }

      console.log(`Retrieved ${Object.keys(cloudLibrary).length} items from cloud`);
      return cloudLibrary;
    } catch (error) {
      console.error('Failed to get library from cloud:', error);
      throw error;
    }
  } /**
   * Remove item from cloud (only if user is authenticated)
   */
  async removeFromCloud(mediaType: 'movie' | 'tv', tmdbId: number): Promise<void> {
    try {
      const libraryId = await this.getOrCreateLibrary();

      // If no library ID, user is not authenticated - skip removal
      if (!libraryId) {
        console.log(`Skipping removal of ${mediaType}-${tmdbId} - no authenticated user`);
        return;
      }

      // Find the TMDB media entry
      const tmdbMedia = await appwriteService.tmdbMedia.getByTmdbId(tmdbId, mediaType);
      if (!tmdbMedia) {
        console.log(`TMDB media ${mediaType}-${tmdbId} not found in cloud`);
        return;
      }

      // Find and delete the library item
      const libraryItem = await appwriteService.libraryItems.getByLibraryAndMedia(libraryId, tmdbMedia.$id);
      if (libraryItem) {
        await appwriteService.libraryItems.delete(libraryItem.$id);
        console.log(`Removed ${mediaType}-${tmdbId} from cloud library`);
      } else {
        console.log(`Library item for ${mediaType}-${tmdbId} not found in cloud`);
      }

      // Optionally clean up TMDB media if no other library items reference it
      // This is more complex and might not be necessary for now
    } catch (error) {
      console.error(`Failed to remove ${mediaType}-${tmdbId} from cloud:`, error);
      throw error;
    }
  }

  /**
   * Check connection status
   */
  async checkConnection(): Promise<boolean> {
    try {
      return await appwriteService.healthCheck();
    } catch {
      return false;
    }
  }

  /**
   * Clear cached library ID (useful when user logs out)
   */
  clearSession(): void {
    this.libraryId = null;
  }
  /**
   * Transfer local library to authenticated user (for after login/signup)
   */
  async transferLocalLibraryToUser(localLibrary: LibraryCollection): Promise<void> {
    console.log('Transferring local library to authenticated user...');
    await this.syncToCloud(localLibrary);
    console.log('Local library transfer completed');
  }
}

// Export singleton instance
export const syncAPI = new LibrarySyncAPI();
