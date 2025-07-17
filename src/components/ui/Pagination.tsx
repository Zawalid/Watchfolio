import { Pagination as P, PaginationProps } from '@heroui/react';
import { parseAsInteger, useQueryState } from 'nuqs';

const className = 'bg-black/20  backdrop-blur-2xl w-fit px-2 [&[data-hover=true]:not([data-active=true])]:bg-black/40';

export function Pagination(props: PaginationProps) {
  const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return (
    <div className='flex justify-center [&_[role="button"]]:cursor-pointer'>
      <P
        showControls
        initialPage={1}
        classNames={{ item: className, next: className, prev: className, cursor: 'w-fit px-2' }}
        size='lg'
        onChange={(page) => {
          setPage(page === 1 ? null : page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        {...props}
      />
    </div>
  );
}
