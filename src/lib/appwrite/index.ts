import { Client, Account,  TablesDB, Storage, Functions, Locale } from 'appwrite';

const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const locale = new Locale(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'watchfolio';
export const TABLES = {
    PROFILES: import.meta.env.VITE_APPWRITE_COLLECTION_PROFILES || 'users_profiles',
    USER_PREFERENCES: import.meta.env.VITE_APPWRITE_COLLECTION_USER_PREFERENCES || 'users_preferences',
    LIBRARIES: import.meta.env.VITE_APPWRITE_COLLECTION_LIBRARIES || 'libraries',
    LIBRARY_MEDIA: import.meta.env.VITE_APPWRITE_COLLECTION_LIBRARY_MEDIA || 'library_media',
} as const;

export const BUCKETS = {
    AVATARS: import.meta.env.VITE_APPWRITE_BUCKET_AVATARS || 'avatars',
} as const;

export default client;