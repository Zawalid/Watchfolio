# Watchfolio - Essential Memory & Guidelines

## Quick Project Identity

**Watchfolio** is an offline-first, AI-powered media library manager for tracking movies/TV shows with real-time cloud sync.

**Core Stack**: React 19 + TypeScript + RxDB + Appwrite + TMDB + Gemini AI + HeroUI + Tailwind 4

## Critical Architecture Patterns

### 1. Local-First Data Flow
```
User Action → RxDB (Local) ←→ Appwrite (Cloud)
              ↓
         TanStack Query → UI Update
```
- **ALWAYS write to RxDB first** (never directly to Appwrite for library data)
- Sync happens automatically via replication
- Use `src/lib/rxdb/collections.ts` for all database operations

### 2. State Management Rules
- **Zustand**: Only for auth (`useAuthStore`) and sync status (`useSyncStore`)
- **TanStack Query**: All TMDB data and user profiles
- **RxDB**: All library data (with reactive queries)
- **nuqs**: URL state (filters, search, pagination)
- **Never** create new Zustand stores without discussion

### 3. Component Architecture
- **Pages** (default export): `src/pages/` - route components
- **Layouts**: `src/layouts/` - wrapper components
- **Features**: `src/components/[feature]/` - feature-specific UI
- **UI Primitives**: `src/components/ui/` - reusable components
- **ALWAYS prefer editing existing components** over creating new ones

## Design System Rules

### Colors (Strict Adherence)
```css
Primary:   #5a4af4 (brand purple/blue)
Secondary: #1ea5fc (bright blue)
Tertiary:  #b66dff (accent purple)
Success:   #05ce91 (green)
Error:     #ff6161 (red)
Warning:   #ffad49 (orange)
```

### Custom Tailwind Utilities (Use These!)
- `blur-bg` - Background with SVG pattern
- `pill-bg` - Glass effect pills
- `button-primary` - Gradient button (primary CTA)
- `button-secondary` - Glass button (secondary action)
- `gradient` - Text gradient
- `outline-heading` - Stroke-only text
- `kbd` - Keyboard shortcut display

### Design Principles
1. **Dark Mode Only** - Optimized for night viewing
2. **Glass Morphism** - Use `backdrop-blur` effects
3. **Gradients** - Primary-to-secondary for important CTAs
4. **Responsive First** - Mobile-first approach
5. **Animations** - Use Framer Motion, must be toggleable

## Code Conventions (Non-Negotiable)

### Package Manager
- **ALWAYS use `pnpm`** - Never use npm or yarn
- Install: `pnpm install` or `pnpm i`
- Add package: `pnpm add <package>`
- Dev dependency: `pnpm add -D <package>`
- Run scripts: `pnpm <script-name>` (e.g., `pnpm dev`, `pnpm build`)

### TypeScript
- **Strict mode** - No `any`, no unused vars
- Zod schemas for validation (runtime + type safety)
- Types in `src/types/` for shared definitions
- Discriminated unions for media types

### File Naming
```
Components:  PascalCase.tsx       (MediaCard.tsx)
Hooks:       useCamelCase.ts      (useLibraryMutations.ts)
Utils:       camelCase.ts         (persistAndSync.ts)
Types:       PascalCase.types.d.ts (Library.types.d.ts)
```

### Import Structure
```typescript
// 1. External libraries
import { useQuery } from '@tanstack/react-query'

// 2. Internal with @ alias (ALWAYS use path alias)
import { MediaCard } from '@/components/media/MediaCard'
import { useAuthStore } from '@/stores/useAuthStore'

// 3. Relative imports (only when necessary)
import { LocalComponent } from './LocalComponent'

// 4. Types
import type { LibraryMedia } from '@/types'
```

### Component Structure (Template)
```typescript
interface ComponentProps {
  // Props with types
}

export function Component({ prop }: ComponentProps) {
  // 1. Hooks (in order: context, state, query, mutation, effect)
  const authState = useAuthStore()
  const [localState, setLocalState] = useState()
  const { data } = useQuery()
  const mutation = useMutation()
  useEffect(() => {}, [])

  // 2. Handlers
  const handleAction = () => {}

  // 3. Early returns
  if (!data) return <Skeleton />

  // 4. Render
  return <div>...</div>
}
```

## Critical Patterns to Follow

### 1. Library Data Operations
```typescript
// ✅ CORRECT: Use collections API
import { addOrUpdateLibraryItem } from '@/lib/rxdb/collections'
await addOrUpdateLibraryItem(db, data)

// ❌ WRONG: Don't use Appwrite directly for library data
await LibraryMediaAPI.create(data) // Only for sync layer!
```

### 2. Queries & Mutations
```typescript
// ✅ Use custom hooks
import { useLibraryMutations } from '@/hooks/library/useLibraryMutations'
const { addOrUpdate } = useLibraryMutations()

// ✅ TanStack Query for TMDB
import { useQuery } from '@tanstack/react-query'
const { data } = useQuery({
  queryKey: ['media', tmdbId],
  queryFn: () => fetchMedia(tmdbId),
  staleTime: 5 * 60 * 1000, // 5 minutes standard
})
```

### 3. Forms (Always)
```typescript
// ✅ React Hook Form + Zod
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  field: z.string().min(1, 'Required')
})

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
})
```

