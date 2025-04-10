import { auth } from '@/lib/auth';

declare global {
  type Session = typeof auth.$Infer.Session;

  type AuthUser = typeof auth.$Infer.Session.user;
}
