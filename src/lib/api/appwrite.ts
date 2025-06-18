import { ID, ImageFormat, ImageGravity, Permission, Query, Role, type Models } from 'appwrite';
import { databases, account, storage, DATABASE_ID, COLLECTIONS, BUCKETS } from '@/lib/appwrite';

function setPermissions(userId: string): string[] {
  return [
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
    data: Omit<T, keyof Models.Document>,
    documentId?: string,
    permissions?: string[]
  ): Promise<T> {
    return (await databases.createDocument(
      DATABASE_ID,
      collectionId,
      documentId || ID.unique(),
      data,
      permissions
    )) as T;
  }

  protected async getDocument<T extends Models.Document>(
    collectionId: string,
    documentId: string,
    queries?: string[]
  ): Promise<T> {
    return (await databases.getDocument(DATABASE_ID, collectionId, documentId, queries)) as T;
  }

  protected async updateDocument<T extends Models.Document>(
    collectionId: string,
    documentId: string,
    data: Partial<Omit<T, keyof Models.Document>>
  ): Promise<T> {
    return (await databases.updateDocument(DATABASE_ID, collectionId, documentId, data)) as T;
  }

  protected async deleteDocument(collectionId: string, documentId: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
  }

  protected async listDocuments<T extends Models.Document>(
    collectionId: string,
    queries?: string[]
  ): Promise<DocumentList<T>> {
    const response = await databases.listDocuments(DATABASE_ID, collectionId, queries);

    return {
      total: response.total,
      documents: response.documents as T[],
    };
  }
}

/**
 * User API - handles user management
 */
export class UserAPI extends BaseAPI {
  async create(userData: CreateUserInput & { id: string }, documentId?: string): Promise<User> {
    const permissions = setPermissions(userData.id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...cleanUserData } = userData;
    return this.createDocument<User>(COLLECTIONS.USERS, cleanUserData, documentId, permissions);
  }

  async get(userId: string): Promise<User> {
    return this.getDocument<User>(COLLECTIONS.USERS, userId, [Query.select(['*', 'preferences.*', 'library.*'])]);
  }

  async update(userId: string, userData: UpdateUserInput): Promise<User> {
    return this.updateDocument<User>(COLLECTIONS.USERS, userId, userData);
  }

  async delete(userId: string): Promise<void> {
    return this.deleteDocument(COLLECTIONS.USERS, userId);
  }

  async list(queries?: string[]): Promise<DocumentList<User>> {
    return this.listDocuments<User>(COLLECTIONS.USERS, queries);
  }

  async getByEmail(email: string): Promise<User | null> {
    const result = await this.listDocuments<User>(COLLECTIONS.USERS, [Query.equal('email', email), Query.limit(1)]);
    return result.documents[0] || null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const result = await this.listDocuments<User>(COLLECTIONS.USERS, [
      Query.equal('username', username),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }
}

/**
 * User Preferences API
 */
export class UserPreferencesAPI extends BaseAPI {
  async create(
    preferencesData: CreateUserPreferencesInput & { userId?: string },
    documentId?: string
  ): Promise<UserPreferences> {
    const permissions = preferencesData.userId ? setPermissions(preferencesData.userId) : undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...cleanData } = preferencesData;
    return this.createDocument<UserPreferences>(COLLECTIONS.USER_PREFERENCES, cleanData, documentId, permissions);
  }

  async get(preferencesId: string): Promise<UserPreferences> {
    return this.getDocument<UserPreferences>(COLLECTIONS.USER_PREFERENCES, preferencesId);
  }

  async update(preferencesId: string, preferencesData: UpdateUserPreferencesInput): Promise<UserPreferences> {
    return this.updateDocument<UserPreferences>(COLLECTIONS.USER_PREFERENCES, preferencesId, preferencesData);
  }

  async delete(preferencesId: string): Promise<void> {
    return this.deleteDocument(COLLECTIONS.USER_PREFERENCES, preferencesId);
  }
}

/**
 * Library API
 */
export class LibraryAPI extends BaseAPI {
  async create(libraryData: CreateLibraryInput & { user: string }, documentId?: string): Promise<Library> {
    return this.createDocument<Library>(
      COLLECTIONS.LIBRARIES,
      libraryData,
      documentId,
      setPermissions(libraryData.user)
    );
  }

