import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { router } from './router';

import '@/styles/index.css';
import { useAuthStore } from './stores/useAuthStore';
import { useLibraryStore } from './stores/useLibraryStore';
import { useOnboardingStore } from './stores/useOnboardingStore';

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

if (import.meta.env.DEV && typeof window !== 'undefined') {
  let devtoolsMounted = false;

  if (!devtoolsMounted) {
    mountStoreDevtool('AuthStore', useAuthStore);
    mountStoreDevtool('LibraryStore', useLibraryStore);
    mountStoreDevtool('OnboardingStore', useOnboardingStore);
    devtoolsMounted = true;
  }
}
