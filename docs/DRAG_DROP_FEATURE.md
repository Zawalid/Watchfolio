# Watchfolio - Drag & Drop Feature Specification

## Document Overview

**Feature Name**: Drag & Drop Library Management
**Priority**: High (Quick Win)
**Effort**: Low-Medium
**Status**: Planning Phase
**Version**: 1.0
**Last Updated**: 2025-10-14

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Feature Priorities](#feature-priorities)
3. [Primary Feature: Move Between Statuses](#primary-feature-move-between-statuses)
4. [Secondary Feature: Custom Reordering](#secondary-feature-custom-reordering)
5. [User Experience Details](#user-experience-details)
6. [Technical Architecture](#technical-architecture)
7. [Related Features & Future Enhancements](#related-features--future-enhancements)
8. [Success Metrics](#success-metrics)
9. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

This document outlines the design and implementation strategy for adding drag-and-drop functionality to Watchfolio's library management system. The feature focuses on making library organization more intuitive and efficient through two main capabilities:

1. **Primary**: Drag media cards to sidebar status tabs to change their watch status
2. **Secondary**: Manually reorder items within a status category

The drag-and-drop feature leverages the existing `@dnd-kit` library already present in the dependencies, making it a low-effort, high-value addition that significantly improves user workflow.

---

## Feature Priorities

### Priority 1: Move Between Statuses (Primary)
**Goal**: Make status changes instant and intuitive
**User Pain Point**: Currently requires:
- Opening media details page, OR
- Using keyboard shortcuts (not discoverable), OR
- Right-click context menu

**Solution**: Direct drag-from-library → drop-on-sidebar-tab workflow

### Priority 2: Custom Reordering (Secondary)
**Goal**: Allow users to prioritize their watchlist
**User Pain Point**: Users want to manually organize "what to watch next"
**Solution**: Custom sort order with drag-to-reorder

---

## Primary Feature: Move Between Statuses

### Overview

Enable users to drag any media card from the library view and drop it onto a status tab in the sidebar to instantly change its watch status.

### User Story

```
As a user managing my library,
I want to drag a movie/show card to a status tab in the sidebar,
So that I can quickly change its status without opening menus or modals.
```

### Detailed Behavior

#### Drag Initiation
- **Trigger**: Click and hold (mouse) or long-press (touch) on any media card
- **Visual Feedback**:
  - Card becomes semi-transparent (opacity: 0.6)
  - Cursor changes to "grabbing"
  - Card slightly scales down (95%)
  - Drag preview follows cursor with smooth animation
  - Other cards remain in place (no reordering within grid)

#### During Drag
- **Sidebar Status Tabs**:
  - All status tabs become highlighted with a subtle glow
  - Active tab (current status) shows different styling
  - Hovering over a tab:
    - Tab background brightens
    - Tab border becomes prominent
    - Small indicator icon appears (arrow or check)
    - Tooltip shows: "Drop to mark as [Status Name]"

- **Visual Indicators**:
  - Current status tab: Dim highlight (you can drop here but status won't change)
  - Other status tabs: Bright highlight (status will change)
  - Invalid drop zones: No highlight

#### Drop Action
- **On Valid Status Tab**:
  - Smooth animation of card returning to original position
  - Immediate status update (optimistic UI)
  - Item moves to the new status view
  - Toast notification: "Moved to [Status Name]"
  - If staying on same view, card fades out
  - If navigating to target status, card appears in new list

- **On Invalid Zone** (outside sidebar):
  - Card animates back to original position
  - No changes made
  - Subtle shake animation to indicate invalid drop

- **On Current Status Tab**:
  - Card returns to position
  - No changes made
  - Toast: "Already in [Status Name]"

### Edge Cases & Handling

#### 1. **Drag from Filtered View**
- User is viewing filtered results (by genre, search, etc.)
- Drop on new status
- **Behavior**: Item status changes, but item might disappear from current view if filter no longer matches
- **Toast**: "Moved to [Status]. Item no longer matches current filters."

#### 2. **Drag While Offline**
- No internet connection
- **Behavior**:
  - Drag-drop works normally (local-first)
  - Visual indicator shows "Sync pending"
  - Changes queue for sync when online
  - Toast: "Saved locally. Will sync when online."

#### 3. **Multi-Select + Drag** (Future Enhancement)
- Multiple cards selected
- Drag one of them
- **Behavior**: All selected cards move to new status
- **Toast**: "Moved [X] items to [Status]"

#### 4. **Drag from Public Profile**
- Viewing someone else's library
- **Behavior**: Drag disabled (cards not draggable)
- Visual cue: No drag cursor on hover

#### 5. **Rapid Status Changes**
- User quickly drags multiple items
- **Behavior**:
  - Queue mutations
  - Optimistic UI updates immediately
  - Show sync status indicator
  - Handle conflicts gracefully

### Accessibility

#### Keyboard Alternative
- Focus on a card (Tab navigation)
- Press `Space` to "pick up" card
- Arrow keys to navigate to sidebar
- `Enter` to drop on focused status tab
- `Escape` to cancel

#### Screen Reader
- Announce: "Media card draggable. Current status: [Status]"
- During drag: "Dragging [Title]. Focus status tab and press Enter to drop."
- After drop: "[Title] moved to [New Status]"

### Mobile Experience

#### Touch Gestures
- **Long Press** (500ms): Initiate drag
- **Haptic Feedback**: Vibrate on drag start
- **Visual Feedback**:
  - Card lifts with shadow
  - Sidebar expands slightly for easier targeting
  - Large touch targets (minimum 44x44px)

#### Responsive Considerations
- On mobile, sidebar is in a drawer
- Opening drawer while dragging:
  - Option 1: Auto-open drawer when drag starts
  - Option 2: Drag to screen edge triggers drawer open
  - Option 3: Show floating status buttons during drag

### Animation Details

All animations respect `enableAnimations` user preference.

#### Drag Start (150ms)
```javascript
{
  scale: 0.95,
  opacity: 0.6,
  zIndex: 1000,
  boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
  transition: { duration: 0.15, ease: 'easeOut' }
}
```

#### Drag Active (No animation, follows cursor)
```javascript
{
  x: cursorX,
  y: cursorY,
  transition: { duration: 0 }
}
```

#### Drop Success (300ms)
```javascript
{
  scale: 1,
  opacity: 0,
  transition: { duration: 0.3, ease: 'easeInOut' }
}
```

#### Drop Cancel (200ms - snap back)
```javascript
{
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  transition: { type: 'spring', stiffness: 300, damping: 25 }
}
```

### Status-Specific Behaviors

#### Moving to "Favorites"
- When dropping on Favorites tab:
  - If item has no status (none), prompt: "Add to Favorites and mark as...?"
  - Show quick select: [Watching] [Completed] [Plan to Watch]
  - Or: Auto-set to Completed + Favorite

#### Moving from "Favorites"
- Favorites is a filter, not a status
- Dropping elsewhere removes favorite flag?
- **Decision Needed**: Should favorites be treated differently?
- **Recommended**: Favorites remain separate (use heart icon for toggle)

#### Moving to "All"
- "All" is not a status, it's a view
- **Behavior**: Drag to "All" tab does nothing (not droppable)

---

## Secondary Feature: Custom Reordering

### Overview

Allow users to manually reorder items within a specific status view by dragging cards to new positions in the grid. Order is preserved and synced across devices.

### User Story

```
As a user with many items in "Plan to Watch",
I want to reorder them by priority,
So that I can easily see what I want to watch next.
```

### Detailed Behavior

#### Enabling Custom Sort
- **Sort Dropdown**: Add new option "Custom Order"
- **Availability**:
  - Initially: Only for "Plan to Watch" status
  - Future: Can enable for all statuses via user preference
- **Default**: Items have no custom order (null)
- **Auto-Assignment**: When user first reorders, assign values (10, 20, 30...)

#### Drag to Reorder
- **Trigger**: Click and drag card when sort is "Custom Order"
- **Visual Feedback**:
  - Drag handle icon appears on card hover (6 dots)
  - Cards shift to make space for drop position
  - Drop indicator line shows where card will land
  - Semi-transparent placeholder shows original position

#### During Reorder Drag
- **Grid Behavior**:
  - Cards smoothly animate to new positions
  - Real-time feedback of final layout
  - Responsive to cursor/touch position
  - Works with multi-column grid

- **Visual States**:
  - **Dragging Card**: Semi-transparent, follows cursor
  - **Other Cards**: Shift positions in real-time
  - **Drop Zone**: Blue line indicator between cards
  - **Placeholder**: Dashed outline in original position

#### Drop to Reorder
- **On Valid Position**:
  - Cards animate to final positions
  - Calculate new `customOrder` values
  - Optimistic UI update
  - Debounced save (1 second delay for multiple reorders)
  - No toast (silent operation for better UX)

- **Edge Detection**:
  - Dragging to top: Insert at position 0
  - Dragging to bottom: Append to end
  - Dragging between: Insert at calculated position

### Custom Order Storage

#### Database Field
```typescript
customOrder: number | null
```

#### Value Assignment Strategy
```
Initial State: All items have customOrder = null
User reorders:
  - First item: customOrder = 10
  - Second item: customOrder = 20
  - Third item: customOrder = 30
  - ...

Why increments of 10?
  - Allows inserting between items without recalculating all
  - Example: Insert between 10 and 20 → assign 15
  - Only recalculate when space runs out

Recalculation Trigger:
  - When gap between items < 2
  - Reassign all items in status: 10, 20, 30, ...
```

#### Sorting Logic
```sql
-- When sortBy = 'customOrder'
ORDER BY
  CASE
    WHEN customOrder IS NULL THEN 999999999
    ELSE customOrder
  END ASC,
  addedAt DESC

-- Items without customOrder appear at end, sorted by addedAt
```

### Multi-Status Ordering

#### Separate Orders Per Status
- Each status maintains its own order
- Moving item to new status:
  - Option 1: Reset customOrder to null (appears at end)
  - Option 2: Preserve order value (might not make sense)
  - **Recommended**: Option 1

#### "All" View
- Shows items from all statuses
- Custom order not available in "All" view
- Falls back to other sort options (recent, title, etc.)

### Bulk Reordering

#### Moving Multiple Items
- **Phase 1**: Single-item drag only
- **Future Enhancement**:
  - Select multiple items (checkboxes)
  - Drag as a group
  - Maintain relative order within group
  - Insert group at drop position

### Accessibility

#### Keyboard Reordering
- Focus on card
- Press `Space` to enter "reorder mode"
- Arrow Up/Down: Move item
- Arrow Left/Right: Move item (in grid)
- `Enter`: Confirm new position
- `Escape`: Cancel

#### Screen Reader
- Announce: "Card [X] of [Y] in custom order. Current position [X]."
- During move: "Moving [Title]. New position [X] of [Y]."
- After drop: "[Title] moved to position [X]."

### Visual Design

#### Drag Handle
```
Position: Top-right corner of card
Icon: Six dots (::) or grip lines (≡)
Visibility:
  - Hidden by default
  - Visible on card hover
  - Always visible on touch devices when custom sort active
Color: Primary-300 with opacity
Size: 20x20px
Cursor: grab / grabbing
```

#### Drop Indicator
```
Style: 2px solid line
Color: Primary (brand blue)
Animation: Pulse gently
Position: Between cards (flexbox gap)
```

#### Placeholder
```
Style: Dashed border
Color: Primary-400 with opacity
Background: Transparent
Opacity: 0.4
```

---

## User Experience Details

### Combined Behavior: Status Change + Reorder

When custom sort is active:
- **Drag within grid**: Reorder
- **Drag to sidebar**: Change status (reorder canceled)

Implementation:
- Detect drop target
- If target = sidebar tab → Status change
- If target = grid position → Reorder
- Priority: Status change > Reorder

### Undo Functionality (Future)

After drag-drop action:
- Show temporary toast with "Undo" button
- 5-second timeout
- Click undo: Revert change
- Useful for accidental drops

### Conflict Resolution

#### Simultaneous Reorders (Multi-Device)
- User A and User B reorder same list
- **Resolution**: Last-write-wins
- RxDB replication handles automatically
- Both devices eventually sync to same state

#### Order Drift
- Over time, customOrder values may become sparse (10, 23, 87, 105...)
- **Cleanup**: Background task to normalize values
- Trigger: When average gap > 50
- Normalize to 10, 20, 30... without changing order

---

## Technical Architecture

### Libraries Used

#### @dnd-kit
```typescript
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
```

**Why @dnd-kit?**
- Already installed
- Excellent performance
- Accessibility built-in
- Touch support
- Tree-shakeable
- Flexible API

### Data Flow

#### Status Change Flow
```
[User Drags Card]
    ↓
[Drop on Sidebar Tab]
    ↓
[Extract Target Status]
    ↓
[useAddOrUpdateLibraryItem Mutation]
    ↓
[Update RxDB Document]
    ↓
[Optimistic UI Update]
    ↓
[RxDB → Appwrite Replication]
    ↓
[Query Invalidation]
    ↓
[UI Reflects New State]
```

#### Reorder Flow
```
[User Drags Card in Custom Sort]
    ↓
[Drop at New Position]
    ↓
[Calculate New customOrder Values]
    ↓
[Optimistic Local Update (Instant)]
    ↓
[Debounce 1s]
    ↓
[Batch Update Mutation]
    ↓
[Update RxDB Documents]
    ↓
[RxDB → Appwrite Replication]
    ↓
[Query Refetch (if needed)]
```

### Database Schema Changes

```typescript
// src/lib/rxdb/schemas.ts

export const LibraryItemschema: RxJsonSchema<LibraryMedia> = {
  version: 5, // Increment from 4
  properties: {
    // ... existing fields

    customOrder: {
      type: ['integer', 'null'],
      minimum: 0,
      maximum: 2147483647,
    },
  },
  indexes: [
    // ... existing indexes

    // New index for custom sort
    ['userId', 'status', 'customOrder'],
  ],
}
```

### API Changes

```typescript
// src/lib/rxdb/collections.ts

// Enhanced query builder
export const getAllLibraryItems = async (
  userId?: string,
  options: {
    sortBy?: 'recent' | 'title' | 'rating' | 'releaseDate' | 'customOrder'
    // ... other options
  }
) => {
  // Handle customOrder sorting
  if (options.sortBy === 'customOrder') {
    queryBuilder = queryBuilder.sort([
      { customOrder: 'asc' },
      { addedAt: 'desc' }
    ])
  }
}

// New function for reordering
export const updateCustomOrder = async (
  itemId: string,
  newOrder: number
): Promise<LibraryMedia> => {
  const db = await getWatchfolioDB()
  const doc = await db.libraryMedia.findOne(itemId).exec()

  if (!doc) throw new LibraryError('Item not found')

  const updated = await doc.update({
    $set: {
      customOrder: newOrder,
      lastUpdatedAt: new Date().toISOString()
    }
  })

  return updated.toJSON() as LibraryMedia
}

// Batch update for efficiency
export const batchUpdateCustomOrder = async (
  updates: Array<{ id: string; customOrder: number }>
): Promise<void> => {
  const db = await getWatchfolioDB()

  await Promise.all(
    updates.map(async ({ id, customOrder }) => {
      const doc = await db.libraryMedia.findOne(id).exec()
      if (doc) {
        await doc.update({
          $set: {
            customOrder,
            lastUpdatedAt: new Date().toISOString()
          }
        })
      }
    })
  )
}
```

### Component Architecture

```
LibraryLayout
  └── LibraryViewLayout
       ├── LibrarySidebar (Droppable Status Tabs)
       │    └── StatusTab (Droppable)
       └── LibraryView
            └── DndContext (Drag-Drop Provider)
                 ├── SortableContext (Reordering)
                 │    └── LibraryCard[] (Draggable & Sortable)
                 └── DragOverlay (Visual Feedback)
```

### State Management

#### Drag State
```typescript
interface DragState {
  isDragging: boolean
  activeId: string | null
  activeItem: LibraryMedia | null
  dragType: 'status-change' | 'reorder' | null
  targetStatus: WatchStatus | null
}
```

Managed by:
- React state in DndContext
- No need for Zustand (temporary UI state)

#### Custom Order State
- Stored in RxDB (source of truth)
- Managed by TanStack Query
- Optimistic updates for instant feedback

---

## Related Features & Future Enhancements

### 1. Multi-Select Drag

**Description**: Select multiple cards and drag them as a group

**Use Case**:
- User wants to mark 5 movies as "Completed" at once
- Bulk reordering

**Implementation**:
- Checkbox selection mode
- Drag any selected card → all move
- Visual: Show count badge on drag preview

**Effort**: Medium

---

### 2. Drag to Remove

**Description**: Drag card to a "trash" zone to remove from library

**Use Case**: Quick deletion without confirmation

**Implementation**:
- Trash zone appears at bottom when dragging
- Drop on trash → Remove from library
- Confirmation modal (respects user preference)
- Undo toast

**Effort**: Low

---

### 3. Drag to Add Tags/Lists

**Description**: Drag cards to custom list categories

**Prerequisites**: Lists & Collections feature (Roadmap #6)

**Use Case**: Organize movies into custom lists

**Implementation**:
- Lists appear in sidebar or modal
- Drop on list → Add to collection
- Can belong to multiple lists

**Effort**: Medium (requires Lists feature first)

---

### 4. Drag from Search/Discover

**Description**: Drag media from search results directly to status

**Use Case**:
- Browsing TMDB search
- See interesting movie
- Drag directly to "Plan to Watch" in sidebar

**Implementation**:
- Make MediaCard (non-library) draggable
- Sidebar always droppable
- On drop: Add to library with target status
- Skip MediaStatusModal

**Effort**: Low

**Value**: Very High (streamlined workflow)

---

### 5. Drag to Create Lists

**Description**: Drag card to empty space → Create new list

**Prerequisites**: Lists feature

**Use Case**: "I want to create a Marvel Movies list"

**Implementation**:
- Drop zone: "Create New List"
- Modal: Name your list
- Card automatically added

**Effort**: Medium

---

### 6. Smart Reordering Suggestions

**Description**: AI suggests optimal order for "Plan to Watch"

**Use Case**: User has 50+ items, needs help prioritizing

**Implementation**:
- Button: "Suggest Order"
- Gemini AI analyzes:
  - User ratings of completed items
  - Genre preferences
  - Current trending topics
  - Movie release dates
- Applies suggested order
- User can accept/reject

**Effort**: Medium (uses existing AI)

---

### 7. Visual Grouping During Drag

**Description**: Cards group visually by genre/decade when dragging

**Use Case**: Better understanding of library composition

**Implementation**:
- During drag, cards shift to show clusters
- Temporary visual grouping
- Returns to sort order on drop

**Effort**: High (complex animation)

---

### 8. Drag to Share

**Description**: Drag card to social share zone

**Prerequisites**: Social features (Roadmap #7)

**Use Case**: Share recommendation with followers

**Implementation**:
- Share zone appears during drag
- Drop → Open share modal with card pre-selected
- Quick share to activity feed

**Effort**: Medium

---

### 9. Drag to Calendar

**Description**: Drag to calendar view to schedule watching

**Prerequisites**: Calendar feature (Roadmap #22)

**Use Case**: "I'll watch this movie on Friday"

**Implementation**:
- Calendar view available
- Drop on date → Schedule reminder
- Integration with notifications

**Effort**: High

---

### 10. Gesture-Based Quick Actions

**Description**: Drag direction triggers action

**Use Case**: Mobile-first quick actions

**Implementation**:
- Swipe right: Mark as completed
- Swipe left: Remove from library
- Swipe up: Add to favorites
- Swipe down: Open details

**Platform**: Mobile only

**Effort**: Medium

---

### 11. Collaborative Reordering

**Description**: Multiple users reorder shared list in real-time

**Prerequisites**:
- Collaborative lists (Roadmap #21)
- Realtime sync (Appwrite Realtime)

**Use Case**: Couples deciding watch order together

**Implementation**:
- Show other user's cursor during drag
- Conflict resolution with timestamps
- Live updates via Realtime subscriptions

**Effort**: High

---

### 12. Drag to Export

**Description**: Drag cards to export zone for selective export

**Use Case**: "Export only my Marvel movies"

**Implementation**:
- Export zone in UI
- Drop cards to add to export selection
- Export button appears when selection exists
- Export as JSON/CSV

**Effort**: Low

---

### 13. Custom Sort Presets

**Description**: Save and load custom sort orders

**Use Case**:
- "Weekend Mood" order
- "Date Night" order
- "Quick Watch" order

**Implementation**:
- Save current customOrder as preset
- Load preset → Apply to current view
- Manage presets in settings

**Effort**: Medium

---

### 14. Drag Visual Themes

**Description**: Different drag animations based on media type

**Implementation**:
- Movies: Film reel animation
- TV Shows: Screen flicker effect
- Documentaries: Paper document style

**Effort**: Low (fun polish)

---

### 15. Batch Operations After Reorder

**Description**: After reordering, apply bulk action

**Use Case**:
- Reorder by priority
- Mark top 5 as "watching"

**Implementation**:
- Reorder mode has "Select Top X" button
- Apply action to selection

**Effort**: Low

---

## Success Metrics

### Quantitative Metrics

1. **Adoption Rate**
   - % of users who use drag-drop at least once
   - Target: >60% within first month

2. **Usage Frequency**
   - Average drags per session
   - Target: >3 status changes via drag-drop per session

3. **Efficiency Gain**
   - Time to change status: Before vs After
   - Target: 50% reduction in time

4. **Custom Sort Adoption**
   - % of users who enable custom sort
   - Target: >30% of "Plan to Watch" users

5. **Error Rate**
   - % of failed drags (bugs, conflicts)
   - Target: <1%

### Qualitative Metrics

1. **User Feedback**
   - Survey: "How intuitive is drag-drop?"
   - Target: >4.5/5 stars

2. **Feature Discovery**
   - % of users who discover feature without tutorial
   - Target: >70%

3. **Mobile Experience**
   - Touch drag satisfaction rating
   - Target: >4/5 stars

### A/B Testing Ideas

1. **Drag Handle Visibility**
   - A: Always visible
   - B: Visible on hover only
   - Metric: Usage rate

2. **Drop Indicator Style**
   - A: Line between cards
   - B: Highlighted target card
   - Metric: Success rate

3. **Animation Duration**
   - A: 200ms
   - B: 300ms
   - Metric: Perceived smoothness

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
- Database schema migration (v4 → v5)
- Add `customOrder` field
- Update TypeScript types
- Create drag-drop context
- Basic DndContext setup

**Deliverable**: Schema ready, types updated

---

### Phase 2: Primary Feature - Status Change (Week 1-2)
- Make LibraryCard draggable
- Make sidebar status tabs droppable
- Implement status change on drop
- Add visual feedback (highlights, tooltips)
- Mutation hooks for status updates
- Toast notifications
- Mobile touch support

**Deliverable**: Fully functional drag-to-change-status

---

### Phase 3: Secondary Feature - Custom Reorder (Week 2-3)
- Add "Custom Order" to sort options
- Implement sortable grid
- Custom order calculation logic
- Batch update mutations
- Debounced saves
- Visual indicators (drag handles, drop lines)

**Deliverable**: Fully functional custom reordering

---

### Phase 4: Polish & Accessibility (Week 3)
- Keyboard navigation for drag-drop
- Screen reader announcements
- Animation refinements
- Respect animation preferences
- Loading and error states
- Edge case handling

**Deliverable**: Accessible, polished experience

---

### Phase 5: Mobile Optimization (Week 4)
- Touch gesture refinements
- Haptic feedback
- Responsive sidebar behavior
- Large touch targets
- Performance optimization for mobile

**Deliverable**: Excellent mobile experience

---

### Phase 6: Testing & Documentation (Week 4)
- Manual testing across devices
- Edge case testing
- Performance profiling
- Update user documentation
- Internal code documentation
- Create demo video

**Deliverable**: Production-ready feature

---

## Open Questions & Decisions Needed

### 1. Favorites Behavior
**Question**: When dragging to "Favorites" tab, what happens?

**Options**:
- A: Toggle favorite flag only (keep existing status)
- B: Set favorite + prompt for status selection
- C: Set favorite + auto-set to Completed

**Recommendation**: Option A (consistent with filter concept)

---

### 2. "All" View Drag Target
**Question**: Should "All" tab be droppable?

**Options**:
- A: Not droppable (All is a view, not a status)
- B: Droppable → Sets status to "none"
- C: Droppable → Opens status selection modal

**Recommendation**: Option A

---

### 3. Custom Sort Availability
**Question**: Which statuses should have custom sort?

**Options**:
- A: Only "Plan to Watch"
- B: All statuses
- C: User preference per status

**Recommendation**: Start with A, expand to C later

---

### 4. Reorder Persistence Across Sorts
**Question**: When switching between sorts, preserve custom order?

**Options**:
- A: Always preserve (hidden when not in custom sort mode)
- B: Reset if user sorts by something else
- C: Ask user: "Switch to [Sort]? Custom order will be hidden."

**Recommendation**: Option A (less surprising)

---

### 5. Multi-Device Conflict Resolution
**Question**: How to handle simultaneous reorders?

**Options**:
- A: Last-write-wins (RxDB default)
- B: Merge strategies (complex)
- C: Lock mechanism (prevent simultaneous edits)

**Recommendation**: Option A (simple, acceptable for v1)

---

### 6. Undo Functionality
**Question**: Include undo for drag-drop actions?

**Options**:
- A: Yes, for all drag-drop actions
- B: Only for status changes (not reorders)
- C: No undo (keep simple)

**Recommendation**: Option B (status changes are more impactful)

---

### 7. Custom Order Normalization
**Question**: When to normalize customOrder values?

**Options**:
- A: On every reorder (heavy)
- B: Background task (weekly)
- C: Manual user action (button: "Reset Order Numbering")
- D: When gap < 2 (automatic, smart)

**Recommendation**: Option D

---

### 8. Drag-Drop in Filtered Views
**Question**: Allow drag-drop when filters are active?

**Options**:
- A: Allow, but warn if item will disappear
- B: Disable drag-drop in filtered views
- C: Allow, auto-remove filters after drop

**Recommendation**: Option A (most flexible)

---

### 9. Touch vs Mouse Behavior
**Question**: Should touch have different behavior than mouse?

**Considerations**:
- Touch: Long-press might feel slow
- Touch: No hover states
- Touch: Larger targets needed

**Recommendation**: Optimize each platform separately

---

### 10. Performance with Large Libraries
**Question**: How to handle drag-drop with 1000+ items?

**Options**:
- A: Only make visible items draggable (infinite scroll)
- B: Virtual scrolling with drag-drop
- C: Limit custom sort to first 100 items

**Recommendation**: Option A (leverage existing infinite scroll)

---

## Conclusion

The drag-and-drop feature represents a significant UX improvement for Watchfolio with minimal implementation effort. By prioritizing status changes as the primary feature, we solve the most common user action (changing watch status) with the most intuitive interaction (drag and drop).

The secondary custom reordering feature adds depth for power users who want granular control over their watchlist priorities.

Both features align perfectly with Watchfolio's local-first architecture and leverage existing infrastructure (`@dnd-kit`), making this a true "quick win" from the roadmap.

**Next Steps**:
1. Review and approve this specification
2. Finalize open questions
3. Begin Phase 1 implementation
4. Iterate based on user feedback

---

**Document Maintained By**: Claude Code
**Stakeholders**: Watchfolio Development Team
**Review Cycle**: Weekly during implementation
