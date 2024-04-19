import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useEffect, useState } from 'react';

export const usePagination = <T,>(data: T[]) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const PAGINATION_BUTTON_AMOUNT = 5;
  const DATA_SIZE = data.length;
  const HAIR_CUTS_PER_PAGE = 12;
  const PAGINATION_BUTTONS = [];

  const CURRENT_PAGE_LAST_INDEX = currentPage * HAIR_CUTS_PER_PAGE;
  const PAGE_NUMBERS_LIMIT = Math.floor(PAGINATION_BUTTON_AMOUNT / 2);
  const CURRENT_PAGE_FIRST_INDEX = CURRENT_PAGE_LAST_INDEX - HAIR_CUTS_PER_PAGE;
  const CURRENT_PAGE_ITEMS = data.slice(CURRENT_PAGE_FIRST_INDEX, CURRENT_PAGE_LAST_INDEX);
  for (let i = 1; i <= Math.ceil(DATA_SIZE / HAIR_CUTS_PER_PAGE); i++) PAGINATION_BUTTONS.push(i);

  const VISIBLE_PAGINATION_BUTTONS = PAGINATION_BUTTONS.slice(
    Math.max(0, currentPage - 1 - PAGE_NUMBERS_LIMIT),
    Math.min(currentPage - 1 + PAGE_NUMBERS_LIMIT + 1, PAGINATION_BUTTONS.length),
  );

  const handleNextPage = () => currentPage < PAGINATION_BUTTONS.length && setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

  const renderPaginationButtons = () => {
    const VISIBLE_BUTTONS = VISIBLE_PAGINATION_BUTTONS.map((pageNumber) => (
      <PaginationItem
        key={pageNumber}
        className={`cursor-pointer ${(currentPage === pageNumber && 'rounded-md bg-accent text-accent-foreground') || ''}`}
      >
        <PaginationLink onClick={() => setCurrentPage(pageNumber)}>{pageNumber}</PaginationLink>
      </PaginationItem>
    ));

    if (VISIBLE_PAGINATION_BUTTONS[0] > 1) {
      VISIBLE_BUTTONS.unshift(
        <PaginationEllipsis
          key='ellipsis-start'
          onClick={() => setCurrentPage(VISIBLE_PAGINATION_BUTTONS[0] - 1)}
        />,
      );
    }

    if (VISIBLE_PAGINATION_BUTTONS[VISIBLE_PAGINATION_BUTTONS.length - 1] < PAGINATION_BUTTONS.length) {
      VISIBLE_BUTTONS.push(
        <PaginationEllipsis
          key='ellipsis-end'
          onClick={() =>
            setCurrentPage(VISIBLE_PAGINATION_BUTTONS[VISIBLE_PAGINATION_BUTTONS.length - 1] + 1)
          }
        />,
      );
    }

    return VISIBLE_BUTTONS;
  };

  const PaginationSection =
    DATA_SIZE > 0 ? (
      <Pagination className='justify-self-end py-2'>
        <PaginationContent className='ml-auto'>
          <PaginationItem>
            <PaginationPrevious onClick={handlePreviousPage} className='cursor-pointer px-2.5' />
          </PaginationItem>
          {renderPaginationButtons()}
          <PaginationItem>
            <PaginationNext onClick={handleNextPage} className='cursor-pointer px-2.5' />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    ) : null;

  return { PaginationSection, CURRENT_PAGE_ITEMS };
};
