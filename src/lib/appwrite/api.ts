import { ID, ImageFormat, ImageGravity, Permission, Query, Role, OAuthProvider, type Models } from 'appwrite';
import { tablesDB, account, storage, locale, functions, DATABASE_ID, TABLES, BUCKETS } from '@/lib/appwrite';
import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  Activity,
  UserLocation,
  ProfileWithLibrary,
} from './types';
import type { UserPreferences, CreateUserPreferencesInput, UpdateUserPreferencesInput } from './types';
import type { Library, CreateLibraryInput, UpdateLibraryInput } from './types';
import type { AppwriteLibraryMedia, CreateAppwriteLibraryMediaInput, UpdateAppwriteLibraryMediaInput } from './types';

function setPermissions(userId: string): string[] {
  return [
    Permission.read(Role.any()),
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

/**
 * Base API class with common functionality
 */
class BaseAPI {
  protected async createDocument<T extends Models.Document>(
    collectionId: string,
    data: Omit<Partial<T>, keyof Models.Document>,
    documentId?: string,
    permissions?: string[]
  ) {
    return (await tablesDB.createRow({
      databaseId: DATABASE_ID,
      tableId: collectionId,
      rowId: documentId || ID.unique(),
      data,
      permissions,
    })) as unknown as T;
  }

  protected async getDocument<T extends Models.Document>(collectionId: string, documentId: string, queries?: string[]) {
    return (await tablesDB.getRow({
      databaseId: DATABASE_ID,
      tableId: collectionId,
      rowId: documentId,
      queries,
    })) as unknown as T;
  }

  protected async updateDocument<T extends Models.Document>(
    collectionId: string,
    documentId: string,
    data: Omit<Partial<T>, keyof Models.Document>
  ) {
    return (await tablesDB.updateRow({
      databaseId: DATABASE_ID,
      tableId: collectionId,
      rowId: documentId,
      data,
    })) as unknown as T;
  }

  protected async deleteDocument(collectionId: string, documentId: string) {
    await tablesDB.deleteRow({
      databaseId: DATABASE_ID,
      tableId: collectionId,
      rowId: documentId,
    });
  }

  protected async listDocuments<T extends Models.Document>(collectionId: string, queries?: string[]) {
    const response = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: collectionId,
      queries,
    });

    return {
      total: response.total,
      documents: response.rows as unknown as T[],
    };
  }
}

/**
 * Profile API - handles profile management
 */
export class ProfileAPI extends BaseAPI {
  async create(profileData: CreateProfileInput) {
    const permissions = setPermissions(profileData.userId);
    return this.createDocument<Profile>(TABLES.PROFILES, profileData, undefined, permissions);
  }
  async get(profileId: string) {
    return this.getDocument<Profile>(TABLES.PROFILES, profileId, [Query.select(['*', 'preferences.*'])]);
  }
  async getByUserId(userId: string) {
    const result = await this.listDocuments<Profile>(TABLES.PROFILES, [
      Query.equal('userId', userId),
      Query.limit(1),
      Query.select(['*', 'preferences.*']),
    ]);
    return result.documents[0] || null;
  }
  async update(profileId: string, profileData: UpdateProfileInput) {
    return this.updateDocument<Profile>(TABLES.PROFILES, profileId, profileData);
  }

  async delete(profileId: string) {
    return this.deleteDocument(TABLES.PROFILES, profileId);
  }

  async list(queries?: string[]) {
    return this.listDocuments<Profile>(TABLES.PROFILES, queries);
  }

  async getByEmail(email: string) {
    const result = await this.listDocuments<Profile>(TABLES.PROFILES, [Query.equal('email', email), Query.limit(1)]);
    return result.documents[0] || null;
  }

  async getUserProfile(username: string): Promise<UserProfile | null> {
    const result = await this.listDocuments<ProfileWithLibrary>(TABLES.PROFILES, [
      Query.equal('username', username),
      Query.limit(1),
      Query.select(['*', 'library.stats']),
    ]);
    const profile = result.documents[0];

    if (!profile || !profile.library) return null;

    const stats = profile.library.stats
      ? JSON.parse(profile.library.stats)
      : {
          all: 0,
          watching: 0,
          completed: 0,
          willWatch: 0,
          onHold: 0,
          dropped: 0,
          favorites: 0,
          movies: 0,
          tvShows: 0,
          totalHoursWatched: 0,
          averageRating: 0,
          topGenres: [],
        };

    return {
      profile: { ...profile, library: profile.library.$id },
      stats,
      recentActivity: profile.recentActivity.map((e) => JSON.parse(String(e))),
    };
  }

