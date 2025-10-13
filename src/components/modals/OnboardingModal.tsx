import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, ModalHeader } from '@heroui/react';
import { ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import WelcomeStep from '@/components/onboarding/steps/WelcomeStep';
import SetupStep from '@/components/onboarding/steps/SetupStep';
import GetStartedStep from '@/components/onboarding/steps/GetStartedStep';
import { Modal } from '@/components/ui/Modal';
import { ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { ShortcutKey } from '@/components/ui/ShortcutKey';
import { addToast } from '@heroui/react';
import { useHotkeys } from 'react-hotkeys-hook';

const steps = [
  { id: 'welcome', component: WelcomeStep },
  { id: 'setup', component: SetupStep },
  { id: 'get-started', component: GetStartedStep },
];

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function OnboardingModal() {
  const { showOnboardingModal, closeOnboardingModal } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalSteps = steps.length;

  const disclosure = useDisclosure({ isOpen: showOnboardingModal });

  const CurrentStepComponent = steps[currentStep]?.component;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  useHotkeys('left', () => (!isFirstStep ? prevStep() : null), { enabled: showOnboardingModal });
  useHotkeys('right', () => (!isLastStep ? nextStep() : null), { enabled: showOnboardingModal });
  useHotkeys('enter', () => (isLastStep ? handleComplete() : nextStep()), { enabled: showOnboardingModal });

  const nextStep = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleComplete = async () => {
    if (!showOnboardingModal) return;
    try {
      addToast({
        title: 'Welcome to Watchfolio!',
        description: 'Your preferences have been saved. Start exploring and building your watchlist!',
        color: 'success',
      });
      closeOnboardingModal();
    } catch (error) {
      log('ERR', 'Failed to complete onboarding:', error);
      addToast({
        title: 'Error',
        description: 'Failed to save preferences. You can update them later in settings.',
        color: 'danger',
      });
      closeOnboardingModal();
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      nextStep();
    }
  };

  if (!CurrentStepComponent) return null;

  return (
    <Modal
      disclosure={disclosure}
      isDismissable={false}
      size='5xl'
      classNames={{ base: 'full-mobile-modal', closeButton: 'hidden' }}
    >
      <ModalHeader className='border-none p- relative'>
        {!isLastStep && (
          <Button size='sm' className='button-secondary! absolute top-4 right-4' onPress={closeOnboardingModal}>
            <ChevronLast className='h-4 w-4' />
            Skip
          </Button>
        )}
      </ModalHeader>
      <ModalBody>
        <div className='bg-Grey-800 absolute top-0 right-0 left-0 h-1'>
          <motion.div
            className='from-Primary-500 to-Secondary-500 h-full bg-gradient-to-r'
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step content */}
        <div className='relative h-full overflow-y-auto'>
          <AnimatePresence mode='wait' custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className='mobile:p-4 sm:p-8 pt-8'
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </ModalBody>
      <ModalFooter className='mobile:flex-row mobile:items-center mobile:justify-between flex flex-col gap-3'>
        <div className='border-Primary-500/20 bg-Primary-500/10 mobile:block hidden rounded-lg border px-3 py-1.5'>
          <p className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press <ShortcutKey shortcut='← →' /> to navigate
          </p>
        </div>
        <div className='mobile:flex-row mobile:gap-3 flex flex-col-reverse gap-2'>
          {!isFirstStep && (
            <Button className='button-secondary!' startContent={<ChevronLeft className='h-4 w-4' />} onPress={prevStep}>
              Previous
            </Button>
          )}

          <Button
            color='primary'
            className='font-semibold'
            endContent={isLastStep ? null : <ChevronRight className='h-4 w-4' />}
            onPress={handleNext}
          >
            {isLastStep ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
