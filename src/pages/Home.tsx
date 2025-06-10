import LibraryOverview from '@/components/library/LibraryOverview';
import WelcomeView from '@/components/WelcomeView';

export default function Home() {
  const isFirstVisit = false

  return isFirstVisit ? <WelcomeView /> : <LibraryOverview />;
}
