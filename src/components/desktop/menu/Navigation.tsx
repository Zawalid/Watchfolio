import { Tooltip } from '@heroui/react';
import { useNavigate, useLocation } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShortcutTooltip } from '@/components/ui/ShortcutKey';
import { useEffect, useState, useRef } from 'react';
import { useShortcut } from '@/hooks/useShortcut';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [navState, setNavState] = useState({ canGoBack: false, canGoForward: false });

  const historyIndexRef = useRef(window.history.state?.idx ?? 0);
  const historyLengthRef = useRef(window.history.length);

  useEffect(() => {
    const currentIdx = window.history.state?.idx ?? 0;
    const historyLength = window.history.length;

    historyIndexRef.current = currentIdx;
    historyLengthRef.current = historyLength;

    setNavState({
      canGoBack: currentIdx > 0,
      canGoForward: currentIdx < historyLength - 1,
    });
  }, [location]);

  const handleBack = () => {
    if (navState.canGoBack) {
      navigate(-1);
    }
  };

  const handleForward = () => {
    if (navState.canGoForward) {
      navigate(1);
    }
  };

  useShortcut('goBack', handleBack, { enabled: navState.canGoBack });
  useShortcut('goForward', handleForward, { enabled: navState.canGoForward });

  const NavButton = ({ direction, icon: Icon }: { direction: 'back' | 'forward'; icon: typeof ChevronLeft }) => {
    const isBack = direction === 'back';
    const isEnabled = isBack ? navState.canGoBack : navState.canGoForward;
    const handleClick = isBack ? handleBack : handleForward;

    return (
      <Tooltip
        content={<ShortcutTooltip shortcutName={isBack ? 'goBack' : 'goForward'} />}
        className='tooltip-secondary!'
        isDisabled={!isEnabled}
      >
        <button
          onClick={handleClick}
          className={`pointer-events-auto h-8 px-2 transition-colors flex items-center justify-center ${
            isEnabled
              ? 'text-Grey-400 hover:bg-white/5 hover:text-white'
              : 'text-Grey-700 cursor-not-allowed opacity-40'
          }`}
          aria-label={`Go ${direction}`}
          disabled={!isEnabled}
        >
          <Icon className='size-4' />
        </button>
      </Tooltip>
    );
  };

  return (
    <div className='flex items-center'>
      <NavButton direction='back' icon={ChevronLeft} />
      <NavButton direction='forward' icon={ChevronRight} />
    </div>
  );
}
