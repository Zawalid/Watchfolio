# AI Assistant Instructions for Watchfolio Development

## Core Principles

### 1. Always Follow Existing Patterns
- **NEVER** create new design patterns - always use existing ones
- Study existing components before implementing anything new
- Match color schemes, typography, spacing, and animations exactly
- Follow the established component architecture and file structure

### 2. Understand Before Implementing
- Read all context files in `.claude/` before starting any work
- Analyze existing similar components to understand patterns
- Ask clarifying questions if requirements are unclear
- Validate understanding with user before proceeding

### 3. Quality Over Speed
- Take time to implement features correctly the first time
- Follow all established coding standards and patterns
- Implement proper error handling and loading states
- Ensure accessibility and performance standards are met

## Development Workflow

### Before Starting Any Feature
1. **Read Context Files**: Review all files in `.claude/` folder
2. **Analyze Existing Code**: Study similar existing components and patterns
3. **Plan Implementation**: Break down feature into small, manageable tasks
4. **Create Todo List**: Use TodoWrite tool to track progress
5. **Validate Approach**: Confirm understanding with user if needed

### During Development
1. **Follow Existing Patterns**: Never deviate from established patterns
2. **Incremental Implementation**: Build features step by step
3. **Test Continuously**: Verify each piece works before moving on
4. **Update Progress**: Mark todos as completed when finished
5. **Handle Errors Gracefully**: Implement proper error boundaries and fallbacks

### Code Implementation Standards

#### Component Development
```typescript
// ALWAYS follow this structure for new components
interface ComponentProps {
  // Use explicit, descriptive prop types
  data: SpecificType;
  onAction?: (param: SpecificType) => void;
  isLoading?: boolean;
}

export function Component({ data, onAction, isLoading = false }: ComponentProps) {
  // Handle loading states
  if (isLoading) {
    return <ComponentSkeleton />;
  }

  // Handle error states
  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  // Main component logic
  return (
    <div className="existing-pattern-classes">
      {/* Follow existing design patterns exactly */}
    </div>
  );
}
```

#### Styling Guidelines
```typescript
// ALWAYS use existing design system classes
<div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg">

// ALWAYS use existing icon container patterns
<div className="from-Primary-500 to-Secondary-500 shadow-Primary-500/25 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg">
  <Icon className="h-5 w-5 text-white drop-shadow-sm" />
</div>

// ALWAYS use existing typography patterns
<h2 className="text-lg font-bold text-white sm:text-2xl">Title</h2>
<p className="text-Grey-400 text-xs sm:text-sm">Description</p>
```

#### Animation Patterns
```typescript
// ALWAYS use existing Framer Motion patterns
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.2 }}
>

// ALWAYS use existing stagger patterns
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
```

### API Integration Standards

#### React Query Patterns
```typescript
// ALWAYS follow existing query patterns
export function useFeatureData(params: FeatureParams) {
  return useQuery({
    queryKey: ['feature', params],
    queryFn: () => apiService.getFeatureData(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.requiredField
  });
}

// ALWAYS follow existing mutation patterns
export function useFeatureMutation() {
  return useMutation({
    mutationFn: (data: FeatureData) => apiService.updateFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['feature']);
      toast.success('Success message');
    },
    onError: (error) => {
      toast.error('Error message');
    }
  });
}
```

## Design System Adherence

### Color Usage
- **Primary Colors**: Use Primary-X scale for brand elements
- **Secondary Colors**: Use Secondary-X scale for accents
- **Grey Scale**: Use Grey-X scale for text and backgrounds
- **Semantic Colors**: Use Success, Error, Warning for status indicators

### Typography Hierarchy
- **Main Headings**: `text-lg font-bold text-white sm:text-2xl`
- **Descriptions**: `text-Grey-400 text-xs sm:text-sm`
- **Body Text**: `text-sm text-white`
- **Captions**: `text-xs text-Grey-500`

