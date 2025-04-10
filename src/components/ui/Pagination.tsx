'use client';

import { useSearchParams } from '@/hooks/useSearchParams';
import { Pagination as P, PaginationProps } from '@heroui/pagination';

const className = 'bg-Black/20  backdrop-blur-2xl w-fit px-2 [&[data-hover=true]:not([data-active=true])]:bg-Black/40';

export default function Pagination(props: PaginationProps) {
  const { setSearchParams } = useSearchParams();

  return (
    <div className='flex justify-center'>
      <P
        showControls
        initialPage={1}
        classNames={{ item: className, next: className, prev: className, cursor: 'w-fit px-2' }}
        size='lg'
        onChange={(page) => {
          setSearchParams('page', String(page), page === 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        {...props}
      />
    </div>
  );
}
