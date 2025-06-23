import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function useInitialAuth() {
  const { user, checkAuth } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

     checkAuth();
  }, [user, checkAuth]);
}