### 4. Animations
```typescript
// ✅ Check preference first
import { useAnimationPreference } from '@/contexts/providers/AnimationProvider'

const { isAnimationEnabled } = useAnimationPreference()

<motion.div
  initial={isAnimationEnabled ? { opacity: 0 } : undefined}
  animate={isAnimationEnabled ? { opacity: 1 } : undefined}
>
```

### 5. Error Handling
```typescript
// ✅ Always wrap async in try-catch
try {
  await operation()
  toast.success('Success message')
} catch (error) {
  log('Operation failed:', error)
  toast.error('User-friendly error message')
}
```

## Important File Locations

### Key Files to Know
- **Auth**: `src/stores/useAuthStore.ts` (270 lines, all auth logic)
- **Sync**: `src/stores/useSyncStore.ts` (sync status)
- **DB Operations**: `src/lib/rxdb/collections.ts` (all queries)
- **Replication**: `src/lib/rxdb/replication.ts` (RxDB ↔ Appwrite)
- **TMDB API**: `src/lib/api/TMDB/` (all TMDB endpoints)
- **Animations**: `src/lib/animations.ts` (Framer Motion variants)
- **Validation**: `src/lib/validation/` (Zod schemas)

### Context Providers (5 Total)
1. `AnimationProvider` - Global animation toggle
2. `ConfirmationModalProvider` - Reusable confirmations
3. `MediaStatusModalProvider` - Add to library modal
4. `NavigationProvider` - Navigation state
5. `ErrorBoundary` - Error catching

## Keyboard Shortcuts System

**30+ shortcuts available** - Use `react-hotkeys-hook`

Common shortcuts:
- `/` - Focus search
- `?` - Help modal
- `Alt+W` - Mark as watching
- `Alt+P` - Add to plan to watch
- `Alt+C` - Mark as completed
- `Alt+F` - Toggle favorite
- Arrow keys - Navigate grids

**When adding features, ALWAYS consider adding keyboard shortcuts!**

## Performance Rules

1. **Images**: Always lazy load with Intersection Observer
2. **Lists**: Use pagination (20 items/page standard)
3. **Heavy Operations**: Use Web Workers (see `src/workers/`)
4. **Queries**: Set appropriate `staleTime` (5 min default)
5. **Debounce**: Search inputs and save operations
6. **Code Split**: Lazy load pages and heavy components

## Database Schema Quick Reference

```typescript
LibraryMedia {
  id: string              // UUID
  userId: string          // Owner
  tmdbId: number          // TMDB reference
  media_type: 'movie' | 'tv'
  status: WatchStatus     // 6 possible statuses
  isFavorite: boolean
  userRating?: number     // 1-10
  notes?: string          // Max 2000 chars
  addedAt: ISO string
  lastUpdatedAt: ISO string

  // TMDB metadata (cached)
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

## Testing & Quality

- **Type Check**: `pnpm typecheck:ci`
- **Lint**: `pnpm lint`
- **Always run before committing**
- No unit tests currently (infrastructure not set up)

## Common Pitfalls to Avoid

### ❌ DON'Ts
1. Don't create new files unless absolutely necessary
2. Don't bypass RxDB for library data operations
3. Don't add new Zustand stores (use TanStack Query)
4. Don't use `any` type
5. Don't forget to handle loading and error states
6. Don't add animations without checking user preference
7. Don't hardcode values that should be in constants
8. Don't forget keyboard shortcuts for new features
9. Don't skip Zod validation for forms
10. Don't directly modify Appwrite for library items

### ✅ DOs
1. Always use path alias (`@/`) for imports
2. Always validate with Zod for runtime safety
3. Always consider mobile responsiveness
4. Always add loading skeletons
5. Always provide empty states
6. Always use custom Tailwind utilities
7. Always check animation preferences
8. Always use existing hooks when available
9. Always follow the data flow (RxDB first)
10. Always add toast feedback for user actions

## AI Features

**Mood Recommendations** (Google Gemini):
- Endpoint: Appwrite Function `Mood Recommendations`
- Input: mood description, user preferences, filters
- Output: Personalized media recommendations with analysis
- Integration point: `src/pages/recommendations/`

## Deployment

- **Platform**: Netlify
- **Build**: `pnpm build` (Vite)
- **Preview**: `pnpm preview`
- **Env Vars**: Set in Netlify dashboard

## Environment Variables

```env
VITE_APPWRITE_ENDPOINT=
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_DATABASE_ID=
VITE_TMDB_API_KEY=
VITE_TMDB_ACCESS_TOKEN=
```

## When in Doubt

1. Check `context.md` for comprehensive information
2. Look at similar existing components for patterns
3. Use TypeScript errors as guidance
4. Check RxDB collections API for database operations
5. Refer to existing hooks before creating new ones
6. Follow the data flow architecture strictly
7. Test on mobile viewport
8. Run type check and linter

## Code Quality Standards

- **217 TypeScript files** - maintain this quality
- **No TODO/FIXME** - resolve issues immediately or create tasks
- **Consistent naming** - follow existing patterns
- **DRY principle** - extract reusable logic to hooks/utils
- **Clean code** - self-documenting with minimal comments needed

## Project Philosophy

**Local-First + Cloud-Sync + AI-Enhanced**

The app must work offline, sync seamlessly, and enhance user experience with AI. Every feature should respect this philosophy.
