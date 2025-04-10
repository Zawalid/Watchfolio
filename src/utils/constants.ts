export const COOKIE_OPTIONS: {
  path: string;
  httpOnly: boolean;
  sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
  secure: boolean;
} = {
  path: '/',
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
};


export const TABS_INDICATORS = {
  popular: { left: 8, width: 102 },
  'top-rated': { left: 135, width: 118 },
  'now-playing': { left: 273, width: 134 },
  upcoming: { left: 426, width: 118 },
  'airing-today': { left: 273, width: 133 },
  'on-tv': { left: 426, width: 93 },
};
