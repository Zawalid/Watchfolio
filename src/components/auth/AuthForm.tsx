import { type FieldErrors, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@heroui/button';
import { signInSchema, signUpSchema } from '@/lib/validation/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { addToast } from '@heroui/toast';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSuccess?: () => void;
}

type SignInFormData = {
  email: string;
  password: string;
};

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};

export default function AuthForm({ type, onSuccess }: AuthFormProps) {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData | SignUpFormData>({
    resolver: zodResolver(type === 'signin' ? signInSchema : signUpSchema),
    defaultValues: {
      ...(type === 'signup' && { name: 'Walid Zakan' }),
      email: 'walid@gmail.com',
      password: 'password',
    },
  });

  const onSubmit = async (data: SignInFormData | SignUpFormData) => {
    try {
      if (type === 'signin') {
        const { email, password } = data as SignInFormData;
        await signIn(email, password);
        addToast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
          color: 'success',
        });
      } else {
        const { name, email, password } = data as SignUpFormData;
        await signUp(name, email, password);
        addToast({
          title: 'Account created successfully!',
          description: 'You can now log in.',
          color: 'success',
        });
      }

      // Call onSuccess callback if provided (for modal), otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/library');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addToast({
        title: 'Error',
        description: errorMessage,
        color: 'danger',
      });
    }
  };

  const isPending = isLoading || isSubmitting;

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
      {type === 'signup' && (
        <Input
          {...register('name')}
          icon='name'
          label='Name'
          placeholder='eg. John Doe'
          error={(errors as FieldErrors<SignUpFormData>).name?.message}
        />
      )}
      <Input {...register('email')} type='email' label='Email' error={errors.email?.message} />
      <PasswordInput {...register('password')} label='Password' error={errors.password?.message} />
      {type === 'signin' && (
        <button
          type='button'
          className='text-Primary-400 hover:text-Primary-500 ml-auto w-fit text-end text-sm transition-colors duration-200'
          onClick={() => {
            // TODO: Implement forgot password modal or functionality
            addToast({
              title: 'Coming Soon',
              description: 'Password reset functionality will be available soon.',
              color: 'primary',
            });
          }}
        >
          Forgot your password?
        </button>
      )}
      <Button className='w-full' color='primary' type='submit' isLoading={isPending}>
        {type === 'signin' ? (isPending ? 'Signing in...' : 'Sign In') : null}
        {type === 'signup' ? (isPending ? 'Signing up...' : 'Sign Up') : null}
      </Button>
    </form>
  );
}
