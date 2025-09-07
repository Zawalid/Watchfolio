import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'mobile' | 'sm' | 'md' | 'lg' | 'xl';

interface ViewportSize {
  isXs: boolean;
  isMobile: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  current: Breakpoint;
  isBelow: (breakpoint: Breakpoint) => boolean;
  isAbove: (breakpoint: Breakpoint) => boolean;
}

export function useViewportSize(): ViewportSize {
  const [size, setSize] = useState<Breakpoint>(() => getBreakpoint());

  function getBreakpoint(): Breakpoint {
    if (typeof window === 'undefined') return 'sm'; 
    const width = window.innerWidth;
    if (width < 400) return 'xs';
    if (width < 500) return 'mobile';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    return 'xl';
  }

  function getBreakpointValue(breakpoint: Breakpoint): number {
    const breakpoints = {
      xs: 400,
      mobile: 500,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    };
    return breakpoints[breakpoint];
  }

  function isBelow(breakpoint: Breakpoint): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < getBreakpointValue(breakpoint);
  }

  function isAbove(breakpoint: Breakpoint): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= getBreakpointValue(breakpoint);
  }

  useEffect(() => {
    const handleResize = () => setSize(getBreakpoint());
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isXs: size === 'xs',
    isMobile: size === 'mobile',
    isSm: size === 'sm',
    isMd: size === 'md',
    isLg: size === 'lg',
    isXl: size === 'xl',
    current: size,
    isBelow,
    isAbove
  };
}