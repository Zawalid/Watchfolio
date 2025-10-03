import { useState } from 'react';
import { Button, Select, SelectItem } from '@heroui/react';
import { SELECT_CLASSNAMES } from '@/styles/heroui';
import { Search } from 'lucide-react';
import { ShortcutKey } from '@/components/ui/ShortcutKey';

interface Preferences {
  contentType: string;
  decade: string;
  duration: string;
}

interface MoodSelectorProps {
  onMoodSelect: (description: string) => void;
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
}

const DECADES = [
  { value: '', label: 'Any Decade' },
  { value: '2020s', label: '2020s' },
  { value: '2010s', label: '2010s' },
  { value: '2000s', label: '2000s' },
  { value: '1990s', label: '1990s' },
  { value: '1980s', label: '1980s' },
  { value: '1970s', label: '1970s' },
  { value: 'classic', label: 'Classic (Pre-1970)' },
];

const DURATIONS = [
  { value: '', label: 'Any Length' },
  { value: 'short', label: 'Short (< 90 min)' },
  { value: 'medium', label: 'Medium (90-150 min)' },
  { value: 'long', label: 'Long (> 150 min)' },
];

const CONTENT_TYPES = [
  { value: 'both', label: 'Movies & TV Shows' },
  { value: 'movies', label: 'Movies Only' },
  { value: 'tv', label: 'TV Shows Only' },
];

const EXAMPLE_PROMPTS = [
  'Something cozy for a rainy Sunday afternoon',
  'Adrenaline-pumping action that keeps me on edge',
  'Mind-bending thriller that makes me question reality',
  'Feel-good comedy to lift my spirits',
  'Dark and atmospheric mystery series',
  'Epic fantasy adventure to escape into',
];

