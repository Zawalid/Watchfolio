import { useEffect, useCallback, useRef, useState } from 'react';

// Constants for grid calculation
const DEFAULT_CARD_WIDTH = 200;
const DEFAULT_CARDS_GAP = 16;

/**
 * Configuration for keybindings. Can be a single key string or an array of keys.
 * Set to `false` to disable a key binding.
 */
interface Keybindings {
  next?: string | string[];
  prev?: string | string[];
  nextRow?: string | string[];
  prevRow?: string | string[];
  first?: string | string[];
  last?: string | string[];
  select?: string | string[] | false;
}

interface UseListNavigatorOptions {
  /** A CSS selector to find all navigable items within the container. */
  itemSelector?: string;
  /** Total number of items in the list. */
  itemCount: number;
  /** Optional callback when an item is "selected" via Enter/Space key. */
  onSelect?: (selectedIndex: number) => void;
  /** The navigation pattern: 'grid' (4-way), 'vertical' (up/down), or 'horizontal' (left/right). */
  orientation?: 'vertical' | 'horizontal' | 'grid';
  /** The master switch. If false, the hook does nothing. Crucial for context switching (e.g., when a modal is open). */
  enabled?: boolean;
  /** If true, navigation will wrap around from the last item to the first, and vice-versa. */
  loop?: boolean;
  /** An object to override the default keybindings (e.g., using WASD). */
  keybindings?: Keybindings;
  /** If true, the hook will automatically call `.focus()` on the active item. Set to false for manual focus management. */
  autoFocus?: boolean;
  /** The width of each card, used for grid calculation. */
  cardWidth?: number;
  /** The gap between cards, used for grid calculation. */
  cardsGap?: number;
  initialIndex?: number;
}

const defaultKeybindings: Required<Keybindings> = {
  next: 'ArrowRight',
  prev: 'ArrowLeft',
  nextRow: 'ArrowDown',
  prevRow: 'ArrowUp',
  first: 'Home',
  last: 'End',
  select: ['Enter', ' '],
};

/**
 * A hook to handle keyboard navigation for a list or grid of items.
 * It attaches a keydown listener to the document and manages focus and selection,
 * but only acts when its `enabled` prop is true.
 * @param options - The configuration options for the navigator.
 */
export function useListNavigator({
  itemSelector = '[role="article"], [role="option"], [role="button"]',
  itemCount,
  onSelect,
  orientation = 'grid',
  enabled = true,
  loop = true,
  keybindings: customKeybindings,
  autoFocus = true,
  cardWidth = DEFAULT_CARD_WIDTH,
  cardsGap = DEFAULT_CARDS_GAP,
  initialIndex,
}: UseListNavigatorOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex && initialIndex > -1 ? initialIndex : -1);

  const keys = { ...defaultKeybindings, ...customKeybindings };

  const getItemsPerRow = useCallback(() => {
    if (orientation !== 'grid' || !containerRef.current) {
      return 1;
    }
    const containerWidth = containerRef.current.clientWidth;
    return Math.max(1, Math.floor(containerWidth / (cardWidth + cardsGap)));
  }, [orientation, containerRef, cardWidth, cardsGap]);

  useEffect(() => {
    if (enabled && autoFocus && currentIndex > -1 && containerRef.current) {
      const items = containerRef.current.querySelectorAll<HTMLElement>(itemSelector);
      items[currentIndex]?.focus();
    }
  }, [currentIndex, enabled, autoFocus, containerRef, itemSelector]);

  useEffect(() => {
    if (!enabled || itemCount === 0) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const isKey = (binding: string | string[] | false) => {
        if (binding === false) return false;
        return Array.isArray(binding) ? binding.includes(e.key) : e.key === binding;
      };

      const allNavKeys = Object.values(keys).flat().filter(Boolean) as string[];

      if (!allNavKeys.includes(e.key)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const navigate = (newIndex: number) => {
        if (currentIndex === -1) {
          setCurrentIndex(0);
          return;
        }

        let finalIndex = newIndex;
        if (loop) {
          finalIndex = (newIndex + itemCount) % itemCount;
        } else {
          finalIndex = Math.max(0, Math.min(newIndex, itemCount - 1));
        }
        if (finalIndex !== currentIndex) {
          setCurrentIndex(finalIndex);
        }
      };

      if (orientation !== 'vertical') {
        if (isKey(keys.next)) navigate(currentIndex + 1);
        if (isKey(keys.prev)) navigate(currentIndex - 1);
      }
      if (orientation !== 'horizontal') {
        if (isKey(keys.nextRow)) navigate(currentIndex + getItemsPerRow());
        if (isKey(keys.prevRow)) navigate(currentIndex - getItemsPerRow());
      }

      if (isKey(keys.first)) navigate(0);
      if (isKey(keys.last)) navigate(itemCount - 1);

      if (isKey(keys.select)) {
        if (onSelect && currentIndex > -1) {
          onSelect(currentIndex);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, itemCount, currentIndex, getItemsPerRow, loop, onSelect, orientation]);

  return {
    containerRef,
    currentIndex,
    setCurrentIndex,
  };
}
