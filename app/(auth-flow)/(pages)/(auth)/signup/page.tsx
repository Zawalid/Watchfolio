import Form from '@/app/(auth-flow)/components/AuthForm';

export const metadata = {
  title: 'Sign Up | Watchfolio',
  description: 'Sign up page',
};

export default function Page() {
  return <Form type='signup' />;
}