  async logActivity(profileId: string, newActivity: Omit<Activity, 'timestamp'>) {
    const profile = await this.get(profileId);
    if (!profile) return;

    const existingActivities: Activity[] = (profile.recentActivity || []).map((entry) => JSON.parse(String(entry)));

    const entryToLog: Activity = { ...newActivity, timestamp: new Date().toISOString() };

    const recentActivity = [entryToLog, ...existingActivities]
      .slice(0, 5)
      .map((entry) => JSON.stringify(entry)) as unknown as Activity[];

    await this.update(profileId, { recentActivity });
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    if (!username.trim()) return false;

    try {
      const result = await this.listDocuments<Profile>(TABLES.PROFILES, [
        Query.equal('username', username),
        Query.limit(1),
        Query.select(['username']),
      ]);
      return result.total === 0;
    } catch (error) {
      log('ERR', 'Error checking username availability:', error);
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
    return this.createDocument<UserPreferences>(TABLES.USER_PREFERENCES, preferencesData, documentId, permissions);
  }
  async get(preferencesId: string) {
    return this.getDocument<UserPreferences>(TABLES.USER_PREFERENCES, preferencesId);
  }

  async update(preferencesId: string, preferencesData: UpdateUserPreferencesInput) {
    return this.updateDocument<UserPreferences>(TABLES.USER_PREFERENCES, preferencesId, preferencesData);
  }

  async delete(preferencesId: string) {
    return this.deleteDocument(TABLES.USER_PREFERENCES, preferencesId);
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

    return this.createDocument<Library>(TABLES.LIBRARIES, libraryData, documentId, permissions);
  }

  async get(libraryId: string) {
    return this.getDocument<Library>(TABLES.LIBRARIES, libraryId, [Query.select(['*', 'items.*'])]);
  }

  async update(libraryId: string, libraryData: UpdateLibraryInput) {
    return this.updateDocument<Library>(TABLES.LIBRARIES, libraryId, libraryData);
  }

  async delete(libraryId: string) {
    return this.deleteDocument(TABLES.LIBRARIES, libraryId);
  }

  async list(queries?: string[]) {
    return this.listDocuments<Library>(TABLES.LIBRARIES, queries);
  }

  async getByUserId(userId: string) {
    const profileAPI = new ProfileAPI();
    const profile = await profileAPI.getByUserId(userId);
    if (!profile?.library) return null;
    return profile.library;
  }

  async clearLibrary(libraryId: string) {
    await this.delete(libraryId);
    await this.create({ stats: '{}' }, libraryId);
  }
}

/**
 * Library Media API - handles unified library media items
 */
export class LibraryMediaAPI extends BaseAPI {
  async create(itemData: CreateAppwriteLibraryMediaInput & { userId?: string }, documentId?: string) {
    const permissions = itemData.userId ? setPermissions(itemData.userId) : undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, libraryId, ...cleanItemData } = itemData;

    const data = { ...cleanItemData, library: libraryId as unknown as Library };

    return this.createDocument<AppwriteLibraryMedia>(TABLES.LIBRARY_MEDIA, data, documentId, permissions);
  }

  async get(itemId: string) {
    return this.getDocument<AppwriteLibraryMedia>(TABLES.LIBRARY_MEDIA, itemId, [Query.select(['*', 'library.*'])]);
  }

  async update(itemId: string, itemData: UpdateAppwriteLibraryMediaInput) {
    return this.updateDocument<AppwriteLibraryMedia>(TABLES.LIBRARY_MEDIA, itemId, itemData);
  }

  async delete(itemId: string) {
    return this.deleteDocument(TABLES.LIBRARY_MEDIA, itemId);
  }

  async list(queries?: string[]) {
    return this.listDocuments<AppwriteLibraryMedia>(TABLES.LIBRARY_MEDIA, queries);
  }

