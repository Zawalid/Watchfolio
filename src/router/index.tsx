import { createBrowserRouter, Navigate } from 'react-router';
import {  Layout, LibraryLayout, MoviesLayout, SettingsLayout, TvLayout } from '@/layouts';
import {
  Home,
  Library,
  NotFound,
  Movies,
  TV,
  Details,
  Search,
  EmailVerification,
  Profile,
  PrivacySecurity,
  Preferences,
  LibrarySettings,
} from '@/pages';
import { moviesLoader, tvShowsLoader } from './loaders';
import { LIBRARY_MEDIA_STATUS, TMDB_MOVIE_CATEGORIES, TMDB_TV_CATEGORIES } from '@/utils/constants';
import { slugify } from '@/utils';


export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
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
              ...([...LIBRARY_MEDIA_STATUS.map(s => s.value), 'all'].map(s => ({
                path: slugify(s), element: <Library status={s as LibraryFilterStatus} />
              })))

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
                element: <Navigate to='/movies/popular' replace />,
              },
              ...(TMDB_MOVIE_CATEGORIES.map(c => ({
                path: c, element: <Movies category={c} />, loader: moviesLoader,
              })))

            ],
          },
          {
            path: 'details/:slug',
            element: <Details type='movie' />,
            // loader: MovieLoader,
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
                element: <Navigate to='/tv/popular' replace />,
              },
              ...(TMDB_TV_CATEGORIES.map(c => ({
                path: c, element: <TV category={c} />, loader: tvShowsLoader,
              })))
            ],
          },
          {
            path: 'details/:slug',
            element: <Details type='tv' />,
            // loader: tvDetailsLoader,
          },
        ],
      },
      {
        path: 'search',
        Component: Search,
      },
      {
        path: 'settings',
        Component: SettingsLayout,
        children: [
          {
            index: true,
            element: <Navigate to='/settings/preferences' replace />,
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
