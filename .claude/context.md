# Watchfolio - Complete Codebase Context

## Project Overview

**Watchfolio** is a modern, feature-rich media library management application for cinephiles to discover, track, and curate their personal movie and TV show collections. It features AI-powered mood-based recommendations, offline-first architecture, and cross-device synchronization.

**Key Value Propositions:**
- Personal media library with granular status tracking (6 statuses)
- AI-powered mood-based recommendations using Google Gemini
- Offline-first architecture with real-time cloud sync
- Comprehensive statistics and viewing pattern analysis
- Public profile sharing
- Import/export functionality

## Tech Stack

### Core Technologies
- **React 19.1.0** with TypeScript 5.7.3
- **Vite 6.3.5** for build tooling
- **React Router 7.6.0** for routing
- **@heroui/react 2.8.1** (NextUI fork) for UI components
- **Tailwind CSS 4.1.7** for styling
- **Framer Motion 12.12.2** for animations

### State & Data Management
- **Zustand 5.0.5** - Global state (Auth, Sync)
- **TanStack Query 5.85.5** - Server state & caching
- **RxDB 16.16.0** - Local-first reactive database
- **nuqs 2.5.1** - URL state management

### Backend Services
- **Appwrite 19.0.0** - BaaS (Auth, Database, Storage, Functions)
- **TMDB API** - Media metadata
- **Google Gemini AI** - Mood recommendations (via Appwrite Functions)

### Form & Validation
- **React Hook Form 7.56.4** with **Zod 3.25.28**

### Advanced Features
- **@dnd-kit** - Drag & drop
- **React Hotkeys Hook 5.1.0** - Keyboard shortcuts (30+ shortcuts)
- **Swiper 11.2.8** - Carousels
- **Vaul 1.1.2** - Mobile drawers

## Architecture

### File Structure
```
src/
├── components/          # 111 components
│   ├── auth/           # Authentication UI
│   ├── celebrity/      # Celebrity views
│   ├── library/        # Library management (11 components)
│   ├── media/          # Media cards & details
│   ├── navbar/         # Navigation (6 components)
│   ├── recommendations/# AI recommendations UI
│   ├── settings/       # Settings panels (12 components)
│   └── ui/             # Reusable primitives (23 components)
├── contexts/           # React contexts
│   └── providers/      # 5 providers
├── hooks/              # 11 custom hooks
├── layouts/            # 9 layout components
├── lib/                # Core libraries
│   ├── api/TMDB/       # TMDB integration (9 files)
│   ├── appwrite/       # Appwrite services (4 files)
│   ├── rxdb/           # RxDB config (5 files)
│   ├── validation/     # Zod schemas
│   └── animations.ts   # Framer Motion variants
├── pages/              # 14 route pages
├── stores/             # Zustand stores
├── types/              # TypeScript definitions
├── utils/              # Utility functions (11 files)
└── workers/            # Web Workers (2)
```

### Data Flow Architecture

**Local-First Pattern:**
```
User Action → Component → Hook/Store
    ↓
RxDB (Local) ←→ Appwrite (Cloud)
    ↓              ↓
TanStack Query   TMDB API
    ↓
Component Re-render
```

### State Management Strategy

1. **Zustand** for critical global state:
   - `useAuthStore`: User, preferences, auth status
   - `useSyncStore`: Sync status and controls

2. **TanStack Query** for server state:
   - Media data from TMDB (5-min stale time)
   - User profiles and stats
   - Automatic caching and invalidation

3. **RxDB** for local database:
   - Reactive queries with indexes
   - Bi-directional sync with Appwrite
   - Offline-first storage

4. **nuqs** for URL state (filters, search, pagination)

## Core Features

### Library Management (Status Tracking)
- **6 Statuses**: Watching, Plan to Watch, Completed, On Hold, Dropped, Favorites
- Personal ratings (1-10)
- Custom notes (2000 chars max)
- Filtering: status, media type, genres, networks
- Sorting: Recent, Rating, Release Date, Runtime, Title, Popularity
- Text search
- Statistics dashboard

### Discovery & Browsing
- TMDB integration (trending, popular, top-rated, upcoming)
- Advanced multi-search (movies, TV, people, collections)
- Genre and network filtering
- Celebrity profiles

### AI-Powered Recommendations
- Natural language mood input
- Personalized based on library, preferences, viewing history
- Filtering: content type, decade, runtime
- Detailed match analysis
- Google Gemini AI integration

### Sync & Import/Export
- Real-time cloud sync with Appwrite
- Offline-first with background sync
- Import: JSON/CSV with Web Worker processing
- Export: JSON/CSV with full metadata
- Conflict resolution

### User Experience
- 30+ keyboard shortcuts (Alt+W, Alt+P, /, ?, etc.)
- Responsive design (mobile-first)
- Dark theme with glass morphism
- Animations (toggleable)
- Empty states
- Error boundaries
- Toast notifications

