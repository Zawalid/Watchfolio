type Link = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  checks?: string[];
};

declare type Links = {
  authenticated: Link[];
  unauthenticated: Link[];
};

declare type FormError = {
  email?: string[];
  password?: string[];
  name?: string[];
  message?: string;
  confirm_password?: string[];
};

declare type Disclosure = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
};

declare type Categories = 'popular' | 'top-rated' | 'now-playing' | 'upcoming' | 'on-tv' | 'airing-today';
