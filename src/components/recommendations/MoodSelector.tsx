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
  'I want something funny and light-hearted',
  'Looking for a thrilling action movie',
  'Need something relaxing to watch before bed',
  'Want a mind-bending sci-fi series',
  'Looking for a romantic comedy',
  'Need something dark and mysterious',
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
    <div className='space-y-8'>
      {/* Main Heading Section */}
      <div className='space-y-4 text-center'>
        <h1 className='heading gradient max-mobile:text-3xl max-xs:text-2xl'>What do you want to watch?</h1>
        <p className='text-Grey-400 mx-auto max-w-2xl text-base sm:text-lg'>
          Describe what you're in the mood for and our AI will find perfect recommendations tailored to your taste
        </p>
      </div>

      {/* AI Chat Input Section */}
      <div className='mx-auto max-w-4xl space-y-6'>
        {/* Chat-style Input Container */}
        <div className='relative'>
          <div className='rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] p-1 shadow-2xl backdrop-blur-md'>
            <div className='rounded-3xl bg-gradient-to-b from-white/[0.01] to-white/[0.05] p-5'>
              <div className='flex gap-4'>
                {/* Avatar/Icon */}
                <div className='flex-shrink-0 pt-1'>
                  <div className='from-Primary-500 to-Secondary-500 shadow-Primary-500/25 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br shadow-lg'>
                    <Search className='h-5 w-5 text-white' />
                  </div>
                </div>

                {/* Input Area */}
                <div className='flex-1 space-y-4'>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Tell me what you're in the mood for... Use Ctrl+↑/↓ to browse search history"
                    rows={3}
                    className='placeholder:text-Grey-400 w-full resize-none border-0 bg-transparent text-base leading-relaxed text-white focus:ring-0 focus:outline-none'
                  />

                  {/* Input Actions */}
                  <div className='flex items-center justify-between gap-3'>
                    <div className='text-Grey-500 flex items-center gap-2 text-xs sm:gap-4'>
                      <div className='flex items-center gap-1 sm:gap-2'>
                        <ShortcutKey
                          shortcut='Ctrl Enter'
                          className='kbd-sm'
                        />
                        <span className='hidden sm:inline'>to search</span>
                      </div>
                      {requestHistory.length > 0 && (
                        <div className='hidden sm:flex items-center gap-2'>
                          <ShortcutKey
                            shortcut='Ctrl ↑ ↓'
                            className='kbd-sm'
                          />
                          <span>history ({requestHistory.length}/10)</span>
                          {historyIndex !== -1 && (
                            <span className="text-Primary-400 text-xs font-medium">
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
                      size='sm'
                      className='from-Primary-500 to-Secondary-500 rounded-full bg-gradient-to-r px-6 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
                      startContent={!isLoading && <Search className='h-4 w-4' />}
                    >
                      {isLoading ? 'Searching...' : 'Get Recommendations'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        <div className='space-y-4'>
          <p className='text-Grey-400 text-center text-sm font-medium'>Try these examples:</p>
          <div className='flex flex-wrap justify-center gap-2'>
            {EXAMPLE_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={async () => {
                  setDescription(prompt);

                  // Add to history using consistent logic
                  if (requestHistory[0] !== prompt) {
                    const newHistory = [prompt, ...requestHistory.filter(item => item !== prompt)].slice(0, 10);
                    setRequestHistory(newHistory);
                    console.log('Added example to history:', { example: prompt, historyLength: newHistory.length, history: newHistory });
                  }
                  setHistoryIndex(-1);

                  setIsLoading(true);
                  try {
                    await onMoodSelect(prompt.trim());
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className='text-Grey-300 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm transition-all hover:scale-105 hover:border-white/30 hover:bg-white/10 hover:text-white'
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences - Moved Below and Simplified */}
        <div className='rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.01] to-white/[0.03] p-6 shadow-lg'>
          <div className='mb-4 text-center'>
            <h3 className='mb-2 text-lg font-semibold text-white'>Refine Your Search</h3>
            <p className='text-Grey-400 text-sm'>Optional preferences to narrow down results</p>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div className='space-y-2'>
              <label htmlFor='content-type' className='text-Grey-400 text-sm font-medium'>
                Content Type
              </label>
              <Select
                id='content-type'
                placeholder='Any type'
                selectedKeys={[preferences.contentType]}
                onSelectionChange={(keys) => handlePreferenceChange('contentType', Array.from(keys)[0] as string)}
                classNames={SELECT_CLASSNAMES}
              >
                {CONTENT_TYPES.map((type) => (
                  <SelectItem key={type.value}>{type.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className='space-y-2'>
              <label htmlFor='decade' className='text-Grey-400 text-sm font-medium'>
                Decade
              </label>
              <Select
                id='decade'
                placeholder='Any decade'
                selectedKeys={[preferences.decade]}
                onSelectionChange={(keys) => handlePreferenceChange('decade', Array.from(keys)[0] as string)}
                classNames={SELECT_CLASSNAMES}
              >
                {DECADES.map((decade) => (
                  <SelectItem key={decade.value}>{decade.label}</SelectItem>
                ))}
              </Select>
            </div>

            <div className='space-y-2'>
              <label htmlFor='duration' className='text-Grey-400 text-sm font-medium'>
                Duration
              </label>
              <Select
                id='duration'
                placeholder='Any duration'
                selectedKeys={[preferences.duration]}
                onSelectionChange={(keys) => handlePreferenceChange('duration', Array.from(keys)[0] as string)}
                classNames={SELECT_CLASSNAMES}
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
