/**
 * React hook for platform detection and platform-specific features
 */

import { useEffect, useState } from 'react';
import {
  getPlatform,
  isDesktop,
  isMobile,
  isWeb,
  isTauri,
  platformCapabilities,
  type Platform,
} from '@/lib/platform';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    setPlatform(getPlatform());
  }, []);

  return {
    platform,
    isDesktop: isDesktop(),
    isMobile: isMobile(),
    isWeb: isWeb(),
    isTauri: isTauri(),
    capabilities: platformCapabilities,
  };
}
