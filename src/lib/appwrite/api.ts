import { ID, ImageFormat, ImageGravity, Permission, Query, Role, OAuthProvider, type Models } from 'appwrite';
import { databases, account, storage, locale, DATABASE_ID, COLLECTIONS, BUCKETS } from '@/lib/appwrite';
import { getLibraryCount, mapFromAppwriteData } from '@/utils/library';

import type { Profile, CreateProfileInput, UpdateProfileInput, Activity, UserLocation } from './types';
import type { UserPreferences, CreateUserPreferencesInput, UpdateUserPreferencesInput } from './types';
import type { Library, CreateLibraryInput, UpdateLibraryInput } from './types';
import type { LibraryItem, CreateLibraryItemInput, UpdateLibraryItemInput } from './types';
import type { TmdbMedia, CreateTmdbMediaInput, UpdateTmdbMediaInput } from './types';

function setPermissions(userId: string): string[] {
  return [Permission.read(Role.any()), Permission.update(Role.user(userId)), Permission.delete(Role.user(userId))];
}

/**
 * Base API class with common functionality
 */
class BaseAPI {
  protected async createDocument<T extends Models.Document>(
    collectionId: string,
    data: Omit<T, keyof Models.Document>,
    documentId?: string,
    permissions?: string[]
  ) {
    return (await databases.createDocument(
      DATABASE_ID,
      collectionId,
      documentId || ID.unique(),
      data,
      permissions
    )) as T;
  }

  protected async getDocument<T extends Models.Document>(collectionId: string, documentId: string, queries?: string[]) {
    return (await databases.getDocument(DATABASE_ID, collectionId, documentId, queries)) as T;
  }

  protected async updateDocument<T extends Models.Document>(
    collectionId: string,
    documentId: string,
    data: Partial<Omit<T, keyof Models.Document>>
  ) {
    return (await databases.updateDocument(DATABASE_ID, collectionId, documentId, data)) as T;
  }

  protected async deleteDocument(collectionId: string, documentId: string) {
    await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
  }

  protected async listDocuments<T extends Models.Document>(collectionId: string, queries?: string[]) {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, queries);

    return {
      total: response.total,
      documents: response.documents as T[],
    };
  }
}

/**
 * Profile API - handles profile management
 */
export class ProfileAPI extends BaseAPI {
  async create(profileData: CreateProfileInput) {
    const permissions = setPermissions(profileData.userId);
    return this.createDocument<Profile>(COLLECTIONS.PROFILES, profileData, undefined, permissions);
  }
  async get(profileId: string) {
    return this.getDocument<Profile>(COLLECTIONS.PROFILES, profileId, [
      Query.select(['*', 'preferences.*', 'library.*']),
    ]);
  }
  async getByUserId(userId: string) {
    const result = await this.listDocuments<Profile>(COLLECTIONS.PROFILES, [
      Query.equal('userId', userId),
      Query.limit(1),
      Query.select(['*', 'preferences.*', 'library.*']),
    ]);
    return result.documents[0] || null;
  }
  async update(profileId: string, profileData: UpdateProfileInput) {
    return this.updateDocument<Profile>(COLLECTIONS.PROFILES, profileId, profileData);
  }

  async delete(profileId: string) {
    return this.deleteDocument(COLLECTIONS.PROFILES, profileId);
  }

  async list(queries?: string[]) {
    return this.listDocuments<Profile>(COLLECTIONS.PROFILES, queries);
  }

