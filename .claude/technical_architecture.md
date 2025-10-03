# Watchfolio Technical Architecture

## Tech Stack Overview

### Frontend Framework
- **React 19**: Latest features including concurrent rendering, automatic batching
- **TypeScript**: Full type safety across entire application
- **Vite**: Modern build tool for fast development and optimized production builds

### State Management
- **TanStack Query (React Query)**: Server state management, caching, synchronization
- **React Context**: Local component state and theme management
- **URL State**: Navigation and filter state in URL parameters

### Database & Storage
- **RxDB**: Offline-first reactive database with real-time sync
- **IndexedDB**: Browser storage for offline functionality
- **Appwrite**: Backend-as-a-Service for cloud sync, authentication, storage

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **HeroUI (NextUI)**: High-quality React components
- **Framer Motion**: Animation library for smooth micro-interactions
- **Lucide React**: Consistent icon system

### Routing & Navigation
- **React Router v7**: File-based routing with modern patterns
- **Lazy Loading**: Code splitting for optimal performance

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── media/          # Media-specific components
│   ├── library/        # Library management components
│   ├── home/           # Homepage sections
│   └── ...            # Feature-specific component folders
├── hooks/              # Custom React hooks
│   ├── library/        # Library-related hooks
│   ├── auth/          # Authentication hooks
│   └── ...            # Feature-specific hooks
├── lib/                # External service integrations
│   ├── api/           # API client configurations
│   ├── appwrite/      # Appwrite service layer
│   └── rxdb/          # Database configuration
├── pages/              # Route components
├── layouts/            # Layout components
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
└── styles/             # Global styles and Tailwind config
```

## Data Architecture

### Database Design (RxDB)
```typescript
// Core Collections
interface LibraryMedia {
  id: string;                    // Unique identifier
  media_type: 'movie' | 'tv';   // Content type
  tmdb_id: number;              // External API reference
  title: string;                // Display title
  status: LibraryStatus;        // User tracking status
  rating?: number;              // User rating (1-10)
  notes?: string;               // Personal notes
  tags: string[];               // Custom tags
  isFavorite: boolean;          // Favorite status
  dateAdded: Date;              // When added to library
  dateWatched?: Date;           // When marked as watched
  // ... additional metadata
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  preferences: UserPreferences;
  // ... profile data
}
```

### API Integration Layer
```typescript
// TMDB API for content data
class TMDBService {
  async searchMedia(query: string): Promise<Media[]>
  async getDetails(type: MediaType, id: number): Promise<MediaDetails>
  async getRecommendations(type: MediaType, id: number): Promise<Media[]>
}

// Appwrite for user data and sync
class AppwriteService {
  auth: AuthService;
  database: DatabaseService;
  storage: StorageService;
  functions: FunctionsService;
}
```

## Code Organization Principles

### Component Architecture
```typescript
// Component file structure
ComponentName/
├── index.ts           // Export barrel
├── ComponentName.tsx  // Main component
├── ComponentName.types.ts  // Type definitions
├── ComponentName.test.tsx  // Unit tests
└── hooks/             // Component-specific hooks
```

### Hook Patterns
```typescript
// Query hooks for server state
export function useMediaDetails(type: MediaType, id: number) {
  return useQuery({
    queryKey: ['media', type, id],
    queryFn: () => tmdbService.getDetails(type, id),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Mutation hooks for actions
export function useAddToLibrary() {
  return useMutation({
    mutationFn: (item: LibraryItem) => libraryService.addItem(item),
    onSuccess: () => queryClient.invalidateQueries(['library']),
  });
}
```

### Error Handling Strategy
```typescript
// Boundary components for error catching
class ErrorBoundary extends Component {
  // React error boundary implementation
}

// Query error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  retry: (failureCount, error) => {
    // Smart retry logic based on error type
  },
  onError: (error) => {
    // Centralized error reporting
  }
});
```

## Performance Optimization

### Code Splitting
```typescript
// Route-based splitting
const LazyPage = lazy(() => import('./Page'));

// Component-based splitting for large features
const LazyModal = lazy(() => import('./Modal'));
```

### Caching Strategy
```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 minutes
      cacheTime: 1000 * 60 * 30,     // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Image Optimization
```typescript
// Lazy image component with shimmer loading
<LazyImage
  src={tmdbImageUrl}
  alt={title}
  className="w-full h-full object-cover"
  loading="lazy"
/>
```

## State Management Patterns

### Server State (React Query)
- All external API calls
- Automatic caching and invalidation
- Background refetching
- Optimistic updates

### Client State (React Context)
- User interface state
- Theme preferences
- Modal/drawer state
- Form state

### URL State
- Search filters and parameters
- Pagination state
- Sort preferences
- View mode selection

## Authentication & Security

### Authentication Flow
```typescript
// Appwrite authentication
class AuthService {
  async login(email: string, password: string)
  async register(email: string, password: string, name: string)
  async logout()
  async getCurrentUser()
  async updatePassword(newPassword: string)
}
```

### Security Measures
- Environment variable protection
- CSRF protection via Appwrite
- Input validation and sanitization
- Rate limiting on API calls

## Offline-First Architecture

### RxDB Synchronization
```typescript
// Local-first with cloud sync
const libraryCollection = database.addCollections({
  library: {
    schema: librarySchema,
    sync: {
      remote: appwriteEndpoint,
      options: {
        live: true,
        retry: true,
      }
    }
  }
});
```

### Progressive Enhancement
- Core functionality works offline
- Enhanced features require connectivity
- Graceful degradation patterns
- Sync status indicators

## Testing Strategy

### Unit Testing
- Jest for testing framework
- React Testing Library for component tests
- MSW (Mock Service Worker) for API mocking

### Integration Testing
- End-to-end user workflows
- Database synchronization testing
- Offline functionality testing

### Performance Testing
- Lighthouse CI integration
- Bundle size monitoring
- Core Web Vitals tracking

## Build & Deployment

### Development Workflow
```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Linting and formatting
npm run lint
npm run format

# Testing
npm run test
```

### Production Build
```bash
# Optimized production build
npm run build

# Build analysis
npm run build:analyze

# Preview production build
npm run preview
```

### Environment Configuration
```typescript
// Environment variables
VITE_TMDB_API_KEY=        # The Movie Database API key
VITE_APPWRITE_PROJECT=    # Appwrite project ID
VITE_APPWRITE_ENDPOINT=   # Appwrite API endpoint
```

## Scalability Considerations

### Code Organization
- Feature-based folder structure
- Modular component architecture
- Dependency injection patterns
- Plugin architecture for extensions

### Performance Scaling
- Virtual scrolling for large lists
- Image lazy loading and optimization
- Database query optimization
- CDN integration for static assets

### Feature Scaling
- Modular feature architecture
- Plugin system for extensions
- Theme system for customization
- API versioning for backwards compatibility