export function MoodSelector({ onMoodSelect, preferences, onPreferencesChange }: MoodSelectorProps) {
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handlePreferenceChange = (key: keyof Preferences, value: string) => {
    onPreferencesChange({
      ...preferences,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;

    const trimmedDescription = description.trim();

    // Add to history if it's not already the most recent
    if (requestHistory[0] !== trimmedDescription) {
      const newHistory = [trimmedDescription, ...requestHistory.filter(item => item !== trimmedDescription)].slice(0, 10);
      setRequestHistory(newHistory);
      console.log('Added to history:', { newRequest: trimmedDescription, historyLength: newHistory.length, history: newHistory });
    }
    setHistoryIndex(-1);

    setIsLoading(true);
    try {
      await onMoodSelect(trimmedDescription);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (requestHistory.length === 0) return;

    let newIndex = historyIndex;

    if (direction === 'up') {
      // Go to older items (higher index)
      newIndex = historyIndex < requestHistory.length - 1 ? historyIndex + 1 : requestHistory.length - 1;
    } else {
      // Go to newer items (lower index) or back to current input
      newIndex = historyIndex > -1 ? historyIndex - 1 : -1;
    }

    setHistoryIndex(newIndex);
    setDescription(newIndex === -1 ? '' : requestHistory[newIndex]);

    console.log('History navigation:', { direction, newIndex, historyLength: requestHistory.length, newDescription: newIndex === -1 ? '' : requestHistory[newIndex] });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('Key pressed:', { key: e.key, ctrl: e.ctrlKey, meta: e.metaKey });

    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      console.log('Submitting via keyboard shortcut');
      handleSubmit();
    } else if (e.key === 'ArrowUp' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      console.log('Navigating history up');
      navigateHistory('up');
    } else if (e.key === 'ArrowDown' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      console.log('Navigating history down');
      navigateHistory('down');
    }
  };

  return (
    <div className='space-y-8 pt-14'>
      {/* Main Heading Section */}
      <div className='space-y-4 text-center'>
        <h1 className='heading gradient xs:text-2xl text-xl sm:text-3xl lg:text-4xl'>Discover Your Next Obsession</h1>
        <p className='text-Grey-400 md:text-lg xs:text-sm text-xs'>Tell us your vibe, and we'll curate personalized recommendations from your watchlist and beyond</p>
      </div>

      {/* AI Chat Input Section */}
      <div className='mx-auto max-w-4xl space-y-6 px-4 sm:px-0'>
        {/* Chat-style Input Container */}
        <div className='relative'>
          <div className='rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] backdrop-blur-md sm:rounded-3xl'>
            <div className='p-5 sm:p-6'>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Describe your mood, genre preferences, or the vibe you're going for... Use Ctrl+↑/↓ to browse previous searches"
                rows={2}
                className='placeholder:text-Grey-400 w-full resize-none border-0 bg-transparent text-xs xs:text-sm md:text-base leading-relaxed text-white focus:outline-none focus:ring-0'
              />

              {/* Bottom Bar with Shortcuts and Button */}
              <div className='mt-4 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
                <div className='text-Grey-500 hidden items-center gap-4 text-xs sm:flex'>
                  <div className='flex items-center gap-1.5'>
                    <ShortcutKey shortcut='Ctrl Enter' className='kbd-sm' />
                    <span>to search</span>
                  </div>
                  {requestHistory.length > 0 && (
                    <div className='flex items-center gap-1.5'>
                      <ShortcutKey shortcut='Ctrl ↑ ↓' className='kbd-sm' />
                      <span>history ({requestHistory.length}/10)</span>
                      {historyIndex !== -1 && (
                        <span className='text-Primary-400 font-medium'>
                          [{historyIndex + 1}/{requestHistory.length}]
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  onPress={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={!description.trim()}
                  className='button-primary h-9 w-full text-sm sm:ml-auto sm:h-10 sm:w-auto'
                  startContent={!isLoading && <Search className='h-4 w-4' />}
                >
                  {isLoading ? 'Searching...' : 'Find My Matches'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className='space-y-4'>
          <p className='text-Grey-400 text-center text-sm font-medium'>Not sure what to describe? Try these vibes:</p>
          <div className='flex flex-wrap justify-center gap-2'>
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={async () => {
                  setDescription(prompt);

                  // Add to history using consistent logic
                  if (requestHistory[0] !== prompt) {
                    const newHistory = [prompt, ...requestHistory.filter((item) => item !== prompt)].slice(0, 10);
                    setRequestHistory(newHistory);
                    console.log('Added example to history:', {
                      example: prompt,
                      historyLength: newHistory.length,
                      history: newHistory,
                    });
                  }
                  setHistoryIndex(-1);

                  setIsLoading(true);
                  try {
                    await onMoodSelect(prompt.trim());
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className='pill-bg text-Grey-300 hover:text-Grey-100 mobile:w-fit w-full rounded-full px-3 py-1.5 text-xs hover:bg-white/10 lg:px-4 lg:py-2 lg:text-sm'
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences - Moved Below and Simplified */}
        <div className='rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.01] to-white/[0.03] p-4 shadow-lg sm:p-6'>
          <div className='mb-4 text-center'>
            <h3 className='mb-2 text-base font-semibold text-white sm:text-lg'>Fine-tune Your Results</h3>
            <p className='text-Grey-400 text-xs sm:text-sm'>Optional filters to personalize your recommendations</p>
          </div>

          <div className='grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3'>
            <div>
              <label htmlFor='content-type' className='text-Grey-400 text-xs font-medium sm:text-sm'>
                Content Type
              </label>
              <Select
                id='content-type'
                placeholder='Any type'
                selectedKeys={[preferences.contentType]}
                onSelectionChange={(keys) => handlePreferenceChange('contentType', Array.from(keys)[0] as string)}
                classNames={SELECT_CLASSNAMES}
                size='sm'
              >
                {CONTENT_TYPES.map((type) => (
                  <SelectItem key={type.value}>{type.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor='decade' className='text-Grey-400 text-xs font-medium sm:text-sm'>
                Decade
              </label>
              <Select
                id='decade'
                placeholder='Any decade'
                selectedKeys={[preferences.decade]}
                onSelectionChange={(keys) => handlePreferenceChange('decade', Array.from(keys)[0] as string)}
                classNames={SELECT_CLASSNAMES}
                size='sm'
              >
                {DECADES.map((decade) => (
                  <SelectItem key={decade.value}>{decade.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor='duration' className='text-Grey-400 text-xs font-medium sm:text-sm'>
                Duration
              </label>
              <Select
                id='duration'
                placeholder='Any duration'
                selectedKeys={[preferences.duration]}
                onSelectionChange={(keys) => handlePreferenceChange('duration', Array.from(keys)[0] as string)}
                classNames={SELECT_CLASSNAMES}
                size='sm'
              >
                {DURATIONS.map((duration) => (
                  <SelectItem key={duration.value}>{duration.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