  async getPublicLibraryItems(libraryId: string, limit: number, offset: number, filters: LibraryFilters) {
    const queries: string[] = [Query.equal('library', libraryId), Query.limit(limit), Query.offset(offset)];

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'favorites') {
        queries.push(Query.equal('isFavorite', true));
      } else {
        queries.push(Query.equal('status', filters.status));
      }
    }
    if (filters.query) {
      queries.push(Query.search('title', filters.query));
    }
    if (filters.mediaType) {
      queries.push(Query.equal('media_type', filters.mediaType));
    }
    if (filters.genres && filters.genres.length > 0) {
      queries.push(Query.contains('genres', filters.genres as unknown as string[]));
    }
    if (filters.networks && filters.networks.length > 0) {
      queries.push(Query.contains('networks', filters.networks as unknown as string[]));
    }

    const sortOrder = filters.sortDir === 'asc' ? Query.orderAsc : Query.orderDesc;
    if (filters.sortBy) {
      queries.push(sortOrder(filters.sortBy));
    } else {
      queries.push(Query.orderDesc('addedAt'));
    }

    return this.listDocuments<AppwriteLibraryMedia>(TABLES.LIBRARY_MEDIA, queries);
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

  async updatePreferences(preferences: Record<string, string>) {
    return await account.updatePrefs(preferences);
  }

  async listSessions() {
    const sessionList = await account.listSessions();
    return sessionList.sessions;
  }

  async deleteSession(sessionId: string) {
    await account.deleteSession(sessionId);
  }

  async deleteSessions() {
    await account.deleteSessions();
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
 * AI Recommendations API - handles natural language AI recommendations
 */
export class AIRecommendationsAPI {
  async getRecommendations(
    description: string,
    userLibrary: LibraryMedia[],
    preferences: { contentType?: string; decade?: string; duration?: string } = {},
    userProfile?: {
      favoriteGenres: number[];
      contentPreferences: string[];
      favoriteNetworks: number[];
      favoriteContentType: string;
    }
  ) {
    try {
      const response = await functions.createExecution({
        functionId: 'mood-recommendations',
        body: JSON.stringify({
          description: description.trim(),
          userLibrary,
          preferences,
          userProfile,
        }),
      });

      const result = JSON.parse(response.responseBody);

      if (result.status !== 200) {
        throw new Error(result.message || 'Failed to get recommendations');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw new Error('Failed to get AI recommendations. Please try again.');
    }
  }

  async getRecommendationsBatch(
    description: string,
    userLibrary: LibraryMedia[],
    preferences: { contentType?: string; decade?: string; duration?: string } = {},
    userProfile?: {
      favoriteGenres: number[];
      contentPreferences: string[];
      favoriteNetworks: number[];
      favoriteContentType: string;
    },
    batchNumber: number = 1,
    excludeTitles: string[] = []
  ) {
    try {
      const response = await functions.createExecution({
        functionId: 'mood-recommendations',
        body: JSON.stringify({
          description: description.trim(),
          userLibrary,
          preferences,
          userProfile,
          batchNumber,
          excludeTitles,
        }),
      });

      const result = JSON.parse(response.responseBody);

      if (result.status !== 200) {
        throw new Error(result.message || 'Failed to get recommendations');
      }

      return result.data;
    } catch (error) {
      console.error('Error getting AI recommendations batch:', error);
      throw new Error('Failed to get AI recommendations. Please try again.');
    }
  }
}

/**
 * Main API service that combines all sub-services
 */
export class AppwriteService {
  public profile = new ProfileAPI();
  public userPreferences = new UserPreferencesAPI();
  public library = new LibraryAPI();
  public libraryMedia = new LibraryMediaAPI();
  public auth = new AuthAPI();
  public storage = new StorageAPI();
  public locale = new LocaleAPI();
  public aiRecommendations = new AIRecommendationsAPI();

  /**
   * Health check - test if Appwrite is accessible
   */
  async healthCheck() {
    try {
      await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: TABLES.PROFILES,
        queries: [Query.limit(1)],
      });
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
      collections: TABLES,
      buckets: BUCKETS,
    };
  }
}

export const appwriteService = new AppwriteService();

export { setPermissions };
