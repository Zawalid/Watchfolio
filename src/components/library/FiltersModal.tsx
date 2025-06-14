import { useHotkeys } from 'react-hotkeys-hook';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { CircleCheck, FunnelX, Filter as FilterIcon } from 'lucide-react';
import { ModalBody } from '@heroui/modal';
import Modal from '@/components/ui/Modal';
import { Button } from '@heroui/button';
import { cn } from '@/utils';
import { GENRES, PLATFORMS } from '@/lib/api/TMDB/values';

interface FiltersModalProps {
  disclosure: Disclosure;
}

const getClassName = (isSelected: boolean) =>
  isSelected
    ? 'border-Secondary-400 bg-Secondary-500/20 text-Secondary-50'
    : 'text-Grey-300 border-white/10 bg-gray-800/40 hover:border-white/20 hover:bg-white/10';

export default function FiltersModal({ disclosure }: FiltersModalProps) {
  const { isOpen, onClose, onOpen } = disclosure;
  const [selectedGenres, setSelectedGenres] = useQueryState('genres', parseAsArrayOf(parseAsString));
  const [selectedPlatforms, setSelectedPlatforms] = useQueryState('platforms', parseAsArrayOf(parseAsString));

  useHotkeys('ctrl+shift+f', () => (isOpen ? onClose() : onOpen()), [isOpen]);
  useHotkeys('esc', onClose, { enabled: isOpen });

  const toggleGenre = (genreId: string) => {
    const currentGenres = selectedGenres || [];
    if (currentGenres.includes(genreId)) {
      setSelectedGenres(currentGenres.length > 1 ? currentGenres.filter((g) => g !== genreId) : null);
    } else {
      setSelectedGenres([...currentGenres, genreId]);
    }
  };

  const togglePlatform = (platformId: string) => {
    const currentPlatforms = selectedPlatforms || [];
    if (currentPlatforms.includes(platformId)) {
      setSelectedPlatforms(currentPlatforms.length > 1 ? currentPlatforms.filter((p) => p !== platformId) : null);
    } else {
      setSelectedPlatforms([...currentPlatforms, platformId]);
    }
  };

  return (
    <Modal disclosure={disclosure} classNames={{ base: 'max-w-4xl' }}>
      <ModalBody className='space-y-6 p-6'>
        {/* Header */}
        <div className='flex items-center gap-3'>
          <div className='bg-Primary-500/20 rounded-lg p-2'>
            <FilterIcon className='text-Primary-400 size-5' />
          </div>
          <h2 className='text-Primary-50 text-xl font-semibold'>Apply Filters</h2>
        </div>

        <div className='grid grid-cols-2 gap-8'>
          {/* Genres */}
          <div className='space-y-5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-Primary-50 text-lg font-medium'>Genres</h3>
              {selectedGenres?.length ? (
                <Button isIconOnly size='sm' className='button-secondary' onPress={() => setSelectedGenres(null)}>
                  <FunnelX className='size-4' />
                </Button>
              ) : null}
            </div>
            <div className='flex flex-wrap gap-2'>
              {Object.entries(GENRES).map(([id, label]) => {
                const isSelected = selectedGenres?.includes(label) || false;
                return (
                  <Button
                    key={id}
                    className={cn('pill-bg', getClassName(isSelected))}
                    onPress={() => toggleGenre(label)}
                  >
                    {label}
                    {isSelected && <CircleCheck className='ml-1.5 inline-block size-4 opacity-70' />}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Streaming Platforms */}
          <div className='space-y-5'>
            <div className='flex items-center justify-between'>
              <h3 className='text-Primary-50 text-lg font-medium'>Streaming Platforms</h3>
              {selectedPlatforms?.length ? (
                <Button isIconOnly size='sm' className='button-secondary' onPress={() => setSelectedPlatforms(null)}>
                  <FunnelX className='size-4' />
                </Button>
              ) : null}
            </div>
            <div className='flex flex-wrap gap-2'>
              {PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms?.includes(platform.id) || false;
                return (
                  <Button
                    key={platform.id}
                    className={cn(
                      'grid size-28 place-content-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-all duration-200',
                      getClassName(isSelected)
                    )}
                    onPress={() => togglePlatform(platform.id)}
                  >
                    {platform.logo ? (
                      <img src={platform.logo} alt={platform.label} className='mr-1 inline-block' loading='lazy' />
                    ) : (
                      platform.label
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {(selectedGenres?.length || selectedPlatforms?.length) && (
          <Button
            className='button-secondary'
            onPress={() => {
              setSelectedGenres(null);
              setSelectedPlatforms(null);
            }}
          >
            Clear All Filters
          </Button>
        )}

        <div className='border-Primary-500/20 bg-Primary-500/10 rounded-lg border p-3'>
          <p className='text-Primary-300 text-xs'>
            <span className='font-medium'>Tip:</span> Press{' '}
            <kbd className='bg-Primary-500/20 rounded px-1 py-0.5 text-xs'>Ctrl</kbd> +
            <kbd className='bg-Primary-500/20 ml-1 rounded px-1 py-0.5 text-xs'>F</kbd> to toggle filters
          </p>
        </div>
      </ModalBody>
    </Modal>
  );
}
