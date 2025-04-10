'use server';

import { common, resetPasswordSchema } from '@/lib/validation';
import { getUrl } from '@/utils';
import { COOKIE_OPTIONS } from '@/utils/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const sendPasswordResetEmail = async (_: unknown, formData: FormData): Promise<FormError | undefined> => {
  // const { account } = await createAdminClient();
  // const email = formData.get('email') as string;
  // const validated = await common.email.safeParseAsync(email);
  // if (!validated.success) return { email: validated.error.formErrors.formErrors };
  // try {
  //   await account.createRecovery(email, `${getUrl()}/reset-password`);
  // } catch (error) {
  //   console.error(error);
  //   return { message: getErrorMessage((error as AppwriteException).type) };
  // }
  // (await cookies()).set('reset-email', Buffer.from(email).toString('base64'), { ...COOKIE_OPTIONS, maxAge: 60 * 60 });
  // redirect('/forgot-password/sent');
};

export const resetPassword = async (
  { userId, secret }: { userId?: string; secret?: string },
  formData: FormData
): Promise<FormError | undefined> => {
  // const { account, users } = await createAdminClient();
  // const data = Object.fromEntries(formData);
  // if (!userId || !secret) return { message: 'Invalid link or link expired. Please request a new one.' };
  // const validated = await resetPasswordSchema.safeParseAsync(data);
  // if (!validated.success) return validated.error.formErrors.fieldErrors;
  // try {
  //   await account.updateRecovery(userId, secret, data.password as string);
  // } catch (error) {
  //   console.error(error);
  //   return { message: getErrorMessage((error as AppwriteException).type) };
  // }
  // const token = await users.createToken(userId, 12, 60 * 5);
  // (await cookies()).delete('reset-email');
  // (await cookies()).set('rs', 'true', { ...COOKIE_OPTIONS, maxAge: 60 * 5 });
  // redirect(`/reset-password/success?userId=${userId}&secret=${token.secret}`);
};

export const signInMagically = async (userId?: string, secret?: string): Promise<FormError | undefined> => {
  // const { account } = await createAdminClient();
  // if (!userId || !secret) redirect('/forgot-password');
  // try {
  //   const session = await account.createSession(userId, secret);
  //   (await cookies()).set('session', session.secret, COOKIE_OPTIONS);
  //   (await cookies()).delete('rs');
  // } catch (error) {
  //   console.error(error);
  //   return { message: getErrorMessage((error as AppwriteException).type) };
  // }
};
