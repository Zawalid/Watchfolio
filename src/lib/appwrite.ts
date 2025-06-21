import { Client, Account, Databases, Storage, Functions, Locale } from 'appwrite';

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const locale = new Locale(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'watchfolio';
export const COLLECTIONS = {
  PROFILES: import.meta.env.VITE_APPWRITE_COLLECTION_PROFILES || 'profiles',
  USER_PREFERENCES: import.meta.env.VITE_APPWRITE_COLLECTION_USER_PREFERENCES || 'user_preferences',
  LIBRARIES: import.meta.env.VITE_APPWRITE_COLLECTION_LIBRARIES || 'libraries',
  LIBRARY_ITEMS: import.meta.env.VITE_APPWRITE_COLLECTION_LIBRARY_ITEMS || 'library_items',
  TMDB_MEDIA: import.meta.env.VITE_APPWRITE_COLLECTION_TMDB_MEDIA || 'tmdb_media',
} as const;

export const BUCKETS = {
  AVATARS: import.meta.env.VITE_APPWRITE_BUCKET_AVATARS || 'avatars',
} as const;

export default client;
