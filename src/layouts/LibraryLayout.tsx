import { Outlet } from 'react-router';
import { GalleryVerticalEnd, HelpCircle, ArrowUp, ArrowDown, PanelLeftClose } from 'lucide-react';
import { Select, SelectItem, SelectSection } from '@heroui/select';
import { Button } from '@heroui/button';
import { useState, useEffect, useRef } from 'react';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import { useQueryState } from 'nuqs';
import { useLibraryStore } from '@/stores/useLibraryStore';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import KeyboardShortcuts from '@/components/library/KeyboardShortcuts';

export default function LibraryLayout() {
  const [query, setQuery] = useQueryState('query', { defaultValue: '' });
  const [sortBy, setSortBy] = useQueryState('sort', { defaultValue: 'recent' });
  const [sortDir, setSortDir] = useQueryState('dir', { defaultValue: 'desc' });
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showTabs, setShowTabs] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { getCount } = useLibraryStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case '?':
          e.preventDefault();
          setShowKeyboardShortcuts(!showKeyboardShortcuts);
          break;
        case '/':
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case 't':
          e.preventDefault();
          setShowTabs(!showTabs);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showKeyboardShortcuts, showTabs]);

  return (
    <div className='relative flex h-full flex-col gap-6 overflow-hidden lg:flex-row lg:gap-10'>
      <Tabs
        className={`absolute z-20 flex-col bg-transparent transition-transform duration-300 lg:flex-col ${showTabs ? 'translate-x-0' : '-translate-x-full'}`}
        tabClassName='px-3 lg:px-4 text-sm lg:text-base'
        tabs={[
          {
            label: `All (${getCount('all')})`,
            icon: <GalleryVerticalEnd className='size-4' />,
            includes: true,
            value: 'all',
            link: '/library/all',
          },
          ...LIBRARY_MEDIA_STATUS.map((status) => {
            const IconComponent = status.icon;
            return {
              label: `${status.label} (${getCount(status.value)})`,
              icon: <IconComponent className='size-4' />,
              value: status.value,
              link: `/library/${status.value}`,
            };
          }),
        ]}
      />

      <div
        className={`flex flex-col gap-8 transition-all duration-300 ${showTabs ? 'w-[calc(100%-260px)] translate-x-[260px]' : 'w-full translate-x-0'}`}
      >
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <Input
            type='text'
            icon='search'
            parentClassname='w-full lg:w-1/3'
            name='search'
            defaultValue={query}
            label='Search Your Library'
            placeholder='Search by title...'
            ref={searchInputRef}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className='flex w-full gap-2 lg:w-auto lg:min-w-fit'>
            <Button
              isIconOnly
              className='button-secondary'
              onPress={() => setShowTabs(!showTabs)}
              aria-label='Toggle tabs visibility'
            >
              {showTabs ? <PanelLeftClose className='size-4' /> : <PanelLeftClose className='size-4 rotate-180' />}
            </Button>
            <Select
              placeholder='Sort by'
              classNames={{
                trigger: 'bg-white/5 border-2 border-white/5 w-54 backdrop-blur-md hover:bg-white/10!',
                popoverContent: 'text-default-500 bg-blur backdrop-blur-md',
                selectorIcon: 'text-Grey-600',
                listbox: '[&:>li]-data-[hover=true]:bg-blur!',
                label: 'text-white/60 font-medium text-xs uppercase border-b border-white/10 pb-1.5 mb-1.5',
              }}
              aria-label='Sort options'
              selectedKeys={[sortBy, sortDir]}
              value={sortBy}
            >
              <SelectSection title='Sort By' showDivider>
                <SelectItem key='recent' onPress={() => setSortBy('recent')}>
                  Recently Added
                </SelectItem>
                <SelectItem key='title' onPress={() => setSortBy('title')}>
                  Title
                </SelectItem>
                <SelectItem key='rating' onPress={() => setSortBy('rating')}>
                  Your Rating
                </SelectItem>
                <SelectItem key='date' onPress={() => setSortBy('date')}>
                  Release Date
                </SelectItem>
              </SelectSection>

              <SelectSection title='Direction'>
                <SelectItem key='asc' onPress={() => setSortDir('asc')} startContent={<ArrowUp className='size-3.5' />}>
                  Ascending (A-Z, Oldest First)
                </SelectItem>
                <SelectItem
                  key='desc'
                  onPress={() => setSortDir('desc')}
                  startContent={<ArrowDown className='size-3.5' />}
                >
                  Descending (Z-A, Newest First)
                </SelectItem>
              </SelectSection>
            </Select>

            <Button
              isIconOnly
              className='button-secondary'
              onPress={() => setShowKeyboardShortcuts(true)}
              aria-label='Show keyboard shortcuts'
            >
              <HelpCircle className='size-4' />
            </Button>
          </div>
        </div>
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>

      {/* Keyboard shortcuts modal */}
      <KeyboardShortcuts isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
    </div>
  );
}
