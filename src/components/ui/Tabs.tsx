'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearchParams } from '@/hooks/useSearchParams';

type TabItem = { label: string; value: string; link: string; includes?: boolean };
type TabsIndicators = { [key: string]: { left: number; width: number } };
type TabsProps = {
  tabs: TabItem[];
  TABS_INDICATORS: TabsIndicators;
  preserveSearchParams?: boolean;
  className?: string;
};

export default function Tabs({ tabs, TABS_INDICATORS, preserveSearchParams = false, className = '' }: TabsProps) {
  const pathname = usePathname();
  const { searchParams } = useSearchParams();

  const tab = tabs.find((tab) => pathname === tab.link || (tab.includes && pathname.includes(tab.link)))?.value;
  const currentTab = tab
    ? { tab, indicator: TABS_INDICATORS[tab] }
    : { tab: tabs[0].value, indicator: { left: 8, width: 102 } };

  return (
    <ul className={`relative flex w-fit gap-5 rounded-xl bg-Black/20 p-2 backdrop-blur-2xl ${className}`}>
      <li
        className='absolute top-1/2 -z-10 h-[calc(100%-16px)] -translate-y-1/2 rounded-lg bg-Primary/400 transition-[left] duration-500'
        style={{ left: `${currentTab.indicator.left}px`, width: `${currentTab.indicator.width}px` }}
      ></li>
      {tabs.map((tab) => (
        <li key={tab.label}>
          <Link
            href={{
              pathname: tab.link,
              query: preserveSearchParams ? Object.fromEntries(searchParams.entries()) : undefined,
            }}
            className={`block size-full px-8 py-2 text-sm font-medium transition-colors duration-200 ${
              currentTab.tab === tab.value ? 'text-Primary/50' : 'text-Grey/300 hover:text-Grey/600'
            }`}
          >
            {tab.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