  async getByEmail(email: string) {
    const result = await this.listDocuments<Profile>(COLLECTIONS.PROFILES, [
      Query.equal('email', email),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }

  async getUserProfile(username: string): Promise<UserProfile | null> {
    const result = await this.listDocuments<Profile>(COLLECTIONS.PROFILES, [
      Query.equal('username', username),
      Query.limit(1),
    ]);
    const profile = result.documents[0];

    if (!profile || !profile.library?.$id) return null;
    //? Im fetching the library because Appwrite only support a max depth of three levels, which means i can't get the media relationship on the library items
    const library = await libraryService.get(profile.library.$id);
    if (!library) return null;

    const items = library.items?.length ? library.items.map((item) => mapFromAppwriteData(item, item.media)) : [];
    const counts = getLibraryCount({ items }) as Record<LibraryFilterStatus, number>;

    const ratedItems: number[] = [];
    const genreCounts: { [key: string]: number } = {};
    let totalMinutesRuntime = 0;

    for (const item of items) {
      if (item.userRating && typeof item.userRating === 'number') ratedItems.push(item.userRating);
      item.genres?.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
      totalMinutesRuntime += item.totalMinutesRuntime || 0;
    }

    const averageRating = ratedItems.length > 0 ? ratedItems.reduce((a, b) => a + b, 0) / ratedItems.length : 0;

    const topGenres = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const stats: LibraryStats = {
      ...counts,
      movies: getLibraryCount({ items, filter: 'all', mediaType: 'movie' }) as number,
      tvShows: getLibraryCount({ items, filter: 'all', mediaType: 'tv' }) as number,
      totalHoursWatched: Math.round(totalMinutesRuntime / 60),
      averageRating,
      topGenres,
    };

    return {
      profile: { ...profile, library, recentActivity: profile.recentActivity.map((e) => JSON.parse(String(e))) },
      stats,
    };
  }

  async logActivity(profileId: string, newActivity: Omit<Activity, 'timestamp'>) {
    const profile = await this.get(profileId);
    if (!profile) return;

    const existingActivities: Activity[] = (profile.recentActivity || []).map((entry) => JSON.parse(String(entry)));

    const entryToLog: Activity = { ...newActivity, timestamp: new Date().toISOString() };

    const recentActivity = [entryToLog, ...existingActivities].slice(0, 5).map((entry) => JSON.stringify(entry));

    await this.update(profileId, { recentActivity });
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    if (!username.trim()) return false;

    try {
      const result = await this.listDocuments<Profile>(COLLECTIONS.PROFILES, [
        Query.equal('username', username),
        Query.limit(1),
        Query.select(['username']),
      ]);
      return result.total === 0;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false; // Safer to assume unavailable on error
    }
  }
}

/**
 * User Preferences API
 */
export class UserPreferencesAPI extends BaseAPI {
  async create(preferencesData: CreateUserPreferencesInput, documentId?: string) {
    const currentUser = await account.get();
    const permissions = setPermissions(currentUser.$id);
    return this.createDocument<UserPreferences>(COLLECTIONS.USER_PREFERENCES, preferencesData, documentId, permissions);
  }
  async get(preferencesId: string) {
    return this.getDocument<UserPreferences>(COLLECTIONS.USER_PREFERENCES, preferencesId);
  }

  async update(preferencesId: string, preferencesData: UpdateUserPreferencesInput) {
    return this.updateDocument<UserPreferences>(COLLECTIONS.USER_PREFERENCES, preferencesId, preferencesData);
  }

  async delete(preferencesId: string) {
    return this.deleteDocument(COLLECTIONS.USER_PREFERENCES, preferencesId);
  }
}

/**
 * Library API
 */
export class LibraryAPI extends BaseAPI {
  async create(libraryData: CreateLibraryInput, documentId?: string) {
    // Since relationship is managed from users_profiles side, we need to get current user for permissions
    const currentUser = await account.get();
    const permissions = setPermissions(currentUser.$id);

    return this.createDocument<Library>(COLLECTIONS.LIBRARIES, libraryData, documentId, permissions);
  }

  async get(libraryId: string) {
    return this.getDocument<Library>(COLLECTIONS.LIBRARIES, libraryId, [
      Query.select(['*', 'items.*', 'items.media.*']),
    ]);
  }

  async update(libraryId: string, libraryData: UpdateLibraryInput) {
    return this.updateDocument<Library>(COLLECTIONS.LIBRARIES, libraryId, libraryData);
  }

  async delete(libraryId: string) {
    return this.deleteDocument(COLLECTIONS.LIBRARIES, libraryId);
  }

  async list(queries?: string[]) {
    return this.listDocuments<Library>(COLLECTIONS.LIBRARIES, queries);
  }

  async getByUserId(userId: string) {
    const profileAPI = new ProfileAPI();
    const profile = await profileAPI.getByUserId(userId);
    if (!profile?.library) return null;
    return profile.library;
  }
}

/**
 * Library Items API
 */
export class LibraryItemsAPI extends BaseAPI {
  async create(itemData: CreateLibraryItemInput & { userId?: string }, documentId?: string) {
    const permissions = itemData.userId ? setPermissions(itemData.userId) : undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, libraryId, mediaId, ...cleanItemData } = itemData;

    // Map the external field names to Appwrite relationship field names
    const appwriteData = {
      ...cleanItemData,
      library: libraryId, // Map libraryId to library
      media: mediaId, // Map mediaId to media
    };

    return this.createDocument<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, appwriteData, documentId, permissions);
  }

