# UI Store Usage Examples

## Simple Modals (Boolean State)

### Example 1: Filters Modal
```tsx
// FiltersModal.tsx
import { useUIStore } from '@/stores/useUIStore';

export function FiltersModal() {
  // Get state and actions
  const isOpen = useUIStore((state) => state.filters);
  const close = useUIStore((state) => state.closeFilters);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <h2>Filters</h2>
      {/* Modal content */}
    </Modal>
  );
}

// Trigger button (anywhere in the app)
export function FilterButton() {
  const toggle = useUIStore((state) => state.toggleFilters);

  return <Button onPress={toggle}>Filters</Button>;
}
```

### Example 2: Import/Export Modal
```tsx
// ImportExportModal.tsx
import { useUIStore } from '@/stores/useUIStore';

export function ImportExportModal() {
  const isOpen = useUIStore((state) => state.importExport);
  const close = useUIStore((state) => state.closeImportExport);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      {/* Content */}
    </Modal>
  );
}

// Already registered in GlobalShortcuts with ctrl+i
// Can also open programmatically:
const open = useUIStore.getState().openImportExport;
open();
```

### Example 3: Keyboard Shortcuts Help Modal
```tsx
// KeyboardShortcutsModal.tsx
import { useUIStore } from '@/stores/useUIStore';

export function KeyboardShortcutsModal() {
  const isOpen = useUIStore((state) => state.shortcuts);
  const close = useUIStore((state) => state.closeShortcuts);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      {/* List of shortcuts */}
    </Modal>
  );
}

// Registered in GlobalShortcuts with ? key
```

---

## Complex Modals (With Data)

### Example 4: Media Status Modal
```tsx
// MediaStatusModal.tsx
import { useUIStore } from '@/stores/useUIStore';

export function MediaStatusModal() {
  const { isOpen, data } = useUIStore((state) => state.mediaStatus);
  const close = useUIStore((state) => state.closeMediaStatus);

  if (!data) return null;

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <h2>Add to Library: {data.title}</h2>
      <img src={data.posterPath} alt={data.title} />
      <p>Type: {data.mediaType}</p>
      <p>TMDB ID: {data.tmdbId}</p>
      {/* Status selection, rating, etc. */}
    </Modal>
  );
}

// Open from anywhere (e.g., MediaCard component)
export function MediaCard({ media }) {
  const openMediaStatus = useUIStore((state) => state.openMediaStatus);

  const handleAddToLibrary = () => {
    openMediaStatus({
      tmdbId: media.id,
      mediaType: media.media_type,
      title: media.title || media.name,
      posterPath: media.poster_path,
    });
  };

  return (
    <div>
      <h3>{media.title}</h3>
      <Button onPress={handleAddToLibrary}>Add to Library</Button>
    </div>
  );
}
```

### Example 5: Confirmation Modal (Promise-based)
```tsx
// ConfirmationModal.tsx
import { useUIStore } from '@/stores/useUIStore';

export function ConfirmationModal() {
  const { isOpen, options } = useUIStore((state) => state.confirmation);
  const resolve = useUIStore((state) => state.resolveConfirmation);

  if (!options) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => resolve(false)}>
      <h2>{options.title}</h2>
      <p>{options.message}</p>
      <div className="actions">
        <Button
          variant={options.variant || 'danger'}
          onPress={() => resolve(true)}
        >
          {options.confirmText || 'Confirm'}
        </Button>
        <Button onPress={() => resolve(false)}>
          {options.cancelText || 'Cancel'}
        </Button>
      </div>
    </Modal>
  );
}

// Usage: Delete functionality
export function DeleteButton({ itemId }) {
  const confirm = useUIStore((state) => state.confirm);

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Delete Library Item?',
      message: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });

    if (confirmed) {
      await deleteItem(itemId);
      toast.success('Item deleted');
    }
  };

  return <Button onPress={handleDelete}>Delete</Button>;
}

// Usage: Clear library
export function ClearLibraryButton() {
  const confirm = useUIStore((state) => state.confirm);

  const handleClear = async () => {
    const confirmed = await confirm({
      title: 'Clear Entire Library?',
      message: 'This will remove all items from your library. This cannot be undone.',
      confirmText: 'Clear Library',
      variant: 'danger',
    });

    if (confirmed) {
      await clearLibrary();
    }
  };

  return <Button onPress={handleClear}>Clear Library</Button>;
}
```

---

## UI Elements

