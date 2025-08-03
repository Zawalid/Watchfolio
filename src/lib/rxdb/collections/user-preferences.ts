import { ID } from 'appwrite';
import { getWatchfolioDB } from '../database';
import type {
    WatchfolioUserPreferences
} from '../types';

// ===== USER PREFERENCES CRUD OPERATIONS =====

export const getUserPreferences = async (
    userId: string
): Promise<WatchfolioUserPreferences | null> => {
    const db = await getWatchfolioDB();
    const doc = await db.userPreferences.findOne({
        selector: { userId }
    }).exec();
    return doc ? doc.toJSON() : null;
};

export const createUserPreferences = async (
    preferencesData: Omit<WatchfolioUserPreferences, 'id'>
): Promise<WatchfolioUserPreferences> => {
    const db = await getWatchfolioDB();
    const doc = await db.userPreferences.insert({
        id: ID.unique(),
        ...preferencesData
    });
    return doc.toJSON();
};

export const updateUserPreferences = async (
    userId: string,
    preferencesData: Partial<WatchfolioUserPreferences>
): Promise<WatchfolioUserPreferences> => {
    const db = await getWatchfolioDB();
    const doc = await db.userPreferences.findOne({
        selector: { userId }
    }).exec();
    if (!doc) throw new Error('User preferences not found');

    await doc.update({
        $set: preferencesData
    });
    return doc.toJSON();
};

export const deleteUserPreferences = async (
    userId: string
): Promise<void> => {
    const db = await getWatchfolioDB();
    const doc = await db.userPreferences.findOne({
        selector: { userId }
    }).exec();
    if (!doc) throw new Error('User preferences not found');

    await doc.remove();
};

// ===== UTILITY OPERATIONS =====

export const getOrCreateUserPreferences = async (
    userId: string
): Promise<WatchfolioUserPreferences> => {
    const existing = await getUserPreferences(userId);

    if (existing) {
        return existing;
    }

    // Create with default values
    return createUserPreferences({
        userId,
        signOutConfirmation: 'enabled',
        theme: 'system',
        language: 'en',
        clearLibraryConfirmation: 'enabled',
        removeFromLibraryConfirmation: 'enabled',
        enableAnimations: 'enabled',
        defaultMediaStatus: 'none',
        autoSync: true
    });
};

export const updatePreference = async <K extends keyof WatchfolioUserPreferences>(
    userId: string,
    key: K,
    value: WatchfolioUserPreferences[K]
): Promise<WatchfolioUserPreferences> => {
    return updateUserPreferences(userId, { [key]: value } as Partial<WatchfolioUserPreferences>);
};

// ===== SPECIFIC PREFERENCE HELPERS =====

export const updateTheme = async (
    userId: string,
    theme: 'light' | 'dark' | 'system'
): Promise<WatchfolioUserPreferences> => {
    return updatePreference(userId, 'theme', theme);
};

export const updateLanguage = async (
    userId: string,
    language: string
): Promise<WatchfolioUserPreferences> => {
    return updatePreference(userId, 'language', language);
};

export const updateDefaultMediaStatus = async (
    userId: string,
    status: WatchfolioUserPreferences['defaultMediaStatus']
): Promise<WatchfolioUserPreferences> => {
    return updatePreference(userId, 'defaultMediaStatus', status);
};

export const toggleAutoSync = async (
    userId: string
): Promise<WatchfolioUserPreferences> => {
    const preferences = await getUserPreferences(userId);
    if (!preferences) throw new Error('User preferences not found');

    return updatePreference(userId, 'autoSync', !preferences.autoSync);
};

export const updateConfirmationSetting = async (
    userId: string,
    setting: 'signOutConfirmation' | 'clearLibraryConfirmation' | 'removeFromLibraryConfirmation',
    value: 'enabled' | 'disabled'
): Promise<WatchfolioUserPreferences> => {
    return updatePreference(userId, setting, value);
};