  async get(itemId: string) {
    return this.getDocument<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, itemId, [
      Query.select(['*', 'library.*', 'media.*']),
    ]);
  }

  async update(itemId: string, itemData: UpdateLibraryItemInput) {
    return this.updateDocument<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, itemId, itemData);
  }

  async delete(itemId: string) {
    return this.deleteDocument(COLLECTIONS.LIBRARY_ITEMS, itemId);
  }

  async list(queries?: string[]) {
    return this.listDocuments<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, queries);
  }

  async getByLibrary(libraryId: string, queries?: string[]) {
    const baseQueries = [Query.equal('library', libraryId), Query.select(['*', 'media.*'])];
    return this.listDocuments<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, [...baseQueries, ...(queries || [])]);
  }

  async getByLibraryAndMedia(libraryId: string, mediaId: string) {
    const result = await this.listDocuments<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, [
      Query.equal('library', libraryId),
      Query.equal('media', mediaId),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }

  async getByStatus(libraryId: string, status: string) {
    return this.getByLibrary(libraryId, [Query.equal('status', status)]);
  }

  async getFavorites(libraryId: string) {
    return this.getByLibrary(libraryId, [Query.equal('isFavorite', true)]);
  }
}

/**
 * TMDB Media API
 */
export class TmdbMediaAPI extends BaseAPI {
  async create(mediaData: CreateTmdbMediaInput, documentId?: string) {
    return this.createDocument<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, mediaData, documentId);
  }

  async get(mediaId: string) {
    return this.getDocument<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, mediaId);
  }

  async update(mediaId: string, mediaData: UpdateTmdbMediaInput) {
    return this.updateDocument<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, mediaId, mediaData);
  }

  async delete(mediaId: string) {
    return this.deleteDocument(COLLECTIONS.TMDB_MEDIA, mediaId);
  }

  async list(queries?: string[]) {
    return this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, queries);
  }

  async getByTmdbId(tmdbId: number, mediaType: MediaType) {
    const result = await this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, [
      Query.equal('id', tmdbId),
      Query.equal('mediaType', mediaType),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }

  async search(title: string, limit: number = 20) {
    return this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, [Query.search('title', title), Query.limit(limit)]);
  }

  async getByGenres(genres: string[], limit: number = 20) {
    return this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, [Query.equal('genres', genres), Query.limit(limit)]);
  }
}

/**
 * Authentication API
 */
