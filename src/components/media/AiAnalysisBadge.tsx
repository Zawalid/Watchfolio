import { Button } from '@heroui/react';
import { Info, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiAnalysisBadgeProps {
  aiAnalysis: {
    detailed_analysis: string;
    mood_alignment: string;
  };
  onExpandChange?: (expanded: boolean) => void;
}

export function AiAnalysisBadge({ aiAnalysis, onExpandChange }: AiAnalysisBadgeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onExpandChange?.(newState);
  };

  return (
    <>
      {/* AI Badge */}
      <div className='absolute top-3 left-3 z-30'>
        <div className='border-Secondary-500/40 bg-Secondary-500/20 text-Secondary-300 flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm'>
          <Sparkles className='h-3 w-3' />
          <span>AI Pick</span>
        </div>
      </div>

      {/* AI Analysis Toggle Button */}
      <div className='absolute top-3 right-3 z-30'>
        <Button
          isIconOnly
          size='sm'
          variant='light'
          onPress={handleToggle}
          className='text-Grey-300 border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white'
        >
          {isExpanded ? <X className='h-4 w-4' /> : <Info className='h-4 w-4' />}
        </Button>
      </div>

      {/* Expanded AI Analysis Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='absolute inset-0 z-20 rounded-2xl bg-gradient-to-br from-Grey-900/98 to-Grey-800/98 p-5 backdrop-blur-xl'
            onClick={handleToggle}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className='flex h-full flex-col space-y-4'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex items-center gap-2'>
                <Sparkles className='text-Secondary-400 h-5 w-5' />
                <span className='text-Secondary-300 text-base font-semibold'>AI Analysis</span>
              </div>

              <div className='flex-1 space-y-4 overflow-y-auto'>
                <div>
                  <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Why this matches</h4>
                  <p className='text-Grey-300 text-sm leading-relaxed'>{aiAnalysis.mood_alignment}</p>
                </div>

                <div className='border-t border-white/10 pt-3'>
                  <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Detailed analysis</h4>
                  <p className='text-Grey-300 text-sm leading-relaxed'>{aiAnalysis.detailed_analysis}</p>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
