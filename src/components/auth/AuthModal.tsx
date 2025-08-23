import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';
import { Modal } from '@/components/ui/Modal';
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { useAuthStore } from '@/stores/useAuthStore';
import { GOOGLE_ICON } from '@/components/ui/Icons';
import AuthForm from './AuthForm';
import { addToast } from '@heroui/react';
import { Link } from 'react-router';

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
  }),
};

export default function AuthModal() {
  const {
    showAuthModal,
    authModalType,
    closeAuthModal,
    switchAuthMode,
    signInWithGoogle,
    isLoading,
    setPendingOnboarding,
  } = useAuthStore();

  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const [previousType, setPreviousType] = useState<'signin' | 'signup'>('signin');
  const disclosure = useDisclosure({ isOpen: showAuthModal, onClose: closeAuthModal });

  const isSignIn = authModalType === 'signin';

  // Calculate animation direction based on mode change
  const direction =
    authModalType === 'signup' && previousType === 'signin'
      ? 1
      : authModalType === 'signin' && previousType === 'signup'
        ? -1
        : 0;

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    try {
      if (authModalType === 'signup') setPendingOnboarding(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign in failed:', error);
      addToast({
        title: 'Sign in failed',
        description: 'Failed to sign in with Google. Please try again.',
        color: 'danger',
      });
    } finally {
      setIsSigningInWithGoogle(false);
    }
  };

  const handleSwitchMode = (newType: 'signin' | 'signup') => {
    setPreviousType(authModalType);
    switchAuthMode(newType);
  };

  const handleAuthSuccess = () => {
    closeAuthModal();
    if (authModalType === 'signup') setPendingOnboarding(true);
  };

  return (
    <Modal disclosure={disclosure} size='lg'>
      <ModalHeader className='flex flex-col gap-2 p-4'>
        <motion.div
          className='text-center'
          key={authModalType}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className='text-2xl font-bold text-white'>{isSignIn ? 'Welcome Back' : 'Create Account'}</h2>
          <p className='text-Grey-300 text-sm'>
            {isSignIn
              ? 'Sign in to continue tracking your entertainment'
              : 'Join Watchfolio to start tracking your shows and movies'}
          </p>
        </motion.div>
      </ModalHeader>

      <ModalBody className='relative space-y-4'>
        <motion.div
          className='pointer-events-none absolute inset-0 opacity-5'
          animate={{
            background: isSignIn
              ? 'radial-gradient(circle at 30% 30%, rgba(90, 74, 244, 0.3) 0%, transparent 50%)'
              : 'radial-gradient(circle at 70% 70%, rgba(30, 165, 252, 0.3) 0%, transparent 50%)',
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        <div className='relative overflow-hidden'>
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={authModalType}
              custom={direction}
              variants={tabVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{
                x: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 35,
                  mass: 0.8,
                },
                opacity: {
                  duration: 0.3,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 0.3,
                  ease: 'easeOut',
                },
                filter: {
                  duration: 0.2,
                },
              }}
            >
              <AuthForm type={authModalType} onSuccess={handleAuthSuccess} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className='relative flex items-center'>
          <div className='flex-1 border-t border-white/10'></div>
          <span className='text-Grey-400 px-3 text-xs'>or continue with</span>
          <div className='flex-1 border-t border-white/10'></div>
        </div>

        {/* Google Sign In */}
        <Button
          className='w-full bg-white font-medium text-black hover:bg-white/90'
          isLoading={isSigningInWithGoogle}
          isDisabled={isLoading}
          startContent={!isSigningInWithGoogle && GOOGLE_ICON}
          onPress={handleGoogleSignIn}
        >
          Continue with Google
        </Button>

        {/* Account Switch Link */}
        <div className='text-center'>
          <span className='text-Grey-400 text-sm'>
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            className='text-Primary-400 hover:text-Primary-300 ml-1 text-sm transition-colors duration-200'
            onClick={() => handleSwitchMode(isSignIn ? 'signup' : 'signin')}
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </ModalBody>

      <ModalFooter className='pt-2'>
        <p className='text-Grey-400 w-full text-center text-xs'>
          By continuing, you agree to our 
          <Link to='/terms' className='text-Primary-400 hover:text-Primary-300'>
            Terms of Service
          </Link> and
          <Link to='/privacy' className='text-Primary-400 hover:text-Primary-300'>
            Privacy Policy
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
}
