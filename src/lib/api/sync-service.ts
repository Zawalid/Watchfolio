import { Query } from 'appwrite';
import { appwriteService } from './appwrite-service';
import { compareLibraries, smartMergeLibraries } from '@/utils/library';
import { authService } from '../auth';

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
      title: media.title || `${media.media_type} ${media.id}`, 
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

export class LibrarySyncAPI {
  /**
   * Get or create library for authenticated user
   * Returns null if user is not authenticated (local-only mode)
   */
  private async getOrCreateLibrary() {
    try {
      // Get current authenticated user
      const currentUser = await appwriteService.auth.getCurrentUser();
      if (!currentUser) return null;

      // Look for existing library for this user
      const libraries = await appwriteService.libraries.list([Query.equal('user', currentUser.$id), Query.limit(1)]);

      if (libraries.documents.length > 0) return libraries.documents[0].$id;

      // Create new library for user
      const library = await appwriteService.libraries.create({
        user: currentUser.$id,
      } as CreateLibraryInput & { user: string });

      return library.$id;
    } catch (error) {
      console.error('Failed to get or create library:', error);
      // Return null for local-only mode on error
      return null;
    }
  }
  /**
   * Sync single item to cloud
   */
  async syncItemToCloud(media: LibraryMedia) {
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
  } /**
   * Intelligent incremental sync to cloud - only syncs changes
   */
  async syncToCloud(library: LibraryCollection) {
    try {
      const libraryId = await this.getOrCreateLibrary();

      // If no library ID, user is not authenticated - skip sync
      if (!libraryId) return;

      // Get current cloud state for comparison
      const cloudLibrary = await this.getLibraryFromCloud();

      // Calculate what needs to be synced
      const diff = compareLibraries(library, cloudLibrary);

      const totalChanges = diff.localOnly.length + diff.needsCloudUpdate.length + diff.cloudOnly.length;

      if (totalChanges === 0) {
        console.log('✅ Already in sync - no changes needed');
        return;
      }

      console.log(
        `🔄 Incremental sync: ${diff.localOnly.length} new, ${diff.needsCloudUpdate.length} updated, ${diff.cloudOnly.length} to remove`
      );

      // Upload new and updated items
      const itemsToUpload = [...diff.localOnly, ...diff.needsCloudUpdate];
      for (const item of itemsToUpload) {
        try {
          await this.syncItemToCloud(item);
        } catch (error) {
          console.error(`Failed to sync ${item.media_type}-${item.id}:`, error);
          // Continue with other items even if one fails
        }
      }

      // Remove items that exist in cloud but not locally
      for (const item of diff.cloudOnly) {
        try {
          await this.removeFromCloud(item.media_type, item.id);
        } catch (error) {
          console.error(`Failed to remove ${item.media_type}-${item.id}:`, error);
        }
      }

      console.log(`✅ Incremental sync completed: ${itemsToUpload.length} uploaded, ${diff.cloudOnly.length} removed`);
    } catch (error) {
      console.error('Failed to sync library to cloud:', error);
      throw error;
    }
  }
  /**
   * Clear cloud library
   */
  async clearLibraryInCloud() {
    try {
      const libraryId = await this.getOrCreateLibrary();
      if (!libraryId) return;

      const currentUser = await appwriteService.auth.getCurrentUser();
      if (!currentUser) return;

      // TODO : FIX : Deleting the library deletes the profile as well
      await appwriteService.libraries.delete(libraryId);
      await authService.createUserLibrary(currentUser.$id);

      console.log('✅ Cloud library cleared successfully');
    } catch (error) {
      console.error('Failed to clear cloud library:', error);
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
   * Remove item from cloud
   */
  async removeFromCloud(mediaType: 'movie' | 'tv', tmdbId: number) {
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
    } catch (error) {
      console.error(`Failed to remove ${mediaType}-${tmdbId} from cloud:`, error);
      throw error;
    }
  }

  /**
   * Check connection status
   */
  async checkConnection() {
    try {
      return await appwriteService.healthCheck();
    } catch {
      return false;
    }
  }

  /**
   * Compare local library with cloud to get sync status
   */
  async compareWithCloud(localLibrary: LibraryCollection): Promise<SyncComparison | null> {
    try {
      const cloudLibrary = await this.getLibraryFromCloud();
      const localItemCount = Object.keys(localLibrary).length;
      const cloudItemCount = Object.keys(cloudLibrary).length;

      // Quick check for empty libraries
      if (localItemCount === 0 && cloudItemCount === 0) {
        return {
          isInSync: true,
          cloudItemCount: 0,
          localItemCount: 0,
          needsUpload: 0,
          needsDownload: 0,
          conflicts: 0,
        };
      }

      const diff = compareLibraries(localLibrary, cloudLibrary);

      return {
        isInSync:
          diff.localOnly.length === 0 &&
          diff.cloudOnly.length === 0 &&
          diff.needsLocalUpdate.length === 0 &&
          diff.needsCloudUpdate.length === 0 &&
          diff.conflicts.length === 0,
        cloudItemCount,
        localItemCount,
        needsUpload: diff.localOnly.length + diff.needsCloudUpdate.length,
        needsDownload: diff.cloudOnly.length + diff.needsLocalUpdate.length,
        conflicts: diff.conflicts.length,
      };
    } catch (error) {
      console.error('Failed to compare with cloud:', error);
      return null;
    }
  }

  /**
   * Perform intelligent sync between local and cloud
   */
  async smartSync(localLibrary: LibraryCollection) {
    try {
      const cloudLibrary = await this.getLibraryFromCloud();

      // Use smart merge utility
      const { mergedLibrary, changes } = smartMergeLibraries(localLibrary, cloudLibrary, {
        preserveLocalFavorites: true,
        conflictResolution: 'newer',
      });

      // Upload any items that need to be synced to cloud
      const diff = compareLibraries(localLibrary, cloudLibrary);

      const itemsToUpload = [...diff.localOnly, ...diff.needsCloudUpdate];

      for (const item of itemsToUpload) {
        try {
          await this.syncItemToCloud(item);
        } catch (error) {
          console.error(`Failed to upload ${item.media_type}-${item.id}:`, error);
          // Continue with other items
        }
      }

      return {
        mergedLibrary,
        changes,
        uploadedCount: itemsToUpload.length,
      };
    } catch (error) {
      console.error('Smart sync failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const syncAPI = new LibrarySyncAPI();