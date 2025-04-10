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
