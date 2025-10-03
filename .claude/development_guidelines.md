# Watchfolio Development Guidelines

## Code Style Standards

### TypeScript Guidelines
```typescript
// Always use explicit types for function parameters and returns
function addToLibrary(item: LibraryMedia): Promise<void> {
  // Implementation
}

// Use interfaces for object shapes
interface MediaCardProps {
  media: Media;
  tabIndex?: number;
  onSelect?: (media: Media) => void;
}

// Use type unions for constrained values
type LibraryStatus = 'planned' | 'watching' | 'completed' | 'paused' | 'dropped';

// Prefer const assertions for immutable data
const LIBRARY_STATUSES = [
  'planned',
  'watching',
  'completed',
  'paused',
  'dropped'
] as const;
```

### React Component Patterns
```typescript
// Use function components with TypeScript interfaces
interface ComponentProps {
  title: string;
  isLoading?: boolean;
  onAction?: () => void;
}

export function Component({ title, isLoading = false, onAction }: ComponentProps) {
  // Use early returns for conditional rendering
  if (isLoading) {
    return <Skeleton />;
  }

  // Extract complex logic to custom hooks
  const { data, isLoading: dataLoading } = useComponentData();

  return (
    <div className="component-base">
      {/* Implementation */}
    </div>
  );
}
```

### Naming Conventions
```typescript
// Components: PascalCase
MediaCard, LibraryView, SearchModal

// Hooks: camelCase with 'use' prefix
useLibraryItems, useMediaSearch, useAuthState

// Utilities: camelCase
formatDate, generateMediaId, createSlug

// Constants: SCREAMING_SNAKE_CASE
TMDB_API_BASE_URL, DEFAULT_PAGE_SIZE, LIBRARY_STATUSES

// Types/Interfaces: PascalCase
Media, LibraryMedia, UserPreferences

// Files: kebab-case or PascalCase for components
media-card.tsx, MediaCard.tsx, use-library-items.ts
```

## File Organization

### Component Structure
```
components/
├── media/
│   ├── MediaCard/
│   │   ├── index.ts              # Export barrel
│   │   ├── MediaCard.tsx         # Main component
│   │   ├── MediaCard.types.ts    # Type definitions
│   │   ├── MediaCard.test.tsx    # Tests
│   │   └── hooks/                # Component-specific hooks
│   ├── MediaGrid.tsx             # Simple components can be single files
│   └── index.ts                  # Feature barrel export
```

### Hook Organization
```
hooks/
├── library/
│   ├── useLibraryQueries.ts      # Related queries grouped
│   ├── useLibraryMutations.ts    # Related mutations grouped
│   └── index.ts                  # Hook barrel export
├── auth/
├── media/
└── index.ts                      # Global hook exports
```

## Component Development Guidelines

### Props Interface Design
```typescript
// Good: Clear, specific props
interface MediaCardProps {
  media: Media;
  showRating?: boolean;
  onAddToLibrary?: (media: Media) => void;
  isCompact?: boolean;
}

// Avoid: Generic or unclear props
interface MediaCardProps {
  data: any;
  config?: object;
  handlers?: { [key: string]: Function };
}
```

### State Management
```typescript
// Use React Query for server state
const { data: media, isLoading } = useQuery({
  queryKey: ['media', mediaId],
  queryFn: () => tmdbApi.getMedia(mediaId)
});

// Use useState for local component state
const [isExpanded, setIsExpanded] = useState(false);

// Use useReducer for complex local state
const [state, dispatch] = useReducer(complexStateReducer, initialState);

// Use context sparingly, prefer prop drilling for 1-2 levels
const theme = useContext(ThemeContext);
```

### Error Handling
```typescript
// Query error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  onError: (error) => {
    // Log error for debugging
    console.error('Query failed:', error);

    // Show user-friendly message
    toast.error('Failed to load data. Please try again.');
  }
});

// Component error boundaries
if (error) {
  return (
    <div className="error-container">
      <h3>Something went wrong</h3>
      <button onClick={() => refetch()}>Try Again</button>
    </div>
  );
}
```

## Styling Guidelines

### Tailwind CSS Usage
```typescript
// Prefer utility classes over custom CSS
<div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] p-6 shadow-lg">

// Use design system utilities
<div className="card-base card-hover">

// Responsive design mobile-first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

// Use CSS variables for dynamic values
<div style={{ '--dynamic-color': color }} className="bg-[color:var(--dynamic-color)]">
```

### CSS Custom Properties
```css
/* Use semantic naming */
:root {
  --color-primary: theme('colors.Primary.500');
  --color-surface: theme('colors.white / 5%');
  --border-radius-card: theme('borderRadius.2xl');
}
```

