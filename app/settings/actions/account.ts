'use server';

import { signOutAction } from '@/lib/actions/auth';
import { getUrl } from '@/utils';
import { revalidatePath } from 'next/cache';

export const sendVerificationEmail = async (): Promise<FormError | undefined> => {};

export const updateEmail = async (email: string, password: string) => {};

export const updateName = async (name: string) => {};

export const updateProfile = async (data: Partial<User>, updated: string[]) => {};

export const updatePassword = async (password: string, newPassword: string) => {};

export const deleteAccount = async () => {};
