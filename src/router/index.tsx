import { createBrowserRouter, Navigate } from 'react-router';
import { Layout, LibraryLayout, MoviesLayout, TvLayout } from '@/layouts';
import { Home, Library, NotFound, Movies, TV, Details, Search } from '@/pages';
import { moviesLoader, tvShowsLoader } from './loaders';

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
                element: <Navigate to='/library/all' />,
              },
              {
                path: ':status',

                Component: Library,
                loader: tvShowsLoader,
              },
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
                element: <Navigate to='/movies/popular' />,
              },
              {
                path: ':category',
                Component: Movies,
                loader: moviesLoader,
              },
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
                element: <Navigate to='/tv/popular' />,
              },
              {
                path: ':category',
                Component: TV,
                loader: tvShowsLoader,
              },
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
        path: '*',
        Component: NotFound,
      },
    ],
  },
]);