## Animation Guidelines

### Framer Motion Patterns
```typescript
// Simple hover interactions
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>

// Stagger children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
```

## API Integration Patterns

### React Query Setup
```typescript
// Query key factories
export const queryKeys = {
  media: {
    all: ['media'] as const,
    details: (type: MediaType, id: number) => [...queryKeys.media.all, 'details', type, id] as const,
    search: (query: string) => [...queryKeys.media.all, 'search', query] as const,
  },
  library: {
    all: ['library'] as const,
    items: (filters: LibraryFilters) => [...queryKeys.library.all, 'items', filters] as const,
  }
};

// Query hooks
export function useMediaDetails(type: MediaType, id: number) {
  return useQuery({
    queryKey: queryKeys.media.details(type, id),
    queryFn: () => tmdbApi.getDetails(type, id),
    staleTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!id
  });
}
```

### Error Handling
```typescript
// Global error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      onError: (error) => {
        // Global error logging
        analytics.trackError(error);
      }
    }
  }
});
```

## Testing Guidelines

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MediaCard } from './MediaCard';

describe('MediaCard', () => {
  const mockMedia = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/test.jpg'
  };

  it('renders media title', () => {
    render(<MediaCard media={mockMedia} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('calls onAddToLibrary when button clicked', () => {
    const onAddToLibrary = vi.fn();
    render(<MediaCard media={mockMedia} onAddToLibrary={onAddToLibrary} />);

    fireEvent.click(screen.getByText('Add to Library'));
    expect(onAddToLibrary).toHaveBeenCalledWith(mockMedia);
  });
});
```

### Hook Testing
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useLibraryItems } from './useLibraryItems';

describe('useLibraryItems', () => {
  it('fetches library items', async () => {
    const { result } = renderHook(() => useLibraryItems());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## Performance Guidelines

### Bundle Optimization
```typescript
// Use dynamic imports for route-based code splitting
const LazyPage = lazy(() => import('./Page'));

// Use dynamic imports for large libraries
const ChartComponent = lazy(() => import('./Chart'));

// Preload critical routes
const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    loader: () => import('./loaders/homeLoader')
  }
]);
```

### React Performance
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Memoize callbacks to prevent re-renders
const handleClick = useCallback((id: string) => {
  onClick(id);
}, [onClick]);

// Use React.memo for pure components
export const MediaCard = memo(function MediaCard({ media }: MediaCardProps) {
  // Component implementation
});
```

## Accessibility Guidelines

### Semantic HTML
```typescript
// Use proper heading hierarchy
<h1>Main Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

// Use semantic elements
<main>
  <section aria-labelledby="trending-title">
    <h2 id="trending-title">Trending Movies</h2>
    <ul role="list">
      <li role="listitem">...</li>
    </ul>
  </section>
</main>

// Provide ARIA labels for interactive elements
<button
  aria-label={`Add ${media.title} to library`}
  onClick={handleAddToLibrary}
>
  <PlusIcon />
</button>
```

### Keyboard Navigation
```typescript
// Support keyboard interactions
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
};

// Manage focus appropriately
useEffect(() => {
  if (isModalOpen) {
    modalRef.current?.focus();
  }
}, [isModalOpen]);
```

## Git Workflow

### Commit Messages
```
feat: add AI-powered mood recommendations
fix: resolve issue with library sync on mobile
docs: update installation instructions
style: improve button hover states
refactor: simplify media card component
test: add unit tests for library hooks
```

### Branch Naming
```
feature/mood-based-recommendations
bugfix/library-sync-issue
hotfix/critical-auth-bug
refactor/simplify-media-components
```

### Pull Request Guidelines
1. **Clear Title**: Describe what the PR does
2. **Description**: Explain the changes and why they were made
3. **Testing**: Document how the changes were tested
4. **Screenshots**: Include visual changes if applicable
5. **Breaking Changes**: Highlight any breaking changes

## Security Guidelines

### Environment Variables
```typescript
// Never commit secrets
VITE_TMDB_API_KEY=your_api_key_here  # ❌ Don't commit this

// Use environment files properly
.env.local     # Local development (gitignored)
.env.example   # Template for other developers
```

### Input Validation
```typescript
// Validate user inputs
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Sanitize content when needed
function sanitizeUserContent(content: string): string {
  return DOMPurify.sanitize(content);
}
```

### API Security
```typescript
// Use proper error handling that doesn't leak information
try {
  const data = await api.fetchSensitiveData();
  return data;
} catch (error) {
  // Don't expose internal error details
  throw new Error('Failed to fetch data');
}
```