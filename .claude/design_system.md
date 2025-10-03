# Watchfolio Design System

## Design Philosophy

**Cinema-Inspired Minimalism**: The design draws inspiration from modern cinema experiences - dark environments that let content shine, subtle lighting effects, and premium materials that don't distract from the main focus.

### Core Principles
1. **Content First**: UI should never compete with movie/TV content for attention
2. **Premium Feel**: Every interaction should feel polished and intentional
3. **Functional Beauty**: Beautiful design that serves functionality, not decoration
4. **Consistent Language**: Unified visual vocabulary across all components
5. **Progressive Disclosure**: Show complexity only when needed

## Color System

### Brand Colors
```css
/* Primary - Purple (Brand Identity) */
Primary-50: #ebe9fe
Primary-500: #5a4af4 (Main brand)
Primary-900: #120f31

/* Secondary - Blue (Accents) */
Secondary-50: #e4f4ff
Secondary-500: #1ea5fc
Secondary-900: #062032

/* Success - Green */
Success-500: #05ce91

/* Error - Red */
Error-500: #ff6161

/* Warning - Orange */
Warning-500: #ffad49
```

### Neutral Palette
```css
/* Grey Scale - Main UI Colors */
Grey-50: #ebeef5   /* Lightest text */
Grey-200: #c1c9d6  /* Light text */
Grey-300: #a1aab8  /* Medium light text */
Grey-400: #7e8795  /* Medium text */
Grey-500: #5d6578  /* Medium dark text */
Grey-600: #4a5467  /* Dark text */
Grey-700: #384155  /* Darker text */
Grey-800: #292f46  /* Very dark backgrounds */
Grey-900: #121829  /* Main background */
```

### Special Colors
```css
--color-blur: rgba(18, 24, 41) /* Background overlay */
--color-border: #292f46        /* Standard borders */
```

## Typography

### Font Family
**Primary**: Poppins (modern, friendly, highly legible)

### Type Scale & Usage
```css
/* Headings */
.heading {
  @apply text-4xl sm:text-5xl font-black text-white leading-tight;
}

/* Gradient Text (for special emphasis) */
.gradient {
  @apply from-Success-400 to-Primary-400 bg-gradient-to-r bg-clip-text text-transparent;
}

/* Body Text Hierarchy */
- Title: text-lg sm:text-2xl font-bold text-white
- Subtitle: text-Grey-400 text-xs sm:text-sm
- Body: text-sm text-white
- Caption: text-xs text-Grey-500
```

## Component Patterns

### Card Design
```css
/* Base Card */
.card-base {
  @apply rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.08] shadow-lg;
}

/* Interactive States */
.card-hover {
  @apply hover:border-white/25 hover:shadow-2xl transition-all duration-500;
}

.card-focus {
  @apply focus:border-Secondary-400/70 focus:ring-Secondary-400/50 focus:ring-2 focus:ring-offset-2 focus:ring-offset-Grey-900;
}
```

### Glass Morphism Effects
```css
/* Standard Glass */
.glass {
  @apply bg-white/5 backdrop-blur-sm border border-white/10;
}

/* Strong Glass */
.glass-strong {
  @apply bg-white/10 backdrop-blur-md border border-white/20;
}
```

### Icon Containers
```css
.icon-container {
  @apply h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg;
}

/* Variations */
.icon-primary { @apply from-Primary-500 to-Secondary-500 shadow-Primary-500/25; }
.icon-success { @apply from-Success-500 to-Secondary-500 shadow-Success-500/25; }
```

### Badges & Pills
```css
.pill-bg {
  @apply rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm;
}

.status-badge {
  @apply rounded-full border px-2 py-0.5 text-xs font-medium backdrop-blur-sm;
}
```

## Input Components

### Text Inputs
```css
.input-base {
  @apply bg-white/5 border-2 border-white/5 focus:border-Primary-500 focus:bg-white/10;
  @apply rounded-xl px-4 pt-4.5 pb-1.5 text-white placeholder:text-Grey-500;
}
```

### Buttons
```css
/* Primary Button */
.button-primary {
  @apply bg-gradient-to-r from-Primary-600 to-Secondary-600 text-white;
  @apply rounded-xl px-6 py-3 font-medium shadow-lg hover:shadow-xl;
}

/* Secondary Button */
.button-secondary {
  @apply border-white/10 bg-white/5 backdrop-blur-md text-white;
  @apply rounded-xl px-6 py-3 hover:bg-white/10;
}
```

## Layout Patterns

### Responsive Grid
```css
/* Standard content grid */
.content-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

/* Section spacing */
.section-spacing {
  @apply space-y-6;
}
```

### Container System
```css
.container {
  @apply mx-auto px-4 md:px-6 lg:px-8;
  /* Custom max-width handling at larger breakpoints */
}
```

## Animation Guidelines

### Motion Principles
1. **Purposeful**: Every animation should have a clear functional purpose
2. **Subtle**: Animations should enhance, not distract
3. **Consistent**: Same timing and easing across similar interactions
4. **Responsive**: Animation quality adapts to device capabilities

### Common Values
```css
/* Duration */
duration-200  /* Quick interactions */
duration-300  /* Standard interactions */
duration-500  /* Complex state changes */

/* Easing */
ease-out      /* Most interactions */
ease-in-out   /* Complex animations */

/* Scale Values */
scale: 1.03   /* Hover scale up */
scale: 0.98   /* Press scale down */
```

### Framer Motion Patterns
```jsx
// Hover interaction
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
transition={{ duration: 0.2 }}

// Focus interaction
whileFocus={{ scale: 1.03, y: -8 }}
transition={{ duration: 0.3, ease: 'easeOut' }}

// Stagger children
variants={{
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}}
```

## Accessibility Standards

### Focus Management
- Clear visual focus indicators
- Logical tab order
- Skip links for main content
- Focus trapping in modals

### Color & Contrast
- WCAG AA compliance minimum
- High contrast mode support
- Color not sole indicator of state

### Semantic HTML
- Proper heading hierarchy
- ARIA labels and roles
- Screen reader friendly content
- Keyboard navigation support

## Mobile Considerations

### Responsive Design
- Mobile-first approach
- Touch-friendly targets (minimum 44px)
- Swipe gestures for navigation
- Progressive enhancement

### Performance
- Optimized images and assets
- Lazy loading patterns
- Smooth 60fps animations
- Fast loading states