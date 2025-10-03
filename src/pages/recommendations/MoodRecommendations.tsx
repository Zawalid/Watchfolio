import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { MoodSelector } from '@/components/recommendations/MoodSelector';
import { RecommendationsList } from '@/components/recommendations/RecommendationsList';
import { useInfiniteLibraryItems } from '@/hooks/library/useLibraryQueries';
import { useAuthStore } from '@/stores/useAuthStore';

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
    duration: '',
  });

  const { user } = useAuthStore();

  const { data: libraryPages } = useInfiniteLibraryItems({ status: 'all' }, { enabled: true });

  const allLibraryItems = libraryPages?.pages.flat() || [];

  usePageTitle('AI Recommendations');

  const handleDescriptionSubmit = (description: string) => {
    setSelectedDescription(description);
  };

  const handleBackToInput = () => {
    setSelectedDescription(null);
  };
  if (!selectedDescription) {
    return (
      <MoodSelector
        onMoodSelect={handleDescriptionSubmit}
        preferences={preferences}
        onPreferencesChange={setPreferences}
      />
    );
  }
  return (
    <RecommendationsList
      description={selectedDescription}
      userLibrary={allLibraryItems}
      preferences={preferences}
      userProfile={user?.profile}
      onBack={handleBackToInput}
    />
  );
}
