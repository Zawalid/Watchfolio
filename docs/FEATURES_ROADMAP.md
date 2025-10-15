# Watchfolio - Feature Roadmap & Suggestions

This document outlines suggested features and enhancements for Watchfolio, prioritized by value, feasibility, and alignment with the existing architecture.

## Priority Levels

- **🔴 High Priority** - High value, ready to implement with current architecture
- **🟡 Medium Priority** - Valuable features that may require some infrastructure work
- **🔵 Low Priority** - Nice-to-have features for future consideration

---

## 🔴 High Priority Features

### 1. Watchlist Management Enhancements

**Reorder/Sort Personal Watchlist**
- Allow users to manually reorder items in "Plan to Watch" status
- Use existing `@dnd-kit` infrastructure (already in dependencies)
- Add custom sort option: "My Order"
- Store order in a new field: `customOrder: number`

**Value**: Users often want to prioritize what to watch next
**Effort**: Low (drag-drop library already present)
**Files**: `src/components/library/`, `src/lib/rxdb/schema.ts`

---

### 2. Advanced Statistics & Insights

**Viewing Patterns Dashboard**
- Watching timeline (items completed per month)
- Rating distribution chart
- Average rating by genre
- Most productive month
- Longest/shortest watched content

**Implementation**:
- Use existing Library Stats function as base
- Add charting library (Chart.js or Recharts)
- Create new page: `src/pages/library/Statistics.tsx`

**Value**: Users love seeing their viewing patterns
**Effort**: Medium (needs charting library)

---

### 3. Enhanced Search & Discovery

**Advanced Filters**
- Filter by year range (e.g., "2020-2023")
- Filter by rating range (e.g., "7.5-9.0")
- Filter by runtime range (e.g., "90-120 minutes")
- Combine multiple genres (AND/OR logic)

**Save Custom Filters**
- Save filter combinations as presets
- Quick access to saved filters
- Example: "High-rated short movies from 2020s"

**Value**: Power users want granular control
**Effort**: Medium (UI + RxDB query builder)

---

### 4. Streaming Service Integration

**"Where to Watch" Feature**
- Use JustWatch API or TMDB "watch providers" endpoint
- Show availability by country
- Filter by available streaming services
- Add to library directly from search results

**Implementation**:
- TMDB already provides watch providers
- Add to media details page
- Store user's preferred services in preferences

**Value**: Users want to know where to watch content
**Effort**: Low (TMDB already has this data)

---

### 5. Episode Tracking for TV Shows

**Track Watched Episodes**
- Mark individual episodes as watched
- Progress bar for each season
- "Continue Watching" section with next episode
- Auto-mark as completed when all episodes watched

**Database Schema Addition**:
```typescript
WatchedEpisodes {
  id: string
  libraryMediaId: string
  seasonNumber: number
  episodeNumber: number
  watchedAt: string
}
```

**Value**: Critical for TV show tracking
**Effort**: High (new schema, UI, sync logic)

---

### 6. Lists & Collections

**Custom User Lists**
- Create custom lists (e.g., "Marvel Movies", "Cozy Rainy Day")
- Add any media to multiple lists
- Share lists publicly
- Browse community lists

**Implementation**:
- New collection: `user_lists`
- Many-to-many relationship with `library_media`
- Public/private toggle per list

**Value**: Organize beyond status categories
**Effort**: Medium (new collection, UI)

---

### 7. Social Features - Phase 1 (Basic)

**Follow System**
- Follow other users
- See followed users' public profiles
- View their recently added/completed items (activity feed)

**Likes & Comments**
- Like items in others' libraries
- Comment on public profiles
- Activity notifications

**Implementation**:
- New collections: `follows`, `likes`, `comments`, `notifications`
- Use Appwrite Realtime for notifications
- Public feed page

**Value**: Social aspect increases engagement
**Effort**: High (multiple new features)

---

## 🟡 Medium Priority Features

### 8. Watchlist Recommendations

**"Recommend from My Watchlist"**
- AI analyzes "Plan to Watch" list
- Suggests what to watch next based on:
  - Current mood
  - Recent watching patterns
  - Highest-rated similar content
- Uses existing Gemini integration

**Value**: Helps users decide what to watch
**Effort**: Low (extend existing AI feature)

---

### 9. Import from External Services

