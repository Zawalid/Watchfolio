import { Link, useLocation, useSearchParams } from 'react-router';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { Tooltip } from '@heroui/tooltip';

type TabItem = { 
  label: string; 
  icon?: React.JSX.Element; 
  value: string; 
  link?: string;  // Optional now, only needed for URL mode
  includes?: boolean; 
  tooltip?: string;  // Optional tooltip for keyboard shortcuts
};

type TabsProps = {
  tabs: TabItem[];
  preserveSearchParams?: boolean;
  className?: string;
  tabClassName?: string;
  indicatorClassName?: string;
  activeTab?: string;  // For controlled mode
  onChange?: (value: string) => void;  // For controlled mode
};

export  function Tabs({ 
  tabs, 
  preserveSearchParams = false, 
  className = '', 
  tabClassName = '',
  indicatorClassName = '',
  activeTab: controlledActiveTab,
  onChange 
}: TabsProps) {
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);
  const containerRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });
  
  // Determine if we're in URL mode or state-controlled mode
  const isControlled = controlledActiveTab !== undefined && onChange !== undefined;

  // Determine the active tab based on mode
  const activeTabValue = isControlled
    ? controlledActiveTab
    : tabs.find((tab) => tab.link && (pathname === tab.link || (tab.includes && pathname.includes(tab.link))))?.value || 
      tabs[0].value;

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.value === activeTabValue);
    if (activeTabIndex !== -1 && tabRefs.current[activeTabIndex] && containerRef.current) {
      const tabElement = tabRefs.current[activeTabIndex];
      const containerElement = containerRef.current;

      
      if (tabElement) {
        const tabRect = tabElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();

        setIndicator({
          left: tabRect.left - containerRect.left,
          top: tabRect.top - containerRect.top,
          width: tabRect.width,
          height: tabRect.height,
        });
      }
    }
  }, [activeTabValue, tabs]);

  // Handle tab click for state-controlled mode
  const handleTabClick = (tab: TabItem, event: React.MouseEvent) => {
    if (isControlled && onChange) {
      event.preventDefault(); // Prevent navigation if we're in controlled mode
      onChange(tab.value);
    }
  };

  return (
    <ul
      ref={containerRef}
      className={cn('relative flex w-fit gap-5 rounded-xl bg-black/20 p-2 backdrop-blur-2xl', className)}
    >
      <motion.li
        className={cn('bg-Primary-400 absolute -z-10 rounded-lg',indicatorClassName)}
        animate={{
          left: indicator.left,
          top: indicator.top,
          width: indicator.width,
          height: indicator.height,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,  // Reduced from 300 for slower movement
          damping: 25,     // Adjusted for smoother animation
          duration: 0.1    // Added minimum duration for consistency
        }}
      />
      {tabs.map((tab, index) => {
        
        // Create the content element with proper styling
        const tabContent = (
          <span
          data-active={activeTabValue === tab.value}
          className={cn(
              'block size-full px-8 py-2 text-sm font-medium transition-colors duration-200 data-[active=true]:text-Primary-50 text-Grey-300 hover:text-Grey-600',
              tab.icon && 'flex items-center gap-2',
              tabClassName
            )}
          >
            {tab.icon && tab.icon}
            {tab.label}
          </span>
        );

        const tabElement = (
          <li
            key={tab.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            >
            {/* Either render as link or button based on mode */}
            {isControlled || !tab.link ? (
              <button
                type="button"
                onClick={(e) => handleTabClick(tab, e)}
                className="block w-full text-left" 
              >
                {tab.tooltip ? (
                  <Tooltip content={tab.tooltip} className="tooltip-secondary">
                    {tabContent}
                  </Tooltip>
                ) : (
                  tabContent
                )}
              </button>
            ) : (
              <Link
                to={{
                  pathname: tab.link,
                  search: preserveSearchParams ? searchParams.toString() : undefined,
                }}
              >
                {tab.tooltip ? (
                  <Tooltip content={tab.tooltip} className="tooltip-secondary">
                    {tabContent}
                  </Tooltip>
                ) : (
                  tabContent
                )}
              </Link>
            )}
          </li>
        );

        return tabElement;
      })}
    </ul>
  );
}