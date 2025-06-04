import { Link, useLocation, useSearchParams } from 'react-router';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

type TabItem = { label: string; value: string; link: string; includes?: boolean };
type TabsProps = {
  tabs: TabItem[];
  preserveSearchParams?: boolean;
  className?: string;
};

export default function Tabs({ tabs, preserveSearchParams = false, className = '' }: TabsProps) {
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const tabRefs = useRef<(HTMLLIElement | null)[]>([]);
  const containerRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const activeTabValue =
    tabs.find((tab) => pathname === tab.link || (tab.includes && pathname.includes(tab.link)))?.value || tabs[0].value;

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

  return (
    <ul 
      ref={containerRef}
      className={cn('relative flex  w-fit gap-5 rounded-xl bg-black/20 p-2 backdrop-blur-2xl', className)}
    >
      <motion.li
        className='absolute -z-10 rounded-lg bg-Primary-400'
        animate={{
          left: indicator.left,
          top: indicator.top,
          width: indicator.width,
          height: indicator.height,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
      {tabs.map((tab, index) => (
        <li
          key={tab.label}
          ref={(el) => {
            tabRefs.current[index] = el;
          }}
        >
          <Link
            to={{
              pathname: tab.link,
              search: preserveSearchParams ? searchParams.toString() : undefined,
            }}
            className={`block size-full px-8 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTabValue === tab.value ? 'text-Primary-50' : 'text-Grey-300 hover:text-Grey-600'
            }`}
          >
            {tab.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}