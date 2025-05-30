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


export const RATING_LABELS = {
  1: 'Terrible',
  2: 'Poor',
  3: 'Below Average',
  4: 'Disappointing',
  5: 'Average',
  6: 'Good',
  7: 'Very Good',
  8: 'Great',
  9: 'Excellent',
  10: 'Masterpiece',
} as const;