**Import from Trakt, Letterboxd, IMDb**
- Parse CSV exports from popular services
- Map to TMDB IDs
- Preview and import
- Use existing Web Worker infrastructure

**Supported Services**:
- Trakt.tv (CSV export)
- Letterboxd (CSV export)
- IMDb ratings (CSV export)
- MyAnimeList (for anime)

**Value**: Lower barrier to entry for new users
**Effort**: Medium (mapping logic, parsers)

---

### 10. Offline Mode Improvements

**Offline Content Caching**
- Cache TMDB images locally (IndexedDB)
- Cache media details for library items
- "Download for offline" button
- Show cached status indicator

**Value**: True offline functionality
**Effort**: Medium (storage management)

---

### 11. Notifications System

**Push Notifications** (via Appwrite)
- New episode airing for tracked shows
- Friend activity (if social features added)
- Upcoming releases in watchlist
- Weekly/monthly statistics summary

**Value**: Keeps users engaged
**Effort**: Medium (Appwrite supports this)

---

### 12. Watch History & Activity Log

**Detailed Activity Timeline**
- Track when items were added/removed
- Rating changes history
- Status changes timeline
- Notes edit history
- Export activity log

**Implementation**:
- Expand existing `activities` collection
- New page: Activity History
- Filter by type (added, completed, rating changed)

**Value**: Users want to see their journey
**Effort**: Low (infrastructure exists)

---

### 13. Quick Rating Widget

**Rate After Marking Complete**
- Modal prompt when marking as completed
- Quick 1-10 rating selector
- Optional notes field
- "Skip" option (optional preference)

**Value**: Encourages rating immediately
**Effort**: Low (UI enhancement)

---

### 14. Multi-Select & Bulk Actions

**Bulk Operations**
- Select multiple items in library
- Change status for all selected
- Add to list
- Export selected items
- Delete selected items

**Implementation**:
- Use existing checkbox pattern
- Bulk action bar at bottom
- Confirmation for destructive actions

**Value**: Manage large libraries efficiently
**Effort**: Medium (UI + logic)

---

### 15. Watchfolio Browser Extension

**Chrome/Firefox Extension**
- Quick "Add to Library" from TMDB/IMDb pages
- See if item is in library while browsing
- Quick status change
- Search library from extension

**Value**: Convenient addition from any page
**Effort**: High (new platform, API integration)

---

## 🔵 Low Priority / Future Features

### 16. Mobile Apps

**React Native Mobile App**
- Share core logic with web app
- Native experience
- Offline-first (already architected)
- Push notifications
- Camera for barcode scanning (optional)

**Value**: Native mobile experience
**Effort**: Very High (new platform)

---

### 17. Desktop App

**Tauri Desktop App**
- Share web codebase
- Native performance
- System tray integration
- Local-first storage with better performance

**Value**: Desktop-native experience
**Effort**: High (new platform, packaging)

---

### 18. Scrobbling & Integrations

**Plex/Jellyfin Integration**
- Auto-track watched content from media servers
- Sync playback status
- Automatic completion marking

**Trakt Scrobbling**
- Sync with Trakt.tv in real-time
- Bi-directional sync

**Value**: Automates tracking
**Effort**: High (external API integrations)

---

### 19. Advanced AI Features

**AI-Powered Features**
- Plot summary rewriting (make it spoiler-free)
- Personalized review generation
- "Movies like X but with Y" queries
- Image recognition (upload poster, find movie)
- Voice input for mood recommendations

**Value**: Cutting-edge user experience
**Effort**: High (AI model integration)

---

### 20. Gamification

**Achievements & Badges**
- "First 100 movies" badge
- "Genre Explorer" (watched 10+ different genres)
- "Binge Watcher" (5+ items in a day)
- "Critic" (rated 100+ items)
- Public badge showcase

**Leaderboards**
- Most watched this month
- Highest average rating
- Most diverse taste

**Value**: Fun engagement mechanic
**Effort**: Medium (tracking, UI)

---

### 21. Watchlist Sharing & Collaborative Lists

**Share Watchlists**
- Generate shareable link
- View-only or collaborative
- Real-time updates (Appwrite Realtime)

**Collaborative Lists**
- Multiple users can add to list
- Vote on what to watch next
- Great for couples/friends

**Value**: Social feature for shared watching
**Effort**: Medium (permissions, UI)

---

### 22. Calendar View