### Authentication & Profile
- Email/password + Google OAuth
- Email verification
- Profile: display name, username, bio, avatar
- Privacy controls (public/private, per-section visibility)
- Public profile sharing (`/u/username`)
- Session/device management

### Settings & Preferences
- Account: email, password, delete account
- Privacy: profile visibility, section toggles
- Preferences: theme, language, default status, animations, auto-sync
- Confirmation dialogs (customizable per action)
- Taste editor (favorite genres/networks)

## Design System

### Color Palette
```css
Primary:   #5a4af4 (Purple/Blue)
Secondary: #1ea5fc (Bright Blue)
Tertiary:  #b66dff (Purple)
Success:   #05ce91 (Green)
Error:     #ff6161 (Red)
Warning:   #ffad49 (Orange)
```

### Design Patterns
- **Glass Morphism**: Backdrop blur effects
- **Gradients**: Primary-to-secondary for CTAs
- **Dark Mode Only**: Optimized for night viewing
- **Custom Utilities**:
  - `blur-bg`: SVG pattern background
  - `pill-bg`: Rounded glass pills
  - `button-primary`: Gradient buttons
  - `button-secondary`: Glass buttons
  - `gradient`: Text gradients
  - `outline-heading`: Stroke-only text

### Typography
- **Font**: Poppins (Google Fonts)
- Responsive hierarchy (text-4xl to text-9xl)

### Responsive Breakpoints
```
xs: 400px, mobile: 500px, sm: 640px, md: 768px
lg: 1024px, xl: 1280px, 2xl: 1536px
```

### Component Patterns
1. **Card**: Glass effect, hover states, shimmer placeholders
2. **Modal**: Backdrop blur, keyboard navigation, animations
3. **Form**: React Hook Form + Zod, inline validation
4. **Status Badges**: Color-coded, icon + label
5. **Infinite Lists**: Skeleton loaders, intersection observer

### Animation Strategy
- **Framer Motion**: Complex animations (page transitions, modals, stagger)
- **@formkit/auto-animate**: Automatic DOM animations
- **CSS Transitions**: Simple state changes
- **User Preference**: Toggle to disable all animations

## Code Conventions

### TypeScript Patterns
- **Strict mode enabled** with no unused locals/parameters
- Type definitions in `src/types/`
- Interfaces for objects, types for unions
- Zod for runtime validation
- Type guards and discriminated unions

### React Patterns
- Custom hooks prefixed with `use`
- Early returns after hooks
- Memoization with `useMemo`/`useCallback` when needed
- Default exports for pages, named exports for reusable components

### File Naming
- **Components**: PascalCase (e.g., `MediaCard.tsx`)
- **Utilities**: camelCase (e.g., `persistAndSync.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useLibraryMutations.ts`)
- **Types**: PascalCase with `.types.d.ts` (e.g., `Library.types.d.ts`)
- **Pages**: PascalCase, route-based naming

### Code Organization
- **Path Alias**: `@/*` → `./src/*`
- **Barrel Exports**: `index.ts` for re-exports
- **Feature Folders**: Related components grouped
- **Separation of Concerns**: Logic in hooks/utils, UI in components

### Coding Standards
- **Prettier** with Tailwind plugin (2-space indent, single quotes)
- **ESLint** with React/TypeScript plugins
- JSDoc for complex functions
- Try-catch for async operations
- Custom `log()` function for debugging

## Database Schema

### RxDB Schema (Version 4)
```typescript
LibraryMedia {
  id: string (PK)
  userId: string
  tmdbId: number
  media_type: 'movie' | 'tv'
  status: WatchStatus
  isFavorite: boolean
  userRating?: number (1-10)
  notes?: string (max 2000)
  addedAt: ISO string
  lastUpdatedAt: ISO string

  // TMDB metadata
  title: string
  overview?: string
  posterPath?: string
  releaseDate?: string
  genres?: number[]
  rating?: number
  totalMinutesRuntime?: number
  networks?: number[]
}
```

### Indexes (Optimized)
- `userId`, `status`, `[userId, status]`
- `[userId, media_type]`, `[userId, isFavorite]`
- `[userId, status, media_type]`
- `[userId, addedAt]`, `[userId, lastUpdatedAt]`
- `[tmdbId, media_type]`

### Appwrite Collections
1. `users_preferences`: User settings
2. `profiles`: Public profiles (username, bio, avatar)
3. `libraries`: Library metadata with stats JSON
4. `library_media`: Media items (synced with RxDB)
5. `activities`: User activity log

## API Integration

### TMDB API (`src/lib/api/TMDB/`)
- `config.ts`: Base URL, API key, image CDN
- `discover.ts`: Advanced discovery filters
- `movies.ts`: Movie-specific endpoints
- `tv.ts`: TV show endpoints
- `people.ts`: Celebrity data
- `search.ts`: Multi-search
- `trending.ts`, `upcoming.ts`

