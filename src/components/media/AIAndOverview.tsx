import { Info, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@heroui/react';
import { useState } from 'react';

export function AiAndOverview({
  overview,
  aiAnalysis,
}: {
  overview?: string;
  aiAnalysis?: { detailed_analysis: string; mood_alignment: string };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasAiAnalysis = !!aiAnalysis;
  const hasOverview = !!overview;

  if (!hasAiAnalysis && !hasOverview) return null;

  return (
    <>
      {/* Toggler Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className={`absolute top-3 z-35 ${isOpen ? 'right-3' : 'left-3'}`}
      >
        <Button
          isIconOnly
          size='sm'
          tabIndex={-1}
          className='h-8 w-8 border border-white/30 bg-white/15 text-white backdrop-blur-xl transition-all hover:border-white/50 hover:bg-white/25'
          onPress={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close' : hasAiAnalysis ? 'View AI Analysis' : 'View Overview'}
        >
          {isOpen ? (
            <X className='size-3.5' />
          ) : hasAiAnalysis ? (
            <Sparkles className='size-3.5' />
          ) : (
            <Info className='size-3.5' />
          )}
        </Button>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='from-Grey-900/98 to-Grey-800/98 absolute inset-0 z-30 rounded-2xl bg-gradient-to-br p-5 backdrop-blur-xl'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className='flex h-full flex-col space-y-4'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className='flex items-center gap-2'>
                {hasAiAnalysis ? (
                  <>
                    <Sparkles className='text-Secondary-400 h-5 w-5' />
                    <span className='text-Secondary-300 text-base font-semibold'>AI Analysis</span>
                  </>
                ) : (
                  <>
                    <Info className='text-Primary-400 h-5 w-5' />
                    <span className='text-Primary-300 text-base font-semibold'>Overview</span>
                  </>
                )}
              </div>

              {/* Content */}
              <div className='flex-1 space-y-4 overflow-y-auto'>
                {hasAiAnalysis ? (
                  <>
                    <div>
                      <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Why this matches</h4>
                      <p className='text-Grey-300 text-sm leading-relaxed'>{aiAnalysis.mood_alignment}</p>
                    </div>

                    <div className='border-t border-white/10 pt-3'>
                      <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Detailed analysis</h4>
                      <p className='text-Grey-300 text-sm leading-relaxed'>{aiAnalysis.detailed_analysis}</p>
                    </div>
                  </>
                ) : (
                  overview && <p className='text-Grey-300 text-sm leading-relaxed'>{overview}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