export class AuthAPI {
  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  }

  async createEmailSession(email: string, password: string) {
    return await account.createEmailPasswordSession(email, password);
  }

  async deleteCurrentSession() {
    await account.deleteSession('current');
  }

  async deleteAllSessions() {
    await account.deleteSessions();
  }

  async createAccount(email: string, password: string, name: string) {
    return await account.create(ID.unique(), email, password, name);
  }

  async updateName(name: string) {
    return await account.updateName(name);
  }

  async updateEmail(email: string, password: string) {
    return await account.updateEmail(email, password);
  }

  async updatePassword(password: string, oldPassword: string) {
    return await account.updatePassword(password, oldPassword);
  }

  async createRecovery(email: string, url: string) {
    return await account.createRecovery(email, url);
  }

  async updateRecovery(userId: string, secret: string, password: string) {
    return await account.updateRecovery(userId, secret, password);
  }
  async createAnonymousSession() {
    return await account.createAnonymousSession();
  }
  async createOAuth2Session(provider: OAuthProvider, successUrl?: string, failureUrl?: string) {
    return account.createOAuth2Session(provider, successUrl, failureUrl);
  }

  async createVerification(url: string) {
    return await account.createVerification(url);
  }

  async updateVerification(userId: string, secret: string) {
    return await account.updateVerification(userId, secret);
  }
}

/**
 * Storage API
 */
export class StorageAPI {
  async uploadFile(bucketId: string, file: File, fileId?: string, permissions?: string[]) {
    return await storage.createFile(bucketId, fileId || ID.unique(), file, permissions);
  }

  async getFile(bucketId: string, fileId: string) {
    return await storage.getFile(bucketId, fileId);
  }

  async deleteFile(bucketId: string, fileId: string) {
    await storage.deleteFile(bucketId, fileId);
  }

  async getFilePreview(
    bucketId: string,
    fileId: string,
    width?: number,
    height?: number,
    gravity?: ImageGravity,
    quality?: number,
    borderWidth?: number,
    borderColor?: string,
    borderRadius?: number,
    opacity?: number,
    rotation?: number,
    background?: string,
    output?: ImageFormat
  ) {
    return new URL(
      storage.getFilePreview(
        bucketId,
        fileId,
        width,
        height,
        gravity,
        quality,
        borderWidth,
        borderColor,
        borderRadius,
        opacity,
        rotation,
        background,
        output
      )
    );
  }

  async listFiles(bucketId: string, queries?: string[]) {
    return await storage.listFiles(bucketId, queries);
  }

  // Avatar specific methods
  async uploadAvatar(file: File, fileId?: string) {
    return this.uploadFile(BUCKETS.AVATARS, file, fileId);
  }

  async getAvatarPreview(fileId: string, size: number = 100) {
    return this.getFilePreview(BUCKETS.AVATARS, fileId, size, size, undefined, 90);
  }
}

/**
 * Locale API - handles user location and locale information
 */
export class LocaleAPI {
  async get() {
    return await locale.get();
  }

  async getUserLocation(): Promise<UserLocation> {
    const localeInfo = await this.get();
    return {
      country: localeInfo.country,
      countryCode: localeInfo.countryCode,
      continent: localeInfo.continent,
      continentCode: localeInfo.continentCode,
    };
  }
}

/**
 * Main API service that combines all sub-services
 */
export class AppwriteService {
  public profiles = new ProfileAPI();
  public userPreferences = new UserPreferencesAPI();
  public libraries = new LibraryAPI();
  public libraryItems = new LibraryItemsAPI();
  public tmdbMedia = new TmdbMediaAPI();
  public auth = new AuthAPI();
  public storage = new StorageAPI();
  public locale = new LocaleAPI();

  /**
   * Health check - test if Appwrite is accessible
   */
  async healthCheck() {
    try {
      await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROFILES, [Query.limit(1)]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get database info
   */
  async getDatabaseInfo() {
    return {
      databaseId: DATABASE_ID,
      collections: COLLECTIONS,
      buckets: BUCKETS,
    };
  }
}

// Export singleton instance
export const appwriteService = new AppwriteService();

// Export individual services for direct access if needed
export const {
  profiles: profilesService,
  userPreferences: userPreferencesService,
  libraries: libraryService,
  libraryItems: libraryItemsService,
  tmdbMedia: tmdbMediaService,
  auth: authService,
  storage: storageService,
  locale: localeService,
} = appwriteService;

// Export the setPermissions utility for external use
export { setPermissions };
