import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/button';
import { Modal } from './ui/Modal';
import { ModalBody, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { useAuthStore } from '@/stores/useAuthStore';
import { GOOGLE_ICON } from './ui/Icons';
import AuthForm from './auth/AuthForm';
import { addToast } from '@heroui/toast';

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function AuthModal() {
  const { showAuthModal, authModalType, closeAuthModal, switchAuthMode, signInWithGoogle, isLoading } = useAuthStore();

  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);
  const disclosure = useDisclosure({ isOpen: showAuthModal, onClose: closeAuthModal });

  const isSignIn = authModalType === 'signin';

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true);
    try {
      await signInWithGoogle();
      closeAuthModal();
      addToast({
        title: 'Welcome!',
        description: 'You have successfully signed in.',
        color: 'success',
      });
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
    switchAuthMode(newType);
  };

  return (
    <Modal disclosure={disclosure} size='md'>
      <ModalHeader className='flex flex-col gap-2 pb-4'>
        <div className='flex items-center justify-center gap-1'>
          {(['signin', 'signup'] as const).map((type) => (
            <Button
              key={type}
              variant={authModalType === type ? 'flat' : 'light'}
              color={authModalType === type ? 'primary' : 'default'}
              size='sm'
              className='flex-1'
              onPress={() => handleSwitchMode(type)}
            >
              {type === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          ))}
        </div>

        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white'>{isSignIn ? 'Welcome Back' : 'Create Account'}</h2>
          <p className='text-Grey-300 text-sm'>
            {isSignIn
              ? 'Sign in to continue tracking your entertainment'
              : 'Join Watchfolio to start tracking your shows and movies'}
          </p>
        </div>
      </ModalHeader>

      <ModalBody className='space-y-4'>
        {/* Auth Form Content */}
        <div className='relative overflow-hidden'>
          <AnimatePresence mode='wait' custom={isSignIn ? -1 : 1}>
            <motion.div
              key={authModalType}
              custom={isSignIn ? -1 : 1}
              variants={tabVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
            >
              <AuthForm type={authModalType} onSuccess={closeAuthModal} />
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
      </ModalBody>

      <ModalFooter className='pt-2'>
        <p className='text-Grey-400 w-full text-center text-xs'>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </ModalFooter>
    </Modal>
  );
}
