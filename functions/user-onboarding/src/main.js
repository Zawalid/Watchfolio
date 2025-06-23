import { Client, Databases, ID, Permission, Role, Query, Users } from 'node-appwrite';

function setPermissions(userId) {
  return [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ];
}

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const PROFILES_COLLECTION_ID = process.env.APPWRITE_PROFILES_COLLECTION_ID;
const PREFERENCES_COLLECTION_ID = process.env.APPWRITE_PREFERENCES_COLLECTION_ID;
const LIBRARIES_COLLECTION_ID = process.env.APPWRITE_LIBRARIES_COLLECTION_ID;

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(req.variables.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(req.variables.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.variables.APPWRITE_API_KEY);

  const databases = new Databases(client);
  const users = new Users(client);

  try {
    log('🚀 User onboarding function started');

    // Get the registered user
    const user = await users.get(req.body.userId);

    // Check if the user is already onboarded
    const profileList = await databases.listDocuments(DATABASE_ID, PROFILES_COLLECTION_ID, [
      Query.equal('userId', user.$id),
    ]);

    if (profileList.documents.length > 0) {
      log('✅ User already onboarded:', user.email);
      return res.json({ success: true, message: 'User already onboarded' });
    }

    log('🔄 Onboarding user:', user.email);

    // Create user's library
    const library = await databases.createDocument(
      DATABASE_ID,
      LIBRARIES_COLLECTION_ID,
      ID.unique(),
      {},
      setPermissions(user.$id)
    );

    // Create user's preferences
    const preferences = await databases.createDocument(
      DATABASE_ID,
      PREFERENCES_COLLECTION_ID,
      ID.unique(),
      {
        signOutConfirmation: 'enabled',
        removeFromLibraryConfirmation: 'enabled',
        clearLibraryConfirmation: 'enabled',
        theme: 'system',
        language: 'en',
      },
      setPermissions(user.$id)
    );

    // Create user's profile and link it with library and preferences
    const baseUsername = user.email.split('@')[0];
    const timestamp = Date.now().toString(36);
    const username = `${baseUsername}_${timestamp}`;

    const profile = await databases.createDocument(
      DATABASE_ID,
      PROFILES_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        name: user.name,
        email: user.email,
        username,
        avatarUrl: `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(name)}`,
        mediaPreference: 'both',
        library,
        preferences
      },
      setPermissions(user.$id)
    )

    log('🔄 User onboarded successfully: ', user.email);
  } catch (err) {
    error('❌ User onboarding failed:', err.message);
    return res.json({
      success: false,
      error: err.message,
      details: err,
    });
  }
};
