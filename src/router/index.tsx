import { createBrowserRouter, Navigate } from 'react-router';
import { Layout, LibraryLayout, MoviesLayout, SettingsLayout, TvLayout } from '@/layouts';
import {
  Home,
  Library,
  NotFound,
  Movies,
  TV,
  MediaDetails,
  Search,
  EmailVerification,
  Profile,
  PrivacySecurity,
  Preferences,
  LibrarySettings,
  Landing,
  CelebrityDetails,
  Celebrities,
  Collections,
  CollectionDetails,
  Networks,
  NetworkDetails,
  TermsOfService,
  PrivacyPolicy,
  Devices,
  UserProfile,
  UserLibrary,
  StatsInsights,
  ViewingTaste,
  MoodRecommendations,
} from '@/pages';
import { moviesLoader, tvShowsLoader, rootLoader } from './loaders';
import { LIBRARY_MEDIA_STATUS } from '@/utils/constants';
import { slugify } from '@/utils';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Landing,
        loader: rootLoader,
      },
      {
        path: 'home',
        Component: Home,
      },
      {
        path: 'library',
        Component: LibraryLayout,
        children: [
          {
            children: [
              {
                index: true,
                element: <Navigate to='/library/all' replace />,
              },
              ...[...LIBRARY_MEDIA_STATUS.map((s) => s.value), 'all'].map((s) => ({
                path: slugify(s),
                element: <Library status={s as LibraryFilterStatus} />,
              })),
            ],
          },
        ],
      },
      {
        path: 'movies',
        children: [
          {
            Component: MoviesLayout,
            children: [
              {
                index: true,
                Component: Movies,
                loader: moviesLoader,
              },
            ],
          },
          {
            path: 'details/:slug',
            element: <MediaDetails type='movie' />,
          },
        ],
      },
      {
        path: 'tv',
        children: [
          {
            Component: TvLayout,
            children: [
              {
                index: true,
                Component: TV,
                loader: tvShowsLoader,
              },
            ],
          },
          {
            path: 'details/:slug',
            element: <MediaDetails type='tv' />,
          },
        ],
      },
      {
        path: 'search',
        Component: Search,
      },
      {
        path: 'mood-match',
        Component: MoodRecommendations,
      },
      {
        path: 'celebrities',
        children: [
          {
            index: true,
            Component: Celebrities,
          },
          {
            path: ':slug',
            Component: CelebrityDetails,
          },
        ],
      },
      {
        path: 'collections',
        children: [
          {
            index: true,
            Component: Collections,
          },
          {
            path: ':slug',
            Component: CollectionDetails,
          },
        ],
      },
      {
        path: 'settings',
        Component: SettingsLayout,
        children: [
          {
            index: true,
            element: <Navigate to='/settings/profile' replace />,
          },
          {
            path: 'profile',
            Component: Profile,
          },
          {
            path: 'privacy',
            Component: PrivacySecurity,
          },
          {
            path: 'preferences',
            Component: Preferences,
          },
          {
            path: 'library',
            Component: LibrarySettings,
          },
          {
            path: 'devices',
            Component: Devices,
          },
        ],
      },
      {
        path: 'networks',
        children: [
          {
            index: true,
            Component: Networks,
          },
          {
            path: ':slug',
            Component: NetworkDetails,
          },
        ],
      },
      {
        path: 'legal',
        children: [
          {
            path: 'terms',
            Component: TermsOfService,
          },
          {
            path: 'privacy',
            Component: PrivacyPolicy,
          },
        ],
      },
      {
        path: 'u/:username',
        Component: UserProfile,
        children: [
          {
            index: true,
            element: <StatsInsights />,
          },
          {
            path: 'stats',
            element: <StatsInsights />,
          },
          {
            path: 'taste',
            element: <ViewingTaste />,
          },
          {
            path: 'library',
            element: <UserLibrary />,
          },
        ],
      },
    ],
  },
  {
    path: '/verify-email',
    Component: EmailVerification,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