**Release Calendar**
- Upcoming releases from watchlist
- New episodes for tracked shows
- Calendar export (iCal)
- Reminders

**Value**: Never miss a release
**Effort**: Medium (calendar UI)

---

### 23. Reviews & Ratings Platform

**User Reviews**
- Write detailed reviews (not just notes)
- Public reviews on profile
- Rate reviews (helpful/not helpful)
- Browse reviews from followed users

**Value**: Community engagement
**Effort**: High (new feature area)

---

### 24. Smart Recommendations Engine

**Beyond AI: Rule-Based Recommendations**
- "Because you watched X"
- Genre-based recommendations
- Decade-based recommendations
- Director/actor-based recommendations
- Combine with existing AI for hybrid approach

**Value**: More recommendation options
**Effort**: Medium (algorithm development)

---

### 25. Multi-Language Support (i18n)

**Internationalization**
- Support multiple languages
- Language switcher in settings
- Translate UI strings
- Keep TMDB content in original language

**Implementation**:
- Use `react-i18next`
- Extract all strings to translation files
- Community contributions for translations

**Value**: Global audience reach
**Effort**: High (translation, testing)

---

## Implementation Strategy

### Phase 1: Enhancement (Q1-Q2 2025)
Focus on improving existing features and adding high-value additions:
1. ✅ Episode Tracking
2. ✅ Advanced Statistics
3. ✅ Watchlist Management Enhancements
4. ✅ "Where to Watch" Integration
5. ✅ Enhanced Search Filters

### Phase 2: Social & Expansion (Q3-Q4 2025)
Add social features and expand platform:
1. ✅ Lists & Collections
2. ✅ Basic Social Features (Follow, Activity Feed)
3. ✅ Notifications System
4. ✅ Import from External Services
5. ✅ Browser Extension

### Phase 3: Advanced Features (2026)
Cutting-edge features and multi-platform:
1. ✅ Mobile Apps (React Native)
2. ✅ Desktop App (Tauri)
3. ✅ Advanced AI Features
4. ✅ Scrobbling Integration
5. ✅ Gamification

---

## Quick Wins (Can Implement This Week)

These features require minimal effort but provide value:

1. **Quick Rating Widget** - Modal after marking complete
2. **Watchlist Recommendations** - Extend existing AI
3. **Activity Log Expansion** - Use existing collection
4. **Save Custom Filters** - Store in preferences
5. **"Where to Watch" Display** - TMDB already has data

---

## Features That Leverage Existing Infrastructure

These features build on what's already in place:

- **Episode Tracking** → Uses RxDB and sync infrastructure
- **Lists & Collections** → Similar to library structure
- **Bulk Actions** → Uses existing operations
- **Browser Extension** → Uses existing API layer
- **Offline Caching** → Extends RxDB usage
- **AI Watchlist Recommendations** → Extends Gemini integration

---

## Community-Requested Features

Based on similar apps' user feedback:

1. ✅ Episode tracking (most requested)
2. ✅ Custom lists
3. ✅ Social features
4. ✅ "Where to watch" info
5. Collaborative lists
6. Calendar view
7. Import from other services

---

## Technical Debt & Improvements

While adding features, consider:

1. **Testing Infrastructure** - Add Jest + React Testing Library
2. **E2E Tests** - Add Playwright for critical flows
3. **Performance Monitoring** - Add analytics (Plausible/Umami)
4. **Error Tracking** - Integrate Sentry
5. **SEO Optimization** - Add meta tags, OpenGraph
6. **Accessibility Audit** - WCAG 2.1 AA compliance
7. **Documentation** - Storybook for components

---

## Metrics to Track

When implementing features, track:

- **Adoption Rate** - % of users using the feature
- **Engagement** - Frequency of usage
- **Performance Impact** - Load time, bundle size
- **User Feedback** - Surveys, feedback forms
- **Conversion** - Does it help user growth?

---

## Conclusion

Watchfolio has a solid foundation. The suggested features align with the:
- ✅ Local-first architecture
- ✅ Offline-capable design
- ✅ AI-enhanced experience
- ✅ User privacy focus
- ✅ Modern tech stack

Prioritize features that:
1. Solve real user problems
2. Leverage existing infrastructure
3. Maintain performance
4. Align with the vision
5. Are maintainable long-term

**Next Steps**: Choose 2-3 features from High Priority list and create implementation plans.