### Spacing Patterns
- **Section Spacing**: `space-y-6`
- **Card Padding**: `p-6`
- **Element Gaps**: `gap-3`, `gap-4`, `gap-6`
- **Responsive Grid**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### Component Patterns
- **Cards**: Glass morphism with rounded-2xl borders
- **Buttons**: Gradient backgrounds with hover effects
- **Icons**: Contained in gradient circular backgrounds
- **Input Fields**: Glass effect with floating labels

## Error Handling Requirements

### User-Facing Errors
```typescript
// ALWAYS provide user-friendly error messages
if (error) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-bold text-white">Something went wrong</h3>
      <p className="text-Grey-400 text-sm mb-4">
        We couldn't load this content. Please try again.
      </p>
      <Button onClick={refetch}>Try Again</Button>
    </div>
  );
}
```

### Loading States
```typescript
// ALWAYS provide loading states that match the content structure
if (isLoading) {
  return (
    <div className="space-y-6">
      {/* Skeleton that matches the actual content layout */}
      <div className="animate-pulse">
        <div className="h-4 bg-Grey-700 rounded w-1/4 mb-2" />
        <div className="h-3 bg-Grey-800 rounded w-1/2" />
      </div>
    </div>
  );
}
```

## Testing Requirements

### Component Testing
- Test all user interactions
- Test loading and error states
- Test responsive behavior
- Test accessibility features

### Integration Testing
- Test API integration
- Test state management
- Test routing integration
- Test error handling

## Documentation Requirements

### Code Documentation
```typescript
// ALWAYS document complex logic
/**
 * Processes user description and generates AI recommendations
 * @param description - Natural language description of what user wants
 * @param preferences - User content preferences (type, decade, duration)
 * @param userLibrary - User's existing library for personalization
 * @returns Promise<RecommendationResponse>
 */
async function generateRecommendations(
  description: string,
  preferences: UserPreferences,
  userLibrary: LibraryMedia[]
): Promise<RecommendationResponse> {
  // Implementation
}
```

### Component Props Documentation
```typescript
interface ComponentProps {
  /** The data to display */
  data: DataType;
  /** Callback when user performs action */
  onAction?: (item: DataType) => void;
  /** Whether component is in loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}
```

## Performance Requirements

### Bundle Size
- Keep bundle impact minimal
- Use dynamic imports for large features
- Optimize images and assets

### Runtime Performance
- Implement proper memoization
- Use React.memo for pure components
- Optimize re-renders

### Network Performance
- Implement proper caching strategies
- Use optimistic updates where appropriate
- Handle offline scenarios

## Accessibility Requirements

### Keyboard Navigation
- Support Tab navigation
- Implement Enter/Space for actions
- Provide skip links

### Screen Readers
- Use semantic HTML
- Provide ARIA labels
- Implement proper heading hierarchy

### Visual Accessibility
- Maintain color contrast ratios
- Provide focus indicators
- Support reduced motion preferences

## Communication Guidelines

### Progress Updates
- Use TodoWrite tool to track progress
- Update todos as work is completed
- Communicate blockers clearly

### Error Reporting
- Provide specific error details
- Include relevant code context
- Suggest potential solutions

### Feature Clarification
- Ask specific questions about requirements
- Confirm understanding before implementing
- Validate design decisions

## Quality Gates

### Before Committing Code
- [ ] Follows all existing patterns
- [ ] Implements proper error handling
- [ ] Includes loading states
- [ ] Passes TypeScript checks
- [ ] Follows accessibility guidelines
- [ ] Matches existing design exactly
- [ ] Includes proper documentation
- [ ] Updates todo list

### Before Marking Feature Complete
- [ ] All requirements implemented
- [ ] All edge cases handled
- [ ] Performance tested
- [ ] Mobile responsive
- [ ] Accessibility verified
- [ ] Error boundaries tested
- [ ] Integration tested
- [ ] Code reviewed against standards

## Remember: The Goal is Excellence

Every feature should feel like it was built by the original team. Users should never be able to tell that a feature was added later - it should feel completely integrated and native to the application.

**When in doubt, always err on the side of following existing patterns rather than creating new ones.**