import Form from '@/app/(auth-flow)/components/AuthForm';

export const metadata = {
  title: 'Sign In | Watchfolio',
  description: 'Sign In page',
};

export default function Page() {
  return <Form type='signin' />;
}
