import { useRef, useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useSearchParams, Link } from 'react-router';
import { cn } from '@/utils';
import { Tooltip } from '@heroui/react';

type TabItem = {
  label: string;
  value: string;
  icon?: ReactNode;
  link?: string;
  includes?: boolean;
  tooltip?: string;
};

type TabsProps = {
  tabs: TabItem[];
  direction?: 'horizontal' | 'vertical';
  preserveSearchParams?: boolean;
  activeTab?: string;
  onChange?: (value: string) => void;
  className?: string;
  tabClassName?: string;
  indicatorClassName?: string;
  renderWrapper?: (tabContent: ReactNode, tab: TabItem) => ReactNode; // optional custom renderer
};

export function Tabs({
  tabs,
  direction = 'vertical',
  preserveSearchParams = false,
  activeTab,
  onChange,
  className = '',
  tabClassName = '',
  indicatorClassName = '',
  renderWrapper,
}: TabsProps) {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();

  const isControlled = activeTab !== undefined && onChange !== undefined;
  const containerRef = useRef<HTMLUListElement>(null);
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const activeTabValue = isControlled
    ? activeTab
    : (tabs.find((tab) => {
        return tab.link && (pathname === tab.link || (tab.includes && pathname.includes(tab.link)));
      })?.value ?? tabs[0].value);

  useEffect(() => {
    const index = tabs.findIndex((t) => t.value === activeTabValue);
    const tabEl = tabRefs.current[index];
    const containerEl = containerRef.current;

    if (tabEl && containerEl) {
      const tabRect = tabEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();

      setIndicator({
        left: tabRect.left - containerRect.left,
        top: tabRect.top - containerRect.top,
        width: tabRect.width,
        height: tabRect.height,
      });
    }
  }, [activeTabValue, tabs]);

  const handleClick = (tab: TabItem, e: React.MouseEvent) => {
    if (isControlled && onChange) {
      e.preventDefault();
      onChange(tab.value);
    }
  };

  return (
    <ul
      ref={containerRef}
      className={cn(
        'relative isolate',
        direction === 'horizontal' ? 'flex flex-row gap-4' : 'flex flex-col gap-4',
        className
      )}
    >
      {/* Animated indicator */}
      <motion.li
        className={cn('bg-Primary-400 absolute -z-10 rounded-md', indicatorClassName)}
        animate={{
          left: indicator.left,
          top: indicator.top,
          width: indicator.width,
          height: indicator.height,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          duration: 0.1,
        }}
      />

      {tabs.map((tab, index) => {
        const isActive = activeTabValue === tab.value;

        const baseClasses = cn(
          'transition-colors duration-200 px-4 py-2 rounded-md font-medium',
          direction === 'vertical' ? 'w-full text-left' : 'inline-block',
          isActive ? 'text-Primary-50' : 'text-Grey-300 hover:bg-white/5',
          tab.icon && 'flex items-center gap-2',
          tabClassName
        );

        const content = (
          <span data-active={isActive} className={baseClasses}>
            {tab.icon}
            {tab.label}
          </span>
        );

        const wrapped = tab.tooltip ? (
          <Tooltip content={tab.tooltip} className='tooltip-secondary!'>
            {content}
          </Tooltip>
        ) : (
          content
        );

        const inner = renderWrapper ? (
          renderWrapper(wrapped, tab)
        ) : isControlled || !tab.link ? (
          <button type='button' onClick={(e) => handleClick(tab, e)} className='w-full'>
            {wrapped}
          </button>
        ) : (
          <Link
            to={{
              pathname: tab.link,
              search: preserveSearchParams ? searchParams.toString() : undefined,
            }}
          >
            {wrapped}
          </Link>
        );

        return (
          <li
            key={tab.value}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
          >
            {inner}
          </li>
        );
      })}
    </ul>
  );
}
