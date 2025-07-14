import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import WelcomeStep from './steps/WelcomeStep';
import FeaturesStep from './steps/FeaturesStep';
import SetupStep from './steps/SetupStep';
import GetStartedStep from './steps/GetStartedStep';
import { Modal } from '@/components/ui/Modal';
import { ModalBody, ModalFooter, useDisclosure } from '@heroui/modal';
import { ShortcutKey } from '@/components/ui/ShortcutKey';

const steps = [
  { id: 'welcome', component: WelcomeStep },
  { id: 'features', component: FeaturesStep },
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
  const { showModal, currentStep, totalSteps, closeModal, nextStep, prevStep, completeOnboarding } =
    useOnboardingStore();
  const disclosure = useDisclosure({
    isOpen: showModal,
    onClose: () => {
      closeModal();
      completeOnboarding();
    },
  });

  const CurrentStepComponent = steps[currentStep]?.component;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showModal) return;

      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowRight':
          if (!isLastStep) nextStep();
          break;
        case 'ArrowLeft':
          if (!isFirstStep) prevStep();
          break;
        case 'Enter':
          if (isLastStep) completeOnboarding();
          else nextStep();
          break;
      }
    },
    [showModal, isFirstStep, isLastStep, closeModal, nextStep, prevStep, completeOnboarding]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  if (!CurrentStepComponent) return null;

  return (
    <Modal disclosure={disclosure} size='5xl'>
      <ModalBody className=''>
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
          <AnimatePresence mode='wait' custom={1}>
            <motion.div
              key={currentStep}
              custom={1}
              variants={stepVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className='p-8 pt-12'
            >
              <CurrentStepComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </ModalBody>
      <ModalFooter className='flex items-center justify-between'>
        <div className='border-Primary-500/20 bg-Primary-500/10 rounded-lg border px-3 py-1.5'>
          <p className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press <ShortcutKey shortcut='← →' /> to navigate
          </p>
        </div>
        <div className='flex gap-3'>
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
