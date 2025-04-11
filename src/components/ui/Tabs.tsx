import { Link, useLocation, useSearchParams } from 'react-router';
import { useRef, useState, useEffect } from 'react';

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
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const activeTabValue =
    tabs.find((tab) => pathname === tab.link || (tab.includes && pathname.includes(tab.link)))?.value || tabs[0].value;

  useEffect(() => {
    const activeTabIndex = tabs.findIndex((tab) => tab.value === activeTabValue);
    if (activeTabIndex !== -1 && tabRefs.current[activeTabIndex]) {
      const tabElement = tabRefs.current[activeTabIndex];
      if (tabElement) {
        const { offsetLeft, offsetWidth } = tabElement;
        setIndicator({
          left: offsetLeft,
          width: offsetWidth,
        });
      }
    }
  }, [activeTabValue, tabs]);

  return (
    <ul className={`relative flex w-fit gap-5 rounded-xl bg-black/20 p-2 backdrop-blur-2xl ${className}`}>
      <li
        className='absolute top-1/2 -z-10 h-[calc(100%-16px)] -translate-y-1/2 rounded-lg bg-Primary-400 transition-all duration-500'
        style={{ left: `${indicator.left}px`, width: `${indicator.width}px` }}
      ></li>
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
