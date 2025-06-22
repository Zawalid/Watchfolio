// Avatar utility functions

export const AVATAR_STYLES = {
  'fun-emoji': 'Fun Emoji',
  avataaars: 'Avataaars',
  initials: 'Initials',
  'pixel-art': 'Pixel Art',
  bottts: 'Robots',
  identicon: 'Identicon',
} as const;

export type AvatarStyle = keyof typeof AVATAR_STYLES;

/**
 * Generate a default avatar URL based on name
 */
export const getDefaultAvatarUrl = (name: string, style: AvatarStyle = 'fun-emoji'): string => {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(name)}`;
};

/**
 * Generate a random avatar URL
 */
export const generateRandomAvatar = (style?: AvatarStyle): string => {
  const selectedStyle =
    style || (Object.keys(AVATAR_STYLES)[Math.floor(Math.random() * Object.keys(AVATAR_STYLES).length)] as AvatarStyle);
  const randomSeed = Math.random().toString(36).substring(2, 15);
  return `https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${randomSeed}`;
};

/**
 * Validate if a URL is likely a valid avatar URL
 */
export const validateAvatarUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);

    // Check for common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|svg|webp)$/i;

    // Check for known avatar services
    const knownServices = [
      'dicebear.com',
      'gravatar.com',
      'github.com',
      'githubusercontent.com',
      'cloudinary.com',
      'imgur.com',
    ];

    return (
      imageExtensions.test(parsedUrl.pathname) || knownServices.some((service) => parsedUrl.hostname.includes(service))
    );
  } catch {
    return false;
  }
};

/**
 * Get avatar URL with fallback
 */
export const getAvatarWithFallback = (avatarUrl: string | null | undefined, name: string): string => {
  if (avatarUrl && validateAvatarUrl(avatarUrl)) {
    return avatarUrl;
  }
  return getDefaultAvatarUrl(name);
};