### Appwrite API (`src/lib/appwrite/`)
- **Service Classes**: ProfileAPI, LibraryAPI, LibraryMediaAPI, UserPreferencesAPI
- **AuthAPI**: Authentication operations
- **StorageAPI**: File uploads (avatars)
- **FunctionsAPI**: Serverless execution

### Appwrite Functions (Serverless)
1. **Mood Recommendations**: Gemini AI integration for personalized suggestions
2. **Library Stats**: Aggregate statistics calculation
3. **Cleanup Deleted Media**: Maintenance function

## Synchronization

### Sync Lifecycle
```
1. Sign In → startSync() → Initialize RxDB replication
2. Live Replication → Push/Pull changes ↔ Appwrite
3. User Change → Update RxDB → Auto-push to cloud
4. Sign Out → stopSync() → destroyDB()
```

### Conflict Resolution
- Last-write-wins strategy
- Timestamps for comparison
- Appwrite handles server-side conflicts

## Performance Optimizations

1. **Query Optimization**: Indexed queries, pagination (20 items/page)
2. **Caching**: TanStack Query (5-min stale), RxDB persistent cache
3. **Code Splitting**: Route-based lazy loading
4. **Web Workers**: Import/export in background thread
5. **Debouncing**: Search input, sync operations (30ms)
6. **Lazy Loading**: Images with Intersection Observer
7. **Memoization**: Zustand selectors, React components

## Special Characteristics

### Unique Aspects
1. **Local-First Architecture**: Rare implementation, works offline
2. **Dual Database System**: RxDB + Appwrite with bi-directional sync
3. **30+ Keyboard Shortcuts**: Context-aware, power-user focused
4. **Web Worker Processing**: Non-blocking import/export
5. **AI-Powered Recommendations**: Natural language mood input
6. **Granular Privacy Controls**: Per-section, per-status visibility
7. **Custom Persistence Middleware**: Cross-tab sync, debounced saves

### Code Quality
- **217 TypeScript files** with ~100% type coverage
- No TODO/FIXME markers (clean codebase)
- Consistent conventions
- Well-organized structure
- Production-ready error handling

## Key Hooks

### Custom Hooks (`src/hooks/`)
- `useLibraryQueries`: Infinite scroll, single item, batch fetch
- `useLibraryMutations`: Add/update, remove, import, clear
- `useLibrarySync`: Manual and auto-sync orchestration
- `useListNavigator`: Keyboard navigation for grids
- `useDiscoverParams`: URL state for discovery page
- `useInitialAuth`: Auth rehydration on app load
- `useViewportSize`: Responsive breakpoint detection
- `useWorker`: Type-safe Web Worker communication

## Context Providers

1. **AnimationProvider**: Global animation toggle
2. **ConfirmationModalProvider**: Reusable confirmation dialogs
3. **MediaStatusModalProvider**: Add to library modal
4. **NavigationProvider**: Navigation state
5. **ErrorBoundary**: Error handling

## Important Files

### Entry Points
- `src/main.tsx`: App entry with providers
- `src/providers.tsx`: Provider composition
- `src/router/index.tsx`: Route configuration

### Core Logic
- `src/lib/rxdb/collections.ts`: Database operations
- `src/lib/rxdb/replication.ts`: Appwrite sync
- `src/stores/useAuthStore.ts`: Auth management (270 lines)
- `src/utils/persistAndSync.ts`: Custom Zustand middleware

### Configuration
- `vite.config.ts`: Build config with path alias
- `tailwind.config.js`: Custom utilities and theme
- `tsconfig.json`: Strict TypeScript config

## Environment Variables

Required `.env`:
```
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_TMDB_API_KEY=
VITE_TMDB_ACCESS_TOKEN=
```

## Security

- Appwrite permissions and document-level security
- Email verification required
- Password validation
- XSS protection (React)
- CSRF tokens (Appwrite)

## Production Status

- **Deployment**: Netlify
- **Build Tool**: Vite with optimization
- **Monitoring**: React Query Devtools, Zustand Devtools
- **Error Handling**: Error boundaries, typed errors, user-friendly messages
- **SEO**: Dynamic page titles, meta tags

## Current Version Status

- **Latest Commit**: "Restore the lost changes (the damn vsocde)"
- **Recent Features**:
  - Mood Match AI recommendations (#6)
  - Enhanced responsiveness (#5)
  - Preferences override bug fix
  - Improved empty states and sync indicators

## Total Statistics

- **217 TypeScript files** (.ts/.tsx)
- **111 React components**
- **11 custom hooks**
- **5 context providers**
- **9 layout components**
- **14 route pages**
- **30+ keyboard shortcuts**
- **50+ features**

## Future-Ready Architecture

The codebase is prepared for:
- Social features (friend system, sharing)
- Multi-platform (Tauri desktop, React Native mobile)
- Streaming integration ("Where to Watch")
- Scrobbling (Plex/Jellyfin)
- Advanced AI features
