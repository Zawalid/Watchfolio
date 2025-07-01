import LandingPage from '@/components/LandingPage';
import LibraryOverview from '@/components/library/LibraryOverview';
import WelcomeView from '@/components/WelcomeView';

export default function Home() {
  const isFirstVisit = true

  // return isFirstVisit ? <WelcomeView /> : <LibraryOverview />;
  return <LandingPage />;
}