### Example 6: Sidebar
```tsx
// Sidebar.tsx
import { useUIStore } from '@/stores/useUIStore';

export function Sidebar() {
  const isOpen = useUIStore((state) => state.sidebar);
  const close = useUIStore((state) => state.closeSidebar);

  return (
    <aside className={isOpen ? 'open' : 'closed'}>
      <Button onPress={close}>Close</Button>
      {/* Sidebar content */}
    </aside>
  );
}

// Toggle button
export function SidebarToggle() {
  const toggle = useUIStore((state) => state.toggleSidebar);

  return <Button onPress={toggle}>Toggle Sidebar</Button>;
}

// Already registered in GlobalShortcuts with ctrl+b
```

### Example 7: Command Palette
```tsx
// CommandPalette.tsx
import { useUIStore } from '@/stores/useUIStore';

export function CommandPalette() {
  const isOpen = useUIStore((state) => state.commandPalette);
  const close = useUIStore((state) => state.closeCommandPalette);

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <Input placeholder="Search commands..." />
      {/* Command list */}
    </Modal>
  );
}

// Already registered in GlobalShortcuts with ctrl+k
```

### Example 8: Search Focus
```tsx
// SearchInput.tsx
import { useUIStore } from '@/stores/useUIStore';
import { useEffect, useRef } from 'react';

export function SearchInput() {
  const isFocused = useUIStore((state) => state.searchFocused);
  const blur = useUIStore((state) => state.blurSearch);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when searchFocused becomes true
  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
      // Reset the focus state after focusing
      blur();
    }
  }, [isFocused, blur]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search..."
    />
  );
}

// Already registered in GlobalShortcuts with / key
// When user presses /, focusSearch() is called, input focuses
```

---

## Global Actions

### Example 9: Close All Modals (Escape key)
```tsx
// Already handled in GlobalShortcuts
// Pressing ESC closes all modals

// Can also call programmatically:
const closeAll = useUIStore.getState().closeAllModals;
closeAll();
```

---

## Outside React Components

### Example 10: Programmatic Access (No Hook)
```tsx
// In a utility function, service, or event handler
import { useUIStore } from '@/stores/useUIStore';

// Open modal
export function handleDeepLink(url: string) {
  if (url.includes('/import')) {
    useUIStore.getState().openImportExport();
  }
}

// Confirmation
export async function confirmLogout() {
  const confirm = useUIStore.getState().confirm;

  const confirmed = await confirm({
    title: 'Logout?',
    message: 'Are you sure you want to logout?',
  });

  if (confirmed) {
    logout();
  }
}
```

---

## Best Practices

### ✅ DO: Use selectors for optimized re-renders
```tsx
// Only re-renders when filters state changes
const isOpen = useUIStore((state) => state.filters);

// Only re-renders when toggleFilters function changes (never)
const toggle = useUIStore((state) => state.toggleFilters);
```

### ✅ DO: Extract actions at component level
```tsx
function MyComponent() {
  const isOpen = useUIStore((state) => state.filters);
  const toggle = useUIStore((state) => state.toggleFilters);

  return <Button onPress={toggle}>Toggle</Button>;
}
```

### ❌ DON'T: Get entire store (causes unnecessary re-renders)
```tsx
// BAD: Re-renders on ANY store change
const store = useUIStore();
return <Button onPress={store.toggleFilters}>Toggle</Button>;
```

### ✅ DO: Use Promise pattern for confirmations
```tsx
const confirmed = await confirm({ ... });
if (confirmed) {
  // Do the action
}
```

### ✅ DO: Pass data to complex modals
```tsx
openMediaStatus({
  tmdbId: 123,
  mediaType: 'movie',
  title: 'The Matrix',
  posterPath: '/path.jpg',
});
```

---

## Migration Example

### Before (with Context Provider)
```tsx
// Old way with provider
const { isOpen, onOpen, onClose } = useDisclosure();

<Modal isOpen={isOpen} onClose={onClose}>
  {/* Content */}
</Modal>

// Pass disclosure down through props
<FiltersModal disclosure={{ isOpen, onOpen, onClose }} />
```

### After (with UI Store)
```tsx
// New way with store
const isOpen = useUIStore((state) => state.filters);
const close = useUIStore((state) => state.closeFilters);

<Modal isOpen={isOpen} onClose={close}>
  {/* Content */}
</Modal>

// No props needed! Modal accesses store directly
<FiltersModal />
```
