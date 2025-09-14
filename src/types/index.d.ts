import { Profile } from "@/lib/appwrite/types";

declare global {
type Link = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  checks?: string[];
};

type Links = {
  authenticated: Link[];
  unauthenticated: Link[];
};

type FormError = {
  email?: string[];
  password?: string[];
  name?: string[];
  message?: string;
  confirm_password?: string[];
};

type Disclosure = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

type Categories = 'popular' | 'top-rated' | 'now-playing' | 'upcoming' | 'on-tv' | 'airing-today';

interface UserProfile {
  profile: Profile;
  stats: LibraryStats;
  recentActivity: Activity[];
}

// ======
type Theme = 'light' | 'dark' | 'system';
type FavoriteContentType = 'movies' | 'tv' | 'both';
type ConfirmationPreferences = 'signOutConfirmation' | 'removeFromLibraryConfirmation' | 'clearLibraryConfirmation';
type ConfirmationKeys = 'sign-out' | 'remove-from-library' | 'clear-library' | 'delete-account';

}