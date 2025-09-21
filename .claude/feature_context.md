# Watchfolio Feature Context & Implementation Guidelines

## Core Features Overview

### 1. Library Management
**Purpose**: Personal media tracking and organization system
**Key Components**:
- `LibraryCard.tsx` - Individual media item display
- `LibraryView.tsx` - Main library interface
- `LibraryStats.tsx` - Analytics and insights
- `LibrarySidebar.tsx` - Filtering and navigation

**Implementation Patterns**:
```typescript
// Status-based filtering
type LibraryStatus = 'planned' | 'watching' | 'completed' | 'paused' | 'dropped';

// Library item structure
interface LibraryMedia {
  id: string;
  media_type: 'movie' | 'tv';
  status: LibraryStatus;
  rating?: number;
  notes?: string;
  tags: string[];
  dateAdded: Date;
  progress?: EpisodeProgress; // For TV shows
}
```

### 2. Content Discovery
**Purpose**: Help users find new content through various discovery mechanisms
**Key Components**:
- `HeroSection.tsx` - Featured content carousel
- `TrendingSection.tsx` - Popular content
- `TopRatedSection.tsx` - Highly rated content
- `RecommendationsSection.tsx` - Personalized suggestions

**Design Patterns**:
```typescript
// Section header pattern
<div className="flex items-center gap-3">
  <div className="from-Success-500 to-Secondary-500 shadow-Primary-500/25 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
    <TrendingUp className="h-5 w-5 text-white" />
  </div>
  <div>
    <h2 className="text-lg font-bold text-white sm:text-2xl">Section Title</h2>
    <p className="text-Grey-400 text-xs sm:text-sm">Section description</p>
  </div>
</div>
```

### 3. Search & Filtering
**Purpose**: Advanced content discovery through search and filters
**Key Components**:
- `SearchInput.tsx` - Main search interface
- `FiltersModal.tsx` - Advanced filtering options
- `MediaFiltersModal.tsx` - Media-specific filters

**Search Patterns**:
```typescript
// Debounced search with suggestions
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);

const { data: searchResults } = useQuery({
  queryKey: ['search', debouncedQuery],
  queryFn: () => tmdbApi.search(debouncedQuery),
  enabled: debouncedQuery.length > 2
});
```

### 4. Media Details & Information
**Purpose**: Comprehensive information about movies and TV shows
**Key Components**:
- `MediaDetails.tsx` - Main details page
- `Cast.tsx` - Cast and crew information
- `Seasons.tsx` - TV show season/episode tracking
- `Similar.tsx` - Related content suggestions

**Detail Page Structure**:
```typescript
// Hero section with backdrop
// Media poster and basic info
// Action buttons (Add to Library, Rate, etc.)
// Detailed information tabs
// Cast and crew
// Recommendations and similar content
```

### 5. User Profiles & Social Features
**Purpose**: User identity and social interaction
**Key Components**:
- `ProfileHeader.tsx` - User profile display
- `UserLibrary.tsx` - Public library view
- `StatsInsights.tsx` - Viewing statistics
- `ViewingTaste.tsx` - Taste analysis

### 6. Settings & Preferences
**Purpose**: User customization and account management
**Key Components**:
- `SettingSection.tsx` - Reusable setting component
- `TasteEditor.tsx` - Preference management
- `ProfileVisibility.tsx` - Privacy controls
- `DeviceManager.tsx` - Session management

## New Feature Implementation Guidelines

### AI Recommendations Feature Context

**Current Task**: Implementing mood-based AI recommendations
**User Feedback**:
- Remove emoji mood selection interface
- Replace with natural language text input
- Use Gemini AI to process user descriptions
- Match existing design patterns exactly

**Implementation Approach**:
1. **Text Input Interface**: Following existing search patterns
2. **Gemini Integration**: Process natural language descriptions
3. **Results Display**: Use existing card and grid patterns
4. **Preferences**: Maintain existing filter structure

**Design Requirements**:
- Follow existing color scheme (Grey-X, Primary-X, Secondary-X)
- Use existing card design patterns
- Match existing typography and spacing
- Implement proper loading and error states
- Follow existing animation patterns

