---
applyTo: '**'
---

# Expert Instructions for Watchfolio Development Agent

## 🎯 Core Principles

You are working on **Watchfolio** - a premium entertainment tracking app with a focus on modern, sleek design and excellent UX. Think Netflix/Disney+ level polish, not generic SaaS.

## 🚫 Critical Rules

- **NEVER run build commands** (`npm run build`, `pnpm build`, etc.) unless explicitly asked
- **NEVER use oversized elements** - the user values properly proportioned, realistic sizing
- **ALWAYS use the established design system** - no random Tailwind colors or arbitrary values
- **THINK ENTERTAINMENT APP** - avoid corporate/SaaS patterns, embrace streaming service aesthetics

## 🎨 Design System Mastery

### Colors (Use ONLY these tokens):

- **Primary**: `Primary-50` to `Primary-900` (Purple: #5a4af4)
- **Secondary**: `Secondary-50` to `Secondary-900` (Blue: #1ea5fc)
- **Tertiary**: `Tertiary-50` to `Tertiary-900` (Purple-Pink: #b66dff)
- **Success**: `Success-50` to `Success-900` (Green: #05ce91)
- **Warning**: `Warning-50` to `Warning-900` (Orange: #ffad49)
- **Error**: `Error-50` to `Error-900` (Red: #ff6161)
- **Grey**: `Grey-50` to `Grey-900` (Dark theme base: #121829)
- **Special**: `bg-blur` (rgba(18, 24, 41, 0.8)), `border` (#292f46)

### Sizing Guidelines:

- **Text**: `text-sm` to `text-4xl` MAX (never use `text-5xl+`)
- **Padding**: `p-2` to `p-8` MAX (avoid excessive padding)
- **Margins**: `m-2` to `m-16` MAX (be conservative)
- **Border radius**: `rounded` to `rounded-2xl` MAX (avoid `rounded-3xl`)
- **Containers**: `max-w-xs` to `max-w-6xl` (prefer `max-w-4xl` or smaller)

### Component Patterns:

- Use `bg-blur backdrop-blur-xl` for glass morphism
- Use `border-white/10` and `border-white/20` for subtle borders
- Use gradient backgrounds sparingly with proper opacity
- Icons should be `w-4 h-4` to `w-6 h-6` (avoid oversized icons)

## 🛠️ Technical Standards

### Code Quality:

- **TypeScript first** - use proper types, avoid `any`
- **React patterns** - functional components, hooks, proper dependency arrays
- **Performance** - use `useMemo`, `useCallback` when appropriate
- **Accessibility** - proper ARIA labels, semantic HTML, keyboard navigation

### State Management:

- **Zustand** for global state (existing stores: `useAuthStore`, `useLibraryStore`, `useSyncStore`)
- **React Query** for server state (`src/lib/react-query.ts`)
- **Local state** for component-specific data
- **Context** only for theme/modal providers

### File Organization:

- **Components**: `/src/components/` (organized by feature)
- **Pages**: `/src/pages/` (route-based organization)
- **Hooks**: `/src/hooks/` (custom business logic)
- **Utils**: `/src/utils/` (pure functions, helpers)
- **Types**: `/src/types/` (TypeScript definitions)

## 🎬 Entertainment App Focus

### UI Inspiration:

- **Netflix**: Clean cards, smooth animations, dark theme
- **Disney+**: Premium feel, gradient accents, hero sections
- **Apple TV+**: Minimal typography, focus on content
- **Spotify**: Music-inspired animations, vibrant but controlled colors

### UX Patterns:

- **Content-first** - media thumbnails, ratings, metadata are priority
- **Smooth animations** - use Framer Motion for micro-interactions
- **Progressive disclosure** - show essential info first, details on demand
- **Quick actions** - bookmarking, rating, status changes should be instant

## 🔧 Development Workflow

### Package Management:

- Use **pnpm** for all package operations
- Check `package.json` for existing dependencies before adding new ones
- Remove unused imports and dependencies

### Error Handling:

- Provide detailed error descriptions with context
- Include steps taken to resolve issues
- Suggest alternative approaches if first attempt fails

### Code Changes:

- Give brief, clear summaries after each change
- Explain the reasoning behind design decisions
- Highlight any breaking changes or new dependencies

## 📱 Responsive Design

### Breakpoints (use existing):

- **xs**: 400px
- **mobile**: 500px
- **sm**: 640px (Tailwind default)
- **md**: 768px, **lg**: 1024px, **xl**: 1280px

### Mobile-First Approach:

- Start with mobile layout, enhance for larger screens
- Use `flex-col sm:flex-row` patterns
- Ensure touch targets are minimum 44px
- Test text readability at all sizes

## 💡 Performance & Best Practices

### Optimization:

- Lazy load images and heavy components
- Use proper `key` props in lists
- Minimize re-renders with proper memoization
- Optimize bundle size (check imports)

### Accessibility:

- Use semantic HTML elements
- Include proper `alt` text for images
- Ensure keyboard navigation works
- Test with screen readers in mind

## 🎯 Success Metrics

When you deliver code, it should:

1. **Look professional** - like it belongs in a premium entertainment app
2. **Feel responsive** - smooth on all devices and screen sizes
3. **Be maintainable** - clear structure, proper types, good patterns
4. **Follow conventions** - consistent with existing Watchfolio codebase
5. **Delight users** - subtle animations, thoughtful UX, polished details

Remember: You're building the next great entertainment app, not another generic dashboard. Every component should feel like it belongs in a premium streaming service. Quality over quantity, polish over features.
