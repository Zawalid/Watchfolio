import { createBrowserRouter, Navigate } from 'react-router';
import { Layout, MoviesLayout, TvLayout } from '@/layouts';
import { Home, NotFound, Movies, TV, Details, Search } from '@/pages';
import { movieDetailsLoader, moviesLoader, tvDetailsLoader, tvShowsLoader } from './loaders';

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
            loader: movieDetailsLoader,
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
            loader: tvDetailsLoader,
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