### Component Development Pattern

```typescript
// Follow existing component structure
export function RecommendationInput({ onSubmit, preferences, onPreferencesChange }: Props) {
  // Use existing design patterns
  return (
    <div className="space-y-6">
      {/* Preferences section following existing pattern */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-3">
          <div className="from-Secondary-500 to-Primary-500 shadow-Secondary-500/25 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
            <Settings className="h-4 w-4 text-white drop-shadow-sm" />
          </div>
          <h3 className="text-lg font-bold text-white">Preferences</h3>
        </div>
        {/* Preference controls */}
      </div>

      {/* Input section */}
      <div className="space-y-4">
        {/* Text input following existing patterns */}
      </div>
    </div>
  );
}
```

## Integration Points

### API Services
```typescript
// Extend existing appwrite service
export class AIRecommendationsAPI {
  async getRecommendations(description: string, userLibrary: LibraryMedia[], preferences: Preferences) {
    // Call Appwrite cloud function
  }
}

// Add to main appwrite service
export const appwriteService = {
  auth: new AuthAPI(),
  database: new DatabaseAPI(),
  aiRecommendations: new AIRecommendationsAPI(),
  // ... other services
};
```

### Routing Integration
```typescript
// Add to existing router structure
{
  path: 'recommendations',
  Component: AIRecommendations,
  // Follow existing route patterns
}
```

### Navigation Integration
```typescript
// Add to existing navigation
const navigationItems = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Library', path: '/library', icon: BookOpen },
  { label: 'Movies', path: '/movies', icon: Film },
  { label: 'TV Shows', path: '/tv', icon: Tv },
  { label: 'AI Recommendations', path: '/recommendations', icon: Brain }, // New item
  // ... existing items
];
```

## Quality Standards

### Code Quality Checklist
- [ ] Follows existing TypeScript patterns
- [ ] Uses proper component structure
- [ ] Implements proper error handling
- [ ] Includes loading states
- [ ] Follows accessibility guidelines
- [ ] Uses existing design system
- [ ] Implements proper animations
- [ ] Includes proper testing

### Design Quality Checklist
- [ ] Matches existing visual design
- [ ] Uses correct color scheme
- [ ] Follows typography patterns
- [ ] Implements proper spacing
- [ ] Uses existing animation patterns
- [ ] Responsive design implemented
- [ ] Accessibility considered
- [ ] Performance optimized

### Integration Quality Checklist
- [ ] Integrates with existing services
- [ ] Follows existing API patterns
- [ ] Uses existing state management
- [ ] Proper error boundaries
- [ ] Loading state management
- [ ] Cache invalidation handled
- [ ] Navigation integration
- [ ] URL state management

## Feature Maintenance

### Regular Tasks
1. **Performance Monitoring**: Track query performance and optimization
2. **Error Analysis**: Monitor and fix common error patterns
3. **User Feedback**: Collect and implement improvement suggestions
4. **API Updates**: Keep up with external API changes
5. **Security Reviews**: Regular security audit of AI integration

### Future Enhancements
1. **Personalization**: Improve recommendations based on user behavior
2. **Collaborative Filtering**: Add user-to-user recommendations
3. **Advanced Analytics**: Deeper insights into recommendation effectiveness
4. **Content Curation**: Editorial recommendation lists
5. **Social Features**: Share and discuss recommendations

## Testing Strategy

### Unit Tests
```typescript
describe('RecommendationInput', () => {
  it('validates input before submission', () => {
    // Test input validation
  });

  it('calls onSubmit with correct data', () => {
    // Test form submission
  });

  it('handles loading and error states', () => {
    // Test state management
  });
});
```

### Integration Tests
```typescript
describe('AI Recommendations Flow', () => {
  it('complete recommendation workflow', () => {
    // Test full user journey
  });

  it('handles API errors gracefully', () => {
    // Test error scenarios
  });
});
```

### Performance Tests
- Bundle size impact
- Query performance
- Animation smoothness
- Mobile performance