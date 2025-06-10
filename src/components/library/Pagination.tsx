import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  showInfo = true,
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='flex flex-col items-center gap-4'
    >
      {/* Pagination info */}
      {showInfo && (
        <div className='text-Grey-400 text-sm'>
          Showing <span className='text-Primary-300 font-medium'>{startItem}</span> to{' '}
          <span className='text-Primary-300 font-medium'>{endItem}</span> of{' '}
          <span className='text-Primary-300 font-medium'>{totalItems}</span> items
        </div>
      )}

      {/* Pagination controls */}
      <div className='flex items-center gap-2'>
        {/* Previous button */}
        <Button
          isIconOnly
          variant='ghost'
          className='text-Grey-400 h-9 w-9 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
          onPress={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          aria-label='Previous page'
        >
          <ChevronLeft className='size-4' />
        </Button>

        {/* Page numbers */}
        <div className='flex items-center gap-1'>
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <div key={`dots-${index}`} className='flex h-9 w-9 items-center justify-center'>
                  <MoreHorizontal className='text-Grey-400 size-4' />
                </div>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isActive ? 'solid' : 'ghost'}
                className={`h-9 w-9 border transition-all duration-200 ${
                  isActive
                    ? 'border-Primary-500/50 bg-Primary-500/20 text-Primary-300 shadow-lg'
                    : 'text-Grey-400 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white'
                }`}
                onPress={() => onPageChange(pageNumber)}
                aria-label={`Page ${pageNumber}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          isIconOnly
          variant='ghost'
          className='text-Grey-400 h-9 w-9 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
          onPress={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          aria-label='Next page'
        >
          <ChevronRight className='size-4' />
        </Button>
      </div>

      {/* Page size selector (optional) */}
      <div className='text-Grey-400 flex items-center gap-2 text-sm'>
        <span>Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={() => onPageChange(1)} // Reset to first page when changing page size
          className='focus:ring-Primary-500/50 rounded border border-white/10 bg-white/5 px-2 py-1 text-white backdrop-blur-md hover:bg-white/10 focus:ring-2 focus:outline-none'
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
          <option value={96}>96</option>
        </select>
      </div>
    </motion.div>
  );
}