  async get(libraryId: string): Promise<Library> {
    return this.getDocument<Library>(COLLECTIONS.LIBRARIES, libraryId, [
      Query.select(['*', 'items.*', 'items.media.*', 'user.*']),
    ]);
  }

  async update(libraryId: string, libraryData: UpdateLibraryInput): Promise<Library> {
    return this.updateDocument<Library>(COLLECTIONS.LIBRARIES, libraryId, libraryData);
  }

  async delete(libraryId: string): Promise<void> {
    return this.deleteDocument(COLLECTIONS.LIBRARIES, libraryId);
  }

  async list(queries?: string[]): Promise<DocumentList<Library>> {
    return this.listDocuments<Library>(COLLECTIONS.LIBRARIES, queries);
  }

  async getByUser(userId: string): Promise<Library | null> {
    const result = await this.listDocuments<Library>(COLLECTIONS.LIBRARIES, [
      Query.equal('user', userId),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }
}

/**
 * Library Items API
 */
export class LibraryItemsAPI extends BaseAPI {
  async create(itemData: CreateLibraryItemInput & { userId?: string }, documentId?: string): Promise<LibraryItem> {
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

  async get(itemId: string): Promise<LibraryItem> {
    return this.getDocument<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, itemId, [
      Query.select(['*', 'library.*', 'media.*']),
    ]);
  }

  async update(itemId: string, itemData: UpdateLibraryItemInput): Promise<LibraryItem> {
    return this.updateDocument<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, itemId, itemData);
  }

  async delete(itemId: string): Promise<void> {
    return this.deleteDocument(COLLECTIONS.LIBRARY_ITEMS, itemId);
  }

  async list(queries?: string[]): Promise<DocumentList<LibraryItem>> {
    return this.listDocuments<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, queries);
  }

  async getByLibrary(libraryId: string, queries?: string[]): Promise<DocumentList<LibraryItem>> {
    const baseQueries = [Query.equal('library', libraryId), Query.select(['*', 'media.*'])];
    return this.listDocuments<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, [...baseQueries, ...(queries || [])]);
  }

  async getByLibraryAndMedia(libraryId: string, mediaId: string): Promise<LibraryItem | null> {
    const result = await this.listDocuments<LibraryItem>(COLLECTIONS.LIBRARY_ITEMS, [
      Query.equal('library', libraryId),
      Query.equal('media', mediaId),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }

  async getByStatus(libraryId: string, status: string): Promise<DocumentList<LibraryItem>> {
    return this.getByLibrary(libraryId, [Query.equal('status', status)]);
  }

  async getFavorites(libraryId: string): Promise<DocumentList<LibraryItem>> {
    return this.getByLibrary(libraryId, [Query.equal('isFavorite', true)]);
  }
}

/**
 * TMDB Media API
 */
export class TmdbMediaAPI extends BaseAPI {
  async create(mediaData: CreateTmdbMediaInput, documentId?: string): Promise<TmdbMedia> {
    return this.createDocument<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, mediaData, documentId);
  }

  async get(mediaId: string): Promise<TmdbMedia> {
    return this.getDocument<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, mediaId);
  }

  async update(mediaId: string, mediaData: UpdateTmdbMediaInput): Promise<TmdbMedia> {
    return this.updateDocument<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, mediaId, mediaData);
  }

  async delete(mediaId: string): Promise<void> {
    return this.deleteDocument(COLLECTIONS.TMDB_MEDIA, mediaId);
  }

  async list(queries?: string[]): Promise<DocumentList<TmdbMedia>> {
    return this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, queries);
  }

  async getByTmdbId(tmdbId: number, mediaType: 'movie' | 'tv'): Promise<TmdbMedia | null> {
    const result = await this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, [
      Query.equal('id', tmdbId),
      Query.equal('mediaType', mediaType),
      Query.limit(1),
    ]);
    return result.documents[0] || null;
  }

  async search(title: string, limit: number = 20): Promise<DocumentList<TmdbMedia>> {
    return this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, [Query.search('title', title), Query.limit(limit)]);
  }

  async getByGenres(genres: string[], limit: number = 20): Promise<DocumentList<TmdbMedia>> {
    return this.listDocuments<TmdbMedia>(COLLECTIONS.TMDB_MEDIA, [Query.equal('genres', genres), Query.limit(limit)]);
  }
}

