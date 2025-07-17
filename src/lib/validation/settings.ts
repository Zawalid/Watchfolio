import { z } from 'zod';

export const common = {
  name: z
    .string()
    .min(1, { message: 'Please enter your name' })
    .min(3, { message: 'Name must be at least 3 characters long' }),
  email: z
    .string()
    .min(1, { message: 'Please enter your email address' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(8, { message: 'Password must be more than 8 characters' })
    .max(32, { message: 'Password must be less than 32 characters' }),
};

export const profileInfoSchema = z.object({
  name: common.name,
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be 30 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  bio: z
    .string()
    .min(1, { message: 'Please enter your bio' })
    .min(10, { message: 'Bio must be at least 10 characters long' })
    .max(500, { message: 'Bio must be less than 500 characters' })
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

export const privacySchema = z.object({
  visibility: z.enum(['public', 'private']),
  hiddenProfileSections: z.array(
    z.enum([
      'stats',
      'taste',
      'library',
      'library.watching',
      'library.completed',
      'library.willWatch',
      'library.onHold',
      'library.dropped',
      'library.favorites',
    ])
  ),
});

export const changeEmailSchema = z
  .object({ email: common.email, confirm_email: common.email, password: common.password })
  .refine((data) => data.email === data.confirm_email, {
    message: 'Emails do not match. Please check the email and confirm email.',
    path: ['confirm_email'],
  });

export const viewingTasteSchema = z.object({
  favoriteContentType: z.enum(['movies', 'tv', 'both']),
  favoriteGenres: z.array(z.number()).max(5, 'You can select up to 5 genres.'),
  favoriteNetworks: z.array(z.number()).max(5, 'You can select up to 5 networks.'),
  contentPreferences: z.array(z.string()),
});

export const changePasswordSchema = z
  .object({ password: common.password, new_password: common.password, confirm_password: common.password })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match. Please check the password and confirm password.',
    path: ['confirm_password'],
  });

export const resetPasswordSchema = z
  .object({ password: common.password, confirm_password: common.password })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match. Please check the password and confirm password.',
    path: ['confirm_password'],
  });
