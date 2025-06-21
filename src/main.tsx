import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router';

import '@/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

/* 
<script 
         disable-devtool-auto 
         src='https://cdn.jsdelivr.net/npm/disable-devtool@latest'
      ></script>
*/

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    throw '(skipping full reload)';
  });
}