/**
 * Authentication API
 */
export class AuthAPI {
  async getCurrentUser(): Promise<Models.User<Models.Preferences> | null> {
    try {
      return await account.get();
    } catch {
      return null;
    }
  }

  async createEmailSession(email: string, password: string): Promise<Models.Session> {
    return await account.createEmailPasswordSession(email, password);
  }

  async deleteCurrentSession(): Promise<void> {
    await account.deleteSession('current');
  }

  async deleteAllSessions(): Promise<void> {
    await account.deleteSessions();
  }

  async createAccount(
    email: string,
    password: string,
    name: string,
    userId?: string
  ): Promise<Models.User<Models.Preferences>> {
    return await account.create(userId || ID.unique(), email, password, name);
  }

  async updateName(name: string): Promise<Models.User<Models.Preferences>> {
    return await account.updateName(name);
  }

  async updateEmail(email: string, password: string): Promise<Models.User<Models.Preferences>> {
    return await account.updateEmail(email, password);
  }

  async updatePassword(password: string, oldPassword: string): Promise<Models.User<Models.Preferences>> {
    return await account.updatePassword(password, oldPassword);
  }

  async createRecovery(email: string, url: string): Promise<Models.Token> {
    return await account.createRecovery(email, url);
  }

  async updateRecovery(userId: string, secret: string, password: string): Promise<Models.Token> {
    return await account.updateRecovery(userId, secret, password);
  }

  async createAnonymousSession(): Promise<Models.Session> {
    return await account.createAnonymousSession();
  }
}

/**
 * Storage API
 */
export class StorageAPI {
  async uploadFile(bucketId: string, file: File, fileId?: string, permissions?: string[]): Promise<Models.File> {
    return await storage.createFile(bucketId, fileId || ID.unique(), file, permissions);
  }

  async getFile(bucketId: string, fileId: string): Promise<Models.File> {
    return await storage.getFile(bucketId, fileId);
  }

  async deleteFile(bucketId: string, fileId: string): Promise<void> {
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
  ): Promise<URL> {
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

  async listFiles(bucketId: string, queries?: string[]): Promise<Models.FileList> {
    return await storage.listFiles(bucketId, queries);
  }

  // Avatar specific methods
  async uploadAvatar(file: File, fileId?: string): Promise<Models.File> {
    return this.uploadFile(BUCKETS.AVATARS, file, fileId);
  }

  async getAvatarPreview(fileId: string, size: number = 100): Promise<URL> {
    return this.getFilePreview(BUCKETS.AVATARS, fileId, size, size, undefined, 90);
  }
}

/**
 * Main API service that combines all sub-services
 */
export class AppwriteService {
  public users = new UserAPI();
  public userPreferences = new UserPreferencesAPI();
  public libraries = new LibraryAPI();
  public libraryItems = new LibraryItemsAPI();
  public tmdbMedia = new TmdbMediaAPI();
  public auth = new AuthAPI();
  public storage = new StorageAPI();

  /**
   * Health check - test if Appwrite is accessible
   */
  async healthCheck(): Promise<boolean> {
    try {
      await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, [Query.limit(1)]);
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
  users: userService,
  userPreferences: userPreferencesService,
  libraries: libraryService,
  libraryItems: libraryItemsService,
  tmdbMedia: tmdbMediaService,
  auth: authService,
  storage: storageService,
} = appwriteService;

// Export the setPermissions utility for external use
export { setPermissions };
