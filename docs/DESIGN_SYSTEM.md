# Watchfolio Design System Reference

## Color Palette

### Primary Colors
- Primary (Purple/Blue): `#5a4af4`
- Secondary (Bright Blue): `#1ea5fc`
- Tertiary (Accent Purple): `#b66dff`

### Semantic Colors
- Success: `#05ce91`
- Error/Danger: `#ff6161`
- Warning: `#ffad49`

### Grayscale
- Grey-900: `#121829` (Main background)
- Grey-800: `#20283e` (Dark surfaces)
- Grey-400: `#767e94` (Muted text)
- Grey-300: `#8e95a9` (Tertiary text, icons)
- Grey-200: `#a8aebf` (Secondary text)
- Grey-100: `#c3c8d4`
- Grey-50: `#ebeef5` (Lightest text)

### Transparency Pattern
```
white/5   - Very subtle backgrounds
white/10  - Standard borders, glass backgrounds
white/15  - Button backgrounds
white/20  - Hover borders
white/60  - Icon colors
white/80  - Text on dark
white/90  - Strong text
```

## Typography

- Font: Poppins
- Text colors: `text-white`, `text-Primary-50` (active), `text-Grey-200` (body), `text-Grey-300` (secondary), `text-white/90`, `text-white/60` (icons)
- Sizes: `text-xs` (12px), `text-sm` (14px), `text-base` (16px)
- Weights: `font-medium` (500), `font-semibold` (600), `font-bold` (700)

## Button Styles

### Primary Button (Gradient)
```tsx
className="button-primary!"
// Or expanded:
className="bg-gradient-to-r from-Primary-600 to-Secondary-600
  hover:from-Primary-700 hover:to-Secondary-700
  shadow-lg shadow-Primary-600/20 text-sm font-medium"
```

### Secondary Button (Glass)
```tsx
className="button-secondary!"
// Or expanded:
className="border border-white/10 bg-white/5
  text-sm backdrop-blur-md hover:bg-white/10"
```

### Icon Buttons
```tsx
className="h-8 w-12 flex items-center justify-center
  hover:bg-white/10 transition-all duration-150 group"
```

## HeroUI Dropdown Pattern

```tsx
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection } from '@heroui/react';

<Dropdown
  classNames={{
    base: 'min-w-64',
    content: 'backdrop-blur-xl bg-blur blur-bg border border-white/5'
  }}
  placement='bottom-start'
>
  <DropdownTrigger>
    <button className="px-3 py-2 text-sm text-Grey-300
      hover:bg-white/5 hover:text-Primary-50
      rounded-lg transition-colors">
      Trigger
    </button>
  </DropdownTrigger>

  <DropdownMenu
    itemClasses={{
      base: 'hover:bg-white/5! rounded-lg px-3 py-2 text-sm
        text-Grey-200 hover:text-Primary-50
        data-[focus=true]:bg-white/5!'
    }}
  >
    <DropdownItem key="item" startContent={<Icon />}>
      Item
    </DropdownItem>
  </DropdownMenu>
</Dropdown>
```

## Glass Morphism

```tsx
// Standard glass:
className="backdrop-blur-xl bg-white/5 border border-white/10"

// Modal backdrop:
className="bg-black/50 backdrop-blur-[3px]"
```

## Spacing

- Gap: `gap-1` (4px), `gap-2` (8px), `gap-3` (12px)
- Padding: `p-3, px-3, py-3` (12px common for menu items)
- Heights: `h-8` (32px titlebar), `h-10` (40px buttons), `h-16` (64px navbar)
- Border radius: `rounded-lg` (8px), `rounded-xl` (12px)
- Icon sizes: `size-4` (16px standard), `size-5` (20px larger)

## Active States

```tsx
// Active menu item:
className="text-Primary-400 bg-Primary-500/20"

// Hover:
className="hover:bg-white/5 hover:text-Primary-50"

// Borders:
className="border-white/10 hover:border-white/20"
```

## Key Principles

1. Dark mode only: Grey-900 background
2. Glass morphism: backdrop-blur-xl everywhere
3. Subtle borders: white/10 default, white/20 hover
4. Icon color: white/60 default, white/90 hover
5. Transitions: 150-200ms duration
