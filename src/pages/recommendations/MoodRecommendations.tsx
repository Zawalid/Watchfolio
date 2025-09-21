import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { MoodSelector } from '@/components/recommendations/MoodSelector';
import { RecommendationsList } from '@/components/recommendations/RecommendationsList';
import { useInfiniteLibraryItems } from '@/hooks/library/useLibraryQueries';

interface Preferences {
  contentType: string;
  decade: string;
  duration: string;
}

export default function MoodRecommendations() {
  const [selectedDescription, setSelectedDescription] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<Preferences>({
    contentType: 'both',
    decade: '',
    duration: ''
  });

  const { data: libraryPages } = useInfiniteLibraryItems(
    { status: 'all' },
    { enabled: true }
  );

  const allLibraryItems = libraryPages?.pages.flat() || [];

  usePageTitle('AI Recommendations');

  const handleDescriptionSubmit = (description: string) => {
    setSelectedDescription(description);
  };

  const handleBackToInput = () => {
    setSelectedDescription(null);
  };

  return (
    <div className="space-y-6 py-8 px-4 sm:py-12 sm:px-6 lg:py-16">
      {!selectedDescription ? (
        <MoodSelector
          onMoodSelect={handleDescriptionSubmit}
          preferences={preferences}
          onPreferencesChange={setPreferences}
        />
      ) : (
        <RecommendationsList
          description={selectedDescription}
          userLibrary={allLibraryItems}
          preferences={preferences}
          onBack={handleBackToInput}
        />
      )}
    </div>
  );
}