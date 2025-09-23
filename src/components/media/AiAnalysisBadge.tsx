import { Popover, PopoverTrigger, PopoverContent, Button } from '@heroui/react';
import { Info, Sparkles } from 'lucide-react';
import { useState } from 'react';


interface AiAnalysisBadgeProps {
  aiAnalysis: {
    detailed_analysis: string;
    mood_alignment: string;
  };
}

export function AiAnalysisBadge({ aiAnalysis }: AiAnalysisBadgeProps) {
  const [isAiPopoverOpen, setIsAiPopoverOpen] = useState(false);

  return (
    <>
      {/* AI Badge */}
      <div className='absolute top-3 left-3 z-30'>
        <div className='border-Secondary-500/40 bg-Secondary-500/20 text-Secondary-300 flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm'>
          <Sparkles className='h-3 w-3' />
          <span>AI</span>
        </div>
      </div>

      {/* AI Analysis Button */}
      <div className='absolute top-3 right-3 z-30'>
        <Popover backdrop='blur' isOpen={isAiPopoverOpen} onOpenChange={setIsAiPopoverOpen}>
          <PopoverTrigger>
            <Button
              isIconOnly
              size='sm'
              variant='light'
              className='text-Grey-300 border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:text-white'
            >
              <Info className='h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='bg-Grey-900/95 max-w-lg border border-white/10 p-6 backdrop-blur-md'>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <Sparkles className='text-Secondary-400 h-5 w-5' />
                <span className='text-Secondary-300 text-base font-semibold'>AI Analysis</span>
              </div>

              <div className='space-y-3'>
                <div>
                  <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Why this matches your request</h4>
                  <p className='text-Grey-300 text-sm leading-relaxed'>{aiAnalysis.mood_alignment}</p>
                </div>

                <div className='border-t border-white/10 pt-3'>
                  <h4 className='text-Primary-300 mb-2 text-sm font-medium'>Detailed analysis</h4>
                  <p className='text-Grey-300 text-sm leading-relaxed'>{aiAnalysis.detailed_analysis}</p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
